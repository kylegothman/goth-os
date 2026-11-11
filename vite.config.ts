import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import pkg from './package.json' with { type: 'json' }

export default defineConfig({
  plugins: [react()],
  base: '/goth-os/',
  define: {
    // Shown in the navbar so the version label stays in sync with package.json.
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
})
