/**
 * Framework Code Snippet Generator for NNUI-KIT
 * Generates idiomatic, production-ready code snippets for:
 * - Pure HTML / Vanilla / HTMX
 * - React 19 (Native Custom Elements props & JSX)
 * - Vue 3 (Composition API <script setup>)
 * - Svelte 5 (Runes & Native bindings)
 */

function sanitizeHtml(str) {
  return str
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function indent(text, spaces = 2) {
  const pad = ' '.repeat(spaces);
  return text
    .split('\n')
    .map((line) => (line.trim() ? pad + line : ''))
    .join('\n');
}

/**
 * Convert HTML string to React 19 JSX
 */
export function htmlToReact(html, componentTitle = 'Example') {
  let clean = sanitizeHtml(html).trim();

  // If this snippet is an imperative toast example
  if (clean.includes('toast.') || clean.includes('ui-toaster')) {
    return `import React from 'react';
import { toast } from 'nnui-kit';

export default function ${pascalCase(componentTitle)}Demo() {
  const triggerToast = () => {
    toast.success('Action completed successfully!', {
      description: 'Your changes have been saved to the cloud.',
      action: {
        label: 'Undo',
        onClick: () => console.log('Undo triggered'),
      },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Mount toaster container once in your app layout */}
      <ui-toaster position="bottom-right" />

      <button data-ui="button" onClick={triggerToast}>
        Show Toast Notification
      </button>
    </div>
  );
}`;
  }

  // Convert HTML attributes to React JSX conventions
  let jsx = clean
    .replace(/\bclass="/g, 'className="')
    .replace(/\bfor="/g, 'htmlFor="')
    .replace(/\btabindex="/g, 'tabIndex="')
    .replace(/<(input|img|hr|br)([^>]*)(?<!\/)>/gi, '<$1$2 />');

  // Add event listener samples if custom element present
  const isCustomElement = /<(ui-|nnui-)[a-z0-9-]+/i.test(jsx);
  const compName = pascalCase(componentTitle) || 'Component';

  if (isCustomElement) {
    if (jsx.includes('ui-dropdown') || jsx.includes('nnui-dropdown')) {
      jsx = jsx.replace(
        /<(ui-dropdown|nnui-dropdown)([^>]*)>/,
        '<$1$2 onSelect={(e: any) => console.log("Selected:", e.detail.value)}>'
      );
    } else if (jsx.includes('ui-tabs') || jsx.includes('nnui-tabs')) {
      jsx = jsx.replace(
        /<(ui-tabs|nnui-tabs)([^>]*)>/,
        '<$1$2 onChange={(e: any) => setTab(e.detail.value)}>'
      );
    } else if (jsx.includes('ui-slider') || jsx.includes('nnui-slider')) {
      jsx = jsx.replace(
        /<(ui-slider|nnui-slider)([^>]*)>/,
        '<$1$2 onInput={(e: any) => setVal(e.detail.value)}>'
      );
    } else if (jsx.includes('ui-select') || jsx.includes('nnui-select')) {
      jsx = jsx.replace(
        /<(ui-select|nnui-select)([^>]*)>/,
        '<$1$2 onChange={(e: any) => setSelected(e.detail.value)}>'
      );
    } else if (jsx.includes('ui-combobox') || jsx.includes('nnui-combobox')) {
      jsx = jsx.replace(
        /<(ui-combobox|nnui-combobox)([^>]*)>/,
        '<$1$2 onChange={(e: any) => setQuery(e.detail.value)}>'
      );
    }
  }

  const indentedJsx = indent(jsx, 4);

  return `import React, { useState } from 'react';
import 'nnui-kit'; // Registers universal Light-DOM elements

export default function ${compName}Demo() {
  const [tab, setTab] = useState('all');
  const [val, setVal] = useState(50);
  const [selected, setSelected] = useState('');
  const [query, setQuery] = useState('');

  return (
${indentedJsx}
  );
}`;
}

/**
 * Convert HTML string to Vue 3 Composition API
 */
export function htmlToVue(html, componentTitle = 'Example') {
  let clean = sanitizeHtml(html).trim();

  if (clean.includes('toast.') || clean.includes('ui-toaster')) {
    return `<script setup>
import { toast } from 'nnui-kit';

function showToast() {
  toast.success('Action completed successfully!', {
    description: 'Your changes have been saved to the cloud.',
    action: {
      label: 'Undo',
      onClick: () => console.log('Undo triggered'),
    },
  });
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Place toaster in root App.vue or layout -->
    <ui-toaster position="bottom-right" />

    <button data-ui="button" @click="showToast">
      Show Toast Notification
    </button>
  </div>
</template>`;
  }

  let template = clean;
  if (template.includes('ui-dropdown') || template.includes('nnui-dropdown')) {
    template = template.replace(
      /<(ui-dropdown|nnui-dropdown)([^>]*)>/,
      '<$1$2 @select="(e) => handleSelect(e.detail.value)">'
    );
  } else if (template.includes('ui-tabs') || template.includes('nnui-tabs')) {
    template = template.replace(
      /<(ui-tabs|nnui-tabs)([^>]*)>/,
      '<$1$2 :value="activeTab" @change="(e) => activeTab = e.detail.value">'
    );
  } else if (template.includes('ui-slider') || template.includes('nnui-slider')) {
    template = template.replace(
      /<(ui-slider|nnui-slider)([^>]*)>/,
      '<$1$2 :value="sliderValue" @input="(e) => sliderValue = e.detail.value">'
    );
  } else if (template.includes('ui-select') || template.includes('nnui-select')) {
    template = template.replace(
      /<(ui-select|nnui-select)([^>]*)>/,
      '<$1$2 @change="(e) => selected = e.detail.value">'
    );
  } else if (template.includes('ui-combobox') || template.includes('nnui-combobox')) {
    template = template.replace(
      /<(ui-combobox|nnui-combobox)([^>]*)>/,
      '<$1$2 @change="(e) => query = e.detail.value">'
    );
  }

  const indentedTemplate = indent(template, 2);

  return `<script setup>
import { ref } from 'vue';
import 'nnui-kit'; // Registers universal Light-DOM elements

const activeTab = ref('all');
const sliderValue = ref(50);
const selected = ref('');
const query = ref('');

const handleSelect = (val) => {
  console.log('Selected:', val);
};
</script>

<template>
${indentedTemplate}
</template>`;
}

/**
 * Convert HTML string to Svelte 5 (Runes)
 */
export function htmlToSvelte(html, componentTitle = 'Example') {
  let clean = sanitizeHtml(html).trim();

  if (clean.includes('toast.') || clean.includes('ui-toaster')) {
    return `<script>
  import { toast } from 'nnui-kit';

  function showToast() {
    toast.success('Action completed successfully!', {
      description: 'Your changes have been saved to the cloud.',
      action: {
        label: 'Undo',
        onClick: () => console.log('Undo triggered'),
      },
    });
  }
</script>

<ui-toaster position="bottom-right"></ui-toaster>

<button data-ui="button" onclick={showToast}>
  Show Toast Notification
</button>`;
  }

  let svelteMarkup = clean;
  if (svelteMarkup.includes('ui-dropdown') || svelteMarkup.includes('nnui-dropdown')) {
    svelteMarkup = svelteMarkup.replace(
      /<(ui-dropdown|nnui-dropdown)([^>]*)>/,
      '<$1$2 onselect={(e) => console.log(e.detail.value)}>'
    );
  } else if (svelteMarkup.includes('ui-tabs') || svelteMarkup.includes('nnui-tabs')) {
    svelteMarkup = svelteMarkup.replace(
      /<(ui-tabs|nnui-tabs)([^>]*)>/,
      '<$1$2 value={activeTab} onchange={(e) => activeTab = e.detail.value}>'
    );
  } else if (svelteMarkup.includes('ui-slider') || svelteMarkup.includes('nnui-slider')) {
    svelteMarkup = svelteMarkup.replace(
      /<(ui-slider|nnui-slider)([^>]*)>/,
      '<$1$2 value={sliderValue} oninput={(e) => sliderValue = e.detail.value}>'
    );
  } else if (svelteMarkup.includes('ui-select') || svelteMarkup.includes('nnui-select')) {
    svelteMarkup = svelteMarkup.replace(
      /<(ui-select|nnui-select)([^>]*)>/,
      '<$1$2 onchange={(e) => selected = e.detail.value}>'
    );
  }

  return `<script>
  import 'nnui-kit';

  let activeTab = $state('all');
  let sliderValue = $state(50);
  let selected = $state('');
</script>

${svelteMarkup}`;
}

/**
 * Format pure HTML
 */
export function formatHtml(html) {
  return sanitizeHtml(html).trim();
}

function pascalCase(str) {
  if (!str) return 'Component';
  return str
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}
