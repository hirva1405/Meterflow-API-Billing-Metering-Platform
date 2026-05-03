/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      colors: {
        rose: { 50: '#fff1f2', 100: '#ffe4e6', 200: '#fecdd3', 300: '#fda4af', 400: '#fb7185', 500: '#f43f5e' },
        peach: { 100: '#fde8d8', 200: '#fbd0b0', 300: '#f9b485', 400: '#f79056' },
        sage: { 100: '#e8f5e0', 200: '#c8e6b8', 300: '#a8d490', 400: '#7bbf60' },
        lavender: { 100: '#f0e8ff', 200: '#dcc8ff', 300: '#c4a0ff', 400: '#a970ff' },
        cream: { 50: '#fffef9', 100: '#fefce8', 200: '#fef9c3' },
      },
      backdropBlur: { xs: '2px' },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'bloom': 'bloom 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'petal-spin': 'petalSpin 20s linear infinite',
        'fade-up': 'fadeUp 0.5s ease forwards',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0px) rotate(0deg)' }, '50%': { transform: 'translateY(-20px) rotate(5deg)' } },
        bloom: { '0%': { opacity: '0', transform: 'scale(0.5) rotate(-10deg)' }, '100%': { opacity: '1', transform: 'scale(1) rotate(0deg)' } },
        petalSpin: { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } },
        fadeUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
    },
  },
  plugins: [],
}
