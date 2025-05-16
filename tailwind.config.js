module.exports = {
  content: ['./src/app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        average: ['Average', 'serif'],
      },
      colors: {
        darkgreen: '#0f5132',
        brand: {
          green: '#2D4739',
          'green-dark': '#223528',
          'green-light': '#3a5c47',
        },
      },
    },
  },
  plugins: [],
} 