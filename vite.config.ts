import { defineConfig } from 'vite'

export default defineConfig({
  base: '/scorm-iframe-packager/',
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        404: './404.html' // Pour gérer les refresh sur GitHub Pages
      }
    }
  }
})