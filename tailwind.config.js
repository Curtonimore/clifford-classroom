/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-average)', 'Average', 'serif'],
        serif: ['var(--font-average)', 'Average', 'serif'],
        mono: ['var(--font-average)', 'Average', 'serif'],
      },
      colors: {
        'brand': '#1B4332',
        'brand-light': '#2D6A4F',
        'brand-dark': '#14342A',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
} 