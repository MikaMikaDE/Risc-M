import { defineConfig } from 'vite';

export default defineConfig({
  base: '/Risc-M/',
  optimizeDeps: {
    include: ['monaco-editor'],
  },
});
