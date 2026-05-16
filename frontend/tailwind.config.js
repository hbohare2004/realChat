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
        dark: {
          900: '#0B0F19', // Deep navy for main bg
          800: '#111827', // Slightly lighter for panels
          700: '#1F2937', // Hover states
          600: '#374151', // Borders
        },
        light: {
          900: '#F3F4F6', // Main bg
          800: '#FFFFFF', // Panels
          700: '#F9FAFB', // Hover states
          600: '#E5E7EB', // Borders
        },
        primary: {
          500: '#8B5CF6', // Vibrant purple
          600: '#7C3AED',
          700: '#6D28D9',
        },
        accent: {
          500: '#EC4899', // Pink accent
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'nexus-gradient': 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
      }
    },
  },
  plugins: [],
}
