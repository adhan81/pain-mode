/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5', // Main purple color from the design
          light: '#E0E7FF',
          dark: '#4338CA',
        },
        secondary: {
          DEFAULT: '#10B981', // Green color for secondary actions
          light: '#D1FAE5',
          dark: '#059669',
        },
        neutral: {
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        red: {
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
        },
        orange: {
          500: '#F97316',
          600: '#EA580C',
        },
        yellow: {
          500: '#EAB308',
          600: '#CA8A04',
        },
        amber: {
          400: '#FBBF24',
          500: '#F59E0B',
        },
      },
      textColor: {
        'primary': '#4F46E5',
        'primary-dark': '#4338CA',
      },
      backgroundColor: {
        'primary': '#4F46E5',
        'primary-dark': '#4338CA',
        'secondary': '#10B981',
        'secondary-dark': '#059669',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
    },
  },
  plugins: [],
} 