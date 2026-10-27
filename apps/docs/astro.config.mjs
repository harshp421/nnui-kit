// @ts-check
import { defineConfig } from 'astro/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || 'https://nnuikit.com',
  vite: {
    resolve: {
      alias: [
        { find: /^nnui-kit\/css$/, replacement: path.resolve(__dirname, '../../packages/nnui-kit/dist/index.css') },
        { find: /^nnui-kit\/client$/, replacement: path.resolve(__dirname, '../../packages/nnui-kit/dist/client.js') },
        { find: /^nnui-kit\/react$/, replacement: path.resolve(__dirname, '../../packages/nnui-kit/dist/react.js') },
        { find: /^nnui-kit\/(.*)$/, replacement: path.resolve(__dirname, '../../packages/nnui-kit/$1') },
        { find: /^nnui-kit$/, replacement: path.resolve(__dirname, '../../packages/nnui-kit/dist/index.js') },
        { find: /^nnuikit\/css$/, replacement: path.resolve(__dirname, '../../packages/nnui-kit/dist/index.css') },
        { find: /^nnuikit\/client$/, replacement: path.resolve(__dirname, '../../packages/nnui-kit/dist/client.js') },
        { find: /^nnuikit\/react$/, replacement: path.resolve(__dirname, '../../packages/nnui-kit/dist/react.js') },
        { find: /^nnuikit\/(.*)$/, replacement: path.resolve(__dirname, '../../packages/nnui-kit/$1') },
        { find: /^nnuikit$/, replacement: path.resolve(__dirname, '../../packages/nnui-kit/dist/index.js') },
      ],
    },
  },
});
