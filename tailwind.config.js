/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{svelte,ts,js}"],
  theme: {
    extend: {
      colors: {
        page: "var(--color-page)",
        surface: "var(--color-surface)",
        "surface-muted": "var(--color-surface-muted)",
        border: "var(--color-border)",
        "border-button": "var(--color-border-button)",
        text: "var(--color-text)",
        "text-muted": "var(--color-text-muted)",
        "text-soft": "var(--color-text-soft)",
        "text-strong": "var(--color-text-strong)",
        accent: "var(--color-accent)",
        "accent-strong": "var(--color-accent-strong)",
        "control-bg": "var(--color-control-bg)",
        "control-disabled-bg": "var(--color-control-disabled-bg)",
        "button-bg": "var(--color-button-bg)",
        "button-hover-bg": "var(--color-button-hover-bg)",
        "button-text": "var(--color-button-text)",
      },
    },
  },
  plugins: [],
};
