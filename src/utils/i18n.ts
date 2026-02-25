import { global } from "@/assets/i18n/global.json" with { type: "json" };
import { units } from "@/assets/i18n/units.json" with { type: "json" };

export type SupportedLocale =
    | "en-US"
    | "pl-PL"
    | "ru-RU"
    | "be-BY"
    | "uk-UA";

export type CurrencyCode = "USD" | "PLN" | "RUB" | "BYN" | "UAH";

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

export const translations: Record<SupportedLocale, Translations> = global;

export const currencies: Record<SupportedLocale, CurrencyCode> = {
    "en-US": "USD",
    "pl-PL": "PLN",
    "ru-RU": "RUB",
    "be-BY": "BYN",
    "uk-UA": "UAH",
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

const unitLabels: Record<SupportedLocale, Record<UnitKey, string>> = units;

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
