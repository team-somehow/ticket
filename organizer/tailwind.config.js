/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'neo-black': '#171717',
        'neo-white': '#FFFFFF',
        'neo-primary': '#47B5FF',
        'neo-secondary': '#47B5FF',
        'neo-accent': '#FFD700',
        'neo-bg': '#F5F5F5',
      },
      boxShadow: {
        'neo': '5px 5px 0px 0px rgba(0,0,0,1)',
        'neo-lg': '8px 8px 0px 0px rgba(0,0,0,1)',
        'neo-xl': '12px 12px 0px 0px rgba(0,0,0,1)',
      },
      borderWidth: {
        'neo': '3px',
      },
      fontFamily: {
        'neo': ['Space Grotesk', 'sans-serif'],
        'neo-display': ['Archivo Black', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
