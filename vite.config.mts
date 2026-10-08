import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

const woff2Only = {
  name: 'woff2-only',
  enforce: 'pre' as const,
  transform(code: string, id: string) {
    if (!id.includes('@fontsource') || !id.endsWith('.css')) return null;
    return code.replace(/,\s*url\([^)]*\.woff\)\s*format\(['"]woff['"]\)/g, '');
  },
};

export default defineConfig({
  plugins: [react(), woff2Only],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    assetsInlineLimit: (file: string) => (/\.(woff2?|ttf|otf|eot)$/i.test(file) ? false : undefined),
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
