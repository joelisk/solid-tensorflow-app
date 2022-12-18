/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: true, // or 'media' or 'class'
  theme: {
    // ends up overriding the entire Tailwind palate
    // colors:{
    //   'midnight-purple': '#362057',
    //   'midnight': '#121063',
    // },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
