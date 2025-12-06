/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        grey: {
          50: '#F2F3F7',
          100: '#ECEDF5',
          200: '#E2E3ED',
          300: '#C0C1CC',
          400: '#9C9FAE',
          500: '#8A8DA0',
          600: '#6B7684',
          700: '#4E5968',
          800: '#3F4650',
          900: '#191F28',
        },
        point: '#394CFF', // 파란색
        error: '#F00E0E', // 빨간색
        gradientStart: '#394CFF',
        gradientEnd: '#C539DE', // 보라색
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, #394CFF, #C539DE)',
      },
      fontSize: {
        // display
        'display-2xl': ['22px', { lineHeight: '30px', fontWeight: '600' }],

        // heading
        'heading-xl': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'heading-lg': ['18px', { lineHeight: '24px', fontWeight: '600' }],
        'heading-md': ['16px', { lineHeight: '20px', fontWeight: '600' }],
        'heading-sm': ['16px', { lineHeight: '20px', fontWeight: '500' }],

        // body
        'body-xl': ['14px', { lineHeight: '20px', fontWeight: '600' }],
        'body-lg': ['14px', { lineHeight: '20px', fontWeight: '500' }],
        'body-md': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'body-sm': ['13px', { lineHeight: '18px', fontWeight: '500' }],
        'body-xs': ['13px', { lineHeight: '18px', fontWeight: '400' }],

        // caption
        'caption-md': ['12px', { lineHeight: '18px', fontWeight: '600' }],
        'caption-sm': ['12px', { lineHeight: '18px', fontWeight: '500' }],
      },
    },
  },
  plugins: [],
};
