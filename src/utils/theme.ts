export type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "theme";

export const getTheme = (): Theme => {
    const attr = document.documentElement.getAttribute("data-theme");
    if (attr === "light" || attr === "dark") return attr;
    return "dark";
};

export const setTheme = (theme: Theme): void => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
        // Persistence can be blocked in privacy-restricted contexts.
    }
};
