import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { gate1Plugin } from './gate1-plugin';

export default defineConfig({
  plugins: [react(), gate1Plugin()],
  server: { fs: { allow: ['../..'] } },
});
