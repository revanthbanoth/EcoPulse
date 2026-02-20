/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#10B981",
                    foreground: "#FFFFFF",
                },
                secondary: {
                    DEFAULT: "#0EA5E9",
                    foreground: "#FFFFFF",
                },
                accent: {
                    DEFAULT: "#F59E0B",
                    foreground: "#FFFFFF",
                },
                background: "var(--background)",
                foreground: "var(--foreground)",
                card: {
                    DEFAULT: "var(--card)",
                    foreground: "var(--foreground)",
                },
                border: "var(--border)",
            },
            fontFamily: {
                heading: ["Outfit", "sans-serif"],
                body: ["Inter", "sans-serif"],
            },
        },
    },
    plugins: [],
}
