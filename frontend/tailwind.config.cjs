module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ─────── Brand Palette (exact hex) ───────
        sahartoon: {
          // Primaries
          cyan:    '#11b4d7',   // Bleu cyan
          yellow:  '#f4dd15',   // Jaune intense
          orange:  '#f38033',   // Orange vif
          lime:    '#fcfe5e',   // Jaune clair / pastel

          // Aliases (used throughout the codebase)
          burgundy: '#11b4d7',  // Primary accent → cyan
          success:  '#11b4d7',  // G1 léger
          warning:  '#f4dd15',  // G2 modéré
          danger:   '#f38033',  // G3 sévère

          // Light-mode surfaces
          beige:    '#f8f9fa',  // Page background light
          cream:    '#ffffff',  // Card surface light
          neutral:  '#e5e7eb',  // Border/divider light
          light:    '#f1f5f9',  // Soft fill light
          dark:     '#0a0a0a',  // Text dark

          // Dark-mode surfaces
          'dark-bg':      '#000000',
          'dark-surface': '#0d0d0d',
          'dark-panel':   '#141414',
          'dark-border':  '#1f1f1f',
          'dark-muted':   '#6b7280',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        xl:  '14px',
        '2xl': '20px',
        '3xl': '28px',
      },
      boxShadow: {
        'soft':     '0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px 0 rgba(0,0,0,0.04)',
        'soft-md':  '0 4px 12px -2px rgba(0,0,0,0.08), 0 2px 6px -2px rgba(0,0,0,0.04)',
        'soft-lg':  '0 10px 24px -4px rgba(0,0,0,0.1), 0 4px 8px -2px rgba(0,0,0,0.05)',
        'glow-cyan':   '0 0 16px rgba(17,180,215,0.35)',
        'glow-yellow': '0 0 16px rgba(244,221,21,0.35)',
        'glow-orange': '0 0 16px rgba(243,128,51,0.35)',
        'inner-glow':  'inset 0 0 20px rgba(17,180,215,0.08)',
      },
      animation: {
        'fadeIn':      'fadeIn 0.3s ease-in-out',
        'slideUp':     'slideUp 0.35s ease-out',
        'pulse-soft':  'pulseSoft 2.5s ease-in-out infinite',
        'shimmer':     'shimmer 1.8s infinite',
        'float':       'float 3s ease-in-out infinite',
        'scanline':    'scanline 4s linear infinite',
      },
      keyframes: {
        fadeIn:    { '0%': { opacity: '0' },           '100%': { opacity: '1' } },
        slideUp:   { '0%': { transform: 'translateY(12px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        pulseSoft: { '0%,100%': { opacity: '1' },      '50%':  { opacity: '.6' } },
        shimmer:   { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        float:     { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
        scanline:  { '0%': { transform: 'translateY(-100%)' }, '100%': { transform: 'translateY(100vh)' } },
      },
    },
  },
  safelist: [
    { pattern: /^(bg|text|border|shadow|ring)-(sahartoon)-(cyan|yellow|orange|lime|burgundy|success|warning|danger|beige|cream|neutral|light|dark)$/ },
    { pattern: /^(bg|text|border)-(white|black|slate)-(50|100|200|300|400|500|600|700|800|900)$/ },
    'border-l-sahartoon-cyan',
    'border-l-sahartoon-yellow',
    'border-l-sahartoon-orange',
    'border-l-sahartoon-burgundy',
    'border-l-sahartoon-success',
    'border-l-sahartoon-warning',
    'border-l-sahartoon-danger',
    'border-l-slate-400',
    'dark',
  ],
  plugins: [],
}
