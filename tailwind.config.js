/* eslint global-require: off */
/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [
    require('@osuresearch/ui/tailwind-preset')
  ],
  content: [
    './src/**/*.{tsx,ts}'
  ],
  theme: {
    extend: {},
  },
  plugins: []
}
