module.exports = {
  theme: {
    extend: {
      fontFamily: {
        serif: ['Georgia', 'serif'],
      },
      textColor: {
        DEFAULT: '#000000',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}; 