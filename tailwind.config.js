/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    container: { center: true, padding: '1rem' },
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        'mode-bus': 'var(--mode-bus)',
        'mode-bus-bg': 'var(--mode-bus-bg)',
        'mode-train': 'var(--mode-train)',
        'mode-train-bg': 'var(--mode-train-bg)',
        'mode-metro': 'var(--mode-metro)',
        'mode-metro-bg': 'var(--mode-metro-bg)',
        'mode-tram': 'var(--mode-tram)',
        'mode-tram-bg': 'var(--mode-tram-bg)',
        'change-up': 'var(--change-up)',
        'change-up-bg': 'var(--change-up-bg)',
        'change-down': 'var(--change-down)',
        'change-down-bg': 'var(--change-down-bg)',
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
        sm: 'calc(var(--radius) - 4px)',
        lg: 'calc(var(--radius) + 2px)',
        xl: 'calc(var(--radius) + 6px)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0,0,0,0.07), 0 1px 2px -1px rgba(0,0,0,0.05)',
        'card-hover': '0 4px 12px 0 rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
        sidebar: '2px 0 8px 0 rgba(0,0,0,0.06)',
        modal: '0 20px 60px -10px rgba(0,0,0,0.25)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};