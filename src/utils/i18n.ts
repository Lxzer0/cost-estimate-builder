export type SupportedLocale = "en-US" | "pl-PL";

export type CurrencyCode = "USD" | "PLN";

export type TranslationKey =
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

export const units: Record<SupportedLocale, string[]> = {
    "en-US": ["piece", "set", "unit", "box", "pack", "m²", "m", "kg", "l"],
    "pl-PL": ["szt.", "kpl.", "jedn.", "op.", "pacz.", "m²", "m.b.", "kg", "l"],
};

export const getTranslations = (locale: SupportedLocale): Translations =>
    translations[locale];

export const getLocaleCurrency = (locale: SupportedLocale): CurrencyCode =>
    currencies[locale];

export const getLocaleUnits = (locale: SupportedLocale): string[] =>
    units[locale];
