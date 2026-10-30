#!/usr/bin/env node

/**
 * NNUI-KIT Command Line Interface (CLI)
 * Component registry installer inspired by shadcn/ui.
 * Usage:
 *   npx nnui init
 *   npx nnui add <component...>
 *   npx nnui add --all
 *   npx nnui list
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = path.resolve(__dirname, '..');

// Load registry with local and remote fallback
async function getRegistry() {
  const localRegistryPath = path.join(packageRoot, 'registry.json');
  if (fs.existsSync(localRegistryPath)) {
    return JSON.parse(fs.readFileSync(localRegistryPath, 'utf-8'));
  }

  // Remote CDN Fallback when executed via npx without local repo
  try {
    const res = await fetch('https://cdn.jsdelivr.net/npm/nnui-kit/registry.json');
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    // try github raw fallback
    try {
      const ghRes = await fetch('https://raw.githubusercontent.com/harshparmar/new_age_uiKit/main/new_age_uikit/registry.json');
      if (ghRes.ok) {
        return await ghRes.json();
      }
    } catch (err) {
      // ignore
    }
  }

  console.error('\x1b[31mError:\x1b[0m Could not locate registry.json locally or via CDN.');
  process.exit(1);
}

// Detect if running inside a React or src-based project
function detectProjectInfo(cwd) {
  const hasSrc = fs.existsSync(path.join(cwd, 'src'));
  let isReact = false;

  const pkgPath = path.join(cwd, 'package.json');
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      const deps = {
        ...pkg.dependencies,
        ...pkg.devDependencies,
        ...pkg.peerDependencies,
      };
      if (deps['react'] || deps['react-dom'] || deps['next'] || deps['@types/react']) {
        isReact = true;
      }
    } catch (e) {
      // ignore
    }
  }

  return { hasSrc, isReact };
}

// Read or create nnui.json configuration
function getConfig(cwd, options = {}) {
  const configPath = path.join(cwd, 'nnui.json');
  if (fs.existsSync(configPath)) {
    try {
      const cfg = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      if (options.path) {
        cfg.componentsDir = options.path;
        cfg.utilsDir = path.join(options.path, 'utils');
      }
      return cfg;
    } catch (e) {
      // fallback
    }
  }

  const { hasSrc, isReact } = detectProjectInfo(cwd);
  const isReactProject = options.react || isReact;
  const useSrc = hasSrc || isReactProject;

  let componentsDir = 'components/ui';
  if (options.path) {
    componentsDir = options.path;
  } else if (useSrc) {
    componentsDir = 'src/components/ui';
  }

  const utilsDir = path.join(componentsDir, 'utils');

  return {
    $schema: 'https://nnui.dev/schema.json',
    style: 'default',
    framework: isReactProject ? 'react' : 'vanilla',
    componentsDir,
    utilsDir,
  };
}

// Print banner
function printBanner() {
  console.log('\n  \x1b[1m\x1b[36m▲ NNUI-KIT CLI\x1b[0m — \x1b[90mUniversal Light-DOM UI Registry\x1b[0m\n');
}

// Command: list
async function handleList() {
  printBanner();
  const reg = await getRegistry();
  const components = Object.values(reg.components);

  console.log('\x1b[1m\x1b[33mTier 0: Pure Semantic Primitives (Zero-JS)\x1b[0m');
  components
    .filter((c) => c.tier === 0)
    .forEach((c) => {
      console.log(`  \x1b[32m${c.name.padEnd(16)}\x1b[0m \x1b[90m${c.description}\x1b[0m`);
    });

  console.log('\n\x1b[1m\x1b[34mTier 2: Micro-Enhancers (Light-DOM Custom Elements)\x1b[0m');
  components
    .filter((c) => c.tier === 2)
    .forEach((c) => {
      console.log(`  \x1b[36m${c.name.padEnd(16)}\x1b[0m \x1b[90m${c.description}\x1b[0m`);
    });

  console.log(`\nTotal: ${components.length} components available in registry.`);
  console.log('Run \x1b[1mnpx nnui add <component>\x1b[0m to install.\n');
}

// Command: init
async function handleInit(cwd, options = {}) {
  printBanner();
  const config = getConfig(cwd, options);
  const reg = await getRegistry();

  const { hasSrc, isReact } = detectProjectInfo(cwd);
  if (isReact || options.react || hasSrc) {
    console.log(`\x1b[90mDetected ${isReact || options.react ? 'React' : 'src/'} project structure. Setting up in \x1b[1m${config.componentsDir}/\x1b[0m\x1b[90m\x1b[0m\n`);
  }

  const componentsDir = path.join(cwd, config.componentsDir);
  const utilsDir = path.join(cwd, config.utilsDir);

  fs.mkdirSync(componentsDir, { recursive: true });
  fs.mkdirSync(utilsDir, { recursive: true });

  // Write utils
  for (const utilFile of ['base-element.js', 'a11y.js', 'anchor-fallback.js']) {
    if (reg.common[utilFile]) {
      const utilPath = path.join(utilsDir, utilFile);
      fs.writeFileSync(utilPath, reg.common[utilFile], 'utf-8');
      console.log(`  \x1b[32m✓\x1b[0m Created ${path.relative(cwd, utilPath)}`);
    }
  }

  // Write tokens.css, theme.css, base.css, and components.css
  const tokensPath = path.join(componentsDir, 'tokens.css');
  fs.writeFileSync(tokensPath, reg.common['tokens.css'], 'utf-8');
  console.log(`  \x1b[32m✓\x1b[0m Created ${path.relative(cwd, tokensPath)}`);

  if (reg.common['theme.css']) {
    const themePath = path.join(componentsDir, 'theme.css');
    fs.writeFileSync(themePath, reg.common['theme.css'], 'utf-8');
    console.log(`  \x1b[32m✓\x1b[0m Created ${path.relative(cwd, themePath)} (Copy-paste theme tokens file)`);
  }

  if (reg.common['base.css']) {
    const baseCssPath = path.join(componentsDir, 'base.css');
    fs.writeFileSync(baseCssPath, reg.common['base.css'], 'utf-8');
    console.log(`  \x1b[32m✓\x1b[0m Created ${path.relative(cwd, baseCssPath)}`);
  }

  const componentsCssPath = path.join(componentsDir, 'components.css');
  fs.writeFileSync(componentsCssPath, reg.common['components.css'], 'utf-8');
  console.log(`  \x1b[32m✓\x1b[0m Created ${path.relative(cwd, componentsCssPath)}`);

  // Write tokens.json (W3C DTCG Specification)
  if (reg.common['tokens.json']) {
    const tokensJsonPath = path.join(cwd, 'tokens.json');
    fs.writeFileSync(tokensJsonPath, reg.common['tokens.json'], 'utf-8');
    console.log(`  \x1b[32m✓\x1b[0m Created ${path.relative(cwd, tokensJsonPath)} (W3C DTCG Token Specification)`);
  }

  // Write nnui.json
  const configPath = path.join(cwd, 'nnui.json');
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
  console.log(`  \x1b[32m✓\x1b[0m Created ${path.relative(cwd, configPath)}`);

  console.log('\n\x1b[32mSuccess!\x1b[0m NNUI-KIT initialized. You can now add components:');
  console.log('  \x1b[36mnpx nnui add dropdown toast dialog tabs stack grid\x1b[0m\n');
}

// Helper: Convert string to PascalCase
function toPascalCase(str) {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

// Helper: Convert string to snake_case
function toSnakeCase(str) {
  return str.replace(/-/g, '_');
}

// Compound subcomponents lookup for React
function getCompoundParts(name) {
  const map = {
    tabs: ['List', 'Tab', 'Trigger', 'Panel', 'Content'],
    combobox: ['Input', 'List', 'Item', 'Option'],
    dialog: ['Trigger', 'Content', 'Close', 'Title', 'Description'],
    select: ['Trigger', 'Value', 'List', 'Content', 'Item', 'Option'],
    accordion: ['Item', 'Trigger', 'Header', 'Content', 'Panel'],
    popover: ['Trigger', 'Content', 'Close'],
    tooltip: ['Trigger', 'Content'],
    command: ['Input', 'List', 'Group', 'Item'],
    sheet: ['Trigger', 'Content', 'Close'],
    stepper: ['StepList', 'Step', 'Panel'],
    slider: ['Track', 'Range', 'Thumb'],
    dropdown: ['Trigger', 'Menu', 'Item'],
    'data-table': ['Header', 'Body', 'Row', 'Cell'],
    'data-grid': ['Header', 'Body', 'Row', 'Cell'],
  };
  return map[name] || [];
}

// Generate React 18/19 Compound Component (Shadcn style)
function generateReactComponent(name, comp) {
  const pascal = toPascalCase(name);
  const compounds = getCompoundParts(name);
  let compoundExports = '';
  if (compounds.length > 0) {
    compoundExports = compounds.map((c) => `export const ${pascal}${c} = ${pascal}.${c};`).join('\n') + '\n\n';
  }

  // Pre-configured composite examples for popular components
  let exampleCode = '';
  if (name === 'dialog') {
    exampleCode = `/**
 * Example Dialog Modal Component (User Customizable)
 */
export function ${pascal}Modal({ open, onClose, title, description, children, ...props }) {
  return (
    <${pascal} open={open} onClose={onClose} {...props}>
      <div data-part="backdrop" onClick={onClose} />
      <div data-part="panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          {title && <h3 style={{ margin: 0, fontWeight: 700 }}>{title}</h3>}
          <button data-part="close" onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>✕</button>
        </div>
        {description && <p style={{ color: 'var(--ui-text-muted)', fontSize: '0.875rem' }}>{description}</p>}
        <div>{children}</div>
      </div>
    </${pascal}>
  );
}`;
  } else if (name === 'tabs') {
    exampleCode = `/**
 * Example Composite Tabs Component (User Customizable)
 */
export function ${pascal}Group({ items = [], defaultValue, onChange, ...props }) {
  return (
    <${pascal} value={defaultValue || (items[0] && items[0].value)} onChange={onChange} {...props}>
      <${pascal}.List style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--ui-border-default)' }}>
        {items.map((item) => (
          <${pascal}.Tab key={item.value} data-value={item.value}>
            {item.label}
          </${pascal}.Tab>
        ))}
      </${pascal}.List>
      {items.map((item) => (
        <${pascal}.Panel key={item.value} data-value={item.value} style={{ marginTop: '1rem' }}>
          {item.content}
        </${pascal}.Panel>
      ))}
    </${pascal}>
  );
}`;
  } else {
    exampleCode = `/**
 * ${comp.title || pascal} Wrapper Component
 */
export function ${pascal}Demo(props) {
  return (
    <${pascal} {...props}>
      {props.children}
    </${pascal}>
  );
}`;
  }

  return `import React from 'react';
import { ${pascal} } from 'nnuikit/react';

// Export raw primitive & compound parts
export { ${pascal} };
${compoundExports}${exampleCode}

export default ${pascal};
`;
}

// Generate Vanilla HTML Component Snippet
function generateHtmlSnippet(name, comp) {
  const tag = `ui-${name}`;

  let markup = '';
  if (name === 'dialog') {
    markup = `  <button data-part="trigger" type="button">Open Modal</button>
  <dialog data-part="dialog">
    <div data-part="panel">
      <h3>Modal Title</h3>
      <p>This is a native Light-DOM dialog running on platform top-layer.</p>
      <button data-part="close" type="button">Close</button>
    </div>
  </dialog>`;
  } else if (name === 'tabs') {
    markup = `  <div data-part="tablist">
    <button data-part="tab" data-value="overview">Overview</button>
    <button data-part="tab" data-value="analytics">Analytics</button>
  </div>
  <div data-part="tabpanel" data-value="overview">Overview content...</div>
  <div data-part="tabpanel" data-value="analytics">Analytics content...</div>`;
  } else {
    markup = `  <button data-part="trigger" type="button">Toggle ${comp.title || name}</button>
  <div data-part="content">
    <h3>${comp.title || name}</h3>
    <p>${comp.desc || 'Light-DOM Platform-Native component.'}</p>
    <button data-part="close" type="button">Close</button>
  </div>`;
  }

  return `<!-- =========================================================================
     NNUI-KIT ${comp.title || name} (Vanilla HTML & Light-DOM Custom Element)
     Zero Shadow DOM • Native Browser Accessible
     ========================================================================= -->

<${tag} id="${name}-demo">
${markup}
</${tag}>

<!-- Load NNUI micro-enhancer module -->
<script type="module" src="./ui-${name}.js"></script>
`;
}

// Generate Ruby on Rails ERB Partial
function generateRailsPartial(name, comp) {
  const snake = toSnakeCase(name);
  const tag = `ui-${name}`;

  let innerContent = '';
  if (name === 'dialog') {
    innerContent = `  <% if local_assigns[:trigger] %>
    <button data-part="trigger" type="button" class="<%= local_assigns[:trigger_class] || 'btn btn-primary' %>">
      <%= local_assigns[:trigger] %>
    </button>
  <% end %>

  <dialog data-part="dialog" class="<%= local_assigns[:dialog_class] %>">
    <div data-part="panel" class="<%= local_assigns[:panel_class] %>">
      <% if local_assigns[:title] %>
        <h3 data-part="title"><%= local_assigns[:title] %></h3>
      <% end %>
      <% if local_assigns[:description] %>
        <p data-part="description"><%= local_assigns[:description] %></p>
      <% end %>

      <div data-part="body">
        <%= yield if block_given? %>
      </div>

      <button data-part="close" type="button" class="<%= local_assigns[:close_class] || 'btn btn-close' %>">✕</button>
    </div>
  </dialog>`;
  } else if (name === 'tabs') {
    innerContent = `  <div data-part="tablist" class="<%= local_assigns[:tablist_class] %>">
    <% Array(local_assigns[:tabs]).each do |tab| %>
      <button data-part="tab" data-value="<%= tab[:id] || tab[:value] %>" class="<%= local_assigns[:tab_class] %>">
        <%= tab[:label] || tab[:title] %>
      </button>
    <% end %>
  </div>

  <%= yield if block_given? %>`;
  } else {
    innerContent = `  <% if local_assigns[:trigger] %>
    <button data-part="trigger" type="button" class="<%= local_assigns[:trigger_class] || 'btn' %>">
      <%= local_assigns[:trigger] %>
    </button>
  <% end %>

  <% if block_given? %>
    <%= yield %>
  <% else %>
    <div data-part="content" class="<%= local_assigns[:content_class] %>">
      <% if local_assigns[:title] %>
        <h3 data-part="title"><%= local_assigns[:title] %></h3>
      <% end %>
      <%= local_assigns[:body] %>
    </div>
  <% end %>`;
  }

  return `<%# app/views/components/_${snake}.html.erb %>
<%# NNUI-KIT Platform-Native Light-DOM ${comp.title || name} %>
<%# Usage: %>
<%#   <%= render "components/${snake}", id: "my-${name}" do %>
<%#     Content here... %>
<%#   <% end %>

<${tag} id="<%= local_assigns[:id] %>" <%= "open" if local_assigns[:open] %> class="<%= local_assigns[:class] %>">
${innerContent}
</${tag}>
`;
}

// Command: add
async function handleAdd(componentNames, options, cwd) {
  printBanner();
  const reg = await getRegistry();
  const config = getConfig(cwd, options);

  // If --all, grab every component in registry
  let namesToInstall = componentNames;
  if (options.all) {
    namesToInstall = Object.keys(reg.components);
  }

  if (namesToInstall.length === 0) {
    console.error('\x1b[31mError:\x1b[0m Please specify one or more component names to install.');
    console.log('Examples:');
    console.log('  \x1b[36mnpx nnui add dialog --react\x1b[0m   (Drops React compound component into src/components/ui/)');
    console.log('  \x1b[36mnpx nnui add dialog --html\x1b[0m    (Drops vanilla HTML snippet & micro-enhancer)');
    console.log('  \x1b[36mnpx nnui add dialog --rails\x1b[0m   (Drops ERB partial & configures importmap)');
    console.log('\nRun \x1b[36mnpx nnui list\x1b[0m to view all available components.');
    process.exit(1);
  }

  let installedCount = 0;

  // -------------------------------------------------------------
  // TARGET 1: REACT (--react or framework: 'react')
  // -------------------------------------------------------------
  const isReactTarget = options.react || config.framework === 'react';
  if (isReactTarget && !options.html && !options.rails) {
    const defaultReactDir = config.componentsDir || (fs.existsSync(path.join(cwd, 'src'))
      ? 'src/components/ui'
      : 'components/ui');
    const targetDir = options.path ? path.resolve(cwd, options.path) : path.join(cwd, defaultReactDir);

    fs.mkdirSync(targetDir, { recursive: true });

    for (const name of namesToInstall) {
      const comp = reg.components[name.toLowerCase()];
      if (!comp) {
        console.warn(`  \x1b[33m⚠\x1b[0m Component "\x1b[1m${name}\x1b[0m" not found in registry. Skipping.`);
        continue;
      }

      const destPath = path.join(targetDir, `${comp.name}.jsx`);
      if (fs.existsSync(destPath) && !options.overwrite) {
        console.log(`  \x1b[90m• ${path.relative(cwd, destPath)} already exists (use --overwrite to replace)\x1b[0m`);
      } else {
        const reactCode = generateReactComponent(comp.name, comp);
        fs.writeFileSync(destPath, reactCode, 'utf-8');
        console.log(`  \x1b[32m✓\x1b[0m Created React component ${comp.title} \x1b[90m(${path.relative(cwd, destPath)})\x1b[0m`);
        installedCount++;
      }
    }

    console.log(`\n\x1b[32mDone!\x1b[0m Added ${installedCount} React component(s) to ${path.relative(cwd, targetDir)}/`);
    console.log('Import your components into your React 18/19 app:\n');
    console.log(`  \x1b[36mimport { ${toPascalCase(namesToInstall[0])} } from './${path.relative(cwd, path.join(targetDir, namesToInstall[0] + '.jsx'))}';\x1b[0m\n`);
    return;
  }

  // -------------------------------------------------------------
  // TARGET 2: HTML / VANILLA (--html / --vanilla)
  // -------------------------------------------------------------
  if (options.html) {
    const targetDir = options.path ? path.resolve(cwd, options.path) : path.join(cwd, config.componentsDir);
    const utilsDir = path.join(cwd, config.utilsDir);

    fs.mkdirSync(utilsDir, { recursive: true });
    for (const utilFile of ['base-element.js', 'a11y.js', 'anchor-fallback.js']) {
      const utilPath = path.join(utilsDir, utilFile);
      if (!fs.existsSync(utilPath) && reg.common[utilFile]) {
        fs.writeFileSync(utilPath, reg.common[utilFile], 'utf-8');
        console.log(`  \x1b[32m✓\x1b[0m Installed ${path.relative(cwd, utilPath)}`);
      }
    }

    for (const name of namesToInstall) {
      const comp = reg.components[name.toLowerCase()];
      if (!comp) {
        console.warn(`  \x1b[33m⚠\x1b[0m Component "\x1b[1m${name}\x1b[0m" not found in registry. Skipping.`);
        continue;
      }

      const compFolder = path.join(targetDir, comp.name);
      fs.mkdirSync(compFolder, { recursive: true });

      // 1. Write micro-enhancer JS
      for (const file of comp.files) {
        const jsDest = path.join(compFolder, file.name);
        let code = file.content.replace(/['"]\.\.\/\.\.\/utils\/(.*?)['"]/g, `'../utils/$1'`);
        fs.writeFileSync(jsDest, code, 'utf-8');
        console.log(`  \x1b[32m✓\x1b[0m Installed JS micro-enhancer \x1b[90m(${path.relative(cwd, jsDest)})\x1b[0m`);
      }

      // 2. Write HTML demonstration snippet
      const htmlDest = path.join(compFolder, `${comp.name}.html`);
      if (!fs.existsSync(htmlDest) || options.overwrite) {
        const htmlSnippet = generateHtmlSnippet(comp.name, comp);
        fs.writeFileSync(htmlDest, htmlSnippet, 'utf-8');
        console.log(`  \x1b[32m✓\x1b[0m Created HTML snippet \x1b[90m(${path.relative(cwd, htmlDest)})\x1b[0m`);
      }

      installedCount++;
    }

    console.log(`\n\x1b[32mDone!\x1b[0m Added ${installedCount} vanilla HTML component(s) to ${path.relative(cwd, targetDir)}/`);
    console.log('Open the .html file in any browser or embed directly into your static templates:\n');
    console.log(`  \x1b[36mopen ./${path.relative(cwd, path.join(targetDir, namesToInstall[0], namesToInstall[0] + '.html'))}\x1b[0m\n`);
    return;
  }

  // -------------------------------------------------------------
  // TARGET 3: RUBY ON RAILS (--rails)
  // -------------------------------------------------------------
  if (options.rails) {
    const viewsDir = options.path ? path.resolve(cwd, options.path) : path.join(cwd, 'app/views/components');
    const jsDir = path.join(cwd, 'app/javascript/components');
    const utilsDir = path.join(jsDir, 'utils');

    fs.mkdirSync(viewsDir, { recursive: true });
    fs.mkdirSync(jsDir, { recursive: true });
    fs.mkdirSync(utilsDir, { recursive: true });

    // Write utils for Rails asset pipeline
    for (const utilFile of ['base-element.js', 'a11y.js', 'anchor-fallback.js']) {
      const utilPath = path.join(utilsDir, utilFile);
      if (!fs.existsSync(utilPath) && reg.common[utilFile]) {
        fs.writeFileSync(utilPath, reg.common[utilFile], 'utf-8');
        console.log(`  \x1b[32m✓\x1b[0m Installed Rails JS util ${path.relative(cwd, utilPath)}`);
      }
    }

    for (const name of namesToInstall) {
      const comp = reg.components[name.toLowerCase()];
      if (!comp) {
        console.warn(`  \x1b[33m⚠\x1b[0m Component "\x1b[1m${name}\x1b[0m" not found in registry. Skipping.`);
        continue;
      }

      const snake = toSnakeCase(comp.name);

      // 1. Write Rails ERB Partial
      const erbPath = path.join(viewsDir, `_${snake}.html.erb`);
      if (!fs.existsSync(erbPath) || options.overwrite) {
        const erbContent = generateRailsPartial(comp.name, comp);
        fs.writeFileSync(erbPath, erbContent, 'utf-8');
        console.log(`  \x1b[32m✓\x1b[0m Created Rails ERB partial \x1b[90m(${path.relative(cwd, erbPath)})\x1b[0m`);
      }

      // 2. Write Rails JS Micro-Enhancer
      for (const file of comp.files) {
        const jsDest = path.join(jsDir, `ui-${comp.name}.js`);
        let code = file.content.replace(/['"]\.\.\/\.\.\/utils\/(.*?)['"]/g, `'./utils/$1'`);
        fs.writeFileSync(jsDest, code, 'utf-8');
        console.log(`  \x1b[32m✓\x1b[0m Created Rails JS enhancer \x1b[90m(${path.relative(cwd, jsDest)})\x1b[0m`);
      }

      installedCount++;
    }

    // 3. Configure importmap.rb if present
    const importmapPath = path.join(cwd, 'config/importmap.rb');
    if (fs.existsSync(importmapPath)) {
      let importmapContent = fs.readFileSync(importmapPath, 'utf-8');
      if (!importmapContent.includes('pin "nnuikit"')) {
        importmapContent += `\n# NNUI-KIT Platform-Native Light-DOM UI Library\npin "nnuikit", to: "https://cdn.jsdelivr.net/npm/nnuikit@1.0.5/dist/index.js"\n`;
        fs.writeFileSync(importmapPath, importmapContent, 'utf-8');
        console.log(`  \x1b[32m✓\x1b[0m Added nnuikit pin to config/importmap.rb`);
      }
    }

    console.log(`\n\x1b[32mDone!\x1b[0m Added ${installedCount} Rails component(s) to ${path.relative(cwd, viewsDir)}/`);
    console.log('Render directly in your Rails ERB views:\n');
    console.log(`  \x1b[36m<%= render "components/${toSnakeCase(namesToInstall[0])}", id: "my-${namesToInstall[0]}", title: "Hello Rails" do %>\x1b[0m`);
    console.log(`  \x1b[36m  <p>Rendered with platform-native Light-DOM!</p>\x1b[0m`);
    console.log(`  \x1b[36m<% end %>\x1b[0m\n`);
    return;
  }

  // -------------------------------------------------------------
  // DEFAULT / STANDARD INSTALLATION (Backwards compatible)
  // -------------------------------------------------------------
  const targetDir = options.path ? path.resolve(cwd, options.path) : path.join(cwd, config.componentsDir);
  const utilsDir = path.join(cwd, config.utilsDir);

  fs.mkdirSync(utilsDir, { recursive: true });
  for (const utilFile of ['base-element.js', 'a11y.js', 'anchor-fallback.js']) {
    const utilPath = path.join(utilsDir, utilFile);
    if (!fs.existsSync(utilPath) && reg.common[utilFile]) {
      fs.writeFileSync(utilPath, reg.common[utilFile], 'utf-8');
      console.log(`  \x1b[32m✓\x1b[0m Installed ${path.relative(cwd, utilPath)}`);
    }
  }

  for (const name of namesToInstall) {
    const comp = reg.components[name.toLowerCase()];
    if (!comp) {
      console.warn(`  \x1b[33m⚠\x1b[0m Component "\x1b[1m${name}\x1b[0m" not found in registry. Skipping.`);
      continue;
    }

    const compFolder = path.join(targetDir, comp.name);
    fs.mkdirSync(compFolder, { recursive: true });

    for (const file of comp.files) {
      const destPath = path.join(compFolder, file.name);
      if (fs.existsSync(destPath) && !options.overwrite) {
        console.log(`  \x1b[90m• ${path.relative(cwd, destPath)} already exists (use --overwrite to replace)\x1b[0m`);
      } else {
        let code = file.content;
        code = code.replace(/['"]\.\.\/\.\.\/utils\/(.*?)['"]/g, `'../utils/$1'`);
        fs.writeFileSync(destPath, code, 'utf-8');
        console.log(`  \x1b[32m✓\x1b[0m Installed ${comp.title} \x1b[90m(${path.relative(cwd, destPath)})\x1b[0m`);
        installedCount++;
      }
    }
  }

  console.log(`\n\x1b[32mDone!\x1b[0m Added ${installedCount} component(s) to ${path.relative(cwd, targetDir)}/`);
  console.log('Import your components directly in your application:\n');
  console.log(`  \x1b[36mimport './${path.relative(cwd, targetDir)}/${namesToInstall[0]}/ui-${namesToInstall[0]}.js';\x1b[0m\n`);
}

// Help documentation
function printHelp() {
  printBanner();
  console.log(`Usage:
  npx nnui <command> [options]

Commands:
  init                       Initialize NNUI in your project directory
  add <component...>         Add one or more components from registry
  add --all                  Add all components into your project
  list                       List all available components in registry
  help                       Show this help menu

Framework Targets:
  --react                    Generate React 18/19 compound components in src/components/ui/
  --html, --vanilla          Generate vanilla HTML snippets & micro-enhancers in components/ui/
  --rails                    Generate Ruby on Rails ERB partials & importmap pinning
  --target <framework>       Specify framework target (react, html, rails)

Options:
  --overwrite                Overwrite existing component files
  --path <directory>         Custom destination folder for components
  --all                      Install all components
`);
}

// CLI Argument Parser
async function run() {
  const args = process.argv.slice(2);
  const cwd = process.cwd();

  if (args.length === 0 || args.includes('-h') || args.includes('--help') || args[0] === 'help') {
    printHelp();
    return;
  }

  const command = args[0];
  const remaining = args.slice(1);

  const isReact = remaining.includes('--react') || remaining.some((a) => a.startsWith('--target=react'));
  const isHtml = remaining.includes('--html') || remaining.includes('--vanilla') || remaining.some((a) => a.startsWith('--target=html') || a.startsWith('--target=vanilla'));
  const isRails = remaining.includes('--rails') || remaining.some((a) => a.startsWith('--target=rails'));

  let targetOption = null;
  const targetFlagIdx = remaining.indexOf('--target');
  if (targetFlagIdx !== -1 && remaining[targetFlagIdx + 1]) {
    targetOption = remaining[targetFlagIdx + 1].toLowerCase();
  }

  const options = {
    overwrite: remaining.includes('--overwrite'),
    all: remaining.includes('--all'),
    react: isReact || targetOption === 'react',
    html: isHtml || targetOption === 'html' || targetOption === 'vanilla',
    rails: isRails || targetOption === 'rails',
    path: null
  };

  const pathIdx = remaining.indexOf('--path');
  if (pathIdx !== -1 && remaining[pathIdx + 1]) {
    options.path = remaining[pathIdx + 1];
  }

  const componentNames = remaining.filter((arg, idx) => {
    if (arg.startsWith('--')) return false;
    if (remaining[idx - 1] === '--path' || remaining[idx - 1] === '--target') return false;
    return true;
  });

  switch (command) {
    case 'list':
    case 'ls':
      await handleList();
      break;
    case 'init':
      await handleInit(cwd, options);
      break;
    case 'add':
      await handleAdd(componentNames, options, cwd);
      break;
    default:
      console.error(`\x1b[31mUnknown command:\x1b[0m "${command}"`);
      printHelp();
      process.exit(1);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

