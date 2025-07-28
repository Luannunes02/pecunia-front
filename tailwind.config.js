/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'pecunia-dark-green': '#2E7D32',
        'pecunia-light-green': '#4CAF50',
      },
    },
  },
  plugins: [],
} 