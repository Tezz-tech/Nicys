/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        lavender:        '#C8A4D4',
        cream:           '#FFF8F0',
        'cream-dark':    '#F0E6D6',
        'dusty-rose':    '#D4A5A5',
        emerald:         '#2D6A4F',
        'baby-pink':     '#F4C2C2',
        midnight:        '#1B2A4A',
        'midnight-light':'#243558',
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
        'lavender': '0 4px 24px rgba(200, 164, 212, 0.25)',
        'ink':      '0 2px 16px rgba(27, 42, 74, 0.08)',
        'wax':      '0 0 0 4px rgba(45, 106, 79, 0.15)',
      },
      keyframes: {
        fadeIn:      { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp:     { '0%': { transform: 'translateY(28px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        float:       { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-16px)' } },
        shimmer:     { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        stampIn:     { '0%': { transform: 'scale(1.5) rotate(-12deg)', opacity: '0' }, '60%': { transform: 'scale(0.95)', opacity: '1' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        inkReveal:   { '0%': { clipPath: 'inset(0 100% 0 0)' }, '100%': { clipPath: 'inset(0 0% 0 0)' } },
        waxPulse:    { '0%,100%': { boxShadow: '0 0 0 0 rgba(45,106,79,0.4)' }, '50%': { boxShadow: '0 0 0 8px rgba(45,106,79,0)' } },
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
