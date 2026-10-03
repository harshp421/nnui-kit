import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const TIER_2_COMPONENTS = [
  { name: 'dropdown', title: 'Dropdown Menu', desc: 'Accessible roving tabindex dropdown menu in Light-DOM', file: 'src/components/dropdown/ui-dropdown.js' },
  { name: 'toast', title: 'Toast / Toaster', desc: 'Stacked notification system with toast() helper and live regions', file: 'src/components/toast/ui-toast.js' },
  { name: 'tabs', title: 'Tabs', desc: 'WAI-ARIA APG compliant roving tabindex tabs in Light-DOM', file: 'src/components/tabs/ui-tabs.js' },
  { name: 'dialog', title: 'Dialog', desc: 'Top-layer accessible modal dialog with backdrop dismissal', file: 'src/components/dialog/ui-dialog.js' },
  { name: 'select', title: 'Select', desc: 'Form-associated custom select with ElementInternals', file: 'src/components/select/ui-select.js' },
  { name: 'combobox', title: 'Combobox', desc: 'Active-descendant autocomplete combobox in Light-DOM', file: 'src/components/combobox/ui-combobox.js' },
  { name: 'accordion', title: 'Accordion', desc: 'Expandable accordion sections with single/multi collapse', file: 'src/components/accordion/ui-accordion.js' },
  { name: 'popover', title: 'Popover', desc: 'Top-layer anchored popover with click-outside dismissal', file: 'src/components/popover/ui-popover.js' },
  { name: 'tooltip', title: 'Tooltip', desc: 'Anchored hover and focus hint with aria-describedby', file: 'src/components/tooltip/ui-tooltip.js' },
  { name: 'command', title: 'Command Palette', desc: 'Fast instant-filtered command menu with keyboard navigation', file: 'src/components/command/ui-command.js' },
  { name: 'sheet', title: 'Sheet / Drawer', desc: 'Native dialog sliding drawer supporting 4 directions', file: 'src/components/sheet/ui-sheet.js' },
  { name: 'slider', title: 'Slider', desc: 'Form-associated range slider with pointer capture and stepping', file: 'src/components/slider/ui-slider.js' },
  { name: 'data-table', title: 'Data Table', desc: 'High-performance table with sorting, search filter, and pagination', file: 'src/components/data-table/ui-data-table.js' },
  { name: 'calendar', title: 'Calendar', desc: 'APG calendar date picker grid with month navigation and keyboard roving focus', file: 'src/components/calendar/ui-calendar.js' },
  { name: 'date-picker', title: 'Date Picker', desc: 'Composed popover date picker with input trigger and calendar', file: 'src/components/date-picker/ui-date-picker.js' },
];

const TIER_0_COMPONENTS = [
  { name: 'button', title: 'Button', desc: 'Semantic button primitive with multiple variants and sizes' },
  { name: 'badge', title: 'Badge', desc: 'Compact status badge and tag indicators' },
  { name: 'input', title: 'Input & Field', desc: 'Form text inputs and labeled field containers' },
  { name: 'checkbox', title: 'Checkbox & Radio', desc: 'Styled native checkbox and radio controls' },
  { name: 'switch', title: 'Switch', desc: 'Accessible boolean toggle switch' },
  { name: 'card', title: 'Card', desc: 'Flexible container with header, content, and footer' },
  { name: 'avatar', title: 'Avatar', desc: 'User avatar with fallback initials and status dot' },
  { name: 'alert', title: 'Alert', desc: 'Callout banner for status and feedback messages' },
  { name: 'progress', title: 'Progress', desc: 'Deterministic progress bar indicator' },
  { name: 'table', title: 'Table', desc: 'Responsive clean data table styling' },
  { name: 'skeleton', title: 'Skeleton', desc: 'Pulsing placeholder for loading states' },
  { name: 'separator', title: 'Separator', desc: 'Horizontal or labeled content divider' },
];

const baseElementContent = fs.readFileSync(path.join(rootDir, 'src/utils/base-element.js'), 'utf-8');
const a11yContent = fs.readFileSync(path.join(rootDir, 'src/utils/a11y.js'), 'utf-8');
const anchorFallbackContent = fs.readFileSync(path.join(rootDir, 'src/utils/anchor-fallback.js'), 'utf-8');
const tokensCss = fs.readFileSync(path.join(rootDir, 'src/styles/tokens.css'), 'utf-8');
const baseCss = fs.readFileSync(path.join(rootDir, 'src/styles/base.css'), 'utf-8');
const componentsCss = fs.readFileSync(path.join(rootDir, 'src/styles/components.css'), 'utf-8');

const registry = {
  $schema: 'https://nnui.dev/schema/registry.json',
  name: 'nnui-kit',
  version: '1.0.0',
  description: 'Official NNUI-KIT Component Registry',
  common: {
    'base-element.js': baseElementContent,
    'a11y.js': a11yContent,
    'anchor-fallback.js': anchorFallbackContent,
    'tokens.css': tokensCss,
    'components.css': componentsCss,
  },
  components: {}
};

// Add Tier 2 Micro-Enhancers
for (const comp of TIER_2_COMPONENTS) {
  const filePath = path.join(rootDir, comp.file);
  const code = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : '';

  registry.components[comp.name] = {
    name: comp.name,
    title: comp.title,
    tier: 2,
    type: 'components:ui',
    description: comp.desc,
    dependencies: [],
    registryDependencies: ['base-element.js'],
    files: [
      {
        name: `ui-${comp.name}.js`,
        path: `components/ui/${comp.name}/ui-${comp.name}.js`,
        content: code
      }
    ],
    cssSnippet: `/* Styles for ${comp.title} included in components.css */`
  };
}

// Add Tier 0 Primitives
for (const comp of TIER_0_COMPONENTS) {
  registry.components[comp.name] = {
    name: comp.name,
    title: comp.title,
    tier: 0,
    type: 'components:ui',
    description: comp.desc,
    dependencies: [],
    registryDependencies: ['tokens.css'],
    files: [
      {
        name: `${comp.name}.html`,
        path: `components/ui/${comp.name}.html`,
        content: `<!-- NNUI-KIT ${comp.title} (${comp.desc}) -->\n<!-- Use standard semantic HTML with data-ui="${comp.name}" -->`
      }
    ],
    cssSnippet: `/* Styles for ${comp.title} in base.css */`
  };
}

const outputPath = path.join(rootDir, 'registry.json');
fs.writeFileSync(outputPath, JSON.stringify(registry, null, 2), 'utf-8');
console.log(`✓ Registry compiled successfully: ${Object.keys(registry.components).length} components in registry.json`);
