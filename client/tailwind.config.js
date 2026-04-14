/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme palette
        'dark-bg': '#121212',
        'dark-surface': '#1e1e1e',
        'dark-border': '#333333',
        'dark-text': '#f3f4f6',

        // Light theme palette
        'light-bg': '#f9fafb',
        'light-surface': '#ffffff',
        'light-border': '#e5e7eb',
        'light-text': '#111827',

        // Green accents for Blackjack vibe
        'green-board': '#0b6623', 
        'green-primary': '#10b981', 
        'green-hover': '#059669',
        'green-accent': '#34d399',

        // Existing custom colors
        'fedora-blue': '#294172', 
        'custom-accent': '#ff49db',
      },
    },
  },
  plugins: [],
}