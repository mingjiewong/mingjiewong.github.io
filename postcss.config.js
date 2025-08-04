/**
 * PostCSS is a tool for transforming CSS with JavaScript plugins.
 * This configuration file specifies which plugins to use in the build process.
 *
 * @see https://postcss.org/
 * @see https://tailwindcss.com/docs/using-postcss
 */
export default {
  /**
   * The `plugins` object lists the PostCSS plugins to be applied.
   * The keys are the plugin names, and the values are their options (if any).
   */
  plugins: {
    /**
     * `@tailwindcss/postcss` is the official PostCSS plugin for Tailwind CSS (v4+).
     * It processes Tailwind directives (like `@tailwind`, `@apply`), handles the `theme()`
     * function, and automatically includes `autoprefixer` to add vendor prefixes
     * for browser compatibility.
     */
    "@tailwindcss/postcss": {},
  },
};
