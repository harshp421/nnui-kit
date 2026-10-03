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

function buildHeader() {
  return `  <header class="docs-nav">
    <div class="docs-nav-left">
      <a href="../index.html" class="docs-logo">
        <span style="background: linear-gradient(135deg, var(--ui-color-brand-600), var(--ui-color-accent-400)); color: var(--ui-text-inverted); width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; font-weight: 800; font-size: 0.9rem;">N</span>
        <span>NNUI-KIT</span>
        <span class="docs-logo-badge">Components</span>
      </a>

      <nav class="docs-nav-links">
        <a href="../docs.html" class="docs-nav-link">Documentation</a>
        <a href="../components.html" class="docs-nav-link active">Components</a>
        <a href="../index.html" class="docs-nav-link">Home</a>
        <a href="../llms.txt" target="_blank" class="docs-nav-link">🤖 llms.txt</a>
      </nav>
    </div>

    <div class="docs-nav-right">
      <button class="docs-search-btn" type="button" style="display: flex; align-items: center; gap: 0.5rem; background: var(--ui-bg-subtle); border: 1px solid var(--ui-border-default); border-radius: 6px; padding: 0.35rem 0.75rem; font-size: 0.8rem; color: var(--ui-text-muted); cursor: pointer; transition: all 0.2s ease;">
        <span>🔍 Search...</span>
        <kbd style="font-family: inherit; font-size: 0.65rem; background: var(--ui-bg-surface); border: 1px solid var(--ui-border-default); padding: 0.1rem 0.35rem; border-radius: 4px; color: var(--ui-text-primary);">⌘K</kbd>
      </button>
      <button id="components-theme-btn" class="ui-button ui-button--secondary" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;">
        ☀️ Light
      </button>
      <a href="../docs.html" class="ui-button" style="padding: 0.35rem 0.85rem; font-size: 0.8rem; text-decoration: none;">
        Getting Started →
      </a>
    </div>
  </header>`;
}

function buildSidebar(currentFile) {
  return `    <aside class="docs-sidebar">
      <div>
        <div class="sidebar-group-title">Getting Started</div>
        <div class="sidebar-items">
          <a href="../docs.html#installation" class="sidebar-item">Installation</a>
          <a href="../docs.html#cdn-backend" class="sidebar-item">CDN & Backend</a>
          <a href="../docs.html#cli-registry" class="sidebar-item">CLI Registry (npx nnui)</a>
          <a href="../docs.html#architecture" class="sidebar-item">Architecture</a>
          <a href="../docs.html#theming" class="sidebar-item">Theming & Layers</a>
          <a href="../docs.html#ai-manifest" class="sidebar-item">AI Manifest (llms.txt)</a>
        </div>
      </div>

      <div>
        <div class="sidebar-group-title">Overview</div>
        <div class="sidebar-items">
          <a href="../components.html" class="sidebar-item">All Components</a>
        </div>
      </div>

      <div>
        <div class="sidebar-group-title">Tier 0: Primitives (Zero-JS)</div>
        <div class="sidebar-items">
${tier0Components.map((c) => `          <a href="./${c.file}" class="sidebar-item${c.file === currentFile ? ' active' : ''}">${c.name}</a>`).join('\n')}
        </div>
      </div>

      <div>
        <div class="sidebar-group-title">Tier 2: Micro-Enhancers</div>
        <div class="sidebar-items">
${tier2Components.map((c) => `          <a href="./${c.file}" class="sidebar-item${c.file === currentFile ? ' active' : ''}">${c.name}</a>`).join('\n')}
        </div>
      </div>
    </aside>`;
}

function buildToc() {
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

const files = fs.readdirSync(componentsDir).filter((f) => f.endsWith('.html'));

for (const file of files) {
  const filePath = path.join(componentsDir, file);
  let html = fs.readFileSync(filePath, 'utf-8');

  // 1. Replace <header class="docs-nav">...</header>
  html = html.replace(/<header class="docs-nav">[\s\S]*?<\/header>/, buildHeader());

  // 2. Replace <aside class="docs-sidebar">...</aside>
  html = html.replace(/<aside class="docs-sidebar">[\s\S]*?<\/aside>/, buildSidebar(file));

  // 3. Ensure overview id exists on component-view-header
  if (!html.includes('id="overview"')) {
    html = html.replace('<div class="component-view-header">', '<div id="overview" class="component-view-header">');
    html = html.replace('<section class="component-view-header">', '<section id="overview" class="component-view-header">');
  }

  // 4. Ensure preview id exists on preview-card
  if (!html.includes('id="preview"')) {
    html = html.replace('<div class="preview-card">', '<div id="preview" class="preview-card">');
  }

  // 5. Ensure api id exists on API Reference heading or wrapper
  if (!html.includes('id="api"')) {
    html = html.replace(/<h2([^>]*)>API Reference<\/h2>/, '<h2 id="api"$1>API Reference</h2>');
  }

  // 6. Ensure docs-toc exists before </main> or closing </div> of docs-wrapper
  if (!html.includes('class="docs-toc"')) {
    // Insert before closing </div> of docs-wrapper
    html = html.replace(/<\/main>\s*<\/div>/, `</main>\n\n${buildToc()}\n  </div>`);
  }

  fs.writeFileSync(filePath, html, 'utf-8');
  console.log(`✓ Synchronized layout for components/${file}`);
}

console.log(`\n🎉 All ${files.length} component pages updated to unified 3-column layout!`);
