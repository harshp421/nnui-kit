import '../src/index.js';
import { isAnchorPositioningSupported } from '../src/utils/anchor-fallback.js';

// Setup Platform Primitives Telemetry Status
function updatePlatformStatus() {
  const anchorStatusEl = document.getElementById('status-anchor');
  if (anchorStatusEl) {
    if (isAnchorPositioningSupported) {
      anchorStatusEl.innerHTML = '<span class="status-dot"></span> CSS Anchor: <strong>Native Engine</strong>';
    } else {
      anchorStatusEl.innerHTML = '<span class="status-dot accent"></span> CSS Anchor: <strong>Sub-1KB Fallback Active</strong>';
    }
  }

  const popoverStatusEl = document.getElementById('status-popover');
  if (popoverStatusEl) {
    const popoverSupported = typeof HTMLElement !== 'undefined' && HTMLElement.prototype.hasOwnProperty('popover');
    popoverStatusEl.innerHTML = popoverSupported
      ? '<span class="status-dot"></span> HTML Popover API: <strong>Supported</strong>'
      : '<span class="status-dot accent"></span> HTML Popover API: <strong>Degraded</strong>';
  }
}

// Live Accessibility Inspector
function setupA11yInspector() {
  const elTag = document.getElementById('tel-tag');
  const elRole = document.getElementById('tel-role');
  const elExpanded = document.getElementById('tel-expanded');
  const elSelected = document.getElementById('tel-selected');
  const elAriaId = document.getElementById('tel-aria-id');

  function updateTelemetry(target) {
    if (!target) return;
    const tag = target.tagName ? target.tagName.toLowerCase() : 'none';
    const role = target.getAttribute('role') || target.tagName.toLowerCase();
    const expanded = target.getAttribute('aria-expanded') || 'n/a';
    const selected = target.getAttribute('aria-selected') || 'n/a';
    const controls = target.getAttribute('aria-controls') || target.getAttribute('aria-labelledby') || target.id || 'none';

    if (elTag) elTag.textContent = `<${tag}>`;
    if (elRole) elRole.textContent = role;
    if (elExpanded) elExpanded.textContent = expanded;
    if (elSelected) elSelected.textContent = selected;
    if (elAriaId) elAriaId.textContent = controls;
  }

  document.addEventListener('focusin', (e) => updateTelemetry(e.target));
  document.addEventListener('click', (e) => updateTelemetry(e.target));
}

// Framework Code Snippets Toggle
const SNIPPETS = {
  combobox: {
    html: `<!-- Universal Light-DOM HTML (SSR/Astro/HTMX) -->
<ui-combobox>
  <div data-part="input-wrapper">
    <input data-part="input" placeholder="Select framework...">
    <span data-part="toggle-icon">▼</span>
  </div>
  <ul data-part="listbox">
    <li data-part="option" data-value="react">React 19</li>
    <li data-part="option" data-value="vue">Vue 3</li>
    <li data-part="option" data-value="svelte">Svelte 5</li>
  </ul>
</ui-combobox>`,
    react: `// React 19 (Zero Wrapper Packages - Pure JSX!)
export function FrameworkPicker({ onChange }) {
  return (
    <ui-combobox onChange={(e) => onChange(e.detail.value)}>
      <div data-part="input-wrapper">
        <input data-part="input" placeholder="Select framework..." />
        <span data-part="toggle-icon">▼</span>
      </div>
      <ul data-part="listbox">
        <li data-part="option" data-value="react">React 19</li>
        <li data-part="option" data-value="vue">Vue 3</li>
        <li data-part="option" data-value="svelte">Svelte 5</li>
      </ul>
    </ui-combobox>
  );
}`,
    vue: `<!-- Vue 3 (Direct v-model / @change on Light-DOM Element) -->
<template>
  <ui-combobox @change="onSelect($event.detail.value)">
    <div data-part="input-wrapper">
      <input data-part="input" placeholder="Select framework..." />
      <span data-part="toggle-icon">▼</span>
    </div>
    <ul data-part="listbox">
      <li data-part="option" data-value="react">React 19</li>
      <li data-part="option" data-value="vue">Vue 3</li>
      <li data-part="option" data-value="svelte">Svelte 5</li>
    </ul>
  </ui-combobox>
</template>`,
    svelte: `<!-- Svelte 5 (Native event handling & standard elements) -->
<script>
  let { onSelect } = $props();
</script>

<ui-combobox onchange={(e) => onSelect(e.detail.value)}>
  <div data-part="input-wrapper">
    <input data-part="input" placeholder="Select framework..." />
    <span data-part="toggle-icon">▼</span>
  </div>
  <ul data-part="listbox">
    <li data-part="option" data-value="react">React 19</li>
    <li data-part="option" data-value="vue">Vue 3</li>
    <li data-part="option" data-value="svelte">Svelte 5</li>
  </ul>
</ui-combobox>`
  },
  tabs: {
    html: `<!-- Universal Tabs -->
<ui-tabs value="tab-1">
  <div data-part="tablist">
    <button data-part="tab" data-value="tab-1">Account</button>
    <button data-part="tab" data-value="tab-2">Security</button>
  </div>
  <div data-part="tabpanel" data-value="tab-1">Account details...</div>
  <div data-part="tabpanel" data-value="tab-2">Security settings...</div>
</ui-tabs>`,
    react: `// React 19 Tabs
export function ProfileTabs() {
  return (
    <ui-tabs value="tab-1" onChange={(e) => console.log(e.detail.value)}>
      <div data-part="tablist">
        <button data-part="tab" data-value="tab-1">Account</button>
        <button data-part="tab" data-value="tab-2">Security</button>
      </div>
      <div data-part="tabpanel" data-value="tab-1">Account settings</div>
      <div data-part="tabpanel" data-value="tab-2">Security controls</div>
    </ui-tabs>
  );
}`,
    vue: `<!-- Vue 3 Tabs -->
<template>
  <ui-tabs value="tab-1" @change="tab = $event.detail.value">
    <div data-part="tablist">
      <button data-part="tab" data-value="tab-1">Account</button>
      <button data-part="tab" data-value="tab-2">Security</button>
    </div>
    <div data-part="tabpanel" data-value="tab-1">Account settings</div>
    <div data-part="tabpanel" data-value="tab-2">Security controls</div>
  </ui-tabs>
</template>`,
    svelte: `<!-- Svelte 5 Tabs -->
<ui-tabs value="tab-1" onchange={(e) => currentTab = e.detail.value}>
  <div data-part="tablist">
    <button data-part="tab" data-value="tab-1">Account</button>
    <button data-part="tab" data-value="tab-2">Security</button>
  </div>
  <div data-part="tabpanel" data-value="tab-1">Account settings</div>
  <div data-part="tabpanel" data-value="tab-2">Security controls</div>
</ui-tabs>`
  },
  dialog: {
    html: `<!-- Tier 1 Native <dialog> + Micro-Enhancer -->
<ui-dialog id="demo-modal">
  <dialog>
    <div data-part="dialog-content">
      <h3>Native Dialog Header</h3>
      <p>Accessible modal window with backdrop filter and esc dismissal.</p>
      <button data-part="dialog-close" class="ui-button ui-button--secondary">Close</button>
    </div>
  </dialog>
</ui-dialog>

<!-- Trigger with pure native JS or Tier 1 Invoker -->
<button class="ui-button" onclick="document.getElementById('demo-modal').showModal()">
  Open Modal
</button>`,
    react: `// React 19 Native Dialog
const modalRef = useRef(null);

<button className="ui-button" onClick={() => modalRef.current?.showModal()}>
  Open Modal
</button>

<ui-dialog ref={modalRef}>
  <dialog>
    <div data-part="dialog-content">
      <h3>Native Dialog Header</h3>
      <button data-part="dialog-close" className="ui-button">Close</button>
    </div>
  </dialog>
</ui-dialog>`,
    vue: `<!-- Vue 3 Native Dialog -->
<button class="ui-button" @click="$refs.modal.showModal()">Open Modal</button>
<ui-dialog ref="modal">
  <dialog>
    <div data-part="dialog-content">
      <h3>Native Dialog Header</h3>
      <button data-part="dialog-close" class="ui-button">Close</button>
    </div>
  </dialog>
</ui-dialog>`,
    svelte: `<!-- Svelte 5 Native Dialog -->
<script>
  let modal;
</script>

<button class="ui-button" onclick={() => modal.showModal()}>Open Modal</button>
<ui-dialog bind:this={modal}>
  <dialog>
    <div data-part="dialog-content">
      <h3>Native Dialog Header</h3>
      <button data-part="dialog-close" class="ui-button">Close</button>
    </div>
  </dialog>
</ui-dialog>`
  },
  select: {
    html: `<!-- Native Form Integration via ElementInternals -->
<form action="/submit" method="POST">
  <ui-select name="role" required>
    <button type="button" data-part="trigger">
      <span data-part="value">Select a role...</span>
      <span>▾</span>
    </button>
    <ul data-part="listbox">
      <li data-part="option" data-value="engineer">Software Engineer</li>
      <li data-part="option" data-value="designer">Product Designer</li>
      <li data-part="option" data-value="pm">Product Manager</li>
    </ul>
  </ui-select>
  <button type="submit" class="ui-button">Submit Form</button>
</form>`,
    react: `// React 19 Form-Associated Select
<form onSubmit={handleSubmit}>
  <ui-select name="role" required>
    <button type="button" data-part="trigger">
      <span data-part="value">Select a role...</span>
      <span>▾</span>
    </button>
    <ul data-part="listbox">
      <li data-part="option" data-value="engineer">Software Engineer</li>
      <li data-part="option" data-value="designer">Product Designer</li>
    </ul>
  </ui-select>
  <button type="submit">Submit</button>
</form>`,
    vue: `<!-- Vue 3 Form Associated Select -->
<ui-select name="role" required @change="onRoleChange">
  <button type="button" data-part="trigger">
    <span data-part="value">Select role</span>
    <span>▾</span>
  </button>
  <ul data-part="listbox">
    <li data-part="option" data-value="engineer">Software Engineer</li>
    <li data-part="option" data-value="designer">Product Designer</li>
  </ul>
</ui-select>`,
    svelte: `<!-- Svelte 5 Form Associated Select -->
<ui-select name="role" required onchange={(e) => role = e.detail.value}>
  <button type="button" data-part="trigger">
    <span data-part="value">Select role</span>
    <span>▾</span>
  </button>
  <ul data-part="listbox">
    <li data-part="option" data-value="engineer">Software Engineer</li>
    <li data-part="option" data-value="designer">Product Designer</li>
  </ul>
</ui-select>`
  },
  quickstart: {
    npm: `// 1. Install package
npm install new-age-uikit

// 2. Import stylesheet and custom elements in your entry file (e.g. main.js / index.ts)
import 'new-age-uikit/css';
import 'new-age-uikit'; // Automatically defines <ui-tabs>, <ui-combobox>, etc.`,

    react: `// React 19 / Next.js Setup
// 1. In app/layout.tsx (Server Layout):
import 'new-age-uikit/css';
import 'new-age-uikit'; // Registers custom elements

// 2. In any Client Component (app/page.tsx):
'use client';
import { useState } from 'react';

export default function App() {
  const [tab, setTab] = useState('account');
  return (
    <ui-tabs value={tab} onChange={(e) => setTab(e.detail.value)}>
      <div data-part="tablist">
        <button data-part="tab" data-value="account">Account</button>
        <button data-part="tab" data-value="security">Security</button>
      </div>
      <div data-part="tabpanel" data-value="account">Account details</div>
      <div data-part="tabpanel" data-value="security">Security settings</div>
    </ui-tabs>
  );
}`,

    vue: `// Vue 3 + Vite Setup
// 1. In vite.config.ts (tell Vue that ui-* are native custom elements):
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('ui-')
        }
      }
    })
  ]
});

// 2. In main.ts:
import 'new-age-uikit/css';
import 'new-age-uikit';`,

    svelte: `// Svelte 5 Setup
// 1. In src/routes/+layout.svelte:
<script>
  import 'new-age-uikit/css';
  import 'new-age-uikit';
  let { children } = $props();
</script>

{@render children()}

// 2. In any Svelte component:
<ui-tabs value="first" onchange={(e) => console.log(e.detail.value)}>
  <div data-part="tablist">
    <button data-part="tab" data-value="first">Tab 1</button>
  </div>
  <div data-part="tabpanel" data-value="first">Content 1</div>
</ui-tabs>`,

    tailwind: `/* Tailwind CSS + NewAge UIKit Setup */
/* In globals.css */
@import 'new-age-uikit/css';

@tailwind base;
@tailwind components;
@tailwind utilities;

/* Because NewAge UIKit uses @layer ui.components,
   your Tailwind utilities (e.g. text-blue-500, p-6, rounded-xl)
   ALWAYS win specificity cleanly without !important! */`,

    cdn: `<!-- Zero-Build / CDN Setup (Astro, HTMX, Laravel Blade, Rails, Plain HTML) -->
<head>
  <!-- 1. Include universal CSS -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/new-age-uikit/dist/assets/index.css">

  <!-- 2. Include micro-enhancers script (< 4KB) -->
  <script type="module" src="https://cdn.jsdelivr.net/npm/new-age-uikit/dist/assets/index.js"></script>
</head>`
  }
};

function setupCodeTabs() {
  document.querySelectorAll('.demo-box').forEach((box) => {
    const compKey = box.dataset.component;
    if (!compKey || !SNIPPETS[compKey]) return;

    const btns = box.querySelectorAll('.code-tab-btn');
    const pre = box.querySelector('.code-snippet-pre');

    function render(framework) {
      if (pre && SNIPPETS[compKey][framework]) {
        pre.textContent = SNIPPETS[compKey][framework];
      }
      btns.forEach((b) => b.classList.toggle('active', b.dataset.framework === framework));
    }

    btns.forEach((btn) => {
      btn.addEventListener('click', () => {
        render(btn.dataset.framework);
      });
    });

    const defaultTab = box.querySelector('.code-tab-btn.active')?.dataset.framework || Object.keys(SNIPPETS[compKey])[0];
    render(defaultTab);
  });
}

// Dark / Light Theme Toggle
function setupThemeToggle() {
  const themeBtn = document.getElementById('theme-toggle-btn');
  if (!themeBtn) return;

  function toggle() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    themeBtn.textContent = next === 'dark' ? '☀️ Light' : '🌙 Dark';
  }

  themeBtn.addEventListener('click', toggle);
}

// Zero-JS Simulator
function setupZeroJsSimulator() {
  const zeroJsBtn = document.getElementById('zero-js-toggle-btn');
  if (!zeroJsBtn) return;

  let zeroJsActive = false;

  zeroJsBtn.addEventListener('click', () => {
    zeroJsActive = !zeroJsActive;
    document.body.classList.toggle('zero-js-simulated', zeroJsActive);
    zeroJsBtn.textContent = zeroJsActive ? '⚡ Enable JS' : '🚫 Simulate Zero-JS';
    zeroJsBtn.classList.toggle('ui-button--danger', zeroJsActive);

    const banner = document.getElementById('zero-js-banner');
    if (banner) {
      banner.style.display = zeroJsActive ? 'block' : 'none';
    }
  });
}

// Native Form Submission Demo Feedback
function setupFormDemo() {
  const form = document.getElementById('demo-internals-form');
  const output = document.getElementById('form-demo-output');
  if (!form || !output) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    output.textContent = `Native FormData Submitted Successfully:\n${JSON.stringify(data, null, 2)}`;
  });
}

// Initialize on DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
  updatePlatformStatus();
  setupA11yInspector();
  setupCodeTabs();
  setupThemeToggle();
  setupZeroJsSimulator();
  setupFormDemo();
});
