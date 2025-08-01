/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
  // Enable JIT mode for smaller builds
  mode: 'jit',
  // Purge unused styles
  purge: {
    enabled: true,
    content: ['./public/**/*.{html,js}'],
  },
}