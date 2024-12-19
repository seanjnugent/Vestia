/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Include all JS/TS/JSX/TSX files in the src folder
    './public/index.html',        // Include the main HTML file
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1D4ED8', // Example: Custom blue color
        secondary: '#9333EA', // Example: Custom purple color
      },
      borderRadius: {
        '3xl': '1.5rem',
      },
      boxShadow: {
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
};
