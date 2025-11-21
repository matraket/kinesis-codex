import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './features/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FB2F72',
        surface: '#0F172A',
        border: '#1E293B',
        muted: '#64748B',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444'
      }
    }
  },
  plugins: []
};

export default config;
