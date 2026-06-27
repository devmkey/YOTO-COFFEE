/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FAF3E7",
        creamDark: "#F0E2C9",
        coffeeDark: "#2A1B12",
        coffee: "#4A2E1E",
        coffeeMid: "#6F4E37",
        tan: "#C9A77C",
        terracotta: "#111111ff",
        terracottaDark: "#0f0f0fff",
        textMuted: "#8A7A68",
        borderTan: "#E3D4B8",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
      },
    },
  },
  plugins: [],
};
