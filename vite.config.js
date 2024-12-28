import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: 'frontend', // Set the frontend folder as the root
  plugins: [react()], // Add React plugin
});
