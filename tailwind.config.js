/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./client/index.html', './client/ts/**/*.tsx'],
  theme: {
    extend: {
      colors: {
        'theme-blue': '#3e4eb8',
        'theme-blue-200': '#9da5db',
        'theme-grey': '#cbcbcb',
        'theme-grey-400': '#d0d0d0',
      },
      gridTemplateColumns: {
        table: 'repeat(2, minmax(125px, 7fr) minmax(125px, 1fr))',
      },
    },
  },
}
