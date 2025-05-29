/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'pecunia': {
          'dark-green': '#1B4332',
          'light-green': '#2D6A4F',
          'accent-green': '#40916C',
          'black': '#1A1A1A',
        }
      }
    },
  },
  plugins: [],
} 