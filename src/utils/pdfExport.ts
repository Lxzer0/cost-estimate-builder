import jsPDF from "jspdf";
import autoTable, { type RowInput } from "jspdf-autotable";
import type { Scope } from "./totals";
import {
    calculateItemTotal,
    calculateScopeTotal,
    calculateGrandTotal,
    formatCurrency,
} from "./totals";

type ExportOptions = {
    title?: string;
    fileName?: string;
};

const buildSectionHeaderRow = (name: string): RowInput => [
    {
        content: name,
        colSpan: 4,
        styles: { fontStyle: "bold" },
    },
];

const buildItemRow = (item: Scope["items"][number]): RowInput => [
    item.title,
    `${item.amount.toString()} ${item.unit}`,
    formatCurrency(item.cost),
    formatCurrency(calculateItemTotal(item)),
];

const buildSubtotalRow = (scope: Scope): RowInput => [
    {
        content: `Subtotal: ${formatCurrency(calculateScopeTotal(scope))}`,
        colSpan: 4,
        styles: { fontStyle: "bold", halign: "right" },
    },
];

const buildTableRows = (scopes: Scope[]): RowInput[] => {
    const rows: RowInput[] = [];

    for (const scope of scopes) {
        rows.push(buildSectionHeaderRow(scope.name));
        for (const item of scope.items) {
            rows.push(buildItemRow(item));
        }
        rows.push(buildSubtotalRow(scope));
    }

    return rows;
};

const getLastAutoTableFinalY = (doc: jsPDF): number | undefined =>
    (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable
        ?.finalY;

export const exportEstimatePdf = (
    scopes: Scope[],
    options: ExportOptions = {},
): void => {
    const doc = new jsPDF({ unit: "pt", format: "letter" });
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");

    const title = options.title;
    const fileName = options.fileName ?? "cost-estimate.pdf";

    if (title) doc.text(title, 40, 40);

    autoTable(doc, {
        startY: 60,
        head: [["Title", "Amount", "Cost", "Total"]],
        body: buildTableRows(scopes),
        styles: {
            fontSize: 10,
            cellPadding: 3,
            textColor: [0, 0, 0],
            lineColor: [0, 0, 0],
            lineWidth: 0.5,
        },
        headStyles: {
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
        `Grand Total: ${formatCurrency(calculateGrandTotal(scopes))}`,
        pageWidth - 40,
        footerY,
        { align: "right" },
    );

    doc.save(fileName);
};
