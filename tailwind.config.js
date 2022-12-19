/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    // ends up overriding the entire Tailwind palate
    // colors:{
    //   'midnight-purple': '#362057',
    //   'midnight': '#121063',
    // },
    extend: {},
  },
  plugins: [],
};
