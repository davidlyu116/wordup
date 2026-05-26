/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#ecfdf5',
          100: '#d1fae5',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        }
      },
      keyframes: {
        flipIn: {
          '0%':   { transform: 'rotateY(90deg)', opacity: '0' },
          '100%': { transform: 'rotateY(0deg)',  opacity: '1' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',     opacity: '1' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-6px)' },
          '40%, 80%': { transform: 'translateX(6px)' },
        }
      },
      animation: {
        flipIn:  'flipIn 0.35s ease-out',
        slideUp: 'slideUp 0.25s ease-out',
        shake:   'shake 0.4s ease-in-out',
      }
    },
  },
  plugins: [],
}
