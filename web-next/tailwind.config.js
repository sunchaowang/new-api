import {nextui} from '@nextui-org/theme'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      keyframes: {
        "scrolling-banner": {
          from: {transform: "translateX(0)"},
          to: {transform: "translateX(calc(-50% - var(--gap)/2))"},
        },
        "scrolling-banner-vertical": {
          from: {transform: "translateY(0)"},
          to: {transform: "translateY(calc(-50% - var(--gap)/2))"},
        },
      },
      animation: {
        "scrolling-banner": "scrolling-banner var(--duration) linear infinite",
        "scrolling-banner-vertical": "scrolling-banner-vertical var(--duration) linear infinite",
      },
      backgroundImage: {
        'hero-bg': "url('/assets/images/hero@bg.jpg')",
      }
    },
  },
  darkMode: "class",
  plugins: [nextui()],
}
