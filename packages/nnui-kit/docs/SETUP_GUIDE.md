# NNUI-KIT — Implementation & Setup Guide

This guide walks you through installing, configuring, and architecting universal Light-DOM components with **NNUI-KIT** across modern web frameworks, SSR runtimes, and hypermedia stacks.

---

## 1. Installation

### Package Manager (Next.js, React, Vue, Svelte, Vite, Astro)

```bash
# npm
npm install nnui-kit

# pnpm
pnpm add nnui-kit

# yarn
yarn add nnui-kit

# bun
bun add nnui-kit
```

### Zero-Build / CDN (HTMX, Django, Rails, Laravel Blade, Plain HTML)

No build step, bundler, or Node.js required. Drop these two lines into your HTML `<head>`:

```html
<!-- Stylesheet (Tokens + Primitives + Defensive Cascade Layers) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/nnui-kit@1.0.0/dist/index.css">

<!-- Core Micro-Enhancers (< 40 KB ESM) -->
<script type="module" src="https://cdn.jsdelivr.net/npm/nnui-kit@1.0.0/dist/index.js"></script>
```

---

## 2. Choosing Your Runtime Entrypoint

NNUI-KIT provides 3 optimized entrypoints:

| Entrypoint | Import Syntax | Best For | Behavior |
| :--- | :--- | :--- | :--- |
| **SSR / Hydration** | `import 'nnui-kit/client'` | Next.js App Router, Remix, Nuxt, SvelteKit | Safely no-ops in Node SSR, registers during client hydration |
| **React Wrapper** | `import { Tabs } from 'nnui-kit/react'` | React 18 & 19 | Ref forwarding, typed props, custom event bridging |
| **Standard Core** | `import 'nnui-kit'` | Vite, Astro, Client SPA, Static HTML | Immediate browser registration of `<nnui-*>` and `<ui-*>` |

---

## 3. Global Styles & Cascade Setup

Import the universal stylesheet in your application's root entry point (e.g. `layout.tsx`, `main.js`, or `globals.css`):

```javascript
import 'nnui-kit/css';
// Or if you only want tokens:
// import 'nnui-kit/tokens';
```

### Defensive Isolation via Cascade Layers (`@layer`)

All library styles reside within explicit cascade layers:
```css
@layer ui.tokens, ui.reset, ui.base, ui.components, ui.overrides;
```

#### Tailwind CSS Integration (v3 & v4)
Because NNUI-KIT uses `@layer`, your Tailwind utility classes (`mt-4`, `bg-blue-600`, `rounded-full`) automatically win the cascade. You will **never** need to use `!important` to customize component internals.

```css
/* In your globals.css */
@import 'nnui-kit/css';

@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### Theming & Dark Mode
NNUI-KIT automatically detects system dark mode via `@media (prefers-color-scheme: dark)`. To set a theme or palette programmatically, set attributes on `<html>`:

```html
<!-- Force Dark Mode with Emerald Palette -->
<html data-theme="dark" data-palette="emerald">

<!-- Force Light Mode with Violet Palette -->
<html data-theme="light" data-palette="violet">
```

---

## 4. Framework-by-Framework Integration Recipes

### A. Next.js 15 & React 19 (App Router)

#### 1. Import in your Root Layout (`app/layout.tsx`):
```tsx
import 'nnui-kit/css';
import 'nnui-kit/client'; // SSR-Safe Client Entry: No HTMLElement crashes during SSR!

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

#### 2. Using First-Class React Components (`nnui-kit/react`):
```tsx
'use client';

import { useRef, useState } from 'react';
import { Tabs, DataGrid, toast } from 'nnui-kit/react';

export function FinanceBlotter() {
  const [activeTab, setActiveTab] = useState('blotter');
  const gridRef = useRef<any>(null);

  const handleOrder = () => {
    toast.success('Order Submitted', { description: '10,000 shares routed.' });
  };

  return (
    <Tabs value={activeTab} onChange={(e) => setActiveTab(e.detail.value)}>
      <DataGrid ref={gridRef} row-height="40" persist="url" sync="cross-tab">
        <div data-part="viewport">
          <div data-part="runway">
            <table data-part="grid-table" className="ui-table">
              <thead></thead>
              <tbody data-part="virtual-tbody"></tbody>
            </table>
          </div>
        </div>
      </DataGrid>
    </Tabs>
  );
}
```

---

### B. Svelte 5 (Runes)

Svelte 5 supports custom elements natively with zero wrapper code:

```svelte
<script>
  import 'nnui-kit/css';
  import 'nnui-kit/client';

  let selectedRole = $state('engineer');
</script>

<ui-select name="role" required onchange={(e) => selectedRole = e.detail.value}>
  <button type="button" data-part="trigger">
    <span data-part="value">Select a role...</span>
    <span>▾</span>
  </button>
  <ul data-part="listbox">
    <li data-part="option" data-value="engineer">Software Engineer</li>
    <li data-part="option" data-value="quant">Quantitative Trader</li>
  </ul>
</ui-select>
```

---

### C. Vue 3 & Nuxt

Tell Vue's template compiler that `ui-*` and `nnui-*` are custom elements in `vite.config.ts`:

#### 1. Configure Vite (`vite.config.ts`):
```typescript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('ui-') || tag.startsWith('nnui-'),
        },
      },
    }),
  ],
});
```

#### 2. Import & Use in Vue Component (`App.vue`):
```vue
<script setup>
import 'nnui-kit/css';
import 'nnui-kit/client';
import { ref } from 'vue';

const activeTab = ref('orders');
</script>

<template>
  <ui-tabs :value="activeTab" @change="activeTab = $event.detail.value">
    <div data-part="tablist">
      <button data-part="tab" data-value="orders">Orders</button>
      <button data-part="tab" data-value="analytics">Analytics</button>
    </div>
    <div data-part="tabpanel" data-value="orders">Active Orders Table</div>
    <div data-part="tabpanel" data-value="analytics">Latency Analytics</div>
  </ui-tabs>
</template>
```

---

### D. HTMX 2 & Hypermedia Stacks

Form-associated custom elements (`<ui-select>`, `<ui-slider>`, `<ui-otp-input>`) integrate with standard HTML form submissions and HTMX swaps without custom JavaScript:

```html
<form hx-post="/api/order" hx-target="#order-status">
  <div data-ui="field">
    <label data-ui="label" for="venue">Execution Venue</label>
    <ui-select id="venue" name="venue" required>
      <button type="button" data-part="trigger"><span data-part="value">Choose venue...</span></button>
      <ul data-part="listbox">
        <li data-part="option" data-value="nasdaq">NASDAQ Lit</li>
        <li data-part="option" data-value="iex">IEX Speedbump</li>
      </ul>
    </ui-select>
  </div>
  
  <div data-ui="field">
    <label data-ui="label" for="rate">Max Participation Rate (%)</label>
    <ui-slider id="rate" name="participation" min="1" max="25" value="5"></ui-slider>
  </div>

  <button type="submit" data-ui="button">Execute Slice</button>
</form>
```

---

## 5. IDE Autocomplete via Custom Elements Manifest (CEM)

To enable tag, attribute, and event autocomplete in **VS Code** and **Cursor**:

Add this to your project's `.vscode/settings.json`:

```json
{
  "html.customData": [
    "./node_modules/nnui-kit/custom-elements.json"
  ]
}
```

Now, typing `<ui-` or `<nnui-` in any HTML, JSX, Vue, or Svelte template will offer intelligent autocomplete with all documented parts (`data-part="input"`, `data-part="viewport"`), attributes (`persist`, `sync`), and events!
