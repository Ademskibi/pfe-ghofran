module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: { extend: {} },
  safelist: [
    { pattern: /^(bg|text|border)-(emerald|amber|rose|indigo|slate)-(100|200|300|500|600|700|800)$/ }
  ],
  plugins: []
}
