export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        doctor: {
          surface: '#07101f',
          panel: '#0d2134',
          accent: '#38bdf8',
          highlight: '#d9f3ff',
          text: '#e2f5ff'
        }
      }
    }
  },
  plugins: []
};
