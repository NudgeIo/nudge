/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        yellow: {
          yellow: 'rgba(250, 204, 20, 1)',
          hover: 'rgba(255, 235, 51, 1)',
          "on-primary": 'rgba(246, 243, 213, 1)',
          "primary-alt": 'rgba(246, 243, 213, 1)',
          "primary-alt-hover":'rgba(243, 238, 196, 1)',
          "yellow-dark-hover": 'rgba(102, 92, 0, 1)',
          tint:{
            1: 'rgba(253, 224, 71, 1)',
          }
        }
      }
    },
  },
  plugins: [],
}
