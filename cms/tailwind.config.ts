import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './features/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './store/**/*.{ts,tsx}',
    '../shared/**/*.{ts,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', ...defaultTheme.fontFamily.sans]
      },
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          foreground: '#F8FAFC'
        },
        secondary: '#0F172A',
        accent: '#8B5CF6',
        muted: '#64748B'
      },
      boxShadow: {
        card: '0 10px 40px rgba(0, 0, 0, 0.08)'
      }
    }
  },
  plugins: []
};

export default config;
