/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        paper: "#f6f2e8",
        accent: "#c6653a",
        sage: "#5f7a68"
      },
      boxShadow: {
        card: "0 20px 60px rgba(23, 32, 51, 0.12)"
      }
    },
  },
  plugins: [],
};
