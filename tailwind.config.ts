import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand colors
        primary: {
          50: "#fdf2f8",
          100: "#fce7f3",
          200: "#fbcfe8",
          300: "#f9a8d4",
          400: "#f472b6",
          500: "#ec4899",
          600: "#db2777",
          700: "#be185d",
          800: "#9d174d",
          900: "#831843",
          950: "#500724",
        },
        // Secondary colors
        secondary: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },
        // Success colors
        success: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
        },
        // Warning colors
        warning: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
          950: "#451a03",
        },
        // Error colors
        error: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
          950: "#450a0a",
        },
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        "card-hover":
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        "card-lg":
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      },
      borderRadius: {
        card: "0.75rem",
        "card-lg": "1rem",
      },
    },
  },
  plugins: [
    // Custom card components
    function ({
      addComponents,
      theme,
    }: import("tailwindcss/types/config").PluginAPI) {
      addComponents({
        ".card": {
          backgroundColor: theme("colors.white"),
          borderRadius: theme("borderRadius.card"),
          boxShadow: theme("boxShadow.card"),
          padding: theme("spacing.6"),
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            boxShadow: theme("boxShadow.card-hover"),
            transform: "translateY(-2px)",
          },
        },
        ".card-sm": {
          backgroundColor: theme("colors.white"),
          borderRadius: theme("borderRadius.card"),
          boxShadow: theme("boxShadow.card"),
          padding: theme("spacing.4"),
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            boxShadow: theme("boxShadow.card-hover"),
            transform: "translateY(-1px)",
          },
        },
        ".card-lg": {
          backgroundColor: theme("colors.white"),
          borderRadius: theme("borderRadius.card-lg"),
          boxShadow: theme("boxShadow.card-lg"),
          padding: theme("spacing.8"),
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            boxShadow: theme("boxShadow.card-hover"),
            transform: "translateY(-3px)",
          },
        },
        ".card-primary": {
          backgroundColor: theme("colors.primary.50"),
          border: `1px solid ${theme("colors.primary.200")}`,
          borderRadius: theme("borderRadius.card"),
          boxShadow: theme("boxShadow.card"),
          padding: theme("spacing.6"),
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            backgroundColor: theme("colors.primary.100"),
            boxShadow: theme("boxShadow.card-hover"),
            transform: "translateY(-2px)",
          },
        },
        ".card-secondary": {
          backgroundColor: theme("colors.secondary.50"),
          border: `1px solid ${theme("colors.secondary.200")}`,
          borderRadius: theme("borderRadius.card"),
          boxShadow: theme("boxShadow.card"),
          padding: theme("spacing.6"),
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            backgroundColor: theme("colors.secondary.100"),
            boxShadow: theme("boxShadow.card-hover"),
            transform: "translateY(-2px)",
          },
        },
        ".card-success": {
          backgroundColor: theme("colors.success.50"),
          border: `1px solid ${theme("colors.success.200")}`,
          borderRadius: theme("borderRadius.card"),
          boxShadow: theme("boxShadow.card"),
          padding: theme("spacing.6"),
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            backgroundColor: theme("colors.success.100"),
            boxShadow: theme("boxShadow.card-hover"),
            transform: "translateY(-2px)",
          },
        },
        ".card-warning": {
          backgroundColor: theme("colors.warning.50"),
          border: `1px solid ${theme("colors.warning.200")}`,
          borderRadius: theme("borderRadius.card"),
          boxShadow: theme("boxShadow.card"),
          padding: theme("spacing.6"),
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            backgroundColor: theme("colors.warning.100"),
            boxShadow: theme("boxShadow.card-hover"),
            transform: "translateY(-2px)",
          },
        },
        ".card-error": {
          backgroundColor: theme("colors.error.50"),
          border: `1px solid ${theme("colors.error.200")}`,
          borderRadius: theme("borderRadius.card"),
          boxShadow: theme("boxShadow.card"),
          padding: theme("spacing.6"),
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            backgroundColor: theme("colors.error.100"),
            boxShadow: theme("boxShadow.card-hover"),
            transform: "translateY(-2px)",
          },
        },
      });
    },
  ],
};

export default config;
