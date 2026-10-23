/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4f9',
          100: '#e1e9f2',
          200: '#c3d3e6',
          300: '#94b3d4',
          400: '#5e8ec0',
          500: '#3a70a8',
          600: '#2c598c',
          700: '#234670',
          800: '#1b3554',
          900: '#0f1f33',
          950: '#08111d',
        },
        brand: {
          blue: '#2563eb',
          violet: '#7c3aed',
          indigo: '#4f46e5',
          accent: '#06b6d4',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'premium': '0 4px 20px -2px rgba(15, 31, 51, 0.06), 0 2px 6px -1px rgba(15, 31, 51, 0.04)',
        'elevated': '0 12px 30px -4px rgba(15, 31, 51, 0.1), 0 4px 10px -2px rgba(15, 31, 51, 0.05)',
      }
    },
  },
  plugins: [],
}
