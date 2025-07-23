/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
        },
        secondary: {
          500: '#ec4899',
          600: '#db2777',
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms')
  ]
}
