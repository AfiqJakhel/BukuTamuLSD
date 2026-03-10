/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: '#0B6FF1',
        'primary-hover': '#003CAD',
        navy: '#00205B',
        sidebar: '#031159',
      }
    },
  },
  plugins: [],
}
