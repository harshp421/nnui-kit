import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const customElementsPath = path.join(rootDir, 'custom-elements.json');
let customElements = { modules: [] };

if (fs.existsSync(customElementsPath)) {
  try {
    customElements = JSON.parse(fs.readFileSync(customElementsPath, 'utf-8'));
  } catch (e) {
    console.warn('Could not parse custom-elements.json, falling back to static metadata');
  }
}

// Global attributes valid on NNUI Light-DOM components
const globalAttributes = [
  {
    name: 'data-part',
    description: 'NNUI-KIT Light-DOM semantic slot part identifier for child elements.',
    values: [
      { name: 'tablist', description: 'Container element holding tab trigger buttons' },
      { name: 'tab', description: 'Interactive tab trigger button' },
      { name: 'tabpanel', description: 'Panel container associated with an active tab' },
      { name: 'trigger', description: 'Interactive trigger for dropdowns, popovers, and selects' },
      { name: 'listbox', description: 'Popup container holding selectable options' },
      { name: 'option', description: 'Selectable option item inside a combobox or select' },
      { name: 'viewport', description: 'Scrollable viewport container for virtualized data grid' },
      { name: 'runway', description: 'Total virtual scroll height runway container' },
      { name: 'grid-table', description: 'Inner virtualized data grid table element' },
      { name: 'virtual-tbody', description: 'Virtual table body element for rendered row slice' },
      { name: 'track', description: 'Slider or scrollbar track element' },
      { name: 'thumb', description: 'Draggable slider thumb handle' },
      { name: 'input', description: 'Embedded search or text input field' },
      { name: 'panel', description: 'Content panel inside an accordion, sheet, or resizable pane' },
      { name: 'step', description: 'Interactive workflow step inside a stepper' },
      { name: 'toolbar', description: 'Action button bar inside prompt box or table' },
      { name: 'close', description: 'Dismiss button inside dialog, sheet, or toast' }
    ]
  },
  {
    name: 'persist',
    description: 'NNUI-KIT State Persistence Protocol. Automatically synchronizes element state with URL or web storage.',
    values: [
      { name: 'url', description: 'Synchronize active state with browser URL search parameters' },
      { name: 'local', description: 'Persist state in localStorage across page refreshes' },
      { name: 'session', description: 'Persist state in sessionStorage for active tab session' }
    ]
  },
  {
    name: 'sync',
    description: 'NNUI-KIT Cross-Tab State Synchronization Protocol using BroadcastChannel.',
    values: [
      { name: 'cross-tab', description: 'Broadcast state changes live across all open browser tabs' }
    ]
  },
  {
    name: 'data-ui',
    description: 'NNUI-KIT component type marker applied to root Light-DOM element.'
  }
];

const COMPONENT_METADATA = [
  {
    baseTag: 'tabs',
    title: 'Tabs',
    description: 'WAI-ARIA APG compliant roving tabindex tabs in Light-DOM. Mutates attributes, never nodes.',
    attributes: [
      { name: 'value', description: 'Currently active tab identifier value.' },
      { name: 'orientation', description: 'Keyboard navigation direction.', values: [{ name: 'horizontal' }, { name: 'vertical' }] }
    ]
  },
  {
    baseTag: 'combobox',
    title: 'Combobox',
    description: 'APG active-descendant combobox autocomplete in Light-DOM with top-layer positioning.',
    attributes: [
      { name: 'value', description: 'Selected option value.' },
      { name: 'open', description: 'Whether the combobox listbox popup is open.' }
    ]
  },
  {
    baseTag: 'dialog',
    title: 'Dialog',
    description: 'Top-layer accessible modal dialog wrapping native HTML5 <dialog> with focus trap.',
    attributes: [
      { name: 'open', description: 'Controls modal open visibility state.' }
    ]
  },
  {
    baseTag: 'select',
    title: 'Select',
    description: 'Custom dropdown select with native HTML5 form integration via ElementInternals.',
    attributes: [
      { name: 'name', description: 'Form submission field name.' },
      { name: 'value', description: 'Currently selected option value.' },
      { name: 'required', description: 'Enforces native form validation before submission.' },
      { name: 'disabled', description: 'Disables select dropdown interaction.' },
      { name: 'open', description: 'Controls open state of dropdown options listbox.' }
    ]
  },
  {
    baseTag: 'accordion',
    title: 'Accordion',
    description: 'Expandable accordion sections with single or multiple simultaneous collapse.',
    attributes: [
      { name: 'type', description: 'Accordion expansion mode.', values: [{ name: 'single' }, { name: 'multiple' }] },
      { name: 'collapsible', description: 'Allows closing all items when in single mode.' }
    ]
  },
  {
    baseTag: 'popover',
    title: 'Popover',
    description: 'Top-layer anchored popover with click-outside light dismiss and anchor positioning.',
    attributes: [
      { name: 'open', description: 'Controls popover visibility.' }
    ]
  },
  {
    baseTag: 'tooltip',
    title: 'Tooltip',
    description: 'Anchored hover and focus tooltip with automatic aria-describedby linkage.',
    attributes: [
      { name: 'delay', description: 'Hover appearance delay in milliseconds (default: 200).' }
    ]
  },
  {
    baseTag: 'command',
    title: 'Command Palette',
    description: 'Fast instant-filtered command menu with keyboard shortcut listener and fuzzy filter.',
    attributes: [
      { name: 'open', description: 'Controls command palette open modal state.' },
      { name: 'shortcut', description: 'Global keyboard shortcut trigger (e.g. "k" or "meta+k").' }
    ]
  },
  {
    baseTag: 'sheet',
    title: 'Sheet / Drawer',
    description: 'Native dialog sliding drawer supporting 4 directions with smooth CSS transitions.',
    attributes: [
      { name: 'open', description: 'Controls sheet slide-in visibility.' },
      { name: 'side', description: 'Screen docking edge.', values: [{ name: 'right' }, { name: 'left' }, { name: 'top' }, { name: 'bottom' }] }
    ]
  },
  {
    baseTag: 'slider',
    title: 'Slider',
    description: 'Form-associated range slider with pointer capture and ElementInternals form value sync.',
    attributes: [
      { name: 'name', description: 'Form submission field name.' },
      { name: 'value', description: 'Current numeric value of the slider.' },
      { name: 'min', description: 'Minimum slider value (default: 0).' },
      { name: 'max', description: 'Maximum slider value (default: 100).' },
      { name: 'step', description: 'Stepping increment granularity (default: 1).' },
      { name: 'disabled', description: 'Disables slider thumb interaction.' }
    ]
  },
  {
    baseTag: 'dropdown',
    title: 'Dropdown Menu',
    description: 'Accessible roving tabindex dropdown menu with top-layer anchoring and light dismiss.',
    attributes: [
      { name: 'open', description: 'Controls menu open visibility.' }
    ]
  },
  {
    baseTag: 'toaster',
    title: 'Toaster',
    description: 'Stacked notification viewport host supporting toast() helper with live regions.',
    attributes: [
      {
        name: 'position',
        description: 'Screen placement corner for queued toast notifications.',
        values: [
          { name: 'bottom-right' },
          { name: 'top-right' },
          { name: 'bottom-left' },
          { name: 'top-left' },
          { name: 'top-center' },
          { name: 'bottom-center' }
        ]
      }
    ]
  },
  {
    baseTag: 'data-table',
    title: 'Data Table',
    description: 'High-performance table with column sorting, search filtering, and pagination.',
    attributes: [
      { name: 'page-size', description: 'Number of rows rendered per page (default: 10).' },
      { name: 'current-page', description: 'Active 1-indexed page number.' }
    ]
  },
  {
    baseTag: 'calendar',
    title: 'Calendar',
    description: 'WAI-ARIA APG calendar grid with month navigation and roving keyboard focus.',
    attributes: [
      { name: 'value', description: 'Selected date string formatted as YYYY-MM-DD.' },
      { name: 'min', description: 'Earliest selectable date string (YYYY-MM-DD).' },
      { name: 'max', description: 'Latest selectable date string (YYYY-MM-DD).' },
      { name: 'disabled', description: 'Disables calendar selection.' }
    ]
  },
  {
    baseTag: 'date-picker',
    title: 'Date Picker',
    description: 'Composed popover date picker with input trigger and embedded calendar.',
    attributes: [
      { name: 'value', description: 'Selected date formatted as YYYY-MM-DD.' },
      { name: 'placeholder', description: 'Input trigger placeholder string.' },
      { name: 'disabled', description: 'Disables date picker interaction.' },
      { name: 'open', description: 'Controls date picker calendar popup state.' }
    ]
  },
  {
    baseTag: 'data-grid',
    title: 'Virtualized Data Grid',
    description: 'Enterprise virtualized data grid streaming >10,000 to 100,000 rows at 60 FPS in Light-DOM.',
    attributes: [
      { name: 'row-height', description: 'Pixel height of each row for virtual window calculation (default: 40).' },
      { name: 'overscan', description: 'Number of virtual buffer rows rendered outside the visible viewport (default: 5).' },
      { name: 'sort-key', description: 'Active column sorting key identifier.' },
      { name: 'sort-dir', description: 'Active sort direction.', values: [{ name: 'asc' }, { name: 'desc' }] },
      { name: 'search', description: 'Active text filter query string across virtualized data.' },
      { name: 'streaming', description: 'Enables high-throughput append optimizations for live data feeds.' },
      { name: 'persist', description: 'Synchronize grid filters and sort state with URL or storage.' },
      { name: 'sync', description: 'Synchronize grid state across browser tabs via BroadcastChannel.' }
    ]
  },
  {
    baseTag: 'date-range-picker',
    title: 'Date Range Picker',
    description: 'APG compliant dual-calendar date range picker with preset chips and hover range highlight.',
    attributes: [
      { name: 'start-date', description: 'Start date formatted as YYYY-MM-DD.' },
      { name: 'end-date', description: 'End date formatted as YYYY-MM-DD.' },
      { name: 'placeholder', description: 'Input trigger display placeholder.' },
      { name: 'disabled', description: 'Disables range selection.' },
      { name: 'open', description: 'Controls calendar range popover state.' },
      { name: 'persist', description: 'Persists selected range into URL or web storage.' }
    ]
  },
  {
    baseTag: 'tags-input',
    title: 'Tags Input',
    description: 'Multi-token chip input with keyboard badge deletion, duplicate prevention, and backspace removal.',
    attributes: [
      { name: 'tags', description: 'Comma-separated string of initial tag items.' },
      { name: 'placeholder', description: 'Input placeholder string.' },
      { name: 'max-tags', description: 'Maximum allowed tags count.' },
      { name: 'disabled', description: 'Disables tag additions and removals.' }
    ]
  },
  {
    baseTag: 'segmented-control',
    title: 'Segmented Control',
    description: 'Accessible pill toggle control with sliding active indicator in Light-DOM.',
    attributes: [
      { name: 'value', description: 'Currently active segment item value.' },
      { name: 'name', description: 'Form submission field name.' },
      { name: 'disabled', description: 'Disables control interaction.' }
    ]
  },
  {
    baseTag: 'otp-input',
    title: 'OTP / PIN Input',
    description: 'One-time passcode input with automatic focus progression and clipboard paste distribution.',
    attributes: [
      { name: 'length', description: 'Total number of digit input boxes (default: 6).' },
      { name: 'value', description: 'Current entered OTP string.' },
      { name: 'type', description: 'Character constraint.', values: [{ name: 'number' }, { name: 'text' }, { name: 'alphanumeric' }] },
      { name: 'mask', description: 'Mask characters with bullets like a password input.' },
      { name: 'disabled', description: 'Disables OTP input boxes.' }
    ]
  },
  {
    baseTag: 'stepper',
    title: 'Stepper / Wizard',
    description: 'Multi-step workflow progress indicator and panel synchronizer in Light-DOM.',
    attributes: [
      { name: 'value', description: 'Active step number or step ID.' },
      { name: 'orientation', description: 'Stepper layout direction.', values: [{ name: 'horizontal' }, { name: 'vertical' }] },
      { name: 'linear', description: 'Enforces linear completion before subsequent steps unlock.' },
      { name: 'sync', description: 'Synchronizes current step across open browser tabs.' }
    ]
  },
  {
    baseTag: 'resizable',
    title: 'Resizable Split Pane',
    description: 'Multi-panel layout with draggable dividers and keyboard arrow key resizing.',
    attributes: [
      { name: 'direction', description: 'Split divider orientation.', values: [{ name: 'horizontal' }, { name: 'vertical' }] },
      { name: 'min-size', description: 'Minimum pane size percentage (default: 10).' },
      { name: 'max-size', description: 'Maximum pane size percentage (default: 90).' }
    ]
  },
  {
    baseTag: 'file-upload',
    title: 'File Upload & Dropzone',
    description: 'Drag-and-drop file uploader with clipboard paste, file extension validation, and list preview.',
    attributes: [
      { name: 'accept', description: 'MIME types or file extensions accepted (e.g. "image/*,.pdf").' },
      { name: 'multiple', description: 'Allows uploading multiple files simultaneously.' },
      { name: 'max-size', description: 'Maximum file size in bytes.' },
      { name: 'disabled', description: 'Disables file dropzone.' }
    ]
  },
  {
    baseTag: 'context-menu',
    title: 'Context Menu',
    description: 'Top-layer right-click context menu with cursor positioning and viewport collision avoidance.',
    attributes: [
      { name: 'disabled', description: 'Disables right-click context menu override.' }
    ]
  },
  {
    baseTag: 'navigation-menu',
    title: 'Navigation Menu',
    description: 'Accessible top-level mega-menu with hover intent delays and roving keyboard focus.',
    attributes: [
      { name: 'delay', description: 'Hover intent opening delay in milliseconds (default: 150).' },
      { name: 'disabled', description: 'Disables menu interaction.' }
    ]
  },
  {
    baseTag: 'tree-view',
    title: 'Tree View',
    description: 'WAI-ARIA APG hierarchical folder and node explorer with 4-way arrow keyboard traversal.',
    attributes: [
      { name: 'selection-mode', description: 'Node selection mode.', values: [{ name: 'single' }, { name: 'multiple' }] },
      { name: 'disabled', description: 'Disables tree interaction.' }
    ]
  },
  {
    baseTag: 'ai-prompt-box',
    title: 'AI Prompt Box',
    description: 'AI Copilot prompt box with auto-expanding textarea, action toolbar, and streaming stop state.',
    attributes: [
      { name: 'max-rows', description: 'Maximum textarea expansion rows before scrollbar appears (default: 8).' },
      { name: 'loading', description: 'Enables generation state and changes submit button to stop button.' },
      { name: 'placeholder', description: 'Textarea prompt placeholder text.' },
      { name: 'disabled', description: 'Disables prompt input.' },
      { name: 'persist', description: 'Persists user prompt draft in web storage.' }
    ]
  },
  {
    baseTag: 'color-picker',
    title: 'Color Picker',
    description: 'Modern color canvas with native EyeDropper API integration and multiple format outputs.',
    attributes: [
      { name: 'value', description: 'Current color string (e.g. "#6366f1" or "oklch(0.6 0.2 260)").' },
      { name: 'name', description: 'Form submission field name.' },
      { name: 'format', description: 'Color format output representation.', values: [{ name: 'hex' }, { name: 'rgb' }, { name: 'hsl' }, { name: 'oklch' }] },
      { name: 'disabled', description: 'Disables color picker canvas.' }
    ]
  }
];

// Generate both <ui-*> and <nnui-*> tags
const tags = [];
for (const comp of COMPONENT_METADATA) {
  const uiTag = {
    name: `ui-${comp.baseTag}`,
    description: `**${comp.title} (NNUI-KIT)**\n\n${comp.description}\n\n[Documentation](https://nnui.dev/components/${comp.baseTag})`,
    attributes: comp.attributes
  };
  const nnuiTag = {
    name: `nnui-${comp.baseTag}`,
    description: `**${comp.title} (NNUI-KIT)**\n\n${comp.description}\n\n[Documentation](https://nnui.dev/components/${comp.baseTag})`,
    attributes: comp.attributes
  };
  tags.push(uiTag, nnuiTag);
}

const vscodeCustomData = {
  $schema: 'https://raw.githubusercontent.com/microsoft/vscode-html-languageservice/main/docs/customData.schema.json',
  version: 1.1,
  tags,
  globalAttributes
};

const outputPath = path.join(rootDir, 'vscode.html-data.json');
fs.writeFileSync(outputPath, JSON.stringify(vscodeCustomData, null, 2), 'utf-8');
console.log(`✓ Generated VS Code HTML Custom Data: ${outputPath} (${tags.length} custom element tags)`);
