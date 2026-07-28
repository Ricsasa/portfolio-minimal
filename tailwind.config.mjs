const withMT = require("@material-tailwind/react/utils/withMT");

const config = withMT({
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {

      },
      minWidth: {
        '8xl': '90rem', // Custom 8xl width (1440px)
        '9xl': '100rem', // Custom 9xl width (1600px)
      },
      maxWidth: {
        '8xl': '90rem', // Custom 8xl width (1440px)
        '9xl': '100rem', // Custom 9xl width (1600px)
      },
      width: {
        '8xl': '90rem', // Custom 8xl width (1440px)
        '9xl': '100rem', // Custom 9xl width (1600px)
      },

    },
  },
  plugins: [],
  darkMode: 'none',
});

export default config