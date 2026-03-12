/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: '#0B6FF1',
        'primary-hover': '#003CAD',
        navy: '#00205B',
        sidebar: '#031159',
      },
      keyframes: {
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '50%': { transform: 'translateY(-12px) translateX(4px)' },
        },
        'float-medium': {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '50%': { transform: 'translateY(-8px) translateX(-6px)' },
        },
        'float-fast': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'wave': {
          '0%, 100%': { height: '8px', opacity: '0.5' },
          '50%': { height: '20px', opacity: '1' },
        },
        'headShake': {
          '0%': { transform: 'translateX(0)' },
          '6.5%': { transform: 'translateX(-6px) rotateY(-9deg)' },
          '18.5%': { transform: 'translateX(5px) rotateY(7deg)' },
          '31.5%': { transform: 'translateX(-3px) rotateY(-5deg)' },
          '43.5%': { transform: 'translateX(2px) rotateY(3deg)' },
          '50%': { transform: 'translateX(0)' },
        },
        'fadeSlideDown': {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'float-slow': 'float-slow 4s ease-in-out infinite',
        'float-medium': 'float-medium 3s ease-in-out infinite',
        'float-fast': 'float-fast 2s ease-in-out infinite',
        'wave': 'wave 1.2s ease-in-out infinite',
        'headShake': 'headShake 0.6s ease-in-out',
        'fadeSlideDown': 'fadeSlideDown 0.3s ease-out',
      },
    },
  },
  plugins: [],
}
