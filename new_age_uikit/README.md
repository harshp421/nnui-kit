# NNUI-KIT (`nnui-kit`)

> **Platform-Native, Three-Tier Light-DOM Universal UI Architecture**  
> Zero framework wrappers • Zero Shadow DOM a11y traps • Sub-4 KB runtime • React 19, Vue 3, Svelte 5, Astro, HTMX & SSR ready.

[![npm version](https://img.shields.io/npm/v/nnui-kit.svg?style=flat-square)](https://www.npmjs.com/package/nnui-kit)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)

---

## 1. Quick Start & Installation

Install the core package from NPM:

```bash
npm install nnui-kit
```

Or using pnpm / yarn / bun:

```bash
pnpm add nnui-kit
# or
yarn add nnui-kit
# or
bun add nnui-kit
```

### Import Styles & Elements

In your main entry point (e.g. `main.js`, `index.tsx`, `App.vue`, `root.tsx`):

```javascript
// 1. Import complete styles and tokens
import 'nnui-kit/css';

// 2. Import & register custom elements (<nnui-*> and <ui-*>)
import 'nnui-kit';
```

Or via CDN directly in standard HTML:

```html
<!-- NNUI-KIT Theme & Cascade Layers -->
<link rel="stylesheet" href="https://unpkg.com/nnui-kit@1.0.0/dist/index.css" />

<!-- NNUI-KIT Core JavaScript Module -->
<script type="module" src="https://unpkg.com/nnui-kit@1.0.0/dist/index.js"></script>
```

Both `<nnui-*>` (e.g. `<nnui-tabs>`) and standard `<ui-*>` (e.g. `<ui-tabs>`) prefixes are registered automatically.

---

## 2. Core Codebase Structure

Where everything is written and built:

```
new_age_uikit/
├── src/                               # 📁 CORE SOURCE CODE
│   ├── index.js                       # Primary library entrypoint & element registration
│   ├── components/                    # Tier 2 Light-DOM Micro-Enhancers
│   │   ├── tabs/ui-tabs.js            # Roving tabindex accessible tabs
│   │   ├── combobox/ui-combobox.js    # APG Active-descendant combobox autocomplete
│   │   ├── dialog/ui-dialog.js        # Native <dialog> focus trap & backdrop modal
│   │   ├── select/ui-select.js        # Form-associated select via ElementInternals
│   │   ├── accordion/ui-accordion.js  # Multi & single accordion disclosure
│   │   ├── popover/ui-popover.js      # Top-layer Popover API action menu
│   │   └── tooltip/ui-tooltip.js      # CSS Anchor positioning tooltip
│   ├── styles/                        # Tier 0 & Primitives Design System
│   │   ├── layers.css                 # @layer ui.tokens, ui.reset, ui.base, ui.components
│   │   ├── tokens.css                 # Authentic Shadcn Zinc palette & radii
│   │   ├── base.css                   # Buttons, Badges, Inputs, Form Field validation
│   │   ├── anchor.css                 # CSS Anchor Positioning definitions
│   │   ├── components.css             # Scoped component styling
│   │   └── index.css                  # Master CSS bundle
│   ├── utils/                         # Engineering Invariant utilities
│   │   ├── base-element.js            # BaseLightElement (Zero Shadow DOM validator)
│   │   ├── a11y.js                    # Unique ID generator & keyboard navigation
│   │   └── anchor-fallback.js         # Sub-1KB CSS Anchor Positioning polyfill
│   └── types/                         # TypeScript & JSX definitions
│       └── index.d.ts                 # Full DOM, React 19 JSX & event typings
│
├── dist/                              # 📦 COMPILED NPM BUNDLE (Published to NPM)
│   ├── index.js                       # Minified ESM bundle for modern bundlers
│   ├── index.cjs                      # CommonJS bundle for Node / legacy bundlers
│   ├── index.css                      # Standalone complete CSS stylesheet
│   └── index.d.ts                     # TypeScript declaration bundle
│
├── custom-elements.json               # Custom Elements Manifest (CEM) for IDE autocomplete
├── llms.txt                           # Contract spec for AI assistants (ChatGPT, Claude, Cursor)
└── .cursorrules                       # Cursor IDE prompt rules
```

---

## 3. The 4 Engineering Invariants

1. **Zero Shadow DOM (`attachShadow()` is forbidden):**  
   Every element lives in the main document DOM. Screen readers (VoiceOver, NVDA, JAWS) parse unbroken accessibility trees with native ARIA and form ID resolutions.
2. **"Mutate Attributes, Never Nodes":**  
   Micro-enhancers never invoke `appendChild()`, `removeChild()`, or reorder child DOM nodes. They coordinate exclusively via attributes (`aria-*`, `data-*`, `tabindex`), guaranteeing 100% hydration and reconciliation safety in React 19, Vue 3, and Svelte 5.
3. **Defensive Cascade Layers (`@layer`):**  
   All styles are contained within `@layer ui.tokens, ui.reset, ui.base, ui.components, ui.overrides;`. Consumer utility classes (Tailwind, UnoCSS, custom CSS) can override library defaults cleanly without `!important`.
4. **Sub-4 KB Core Runtime:**  
   Layout calculations are offloaded to native browser top-layer primitives (`popover`, `<dialog>`) and CSS Anchor Positioning, with an automatic sub-1KB progressive fallback.

---

## 4. Usage Across Frameworks

Because all components are standard Light-DOM custom elements, you write **pure HTML markup** in any framework:

### React 19 (Zero Wrapper Packages)
```jsx
import 'nnui-kit';
import 'nnui-kit/css';

export function UserCombobox({ onSelect }) {
  return (
    <nnui-combobox onChange={(e) => onSelect(e.detail.value)}>
      <div data-part="input-wrapper">
        <input data-part="input" placeholder="Search frameworks..." />
        <span data-part="toggle-icon">▼</span>
      </div>
      <ul data-part="listbox">
        <li data-part="option" data-value="react">React 19</li>
        <li data-part="option" data-value="vue">Vue 3</li>
        <li data-part="option" data-value="svelte">Svelte 5</li>
      </ul>
    </nnui-combobox>
  );
}
```

### Vue 3
```html
<script setup>
import 'nnui-kit';
import 'nnui-kit/css';
import { ref } from 'vue';

const activeTab = ref('account');
</script>

<template>
  <nnui-tabs :value="activeTab" @change="activeTab = $event.detail.value">
    <div data-part="tablist">
      <button data-part="tab" data-value="account">Account</button>
      <button data-part="tab" data-value="security">Security</button>
    </div>
    <div data-part="tabpanel" data-value="account">Account settings</div>
    <div data-part="tabpanel" data-value="security">Security settings</div>
  </nnui-tabs>
</template>
```

### Svelte 5
```html
<script>
import 'nnui-kit';
import 'nnui-kit/css';
let role = $state('engineer');
</script>

<nnui-select name="role" required onchange={(e) => role = e.detail.value}>
  <button type="button" data-part="trigger">
    <span data-part="value">Select role...</span>
    <span>▾</span>
  </button>
  <ul data-part="listbox">
    <li data-part="option" data-value="engineer">Software Engineer</li>
    <li data-part="option" data-value="designer">Product Designer</li>
  </ul>
</nnui-select>
```

---

## 5. How to Deploy / Publish to NPM

To publish this package to NPM so developers worldwide can download it:

### Step 1: Login to your NPM Account
```bash
npm login
```

### Step 2: Test the Distribution Build
```bash
# Build the library bundle (dist/index.js, dist/index.cjs, dist/index.css)
npm run build:lib

# Verify the exact package contents and size (dry run)
npm run pack:check
```

### Step 3: Publish to NPM
```bash
# Publish publicly to the NPM registry
npm publish --access public
```

*(Note: If you publish subsequent versions, increment the version with `npm version patch`, `npm version minor`, or `npm version major` prior to publishing).*

---

## 6. Local Development

```bash
# Start Vite development server with interactive documentation and playground
npm run dev

# Build both documentation showcase and NPM library bundle
npm run build

# Preview documentation production build
npm run preview
```

---

## License

MIT © [NNUI-KIT Authors](LICENSE)
