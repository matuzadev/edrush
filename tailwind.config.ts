import type { Config } from 'tailwindcss';

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        emerald: {
          500: '#34D399',
          600: '#10B981',
        },
        slate: {
          50: '#F8FAFC',
          900: '#0F172A',
          950: '#020617',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      transitionDuration: {
        800: '800ms',
      },
    },
  },
  plugins: [],
};

export default config;
  