/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fredoka', 'Comic Sans MS', 'system-ui', 'sans-serif'],
      },
      colors: {
        skyKid: '#64d2ff',
        peachKid: '#ffbe98',
        mintKid: '#b2f7ef',
      },
    },
  },
  plugins: [],
}
