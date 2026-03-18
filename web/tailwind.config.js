/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        sophie: {
          primary: '#8b5cf6',
          secondary: '#ec4899',
          dark: '#0f172a',
        }
      }
    },
  },
  plugins: [],
}
