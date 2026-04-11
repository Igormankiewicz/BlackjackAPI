/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Add your custom brand colors here
        'fedora-blue': '#294172', 
        'custom-accent': '#ff49db',
      },
    },
  },
  plugins: [],
}