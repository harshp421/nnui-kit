import { resolve } from 'path';
import { copyFileSync } from 'fs';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.js'),
        client: resolve(__dirname, 'src/client.js'),
        react: resolve(__dirname, 'src/react.js'),
      },
      name: 'NNUI',
      fileName: (format, entryName) => (format === 'es' ? `${entryName}.js` : `${entryName}.cjs`),
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
        banner: (chunk) => {
          if (chunk.name === 'react') return "'use client';\n";
          return '';
        },
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
          copyFileSync(
            resolve(__dirname, 'src/types/client.d.ts'),
            resolve(__dirname, 'dist/client.d.ts')
          );
          copyFileSync(
            resolve(__dirname, 'src/types/react.d.ts'),
            resolve(__dirname, 'dist/react.d.ts')
          );
        } catch (e) {
          console.warn('Could not copy d.ts to dist:', e.message);
        }
      },
    },
  ],
});
