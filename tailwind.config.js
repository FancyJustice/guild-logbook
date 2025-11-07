/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: '#f4e8d8',
        'parchment-dark': '#e8d7be',
        gold: '#d4a574',
        'gold-dark': '#8b6f47',
        wood: '#4a3728',
        'wood-light': '#6b5541',
        seal: '#8b0000',
        'seal-light': '#c41e3a',
        ultimate: '#ffd700',
        'ultimate-dark': '#daa520',
      },
      fontFamily: {
        serif: ['Garamond', 'serif'],
        fantasy: ['MedievalSharp', 'cursive'],
        medieval: ['MedievalSharp', 'cursive'],
      },
      backgroundImage: {
        'paper-texture': "url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><filter id=%22noise%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%221%22 result=%22noise%22/></filter><rect width=%22100%22 height=%22100%22 fill=%22%23f4e8d8%22 filter=%22url(%23noise)%22/></svg>')",
      },
    },
  },
  plugins: [],
}
