import type { Scope } from "./totals";

import type { SupportedLocale, CurrencyCode, Translations } from "./i18n";

type SaveOptions = {
    title?: string;
    locale?: SupportedLocale;
    currency?: CurrencyCode;
    t?: Translations;
};

export const saveEstimate = async (
    scopes: Scope[],
    options: SaveOptions = {},
): Promise<void> => {
    
};
