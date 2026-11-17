/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'royal-pink': '#EA1B85',
        'royal-pink-hover': '#D01273',
        'royal-pink-subtle': '#FDF2F8',
        'royal-pink-border': 'rgba(234, 27, 133, 0.25)',
        'deep-navy': '#14213D',
        'navy-surface': '#1A294B',
        'navy-dark': '#0E1729',
        'navy-light': '#253864',
        'navy-border': '#2A3C66',
        'pale-pink': '#FCE8F2',
        'pale-pink-subtle': '#FFF5FA',
        'lavender': '#A78BFA',
        'lavender-light': '#EDE9FE',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        heading: ['Manrope', 'Outfit', 'Inter', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Roboto Mono', 'monospace'],
      },
      boxShadow: {
        'royal': '0 4px 20px -2px rgba(234, 27, 133, 0.28)',
        'card': '0 1px 3px 0 rgba(20, 33, 61, 0.04), 0 1px 2px -1px rgba(20, 33, 61, 0.04)',
        'card-hover': '0 10px 25px -5px rgba(20, 33, 61, 0.08), 0 8px 10px -6px rgba(20, 33, 61, 0.04)',
        'modal': '0 25px 50px -12px rgba(20, 33, 61, 0.25)',
      }
    },
  },
  plugins: [],
}
