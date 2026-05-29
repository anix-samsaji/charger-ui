import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary:                   'rgb(var(--m3-primary) / <alpha-value>)',
        'on-primary':              'rgb(var(--m3-on-primary) / <alpha-value>)',
        'primary-container':       'rgb(var(--m3-primary-container) / <alpha-value>)',
        'on-primary-container':    'rgb(var(--m3-on-primary-container) / <alpha-value>)',

        secondary:                 'rgb(var(--m3-secondary) / <alpha-value>)',
        'on-secondary':            'rgb(var(--m3-on-secondary) / <alpha-value>)',
        'secondary-container':     'rgb(var(--m3-secondary-container) / <alpha-value>)',
        'on-secondary-container':  'rgb(var(--m3-on-secondary-container) / <alpha-value>)',

        tertiary:                  'rgb(var(--m3-tertiary) / <alpha-value>)',
        'on-tertiary':             'rgb(var(--m3-on-tertiary) / <alpha-value>)',
        'tertiary-container':      'rgb(var(--m3-tertiary-container) / <alpha-value>)',
        'on-tertiary-container':   'rgb(var(--m3-on-tertiary-container) / <alpha-value>)',

        error:                     'rgb(var(--m3-error) / <alpha-value>)',
        'on-error':                'rgb(var(--m3-on-error) / <alpha-value>)',
        'error-container':         'rgb(var(--m3-error-container) / <alpha-value>)',
        'on-error-container':      'rgb(var(--m3-on-error-container) / <alpha-value>)',

        background:                'rgb(var(--m3-background) / <alpha-value>)',
        'on-background':           'rgb(var(--m3-on-background) / <alpha-value>)',

        surface:                   'rgb(var(--m3-surface) / <alpha-value>)',
        'on-surface':              'rgb(var(--m3-on-surface) / <alpha-value>)',
        'surface-variant':         'rgb(var(--m3-surface-variant) / <alpha-value>)',
        'on-surface-variant':      'rgb(var(--m3-on-surface-variant) / <alpha-value>)',

        'surface-container-lowest':  'rgb(var(--m3-surface-container-lowest) / <alpha-value>)',
        'surface-container-low':     'rgb(var(--m3-surface-container-low) / <alpha-value>)',
        'surface-container':         'rgb(var(--m3-surface-container) / <alpha-value>)',
        'surface-container-high':    'rgb(var(--m3-surface-container-high) / <alpha-value>)',
        'surface-container-highest': 'rgb(var(--m3-surface-container-highest) / <alpha-value>)',

        outline:                   'rgb(var(--m3-outline) / <alpha-value>)',
        'outline-variant':         'rgb(var(--m3-outline-variant) / <alpha-value>)',

        warning:                   '#F5A623',
      },
      fontFamily: {
        sans:    ['Barlow', 'system-ui', 'sans-serif'],
        display: ['Barlow Condensed', 'Barlow', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-sm': ['36px', { lineHeight: '44px', fontWeight: '400' }],
        'headline-sm': ['24px', { lineHeight: '32px', fontWeight: '400' }],
        'title-lg':    ['22px', { lineHeight: '28px', fontWeight: '500' }],
        'title-md':    ['16px', { lineHeight: '24px', fontWeight: '500', letterSpacing: '0.15px' }],
        'title-sm':    ['14px', { lineHeight: '20px', fontWeight: '500', letterSpacing: '0.1px' }],
        'body-md':     ['14px', { lineHeight: '20px', fontWeight: '400', letterSpacing: '0.25px' }],
        'label-lg':    ['14px', { lineHeight: '20px', fontWeight: '500', letterSpacing: '0.1px' }],
        'label-md':    ['12px', { lineHeight: '16px', fontWeight: '500', letterSpacing: '0.5px' }],
        'label-sm':    ['11px', { lineHeight: '16px', fontWeight: '500', letterSpacing: '0.5px' }],
      },
      borderRadius: {
        sm:    '8px',
        DEFAULT: '12px',
        lg:    '16px',
        xl:    '20px',
        '2xl': '24px',
        '3xl': '28px',
        full:  '9999px',
      },
      animation: {
        'pulse-ring':   'pulseRing 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer':      'shimmer 1.4s ease-in-out infinite',
        'draw':         'draw 2s ease-out forwards',
        'fade-up':      'fadeUp 0.5s cubic-bezier(0.2, 0, 0, 1) forwards',
        'map-ripple':   'mapRipple 2s ease-out infinite',
      },
      keyframes: {
        pulseRing: {
          '0%':   { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(2.5)', opacity: '0' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        draw: {
          to: { strokeDashoffset: '0' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        mapRipple: {
          '0%':   { transform: 'scale(1)', opacity: '0.6' },
          '100%': { transform: 'scale(3)', opacity: '0' },
        },
      },
      gridTemplateColumns: {
        '12': 'repeat(12, minmax(0, 1fr))',
      },
      transitionTimingFunction: {
        'm3-emphasized': 'cubic-bezier(0.2, 0, 0, 1)',
      },
      transitionDuration: {
        '200': '200ms',
        '400': '400ms',
        '500': '500ms',
      },
    },
  },
  plugins: [],
}

export default config
