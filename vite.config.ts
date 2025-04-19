import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  base: '/web2scorm/', // Ajoutez le nom de votre dépôt ici
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist', // Assurez-vous que cela correspond à votre dossier de sortie
  },
});
