module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        principal: '#F28C38',
        fox: '#F47C20',
        foxDark: '#7A3F14',
        foxDetail: '#6B3A1E',
        muzzle: '#F4EFEA',
        glasses: '#3ED1C8',
        ui: '#2FA8CC',
        uiDark: '#1F6F8B',
        yellowButton: '#FFD500',
        appBg: '#F8FAFB',
        bgShape: '#DDE5EA',
      },
    },
  },
  safelist: [
    { pattern: /^(bg|text|border)-(emerald|amber|rose|indigo|slate)-(100|200|300|500|600|700|800)$/ }
  ],
  plugins: []
}
