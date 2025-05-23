// tailwind.config.js
const { heroui } = require("@heroui/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    './src/**/*.{astro,html,js,jsx,ts,tsx}',    // ← Aquí tus componentes React y Astro
    './components/**/*.{astro,js,jsx,ts,tsx}',  // si tienes componentes fuera de src/
    './node_modules/@heroui/theme/dist/components/**/*.{js,ts}'
  ],
  theme: {
    extend: {},
  },
  plugins: [heroui()],
  
};

