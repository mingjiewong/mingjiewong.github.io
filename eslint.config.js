// Import core ESLint functionality and plugins.
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

/**
 * ESLint configuration using the new "flat" config format.
 * @see https://eslint.org/docs/latest/use/configure/configuration-files-new
 */
export default defineConfig([
  // Ignore the 'dist' directory, which contains production build artifacts.
  globalIgnores(['dist']),
  {
    // This configuration block applies to all JavaScript and JSX files.
    files: ['**/*.{js,jsx}'],

    // Extends a set of recommended configurations.
    extends: [
      // Core recommended rules from ESLint.
      js.configs.recommended,
      // Recommended rules for React Hooks (e.g., ensures hooks are called correctly).
      reactHooks.configs['recommended-latest'],
      // Rules to support React Refresh (Fast Refresh) in a Vite environment.
      reactRefresh.configs.vite,
    ],

    // Specifies language-specific options for parsing JavaScript.
    languageOptions: {
      // Sets the ECMAScript version. '2020' is a safe default.
      ecmaVersion: 2020,
      // Defines global variables that are available at runtime.
      // 'globals.browser' includes browser-specific globals like `window` and `document`.
      globals: globals.browser,
      parserOptions: {
        // Use the latest ECMAScript version for parsing.
        ecmaVersion: 'latest',
        // Enable JSX parsing.
        ecmaFeatures: { jsx: true },
        // Use ES modules (`import`/`export`).
        sourceType: 'module',
      },
    },

    // Custom rule overrides.
    rules: {
      // Customize the 'no-unused-vars' rule.
      // It will flag unused variables as an error, but ignore variables
      // whose names start with an uppercase letter or an underscore.
      // This is useful for props or variables that are intentionally unused.
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])
