// Import `defineConfig` from Vite to provide type-safe configuration and autocompletion.
import { defineConfig } from 'vite'

// Import the official Vite plugin for React, which enables features like Fast Refresh (HMR).
import react from '@vitejs/plugin-react'

// Import the Tailwind CSS plugin for Vite to process Tailwind directives.
import tailwindcss from '@tailwindcss/vite'

/**
 * Vite configuration file.
 * @see https://vitejs.dev/config/
 */
export default defineConfig({
  /**
   * The `plugins` array specifies which Vite plugins to use.
   * The order of plugins can be important.
   */
  plugins: [
    // Enables React support, including JSX transformation and Fast Refresh.
    react(), 

    // Integrates Tailwind CSS into the build process.
    tailwindcss()
  ],

  // The `base` option sets the base public path for the application.
  base: '/',
})