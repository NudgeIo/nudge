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
        },
          surface:{
            variant: "rgba(239, 241, 246, 1)",
            60: "rgba(255, 255, 255, 0.6)"
          },
        green:{
          shades:{
            1: "rgba(22, 163, 74, 1)"
          },
          tint:{
            4: "rgba(240, 253, 244, 1)"
          }
        },

        blue:{
          blue:'rgba(59, 130, 246, 1)'
        },
        background:"rgba(245, 245, 245, 1)",

        utility:{
          outline:"rgba(213, 216, 221, 1)",
          "disabled-content": "rgba(26, 26, 31, 0.38)",
          "disabled-background": "rgba(26, 26, 31, 0.12)"
        },

        input:{
          text:{
            dim: "rgba(65, 65, 78, 0.7)"
          }
        }
        
      }
    },
  },
  plugins: [],
}
