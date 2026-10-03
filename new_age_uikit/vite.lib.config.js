import { resolve } from 'path';
import { copyFileSync } from 'fs';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'NNUI',
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) return 'index.css';
          return assetInfo.name || 'asset';
        },
      },
    },
  },
  plugins: [
    {
      name: 'copy-dts',
      closeBundle() {
        try {
          copyFileSync(
            resolve(__dirname, 'src/types/index.d.ts'),
            resolve(__dirname, 'dist/index.d.ts')
          );
        } catch (e) {
          console.warn('Could not copy index.d.ts to dist:', e.message);
        }
      },
    },
  ],
});
