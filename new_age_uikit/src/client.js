/**
 * NNUI-KIT Client-Safe Hydration Entry
 * 
 * Safely no-ops in Node.js Server-Side Rendering (SSR), React Server Components (RSC),
 * Next.js, Remix, Astro, and SvelteKit server runtimes without ReferenceError: HTMLElement.
 * Automatically registers all custom elements (<nnui-*> and <ui-*>) once loaded in the browser.
 * 
 * Usage:
 *   import 'nnui-kit/client';
 *   // or
 *   import { register, toast } from 'nnui-kit/client';
 */

import { register, elements, toast, BaseLightElement } from './index.js';

// Auto-register in browser environment during hydration
if (typeof window !== 'undefined' && typeof window.customElements !== 'undefined') {
  register(['nnui', 'ui']);
}

export { register, elements, toast, BaseLightElement };
export * from './index.js';
