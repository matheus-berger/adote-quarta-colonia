/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Esta linha é crucial para o Tailwind escanear seus arquivos React
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
