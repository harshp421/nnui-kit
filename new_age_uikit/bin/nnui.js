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

// Read or create nnui.json configuration
function getConfig(cwd) {
  const configPath = path.join(cwd, 'nnui.json');
  if (fs.existsSync(configPath)) {
    try {
      return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    } catch (e) {
      // fallback
    }
  }
  return {
    $schema: 'https://nnui.dev/schema.json',
    style: 'default',
    componentsDir: 'components/ui',
    utilsDir: 'components/ui/utils',
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
async function handleInit(cwd) {
  printBanner();
  const config = getConfig(cwd);
  const reg = await getRegistry();

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

  // Write tokens.css and components.css
  const tokensPath = path.join(componentsDir, 'tokens.css');
  fs.writeFileSync(tokensPath, reg.common['tokens.css'], 'utf-8');
  console.log(`  \x1b[32m✓\x1b[0m Created ${path.relative(cwd, tokensPath)}`);

  const componentsCssPath = path.join(componentsDir, 'components.css');
  fs.writeFileSync(componentsCssPath, reg.common['components.css'], 'utf-8');
  console.log(`  \x1b[32m✓\x1b[0m Created ${path.relative(cwd, componentsCssPath)}`);

  // Write nnui.json
  const configPath = path.join(cwd, 'nnui.json');
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
  console.log(`  \x1b[32m✓\x1b[0m Created ${path.relative(cwd, configPath)}`);

  console.log('\n\x1b[32mSuccess!\x1b[0m NNUI-KIT initialized. You can now add components:');
  console.log('  \x1b[36mnpx nnui add dropdown toast dialog tabs\x1b[0m\n');
}

// Command: add
async function handleAdd(componentNames, options, cwd) {
  printBanner();
  const reg = await getRegistry();
  const config = getConfig(cwd);

  const targetDir = options.path ? path.resolve(cwd, options.path) : path.join(cwd, config.componentsDir);
  const utilsDir = path.join(cwd, config.utilsDir);

  // If --all, grab every component in registry
  let namesToInstall = componentNames;
  if (options.all) {
    namesToInstall = Object.keys(reg.components);
  }

  if (namesToInstall.length === 0) {
    console.error('\x1b[31mError:\x1b[0m Please specify one or more component names to install.');
    console.log('Example: \x1b[36mnpx nnui add dropdown toast\x1b[0m');
    console.log('Run \x1b[36mnpx nnui list\x1b[0m to view available components.');
    process.exit(1);
  }

  // Ensure utils exist
  fs.mkdirSync(utilsDir, { recursive: true });
  for (const utilFile of ['base-element.js', 'a11y.js', 'anchor-fallback.js']) {
    const utilPath = path.join(utilsDir, utilFile);
    if (!fs.existsSync(utilPath) && reg.common[utilFile]) {
      fs.writeFileSync(utilPath, reg.common[utilFile], 'utf-8');
      console.log(`  \x1b[32m✓\x1b[0m Installed ${path.relative(cwd, utilPath)}`);
    }
  }

  let installedCount = 0;

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
        // Rewrite import paths to point to project's utilsDir
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
  console.log(`  \x1b[36mimport './${path.relative(cwd, targetDir)}/dropdown/ui-dropdown.js';\x1b[0m\n`);
}

// Help documentation
function printHelp() {
  printBanner();
  console.log(`Usage:
  npx nnui <command> [options]

Commands:
  init                       Initialize NNUI in your project directory
  add <component...>         Add one or more components from registry
  add --all                  Add all 27 components into your project
  list                       List all available components in registry
  help                       Show this help menu

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

  const options = {
    overwrite: remaining.includes('--overwrite'),
    all: remaining.includes('--all'),
    path: null
  };

  const pathIdx = remaining.indexOf('--path');
  if (pathIdx !== -1 && remaining[pathIdx + 1]) {
    options.path = remaining[pathIdx + 1];
  }

  const componentNames = remaining.filter((arg) => !arg.startsWith('--') && arg !== options.path);

  switch (command) {
    case 'list':
    case 'ls':
      await handleList();
      break;
    case 'init':
      await handleInit(cwd);
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
