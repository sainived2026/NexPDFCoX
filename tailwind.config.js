/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── NexPDFCoX Brand Palette ──
        brand: {
          50:  '#f9f0ee',   // lightest blush tint
          100: '#f2ddd8',
          200: '#eacdc2',   // #EACDC2 — blush cream
          300: '#d4a398',
          400: '#c4796e',
          500: '#b75d69',   // #B75D69 — rose accent (primary CTA)
          600: '#a04d5a',
          700: '#774c60',   // #774C60 — dusty plum
          800: '#372549',   // #372549 — deep eggplant
          900: '#1a1423',   // #1A1423 — near-black (darkest)
          950: '#100b16',
        },
        // Semantic aliases
        blush:    '#EACDC2',
        rose:     '#B75D69',
        plum:     '#774C60',
        eggplant: '#372549',
        void:     '#1A1423',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body:    ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'float':      'float 6s ease-in-out infinite',
        'glow':       'glow 3s ease-in-out infinite alternate',
        'slide-up':   'slideUp 0.4s cubic-bezier(0.16,1,0.3,1)',
        'fade-in':    'fadeIn 0.3s ease-out',
        'shimmer':    'shimmer 2.5s linear infinite',
        'ping-slow':  'ping 2.5s cubic-bezier(0,0,0.2,1) infinite',
        'pulse-rose': 'pulseRose 2s ease-in-out infinite',
      },
      keyframes: {
        float:      { '0%,100%': { transform: 'translateY(0px)' },  '50%': { transform: 'translateY(-8px)' } },
        glow:       { from: { boxShadow: '0 0 20px #B75D6933' },    to:   { boxShadow: '0 0 48px #B75D6977, 0 0 80px #B75D6933' } },
        slideUp:    { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn:     { from: { opacity: '0' }, to: { opacity: '1' } },
        shimmer:    { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        pulseRose:  { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.6' } },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #B75D69 0%, #774C60 100%)',
        'gradient-deep':  'linear-gradient(135deg, #372549 0%, #1A1423 100%)',
        'mesh-warm': [
          'radial-gradient(at 30% 15%, rgba(183,93,105,0.18) 0, transparent 50%)',
          'radial-gradient(at 80% 5%,  rgba(119,76,96,0.14)  0, transparent 50%)',
          'radial-gradient(at 5%  60%, rgba(234,205,194,0.08) 0, transparent 50%)',
        ].join(', '),
      },
      boxShadow: {
        'rose':      '0 0 24px #B75D6944, 0 0 64px #B75D6922',
        'rose-sm':   '0 0 12px #B75D6933',
        'glass':     '0 8px 32px rgba(26,20,35,0.25), inset 0 1px 0 rgba(234,205,194,0.08)',
        'card':      '0 4px 24px rgba(26,20,35,0.2)',
        'card-glow': '0 4px 32px rgba(183,93,105,0.15)',
        'upload':    '0 0 0 2px #B75D69, 0 0 40px #B75D6922',
        'inner-glow':'inset 0 1px 0 rgba(234,205,194,0.1)',
      },
    },
  },
  plugins: [],
}
