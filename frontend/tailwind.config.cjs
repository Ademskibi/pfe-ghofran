module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Sahartoon Brand Colors
        sahartoon: {
          burgundy: '#8B1E3F',      // Primary
          beige: '#F8F7F4',          // Background
          cream: '#FDFCFB',          // Light background
          success: '#22C55E',        // G1 Light - Green
          warning: '#F59E0B',        // G2 Moderate - Orange
          danger: '#DC2626',         // G3 Severe - Red
          neutral: '#E5E7EB',        // Gray neutral
          dark: '#1F2937',           // Dark text
          light: '#F3F4F6',          // Light gray
        },
        // Legacy colors (kept for compatibility)
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
      fontFamily: {
        sans: ['Inter', 'Figtree', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '16px',
        '2xl': '24px',
      },
      boxShadow: {
        'soft': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'soft-md': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'soft-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
      },
      animation: {
        'fadeIn': 'fadeIn 0.3s ease-in-out',
        'slideUp': 'slideUp 0.3s ease-out',
        'pulse-soft': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  safelist: [
    { pattern: /^(bg|text|border)-(sahartoon|emerald|amber|rose|indigo|slate)-(100|200|300|500|600|700|800|burgundy|beige|cream|success|warning|danger|neutral|dark|light)$/ }
  ],
  plugins: []
}
