# NewAge UIKit — Implementation & Setup Guide

This guide walks you through setting up and integrating **NewAge UIKit** into any project or tech stack.

---

## 1. Installation

### Option A: Using a Package Manager (React, Vue, Svelte, Next.js, Vite)

```bash
# npm
npm install new-age-uikit

# pnpm
pnpm add new-age-uikit

# yarn
yarn add new-age-uikit
```

### Option B: Zero-Build / CDN (Astro, HTMX, Laravel Blade, Rails, Django, Plain HTML)

No build step, bundler, or Node.js required. Drop these two lines into your HTML `<head>`:

```html
<!-- Stylesheet (Tokens + Platform Primitives + Cascade Layers) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/new-age-uikit/dist/assets/index.css">

<!-- Core Micro-Enhancers (< 4 KB ESM) -->
<script type="module" src="https://cdn.jsdelivr.net/npm/new-age-uikit/dist/assets/index.js"></script>
```

---

## 2. Global Styles & Cascade Setup

Import the universal stylesheet in your application's root entry point (e.g. `main.js`, `index.tsx`, or `globals.css`):

```javascript
import 'new-age-uikit/css';
// Or if you only want tokens:
// import 'new-age-uikit/tokens';
```

### Defensive Isolation via Cascade Layers (`@layer`)

All library styles reside within an explicit cascade layer:
```css
@layer ui.tokens, ui.reset, ui.base, ui.components, ui.overrides;
```

#### Tailwind CSS Integration (v3 & v4)
Because NewAge UIKit uses `@layer`, your Tailwind utility classes (`mt-4`, `bg-blue-600`, `rounded-full`) automatically win the cascade. You will **never** need to use `!important` to customize component internals.

```css
/* In your globals.css */
@import 'new-age-uikit/css';

@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### Theming & Dark Mode
NewAge UIKit automatically detects system dark mode via `@media (prefers-color-scheme: dark)`. To force a theme programmatically, set the `data-theme` attribute on `<html>`:

```html
<!-- Force Dark Mode -->
<html data-theme="dark">

<!-- Force Light Mode -->
<html data-theme="light">
```

---

## 3. Framework-by-Framework Integration Recipes

### A. React 19 & Next.js (App Router)

Because components are native Light-DOM custom elements, **no wrapper library is required**. Standard JSX tags work directly.

#### 1. Import in your Root Layout (`app/layout.tsx`):
```tsx
import 'new-age-uikit/css';
import 'new-age-uikit'; // Registers <ui-tabs>, <ui-combobox>, etc.

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

#### 2. Using Components in React Components:
```tsx
'use client';
import { useState } from 'react';

export function FrameworkSelector() {
  const [selected, setSelected] = useState('react');

  return (
    <ui-combobox
      value={selected}
      onChange={(e: any) => setSelected(e.detail.value)}
    >
      <div data-part="input-wrapper">
        <input data-part="input" placeholder="Search framework..." />
        <span data-part="toggle-icon">▼</span>
      </div>
      <ul data-part="listbox">
        <li data-part="option" data-value="react">React 19</li>
        <li data-part="option" data-value="vue">Vue 3</li>
        <li data-part="option" data-value="svelte">Svelte 5</li>
      </ul>
    </ui-combobox>
  );
}
```

---

### B. Vue 3 & Nuxt

By default, Vue tries to resolve custom element tags as Vue components. You configure one option in `vite.config.ts` to instruct Vue to treat `ui-*` tags as custom elements.

#### 1. Configure Vite (`vite.config.ts`):
```typescript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // Tell Vue all tags starting with 'ui-' are native custom elements
          isCustomElement: (tag) => tag.startsWith('ui-'),
        },
      },
    }),
  ],
});
```

#### 2. Import & Use in Vue Component (`App.vue`):
```vue
<script setup>
import 'new-age-uikit/css';
import 'new-age-uikit';
import { ref } from 'vue';

const activeTab = ref('account');
</script>

<template>
  <ui-tabs :value="activeTab" @change="activeTab = $event.detail.value">
    <div data-part="tablist">
      <button data-part="tab" data-value="account">Account</button>
      <button data-part="tab" data-value="security">Security</button>
    </div>
    <div data-part="tabpanel" data-value="account">Account Settings</div>
    <div data-part="tabpanel" data-value="security">Security Settings</div>
  </ui-tabs>
</template>
```

---

### C. Svelte 5

Svelte supports custom elements natively out of the box with zero configuration.

```svelte
<script>
  import 'new-age-uikit/css';
  import 'new-age-uikit';

  let selectedRole = $state('engineer');
</script>

<ui-select name="role" required onchange={(e) => selectedRole = e.detail.value}>
  <button type="button" data-part="trigger">
    <span data-part="value">Select a role...</span>
    <span>▾</span>
  </button>
  <ul data-part="listbox">
    <li data-part="option" data-value="engineer">Software Engineer</li>
    <li data-part="option" data-value="designer">Product Designer</li>
  </ul>
</ui-select>
```

---

### D. Astro, HTMX & Server-Rendered HTML

Because Tier 0 and Tier 1 render 100% crawlable semantic HTML before JavaScript hydrates, server-side frameworks (Astro, Laravel, Rails, Django) get instant First Contentful Paint:

```html
<!-- Astro / HTMX / Blade Template -->
<div data-ui="card">
  <div data-part="card-header">
    <h3 data-part="card-title">Server Rendered Card</h3>
  </div>
  <div data-part="card-body">
    Zero-JS first paint. Crawlers index this instantly.
  </div>
  <div data-part="card-footer">
    <button class="ui-button">Action</button>
  </div>
</div>
```

---

## 4. IDE Autocomplete via Custom Elements Manifest (CEM)

To enable tag, attribute, and event autocomplete in **VS Code**:

Add this to your project's `.vscode/settings.json`:

```json
{
  "html.customData": [
    "./node_modules/new-age-uikit/custom-elements.json"
  ]
}
```

Now, typing `<ui-` in any HTML, JSX, Vue, or Svelte template will offer intelligent autocomplete with all documented parts (`data-part="input"`, `data-part="listbox"`), attributes, and events!
