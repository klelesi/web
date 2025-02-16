import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        black: '#181818',
        red: '#FF637B',
        'red-dark': '#E14961',
        beige: '#F9F2E9',
        gray: '#BBBBBB',
        'dark-gray': '#7D7D7D',
        'light-gray': "#F3F3F3",
        error: "#EA324E",
        orange: '#FF9314',
        green: '#79CE82',
        blue: '#0E9FF0',
        'error-washed': "rgba(234, 50, 78, 0.1)",
      },
      fontFamily: {
        'sans': ['Kulim Park', 'sans-serif'],
      },
      container: {
        center: true,
        padding: '2rem',
      },
      typography: {
        DEFAULT: {
          css: {
            lineHeight: '1.5',
            a: {
              color: '#FF637B',
              '&:hover': {
                color: '#E14961',
              },
            },
            '--tw-prose-bullets': '#000',
          },
        },
      },
    },
    boxShadow: {
      DEFAULT: '4px 4px 0px rgba(0, 0, 0, 0.15);',
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} satisfies Config;
