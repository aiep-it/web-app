const { heroui } = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      colors: {
        'purple-25': '#fafaff',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float-delayed 8s ease-in-out infinite 2s',
        'float-slow': 'float-slow 10s ease-in-out infinite 4s',
        'shimmer': 'shimmer 2s linear infinite',
        'fade-in': 'fade-in 0.6s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
        'result-reveal': 'result-reveal 0.8s ease-out',
        'bounce-success': 'bounce-success 1s ease-in-out',
        'shake': 'shake 0.5s ease-in-out',
        'pulse-green': 'pulse-green 2s ease-in-out infinite',
        'pulse-red': 'pulse-red 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'float-delayed': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'fade-in': {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          'from': { opacity: '0', transform: 'translateY(30px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        'result-reveal': {
          '0%': { opacity: '0', transform: 'scale(0.8) rotateY(90deg)' },
          '50%': { opacity: '0.5', transform: 'scale(1.1) rotateY(45deg)' },
          '100%': { opacity: '1', transform: 'scale(1) rotateY(0deg)' },
        },
        'bounce-success': {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-10px)' },
          '60%': { transform: 'translateY(-5px)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-3px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(3px)' },
        },
        'pulse-green': {
          '0%, 100%': { backgroundColor: 'rgba(34, 197, 94, 0.2)' },
          '50%': { backgroundColor: 'rgba(34, 197, 94, 0.4)' },
        },
        'pulse-red': {
          '0%, 100%': { backgroundColor: 'rgba(239, 68, 68, 0.2)' },
          '50%': { backgroundColor: 'rgba(239, 68, 68, 0.4)' },
        },
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            primary: {
              50: "#eff6ff",
              100: "#dbeafe", 
              200: "#bfdbfe",
              300: "#93c5fd",
              400: "#60a5fa",
              500: "#2563eb",
              600: "#1d4ed8",
              700: "#1e40af",
              800: "#1e3a8a",
              900: "#172554",
              DEFAULT: "#2563eb",
              foreground: "#FFFFFF"
            },
            secondary: {
              50: "#f5f3ff",
              100: "#ede9fe",
              200: "#ddd6fe",
              300: "#c4b5fd",
              400: "#a78bfa",
              500: "#6f2da8",
              600: "#7c3aed",
              700: "#6d28d9",
              800: "#5b21b6",
              900: "#4c1d95",
              DEFAULT: "#6f2da8",
              foreground: "#FFFFFF"
            }
          }
        }
      }
    })
  ]
};

module.exports = config;
