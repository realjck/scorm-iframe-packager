import { defineConfig } from 'vite'

export default defineConfig({
  base: '/scorm-iframe-packager/',
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
      }
    }
  }
})