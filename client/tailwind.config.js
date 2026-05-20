/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        lavender:        '#C4A8F0',
        cream:           '#FFFCF5',
        'cream-dark':    '#F5EBD8',
        'dusty-rose':    '#E8A0B4',
        emerald:         '#8B1A2E',
        'baby-pink':     '#FFC1D0',
        midnight:        '#0D1B38',
        'midnight-light':'#1A2D52',
        maroon:          '#8B1A2E',
        sepia:           '#8B7355',
        'sepia-light':   '#C4A882',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body:    ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      fontWeight: {
        light:       '300',
        normal:      '400',
        medium:      '500',
        semibold:    '600',
        bold:        '700',
      },
      letterSpacing: {
        'display':  '0.02em',
        'stamp':    '0.25em',
        'micro':    '0.35em',
      },
      boxShadow: {
        'lavender': '0 4px 24px rgba(196, 168, 240, 0.30)',
        'ink':      '0 2px 16px rgba(13, 27, 56, 0.10)',
        'wax':      '0 0 0 4px rgba(139, 26, 46, 0.15)',
        'emboss':   '0 4px 14px rgba(13,27,56,0.12), 0 1px 4px rgba(13,27,56,0.08), inset 0 1px 0 rgba(255,255,255,0.18)',
        'lift':     '0 8px 28px rgba(13,27,56,0.16), 0 2px 8px rgba(13,27,56,0.10), inset 0 1px 0 rgba(255,255,255,0.18)',
      },
      keyframes: {
        fadeIn:      { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp:     { '0%': { transform: 'translateY(28px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        float:       { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-16px)' } },
        shimmer:     { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        stampIn:     { '0%': { transform: 'scale(1.5) rotate(-12deg)', opacity: '0' }, '60%': { transform: 'scale(0.95)', opacity: '1' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        inkReveal:   { '0%': { clipPath: 'inset(0 100% 0 0)' }, '100%': { clipPath: 'inset(0 0% 0 0)' } },
        waxPulse:    { '0%,100%': { boxShadow: '0 0 0 0 rgba(139,26,46,0.4)' }, '50%': { boxShadow: '0 0 0 8px rgba(139,26,46,0)' } },
      },
      animation: {
        'fade-in':   'fadeIn 1s ease-in-out',
        'slide-up':  'slideUp 0.8s ease-out',
        float:       'float 6s ease-in-out infinite',
        shimmer:     'shimmer 3s ease-in-out infinite',
        'stamp-in':  'stampIn 0.5s cubic-bezier(0.34,1.56,0.64,1)',
        'ink-reveal': 'inkReveal 0.8s ease-out',
        'wax-pulse': 'waxPulse 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
