module.exports = {
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/streamdown/dist/*.js",
  ],
}