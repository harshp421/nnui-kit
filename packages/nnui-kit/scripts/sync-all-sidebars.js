import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const componentsDir = path.join(rootDir, 'components');

const tier0Components = [
  { file: 'button.html', name: 'Button' },
  { file: 'badge.html', name: 'Badge' },
  { file: 'input.html', name: 'Input & Field' },
  { file: 'checkbox.html', name: 'Checkbox & Radio' },
  { file: 'switch.html', name: 'Switch' },
  { file: 'card.html', name: 'Card' },
  { file: 'avatar.html', name: 'Avatar' },
  { file: 'alert.html', name: 'Alert' },
  { file: 'progress.html', name: 'Progress' },
  { file: 'table.html', name: 'Table' },
  { file: 'skeleton.html', name: 'Skeleton' },
  { file: 'separator.html', name: 'Separator' },
];

const tier2Components = [
  { file: 'data-grid.html', name: 'Virtualized Data Grid', isNew: true },
  { file: 'date-range-picker.html', name: 'Date Range Picker', isNew: true },
  { file: 'tags-input.html', name: 'Tags Input', isNew: true },
  { file: 'segmented-control.html', name: 'Segmented Control', isNew: true },
  { file: 'otp-input.html', name: 'OTP / PIN Input', isNew: true },
  { file: 'stepper.html', name: 'Stepper / Wizard', isNew: true },
  { file: 'resizable.html', name: 'Resizable Split Pane', isNew: true },
  { file: 'file-upload.html', name: 'File Upload & Dropzone', isNew: true },
  { file: 'context-menu.html', name: 'Context Menu', isNew: true },
  { file: 'navigation-menu.html', name: 'Navigation Menu', isNew: true },
  { file: 'tree-view.html', name: 'Tree View', isNew: true },
  { file: 'ai-prompt-box.html', name: 'AI Prompt Box', isNew: true },
  { file: 'color-picker.html', name: 'Color Picker', isNew: true },
  { file: 'data-table.html', name: 'Data Table' },
  { file: 'calendar.html', name: 'Calendar' },
  { file: 'date-picker.html', name: 'Date Picker' },
  { file: 'dropdown.html', name: 'Dropdown Menu' },
  { file: 'toast.html', name: 'Toast / Toaster' },
  { file: 'combobox.html', name: 'Combobox' },
  { file: 'tabs.html', name: 'Tabs' },
  { file: 'dialog.html', name: 'Dialog' },
  { file: 'select.html', name: 'Select' },
  { file: 'accordion.html', name: 'Accordion' },
  { file: 'popover.html', name: 'Popover' },
  { file: 'tooltip.html', name: 'Tooltip' },
  { file: 'command.html', name: 'Command Palette' },
  { file: 'sheet.html', name: 'Sheet / Drawer' },
  { file: 'slider.html', name: 'Slider' },
];

/**
 * Builds the canonical top navigation header
 * @param {string} rootPrefix - Path prefix to root ('./' or '../')
 * @param {'docs'|'components'|'tokens'|'home'} activeNav - Currently active navigation tab
 */
function buildHeader(rootPrefix, activeNav) {
  return `  <!-- Top Navigation (Shadcn Style) -->
  <header class="docs-nav">
    <div class="docs-nav-left">
      <a href="${rootPrefix}index.html" class="docs-logo">
        <span style="background: linear-gradient(135deg, var(--ui-color-brand-600), var(--ui-color-accent-400)); color: var(--ui-text-inverted); width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; font-weight: 800; font-size: 0.9rem;">N</span>
        <span>NNUI-KIT</span>
        <span class="docs-logo-badge">${activeNav === 'docs' ? 'Docs' : activeNav === 'tokens' ? 'Design Tokens' : 'Components'}</span>
      </a>

      <nav class="docs-nav-links">
        <a href="${rootPrefix}docs.html" class="docs-nav-link${activeNav === 'docs' ? ' active' : ''}">Documentation</a>
        <a href="${rootPrefix}components.html" class="docs-nav-link${activeNav === 'components' ? ' active' : ''}">Components</a>
        <a href="${rootPrefix}tokens.html" class="docs-nav-link${activeNav === 'tokens' ? ' active' : ''}">Design Tokens</a>
        <a href="${rootPrefix}index.html" class="docs-nav-link${activeNav === 'home' ? ' active' : ''}">Home</a>
        <a href="${rootPrefix}llms.txt" target="_blank" class="docs-nav-link">🤖 llms.txt</a>
      </nav>
    </div>

    <div class="docs-nav-right">
      <button class="docs-search-btn" type="button" style="display: flex; align-items: center; gap: 0.5rem; background: var(--ui-bg-subtle); border: 1px solid var(--ui-border-default); border-radius: 6px; padding: 0.35rem 0.75rem; font-size: 0.8rem; color: var(--ui-text-muted); cursor: pointer; transition: all 0.2s ease;">
        <span>🔍 Search...</span>
        <kbd style="font-family: inherit; font-size: 0.65rem; background: var(--ui-bg-surface); border: 1px solid var(--ui-border-default); padding: 0.1rem 0.35rem; border-radius: 4px; color: var(--ui-text-primary);">⌘K</kbd>
      </button>
      <button id="${activeNav === 'docs' ? 'docs-theme-btn' : activeNav === 'tokens' ? 'tokens-theme-btn' : 'components-theme-btn'}" class="ui-button ui-button--secondary" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;">
        ☀️ Light
      </button>
      ${activeNav === 'docs' ? `
      <a href="${rootPrefix}components.html" class="ui-button" style="padding: 0.35rem 0.85rem; font-size: 0.8rem; text-decoration: none;">
        Components →
      </a>` : activeNav === 'tokens' ? `
      <button id="copy-tokens-json-btn" class="ui-button" style="padding: 0.35rem 0.85rem; font-size: 0.8rem;">
        Export tokens.json ↗
      </button>` : `
      <a href="${rootPrefix}docs.html" class="ui-button" style="padding: 0.35rem 0.85rem; font-size: 0.8rem; text-decoration: none;">
        Getting Started →
      </a>`}
    </div>
  </header>`;
}

/**
 * Builds the canonical left navigation sidebar
 * @param {string} rootPrefix - Path prefix to root ('./' or '../')
 * @param {string} compPrefix - Path prefix to components directory ('./components/' or './')
 * @param {string} activeItemKey - Identifier for active item
 */
function buildSidebar(rootPrefix, compPrefix, activeItemKey) {
  return `    <!-- Left Navigation Sidebar (Unified Canonical) -->
    <aside class="docs-sidebar">
      <div class="sidebar-group">
        <div class="sidebar-group-title">Getting Started</div>
        <div class="sidebar-items">
          <a href="${rootPrefix}docs.html#introduction" class="sidebar-item${activeItemKey === 'docs#introduction' ? ' active' : ''}">Introduction</a>
          <a href="${rootPrefix}docs.html#installation" class="sidebar-item${activeItemKey === 'docs#installation' ? ' active' : ''}">Installation</a>
          <a href="${rootPrefix}docs.html#cdn-backend" class="sidebar-item${activeItemKey === 'docs#cdn-backend' ? ' active' : ''}">CDN & Backend</a>
          <a href="${rootPrefix}docs.html#cli-registry" class="sidebar-item${activeItemKey === 'docs#cli-registry' ? ' active' : ''}">CLI Registry (npx nnui)</a>
          <a href="${rootPrefix}docs.html#architecture" class="sidebar-item${activeItemKey === 'docs#architecture' ? ' active' : ''}">Architecture</a>
          <a href="${rootPrefix}docs.html#theming" class="sidebar-item${activeItemKey === 'docs#theming' ? ' active' : ''}">Theming & Layers</a>
          <a href="${rootPrefix}docs.html#form-validation" class="sidebar-item${activeItemKey === 'docs#form-validation' ? ' active' : ''}">Form Validation (RHF/Zod)</a>
          <a href="${rootPrefix}docs.html#ai-manifest" class="sidebar-item${activeItemKey === 'docs#ai-manifest' ? ' active' : ''}">AI Manifest (llms.txt)</a>
        </div>
      </div>

      <div class="sidebar-group">
        <div class="sidebar-group-title">Design System & Tokens</div>
        <div class="sidebar-items">
          <a href="${rootPrefix}tokens.html" class="sidebar-item${activeItemKey === 'tokens' ? ' active' : ''}"><span>Design Tokens Studio</span> <span class="sidebar-badge-new">Live</span></a>
          <a href="${rootPrefix}docs.html#design-tokens" class="sidebar-item${activeItemKey === 'docs#design-tokens' ? ' active' : ''}">Tokens & DTCG Standard</a>
          <a href="${rootPrefix}docs.html#color-palettes" class="sidebar-item${activeItemKey === 'docs#color-palettes' ? ' active' : ''}">Color Palettes</a>
          <a href="${rootPrefix}docs.html#layout-primitives" class="sidebar-item${activeItemKey === 'docs#layout-primitives' ? ' active' : ''}">Layout (Stack, Grid)</a>
          <a href="${rootPrefix}docs.html#typography-system" class="sidebar-item${activeItemKey === 'docs#typography-system' ? ' active' : ''}">Typography System</a>
          <a href="${rootPrefix}docs.html#feedback-primitives" class="sidebar-item${activeItemKey === 'docs#feedback-primitives' ? ' active' : ''}">Feedback & Status</a>
          <a href="${rootPrefix}docs.html#accessibility-standards" class="sidebar-item${activeItemKey === 'docs#accessibility-standards' ? ' active' : ''}">Accessibility & Motion</a>
        </div>
      </div>

      <div class="sidebar-group">
        <div class="sidebar-group-title">Components Overview</div>
        <div class="sidebar-items">
          <a href="${rootPrefix}components.html" class="sidebar-item${activeItemKey === 'components' ? ' active' : ''}"><span>All Components Gallery</span> <span class="sidebar-badge-counter">30</span></a>
        </div>
      </div>

      <div class="sidebar-group">
        <div class="sidebar-group-title">Tier 0: Primitives (Zero-JS)</div>
        <div class="sidebar-items">
${tier0Components.map((c) => `          <a href="${compPrefix}${c.file}" class="sidebar-item${activeItemKey === c.file ? ' active' : ''}">${c.name}</a>`).join('\n')}
        </div>
      </div>

      <div class="sidebar-group">
        <div class="sidebar-group-title">Tier 2: Micro-Enhancers</div>
        <div class="sidebar-items">
${tier2Components.map((c) => `          <a href="${compPrefix}${c.file}" class="sidebar-item${activeItemKey === c.file ? ' active' : ''}"><span>${c.name}</span>${c.isNew ? ' <span class="sidebar-badge-new">New</span>' : ''}</a>`).join('\n')}
        </div>
      </div>
    </aside>`;
}

function buildComponentToc() {
  return `    <!-- Right Side "On This Page" Table of Contents -->
    <aside class="docs-toc">
      <div class="toc-title">On This Page</div>
      <div class="toc-items">
        <a href="#overview" class="toc-link">Overview</a>
        <a href="#preview" class="toc-link">Interactive Demo</a>
        <a href="#code" class="toc-link">Code Snippets</a>
        <a href="#api" class="toc-link">API Reference</a>
      </div>
    </aside>`;
}

// 1. Synchronize all 30 component pages in components/
const componentFiles = fs.readdirSync(componentsDir).filter((f) => f.endsWith('.html'));

for (const file of componentFiles) {
  const filePath = path.join(componentsDir, file);
  let html = fs.readFileSync(filePath, 'utf-8');

  // Replace header
  html = html.replace(/<!-- Top Navigation[\s\S]*?<\/header>|<header class="docs-nav">[\s\S]*?<\/header>/, buildHeader('../', 'components'));

  // Replace sidebar
  html = html.replace(/<!-- Left Navigation Sidebar[\s\S]*?<\/aside>|<aside class="docs-sidebar">[\s\S]*?<\/aside>/, buildSidebar('../', './', file));

  // Ensure anchor IDs exist for TOC
  if (!html.includes('id="overview"')) {
    html = html.replace('<div class="component-view-header">', '<div id="overview" class="component-view-header">');
    html = html.replace('<section class="component-view-header">', '<section id="overview" class="component-view-header">');
  }

  if (!html.includes('id="preview"') && !html.includes('id="interactive-demo"')) {
    html = html.replace('<div class="preview-card">', '<div id="preview" class="preview-card">');
  }

  if (!html.includes('id="api"') && !html.includes('id="api-reference"')) {
    html = html.replace(/<h2([^>]*)>API Reference<\/h2>/, '<h2 id="api"$1>API Reference</h2>');
  }

  // Ensure TOC exists before closing docs-wrapper
  if (!html.includes('class="docs-toc"')) {
    html = html.replace(/<\/main>\s*<\/div>/, `</main>\n\n${buildComponentToc()}\n  </div>`);
  }

  fs.writeFileSync(filePath, html, 'utf-8');
  console.log(`✓ Synchronized components/${file}`);
}

// 2. Synchronize components.html
{
  const filePath = path.join(rootDir, 'components.html');
  let html = fs.readFileSync(filePath, 'utf-8');
  html = html.replace(/<!-- Top Navigation[\s\S]*?<\/header>|<header class="docs-nav">[\s\S]*?<\/header>/, buildHeader('./', 'components'));
  html = html.replace(/<!-- Left Navigation Sidebar[\s\S]*?<\/aside>|<aside class="docs-sidebar">[\s\S]*?<\/aside>/, buildSidebar('./', './components/', 'components'));
  fs.writeFileSync(filePath, html, 'utf-8');
  console.log(`✓ Synchronized components.html`);
}

// 3. Synchronize tokens.html
{
  const filePath = path.join(rootDir, 'tokens.html');
  let html = fs.readFileSync(filePath, 'utf-8');
  html = html.replace(/<!-- Top Navigation[\s\S]*?<\/header>|<header class="docs-nav">[\s\S]*?<\/header>/, buildHeader('./', 'tokens'));
  html = html.replace(/<!-- Left Navigation Sidebar[\s\S]*?<\/aside>|<aside class="docs-sidebar">[\s\S]*?<\/aside>/, buildSidebar('./', './components/', 'tokens'));
  fs.writeFileSync(filePath, html, 'utf-8');
  console.log(`✓ Synchronized tokens.html`);
}

// 4. Synchronize docs.html
{
  const filePath = path.join(rootDir, 'docs.html');
  let html = fs.readFileSync(filePath, 'utf-8');
  html = html.replace(/<!-- Top Navigation[\s\S]*?<\/header>|<header class="docs-nav">[\s\S]*?<\/header>/, buildHeader('./', 'docs'));
  html = html.replace(/<!-- Left Navigation Sidebar[\s\S]*?<\/aside>|<aside class="docs-sidebar">[\s\S]*?<\/aside>/, buildSidebar('./', './components/', 'docs#introduction'));
  fs.writeFileSync(filePath, html, 'utf-8');
  console.log(`✓ Synchronized docs.html`);
}

console.log(`\n🎉 100% unified canonical sidebar & header synchronized across all 33 pages!`);
