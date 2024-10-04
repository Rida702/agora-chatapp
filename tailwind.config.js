/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  // Include all files in the src directory
    "./components/**/*.{js,jsx,ts,tsx}", // Include all files in the components directory
    "./screens/**/*.{js,jsx,ts,tsx}", // Include all files in the components directory
    "./App.{js,jsx,ts,tsx}", // Include the root App.js file
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

