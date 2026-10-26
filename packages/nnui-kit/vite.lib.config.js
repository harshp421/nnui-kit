import { resolve } from 'path';
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'fs';
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
          if (existsSync(resolve(__dirname, 'vscode.html-data.json'))) {
            copyFileSync(
              resolve(__dirname, 'vscode.html-data.json'),
              resolve(__dirname, 'dist/vscode.html-data.json')
            );
          }

          // Generate dist/standalone.css (unlayered bundle for Tailwind preflight coexistence)
          const indexCssPath = resolve(__dirname, 'dist/index.css');
          if (existsSync(indexCssPath)) {
            const rawCss = readFileSync(indexCssPath, 'utf8');
            let standalone = rawCss.replace(/@layer\s+ui\.[^;]+;/g, '');
            let result = '';
            let i = 0;
            while (i < standalone.length) {
              const layerIdx = standalone.indexOf('@layer', i);
              if (layerIdx === -1) {
                result += standalone.slice(i);
                break;
              }
              result += standalone.slice(i, layerIdx);
              const openBrace = standalone.indexOf('{', layerIdx);
              if (openBrace === -1) {
                result += standalone.slice(layerIdx);
                break;
              }
              let depth = 1;
              let j = openBrace + 1;
              while (j < standalone.length && depth > 0) {
                if (standalone[j] === '{') depth++;
                else if (standalone[j] === '}') depth--;
                j++;
              }
              result += standalone.slice(openBrace + 1, j - 1);
              i = j;
            }
            writeFileSync(resolve(__dirname, 'dist/standalone.css'), result, 'utf8');
          }
        } catch (e) {
          console.warn('Could not copy d.ts or html-data to dist:', e.message);
        }
      },
    },
  ],
});

