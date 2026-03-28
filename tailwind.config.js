/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#6c3b89',
          light: '#ac77d7',
          soft: '#cac3ea',
        },
        secondary: {
          DEFAULT: '#5c9fbb',
          light: '#98dee0',
        },
        accent: {
          DEFAULT: '#a5526b',
          light: '#d698bd',
        },
      },
      fontFamily: {
        inter: ['var(--font-inter)'],
        space: ['var(--font-space)'],
      },
    },
  },
  plugins: [],
};
