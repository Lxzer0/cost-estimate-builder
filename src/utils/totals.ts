export type Scope = {
    name: string;
    items: Item[];
};

export type Item = {
    title: string;
    cost: number;
    amount: number;
    unit: string;
};

export const calculateItemTotal = (item: Item): number => {
    const amount = Number.isFinite(item.amount) ? item.amount : 0;
    const cost = Number.isFinite(item.cost) ? item.cost : 0;
    return amount * cost;
};

export const calculateScopeTotal = (scope: Scope): number => {
    return scope.items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
};

export const calculateGrandTotal = (scopes: Scope[]): number => {
    return scopes.reduce((sum, scope) => sum + calculateScopeTotal(scope), 0);
};

export const formatCurrency = (
    value: number,
    locale: string = "en-US",
    currency: string = "USD",
): string => {
    const safe = Number.isFinite(value) ? value : 0;
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
    }).format(safe);
};

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
