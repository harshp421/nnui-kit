# NNUI-KIT (`nnuikit`)

> **Platform-Native, Three-Tier Light-DOM Universal UI Architecture**  
> 51 Components & Primitives • Zero Shadow DOM a11y traps • SSR Safe (`nnuikit/client`) • First-class React 18/19 wrapper (`nnuikit/react`) • React 19, Vue 3, Svelte 5, Astro, HTMX 2 & Node SSR ready • Sub-40 KB gzipped total runtime.

[![npm version](https://img.shields.io/npm/v/nnuikit.svg?style=flat-square)](https://www.npmjs.com/package/nnuikit)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Bundle Size](https://img.shields.io/badge/gzip%20size-39.8%20kB-emerald.svg?style=flat-square)](https://bundlephobia.com/package/nnuikit)
[![Shadow DOM](https://img.shields.io/badge/Shadow%20DOM-0%25%20(Pure%20Light--DOM)-purple.svg?style=flat-square)](https://github.com/harshp421/nnui-kit)

---

## 1. Quick Start & Installation

Install the universal package from npm:

```bash
npm install nnuikit
# or
pnpm add nnuikit
# or
yarn add nnuikit
# or
bun add nnuikit
```

### Choose Your Import Mode

NNUI-KIT offers 3 dedicated entrypoints tailored to your exact application runtime:

#### A. SSR & Full-Stack Frameworks (Next.js App Router, Remix, Nuxt, SvelteKit)
Safely no-ops in Node.js server pre-rendering (zero `ReferenceError: HTMLElement is not defined`) and automatically upgrades custom elements during client hydration:

```javascript
// In app/layout.tsx, src/routes/+layout.svelte, or main entrypoint:
import 'nnuikit/css';
import 'nnuikit/client'; // SSR-Safe Client Hydration Entry
import { toast } from 'nnuikit';
```

#### B. First-Class React 18 & 19 Wrapper (`nnuikit/react`)
Idiomatic React components with automatic ref forwarding, typed props, and custom DOM event bridging (`onSelectionChange`, `onChange`, `onSort`, `onOpen`, `onClose`):

```jsx
'use client';

import 'nnuikit/css';
import 'nnuikit/client';
import { Tabs, DataGrid, Stepper, Dialog, toast } from 'nnuikit/react';

export function Dashboard() {
  return (
    <Tabs value="blotter" onChange={(e) => console.log(e.detail.value)}>
      <DataGrid rowHeight={40} persist="url" sync="cross-tab">
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

#### C. Universal Web Components (Vue 3, Svelte 5, Astro, HTMX, Vanilla JS)
Direct platform-native custom elements (`<nnui-*>` or `<ui-*>`) with zero framework wrappers:

```javascript
import 'nnuikit/css';
import 'nnuikit'; // Registers both <nnui-*> and <ui-*> prefixes
```

Or via CDN directly in static HTML (zero build step):

```html
<!-- Design Tokens & Cascade Layers -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/nnuikit@1.0.8/dist/index.css" />

<!-- Core JavaScript Module -->
<script type="module" src="https://cdn.jsdelivr.net/npm/nnuikit@1.0.8/dist/index.js"></script>
```

#### D. Instant VS Code & Cursor IDE Autocomplete
To enable autocomplete for `<ui-*>` / `<nnui-*>` tags, attributes, and `data-part="..."` slots in HTML, Astro, Vue, and Svelte templates, add to `.vscode/settings.json`:

```json
{
  "html.customData": [
    "./node_modules/nnuikit/dist/vscode.html-data.json"
  ]
}
```

#### E. Component Registry CLI with Framework Targets (Shadcn-Style Code Ownership)
Rather than a closed black-box dependency, you can drop fully editable component source code directly into your repository:

```bash
# Initialize tokens & config
npx nnuikit init

# Target 1: React 18 & 19 (drops React compound component into src/components/ui/)
npx nnuikit add dialog tabs command --react

# Target 2: Vanilla HTML (drops runnable HTML snippet & JS micro-enhancer)
npx nnuikit add dialog tabs command --html

# Target 3: Ruby on Rails (drops ERB partial & configures config/importmap.rb)
npx nnuikit add dialog tabs command --rails
```

---

## 2. Global CSS & Design Tokens (`globals.css` / `theme.css`)

NNUI-KIT provides standalone, W3C DTCG-compliant global CSS stylesheets that you can either import directly or copy-paste straight into your project:

```javascript
// Option A: Universal Master Stylesheet (tokens + reset + primitives)
import 'nnuikit/globals.css';

// Option B: Pure Standalone Theme Tokens (zero-dependency CSS custom properties only)
import 'nnuikit/theme.css';
```

### Turnkey Copy-Paste Design Tokens for Your Product

You can copy `theme.css` directly into your application (e.g. `app/globals.css`, `src/globals.css`, or HTML `<link>`) to instantly control all design system tokens:

```css
@layer ui.tokens {
  :root {
    /* Brand Tonal Ramp (50–950) */
    --ui-color-brand-500: #71717a; /* Replace with your brand color */

    /* Semantic Canvas & Surfaces */
    --ui-bg-canvas: #ffffff;
    --ui-bg-surface: #ffffff;
    --ui-bg-surface-elevated: #f4f4f5;
    --ui-bg-subtle: #f4f4f5;

    /* Semantic Text */
    --ui-text-primary: #09090b;
    --ui-text-secondary: #52525b;
    --ui-text-muted: #71717a;

    /* Semantic Borders */
    --ui-border-default: #e4e4e7;
    --ui-border-subtle: #f4f4f5;

    /* Radii & Typography */
    --ui-radius-md: 0.5rem;
    --ui-font-sans: 'Inter', system-ui, sans-serif;
  }

  /* Authentic Dark Mode */
  :root[data-theme="dark"], .dark {
    --ui-bg-canvas: #09090b;
    --ui-bg-surface: #09090b;
    --ui-text-primary: #fafafa;
    --ui-border-default: #27272a;
  }
}
```

> **Live Theme Studio**: Visit our documentation at `/tokens` to customize 7 curated color harmonies (Zinc, Slate, Violet, Emerald, Rose, Blue, Orange) and download or copy tailored `globals.css` with 1 click.

---

## 3. NNUI CLI & Component Registry (`npx nnui`)

Just like shadcn/ui, you can copy components directly into your project codebase or install individual pieces using the official CLI:

```bash
# Initialize NNUI configuration and styles
npx nnuikit init

# List all available components in the registry
npx nnuikit list

# Add specific components and their dependencies directly into your project
npx nnuikit add data-grid stepper combobox toast
```

---

## 3. Complete 40-Component Directory

### Tier 0: Pure Semantic Primitives (12 Zero-JS Controls)
Styled via `@layer ui.base` with instant first-paint performance and zero JavaScript overhead:
* **Button** (`[data-ui="button"]`) — Primary, Secondary, Outline, Ghost, Destructive, Link, Sizes (sm, md, lg), and Icon buttons.
* **Badge** (`[data-ui="badge"]`) — Neutral, Brand, Success, Warning, Error, with status dots.
* **Input & Field** (`[data-ui="input"]`, `[data-ui="field"]`) — Accessible label, helper text, error messages, and floating styles.
* **Checkbox & Radio** (`input[type="checkbox"]`, `input[type="radio"]`) — Native accessible inputs styled with custom tokens.
* **Switch** (`[data-ui="switch"]`) — Platform toggle switch with smooth spring transitions.
* **Card** (`[data-ui="card"]`) — Elevation, borders, header, title, body, and action footer.
* **Avatar** (`[data-ui="avatar"]`) — Image fallback, initials, status badges, and user groups.
* **Alert** (`[data-ui="alert"]`) — Informational, Success, Warning, and Error callout banners.
* **Progress** (`[data-ui="progress"]`) — Determinate and indeterminate animated progress bars.
* **Table** (`[data-ui="table"]`) — Semantic tabular layout with responsive horizontal scrolling.
* **Skeleton** (`[data-ui="skeleton"]`) — Pulsing shimmer loading placeholders for text, cards, and avatars.
* **Separator** (`[data-ui="separator"]`) — Accessible horizontal and vertical visual dividers.

### Tier 2: Micro-Enhancers (28 Platform-Native Custom Elements)
Living 100% in the Light DOM without Shadow DOM accessibility barriers:
1. **`<ui-data-grid>`** / `<nnui-data-grid>` — High-performance virtualized data grid (15,000+ streaming rows at 60 FPS, 18 DOM nodes, column sorting, search, selection, CSV export).
2. **`<ui-combobox>`** / `<nnui-combobox>` — WAI-ARIA APG active-descendant autocomplete with arrow navigation.
3. **`<ui-tabs>`** / `<nnui-tabs>` — Layered tab panels with roving tabindex and horizontal/vertical modes.
4. **`<ui-dialog>`** / `<nnui-dialog>` — Native `<dialog>` modal with backdrop blur, focus trap, and Esc dismiss.
5. **`<ui-select>`** / `<nnui-select>` — Form-associated select dropdown using `ElementInternals` with native form submission.
6. **`<ui-accordion>`** / `<nnui-accordion>` — Expandable disclosure system with single or multiple expand modes.
7. **`<ui-popover>`** / `<nnui-popover>` — Top-layer Popover API action menu anchored to trigger buttons.
8. **`<ui-tooltip>`** / `<nnui-tooltip>` — CSS Anchor positioning tooltip with progressive collision fallback.
9. **`<ui-command>`** / `<nnui-command>` — Global command palette (⌘K) with fuzzy search, grouping, and keyboard shortcuts.
10. **`<ui-sheet>`** / `<nnui-sheet>` — Off-canvas sliding drawer (top, right, bottom, left) with gesture dismiss.
11. **`<ui-slider>`** / `<nnui-slider>` — Custom range slider with touch drag, discrete steps, and ARIA value text.
12. **`<ui-dropdown>`** / `<nnui-dropdown>` — Contextual dropdown menu with nested submenus and item selection.
13. **`<ui-toaster>`** & **`toast`** — Stacked notification engine with imperative `toast.success()`, `toast.error()`, action buttons, and auto-dismiss.
14. **`<ui-data-table>`** / `<nnui-data-table>` — Tabular grid with column sorting, live filter, pagination, and bulk CSV export.
15. **`<ui-calendar>`** / `<nnui-calendar>` — Accessible month date grid with keyboard roving focus and range highlighting.
16. **`<ui-date-picker>`** / `<nnui-date-picker>` — Popover trigger with embedded calendar grid and form association.
17. **`<ui-date-range-picker>`** / `<nnui-date-range-picker>` — Dual-date range selector with presets (7D, 30D, YTD, MTD) and hover tracking.
18. **`<ui-tags-input>`** / `<nnui-tags-input>` — Tokenized chip editor with Backspace deletion, duplicate validation, and max-tag limits.
19. **`<ui-segmented-control>`** / `<nnui-segmented-control>` — Sliding pill iOS/macOS toggle with animated indicator and arrow navigation.
20. **`<ui-otp-input>`** / `<nnui-otp-input>` — Multi-digit security PIN/code input with auto-advance, backspace navigation, and clipboard paste.
21. **`<ui-stepper>`** / `<nnui-stepper>` — Multi-step wizard workflow with linear enforcement, step completion status, and cross-tab sync.
22. **`<ui-resizable>`** / `<nnui-resizable>` — Split pane layout with draggable resize handles, min/max constraints, and keyboard arrow adjustments.
23. **`<ui-file-upload>`** / `<nnui-file-upload>` — Drag-and-drop file upload zone with file type filtering, size validation, and multi-file previews.
24. **`<ui-context-menu>`** / `<nnui-context-menu>` — Desktop-class right-click contextual menu anchored to cursor coordinates.
25. **`<ui-navigation-menu>`** / `<nnui-navigation-menu>` — Mega-menu header with animated hover flyout panels and delay timers.
26. **`<ui-tree-view>`** / `<nnui-tree-view>` — Hierarchical folder/file tree with recursive expansion, multiselect, and arrow-key roving focus.
27. **`<ui-ai-prompt-box>`** / `<nnui-ai-prompt-box>` — AI prompt composer with autosizing textarea, file attachments, cancel generation, and draft autosave.
28. **`<ui-color-picker>`** / `<nnui-color-picker>` — Color selection panel with gradient canvas, hue slider, alpha channel, and hex/rgb inputs.

---

## 4. Crown Platform Innovations

### 1. High-Performance Virtualized Data Grid
Handles **15,000+ real-time streaming rows at 60 FPS** while maintaining an active footprint of **only 18 DOM elements**.
* Uses passive `requestAnimationFrame` runway windowing (0 main-thread scroll lag).
* Live streaming support: `grid.appendRows(newTrades)`.
* Instant search filtering and multi-column sorting across 100,000 rows in < 12ms.

### 2. Declarative State Persistence
Eliminate custom router code and Redux boilerplate by adding declarative attributes:
* `persist="url"` — Automatically synchronizes state with URL search params (e.g., `?search=nvda&sort=price&dir=desc`).
* `persist="local"` — Automatically saves drafts and progress to `localStorage` across page refreshes.
* `persist="session"` — Persists state across single browser sessions.

```html
<!-- Syncs search, sorting, and pagination directly to the URL -->
<ui-data-grid persist="url" sync="cross-tab"></ui-data-grid>

<!-- Autosaves wizard progress across page reloads -->
<ui-stepper persist="local" sync="cross-tab"></ui-stepper>
```

### 3. Real-Time Multi-Tab Synchronization (`sync="cross-tab"`)
Add `sync="cross-tab"` to any component to instantly reflect state changes across all open browser windows and tabs via Web `BroadcastChannel` with **zero backend or WebSocket setup**.

### 4. Autonomous AI Introspection Protocol (`element.inspectAI()`)
Every element implements the `nnui.ai.v1` protocol. Autonomous AI agents (Cursor, Claude, Copilot, Antigravity) can query the element directly:

```javascript
const schema = await element.inspectAI();
console.log(schema.protocol); // "nnui.ai.v1"
console.log(schema.liveState); // Current component state snapshot
console.log(schema.frameworkSnippets); // React 19, Vue 3, Svelte 5 snippets
```

---

## 5. Usage Across Frameworks

### React 18 & 19 (Next.js 15 App Router)
```jsx
'use client';

import 'nnuikit/client';
import { toast } from 'nnuikit';
import { Tabs, DataGrid } from 'nnuikit/react';

export default function App() {
  return (
    <Tabs value="orders" onChange={(e) => console.log(e.detail.value)}>
      <DataGrid row-height="40" persist="url" />
    </Tabs>
  );
}
```

### Svelte 5 (Runes)
```svelte
<script>
  import 'nnuikit/css';
  import 'nnuikit/client';
  let activeTab = $state('blotter');
</script>

<ui-tabs value={activeTab} onchange={(e) => activeTab = e.detail.value}>
  <div data-part="tablist">
    <button data-part="tab" data-value="blotter">Blotter</button>
    <button data-part="tab" data-value="analytics">Analytics</button>
  </div>
  <div data-part="tabpanel" data-value="blotter">Real-Time Data</div>
</ui-tabs>
```

### Vue 3 (Composition API)
```html
<script setup>
import 'nnuikit/css';
import 'nnuikit/client';
import { ref } from 'vue';

const role = ref('engineer');
</script>

<template>
  <ui-select name="role" :value="role" @change="role = $event.detail.value">
    <button type="button" data-part="trigger">
      <span data-part="value">Select role...</span>
    </button>
    <ul data-part="listbox">
      <li data-part="option" data-value="engineer">Software Engineer</li>
      <li data-part="option" data-value="quant">Quantitative Trader</li>
    </ul>
  </ui-select>
</template>
```

### HTMX 2 (Hypermedia Driven)
```html
<!-- Form-associated custom elements serialize natively into FormData without custom JS -->
<form hx-post="/api/order" hx-target="#blotter">
  <ui-select name="venue" required>
    <button type="button" data-part="trigger"><span data-part="value">Choose Venue...</span></button>
    <ul data-part="listbox">
      <li data-part="option" data-value="NASDAQ">NASDAQ Lit</li>
      <li data-part="option" data-value="IEX">IEX Speed Bump</li>
    </ul>
  </ui-select>
  <ui-slider name="participation" min="1" max="20" value="5"></ui-slider>
  <button type="submit" data-ui="button">Submit Order</button>
</form>
```

---

## 6. W3C DTCG Design Tokens & 7 Curated Palettes

NNUI-KIT includes a full implementation of the W3C Design Tokens Community Group (DTCG) specification in [`tokens.json`](./tokens.json) and [`tokens.css`](./src/styles/tokens.css), with 7 curated color palettes:
* **Zinc** (Monochrome neutral)
* **Slate** (Cool technical gray)
* **Violet** (Modern electric accent)
* **Blue** (Corporate fintech accent)
* **Emerald** (Forest & data terminal accent)
* **Rose** (Warm dynamic accent)
* **Orange** (Warm sunset accent)

Switch themes by applying `data-theme` and `data-palette` attributes to `<html>`:

```html
<!-- Emerald Dark Theme -->
<html data-theme="dark" data-palette="emerald">
```

---

## 7. Core Architectural Invariants

1. **Zero Shadow DOM (Guarded via `attachShadow()`):**  
   Every element lives 100% in the document Light DOM. Screen readers (VoiceOver, NVDA, JAWS) parse unbroken accessibility trees with native ARIA and form ID resolutions. The base class explicitly overrides `attachShadow()` to throw a runtime error, preventing third-party script shadow injection.
2. **"Mutate Attributes, Never Nodes":**  
   Micro-enhancers coordinate exclusively via attributes (`aria-*`, `data-*`, `tabindex`), guaranteeing 100% hydration and reconciliation safety in React 19, Vue 3, and Svelte 5 without V-DOM thrashing.
3. **Defensive Cascade Layers (`@layer`):**  
   All styles are contained within `@layer ui.tokens, ui.reset, ui.base, ui.components, ui.overrides;`. Consumer utility classes (Tailwind, UnoCSS, custom CSS) can override library defaults cleanly without `!important`.
4. **Lean Modular Runtime (~1–3 kB per component):**  
   Individual components tree-shake down to ~1–3 kB gzipped each. The full 51-component monolithic suite is ~50.7 kB gzipped JS (~72 kB with complete CSS), with zero heavy virtual DOM runtime or CSS-in-JS emotion injection.

---

## 8. Verification & Test Suite

The codebase includes 16 automated test suites executing hundreds of unit, integration, and SSR checks:

```bash
# Run all 16 test suites (SSR, React 19, FACE, Anchor fallbacks, AI primitives, Tokens)
npm test

# Build NPM distribution bundle (dist/index.js, dist/client.js, dist/react.js, dist/index.css)
npm run build:lib

# Dry-run package verification
npm run pack:check
```

---

## License

MIT © [NNUI-KIT Authors](LICENSE)
