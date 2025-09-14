/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        rosa: '#C2227A',
        verde: '#8BC34A',
        ciano: '#00BCD4',
        background: '#F8F9FA',
        'text-primary': '#1A1A1A',
        'text-secondary': '#6B7280',
      },
    },
  },
  plugins: [],
}