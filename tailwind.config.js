/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        mainBackgroundColor: "#0D1117",
        coloumnBackground: "#161C22",
      },
      fontFamily: {
        gabarito: ["Gabarito", "sans-serif"], // Adding "Gabarito" to the font family with a fallback to generic sans-serif
      },
    },
  },
  plugins: [],
};
