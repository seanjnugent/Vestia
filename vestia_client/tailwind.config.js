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
    },
  },
  plugins: [],
};
