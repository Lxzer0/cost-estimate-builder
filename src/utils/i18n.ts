export type SupportedLocale = "en-US" | "pl-PL";

export type CurrencyCode = "USD" | "PLN";

export type UnitKey =
    | "pcs"
    | "set"
    | "unit"
    | "box"
    | "pack"
    | "m2"
    | "mb"
    | "kg"
    | "l"
    | "point";

type UnitOption = {
    value: UnitKey;
    label: string;
};

type TranslationKey =
    | "actions"
    | "add"
    | "amount"
    | "cost"
    | "defaultScope"
    | "emptyState"
    | "exportPdf"
    | "grandTotal"
    | "item"
    | "itemNamePlaceholder"
    | "newEntry"
    | "noItems"
    | "preview"
    | "remove"
    | "removeScope"
    | "scope"
    | "scopeLabel"
    | "subtotal"
    | "title"
    | "titlePlaceholder"
    | "total"
    | "type"
    | "unit"
    | "untitledItem";

export type Translations = Record<TranslationKey, string>;

export const translations: Record<SupportedLocale, Translations> = {
    "en-US": {
        actions: "Actions",
        add: "Add",
        amount: "Amount",
        cost: "Cost",
        defaultScope: "General",
        emptyState: "Add items and scopes to build your cost estimate.",
        exportPdf: "Export PDF",
        grandTotal: "Grand total",
        item: "Item",
        itemNamePlaceholder: "{entryType} name",
        newEntry: "New entry",
        noItems: "No items yet.",
        preview: "Preview",
        remove: "Remove",
        removeScope: "Remove scope",
        scope: "Scope",
        scopeLabel: "Scope",
        subtotal: "Subtotal",
        title: "Title",
        titlePlaceholder: "Cost Estimate",
        total: "Total",
        type: "Type",
        unit: "Unit",
        untitledItem: "Untitled item",
    },
    "pl-PL": {
        actions: "Akcje",
        add: "Dodaj",
        amount: "Ilość",
        cost: "Cena",
        defaultScope: "Ogólne",
        emptyState: "Dodawaj wpisy i zakresy aby utworzyć kosztorys.",
        exportPdf: "Eksportuj PDF",
        grandTotal: "Suma końcowa",
        item: "Wpis",
        itemNamePlaceholder: "Nazwa {entryType}u",
        newEntry: "Nowy wpis",
        noItems: "Brak wpisów.",
        preview: "Podgląd",
        remove: "Usuń",
        removeScope: "Usuń zakres",
        scope: "Zakres",
        scopeLabel: "Zakres",
        subtotal: "Suma częściowa",
        title: "Tytuł",
        titlePlaceholder: "Kosztorys",
        total: "Suma",
        type: "Typ",
        unit: "Jednostka",
        untitledItem: "Wpis bez nazwy",
    },
};

export const currencies: Record<SupportedLocale, CurrencyCode> = {
    "en-US": "USD",
    "pl-PL": "PLN",
};

const unitKeys = [
    "pcs",
    "set",
    "unit",
    "box",
    "pack",
    "m2",
    "mb",
    "kg",
    "l",
    "point",
] as const satisfies readonly UnitKey[];

const unitLabels: Record<SupportedLocale, Record<UnitKey, string>> = {
    "en-US": {
        pcs: "piece",
        set: "set",
        unit: "unit",
        box: "box",
        pack: "pack",
        m2: "m²",
        mb: "m",
        kg: "kg",
        l: "l",
        point: "pt",
    },
    "pl-PL": {
        pcs: "szt.",
        set: "kpl.",
        unit: "jedn.",
        box: "op.",
        pack: "pacz.",
        m2: "m²",
        mb: "m.b.",
        kg: "kg",
        l: "l",
        point: "pkt.",
    },
};

export const getTranslations = (locale: SupportedLocale): Translations =>
    translations[locale];

export const getLocaleCurrency = (locale: SupportedLocale): CurrencyCode =>
    currencies[locale];

export const getLocaleUnits = (locale: SupportedLocale): UnitOption[] =>
    unitKeys.map((value) => ({
        value,
        label: unitLabels[locale][value],
    }));

export const formatUnitLabel = (
    unit: string,
    locale: SupportedLocale,
): string => {
    const normalized = normalizeUnitKey(unit);
    if (!normalized) return unit;

    return unitLabels[locale][normalized];
};

export const normalizeUnitKey = (unit?: string): UnitKey | "" => {
    if (!unit) return "";

    const trimmed = unit.trim();
    if (!trimmed) return "";

    if (isUnitKey(trimmed)) return trimmed;
    return "";
};

const isUnitKey = (value: string): value is UnitKey =>
    unitKeys.includes(value as UnitKey);
