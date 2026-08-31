/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#fdfdfb',
          100: '#fbfbf8',
          200: '#f4f6f0',
          300: '#e9ece0',
          400: '#d8dec8'
        },
        rural: {
          green: {
            50: '#f2f8f2',
            100: '#e1f0e1',
            200: '#c4e2c5',
            300: '#99cca0',
            400: '#64af71',
            500: '#3e934d',
            600: '#2e7d32',
            700: '#246328',
            800: '#1e4f22',
            900: '#164219',
            950: '#0a230c'
          },
          saffron: {
            50: '#fffbeb',
            100: '#fef3c7',
            200: '#fde68a',
            300: '#fcd34d',
            400: '#fbbf24',
            500: '#f59e0b',
            600: '#d97706',
            700: '#b45309',
            800: '#92400e'
          },
          blue: {
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            600: '#2563eb',
            700: '#1d4ed8',
            800: '#1e40af',
            900: '#1e3a8a'
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Devanagari', 'system-ui', 'sans-serif'],
        heading: ['Outfit', 'Noto Sans Devanagari', 'sans-serif']
      }
    },
  },
  plugins: [],
}
