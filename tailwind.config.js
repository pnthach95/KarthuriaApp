/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      aspectRatio: {
        /** for stage girl and equip thumbnail */
        'stage-girl': '144 / 160',
        'character-portrait': '19 / 30',
        /** for memoir and dress */
        memoir: '4 / 3',
        role: '3 / 2',
      },
      width: {
        '1/7': '14.28571429%',
      },
    },
  },
  plugins: [],
};
