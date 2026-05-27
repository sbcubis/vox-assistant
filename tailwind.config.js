/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a12',
        surface: '#12121e',
        card: '#1a1a2e',
        border: '#ffffff0f',
        accent: '#7c3aed',
        'accent-light': '#a855f7',
      }
    },
  },
  plugins: [],
}
