// Import the default theme from Tailwind CSS to extend its font families.
// This allows us to add custom fonts while keeping Tailwind's defaults as fallbacks.
const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
export default {
  /**
   * The `content` array specifies all the files where Tailwind should look for class names.
   * This is crucial for tree-shaking (purging) unused styles in production builds,
   * resulting in a smaller CSS file.
   */
  content: [
    // The main HTML entry point.
    "./index.html", 
    // All JavaScript/TypeScript files in the src directory.
    "./src/**/*.{js,jsx,ts,tsx}"
  ],

  /**
   * The `theme` object is where you define your project's design system,
   * including colors, spacing, typography, and more.
   */
  theme: {
    /**
     * The `extend` key allows you to add new values to Tailwind's default theme
     * or override existing ones without replacing the entire theme object.
     */
    extend: {
      /**
       * The `fontFamily` object defines custom font stacks for your project.
       * We are prepending our custom fonts ('Inter', 'Lora', 'Roboto Mono')
       * to Tailwind's default sans-serif, serif, and monospace stacks.
       */
      fontFamily: {
        // 'Inter' is now the default sans-serif font.
        sans: ['Inter', ...fontFamily.sans],
        // 'Lora' is now the default serif font.
        serif: ['Lora', ...fontFamily.serif],
        // 'Roboto Mono' is now the default monospace font.
        mono: ['Roboto Mono', ...fontFamily.mono],
      },
    },
  },

  /**
   * The `plugins` array is where you can add official or third-party Tailwind plugins
   * to extend its functionality, such as adding new utilities or variants.
   * Example: require('@tailwindcss/typography')
   */
  plugins: [],
};
