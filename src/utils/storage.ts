import type { Scope } from "./totals";

const STORAGE_KEY = "cost-estimate-builder:scopes";

export const loadScopes = (): Scope[] => {
    if (typeof localStorage === "undefined") {
        return [];
    }

    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as Scope[]) : [];
    } catch {
        return [];
    }
};

export const saveScopes = (scopes: Scope[]): void => {
    if (typeof localStorage === "undefined") return;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(scopes));
};

export const clearScopes = (): void => {
    if (typeof localStorage === "undefined") return;

    localStorage.removeItem(STORAGE_KEY);
};
