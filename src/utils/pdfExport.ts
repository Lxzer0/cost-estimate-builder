import jsPDF from "jspdf";
import autoTable, { type RowInput } from "jspdf-autotable";
import type { Scope } from "@/utils/totals";
import {
    calculateItemTotal,
    calculateScopeTotal,
    calculateGrandTotal,
    formatCurrency,
} from "@/utils/totals";
import {
    getLocaleCurrency,
    getTranslations,
    formatUnitLabel,
    type SupportedLocale,
    type CurrencyCode,
    type Translations,
} from "./i18n";

type ExportOptions = {
    title?: string;
    fileName?: string;
    locale?: SupportedLocale;
    currency?: CurrencyCode;
    t?: Translations;
};

const buildSectionHeaderRow = (name: string): RowInput => [
    {
        content: name,
        colSpan: 4,
        styles: { fontStyle: "bold" },
    },
];

const buildItemRow = (
    item: Scope["items"][number],
    locale: SupportedLocale,
    currency: CurrencyCode,
): RowInput => [
    item.title,
    `${item.amount.toString()} ${formatUnitLabel(item.unit, locale)}`,
    formatCurrency(item.cost, locale, currency),
    formatCurrency(calculateItemTotal(item), locale, currency),
];

const buildSubtotalRow = (
    scope: Scope,
    locale: SupportedLocale,
    currency: CurrencyCode,
    t: Translations,
): RowInput => [
    {
        content: `${t.subtotal}: ${formatCurrency(
            calculateScopeTotal(scope),
            locale,
            currency,
        )}`,
        colSpan: 4,
        styles: { fontStyle: "bold", halign: "right" },
    },
];

const buildTableRows = (
    scopes: Scope[],
    locale: SupportedLocale,
    currency: CurrencyCode,
    t: Translations,
): RowInput[] => {
    const rows: RowInput[] = [];

    for (const scope of scopes) {
        rows.push(buildSectionHeaderRow(scope.name));
        for (const item of scope.items) {
            rows.push(buildItemRow(item, locale, currency));
        }
        rows.push(buildSubtotalRow(scope, locale, currency, t));
    }

    return rows;
};

const getLastAutoTableFinalY = (doc: jsPDF): number | undefined =>
    (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable
        ?.finalY;

const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const chunkSize = 0x8000;

    for (let i = 0; i < bytes.length; i += chunkSize) {
        const chunk = bytes.subarray(i, i + chunkSize);
        binary += String.fromCharCode(...chunk);
    }

    return btoa(binary);
};

const loadOpenSansFonts = async (doc: jsPDF): Promise<void> => {
    const [regularRes, boldRes] = await Promise.all([
        fetch("/fonts/OpenSans-Regular.ttf"),
        fetch("/fonts/OpenSans-Bold.ttf"),
    ]);

    const [regularBuffer, boldBuffer] = await Promise.all([
        regularRes.arrayBuffer(),
        boldRes.arrayBuffer(),
    ]);

    doc.addFileToVFS(
        "OpenSans-Regular.ttf",
        arrayBufferToBase64(regularBuffer),
    );
    doc.addFileToVFS("OpenSans-Bold.ttf", arrayBufferToBase64(boldBuffer));

    doc.addFont("OpenSans-Regular.ttf", "OpenSans", "normal");
    doc.addFont("OpenSans-Bold.ttf", "OpenSans", "bold");
};

export const exportEstimatePdf = async (
    scopes: Scope[],
    options: ExportOptions = {},
): Promise<void> => {
    const doc = new jsPDF({ unit: "pt", format: "letter" });
    await loadOpenSansFonts(doc);
    doc.setFontSize(14);
    doc.setFont("OpenSans", "bold");

    const title = options.title;
    const fileName = options.fileName ?? "cost-estimate.pdf";
    const locale = options.locale ?? "en-US";
    const t = options.t ?? getTranslations(locale);
    const currency = options.currency ?? getLocaleCurrency(locale);

    if (title) doc.text(title, 40, 40);

    autoTable(doc, {
        startY: 60,
        head: [[t.title, t.amount, t.cost, t.total]],
        body: buildTableRows(scopes, locale, currency, t),
        styles: {
            font: "OpenSans",
            fontSize: 10,
            cellPadding: 3,
            textColor: [0, 0, 0],
            lineColor: [0, 0, 0],
            lineWidth: 0.5,
        },
        headStyles: {
            font: "OpenSans",
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            fontStyle: "bold",
        },
        alternateRowStyles: {
            fillColor: [255, 255, 255],
        },
        columnStyles: {
            0: { cellWidth: "auto" },
            1: { cellWidth: 70 },
            2: { cellWidth: 70 },
            3: { cellWidth: 70 },
        },
    });

    const finalY = getLastAutoTableFinalY(doc);
    const footerY = (finalY ?? 80) + 24;
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.text(
        `${t.grandTotal}: ${formatCurrency(
            calculateGrandTotal(scopes),
            locale,
            currency,
        )}`,
        pageWidth - 40,
        footerY,
        { align: "right" },
    );

    doc.save(fileName);
};
