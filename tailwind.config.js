/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "gemini-start": "#4B91E6",
        "gemini-end": "#C86478",
      }
    },
  },
  plugins: [],
}

