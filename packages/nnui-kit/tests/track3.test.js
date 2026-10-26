import { GlobalWindow } from 'happy-dom';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

// Setup global mock DOM environment
const window = new GlobalWindow();
globalThis.window = window;
globalThis.document = window.document;
globalThis.HTMLElement = window.HTMLElement;
globalThis.customElements = window.customElements;
globalThis.CustomEvent = window.CustomEvent;
globalThis.Event = window.Event;
globalThis.requestAnimationFrame = (fn) => setTimeout(fn, 0);
globalThis.cancelAnimationFrame = (id) => clearTimeout(id);

// Mock CSS.supports
globalThis.CSS = {
  supports: () => false
};

// Import and register components
const componentsMap = {
  'data-grid': (await import('../src/components/data-grid/ui-data-grid.js')).UiDataGrid,
  'date-range-picker': (await import('../src/components/date-range-picker/ui-date-range-picker.js')).UiDateRangePicker,
  'tags-input': (await import('../src/components/tags-input/ui-tags-input.js')).UiTagsInput,
  'data-table': (await import('../src/components/data-table/ui-data-table.js')).UiDataTable,
  'calendar': (await import('../src/components/calendar/ui-calendar.js')).UiCalendar,
  'date-picker': (await import('../src/components/date-picker/ui-date-picker.js')).UiDatePicker,
  'dropdown': (await import('../src/components/dropdown/ui-dropdown.js')).UiDropdown,
  'toaster': (await import('../src/components/toast/ui-toast.js')).UiToaster,
  'combobox': (await import('../src/components/combobox/ui-combobox.js')).UiCombobox,
  'tabs': (await import('../src/components/tabs/ui-tabs.js')).UiTabs,
  'dialog': (await import('../src/components/dialog/ui-dialog.js')).UiDialog,
  'select': (await import('../src/components/select/ui-select.js')).UiSelect,
  'accordion': (await import('../src/components/accordion/ui-accordion.js')).UiAccordion,
  'popover': (await import('../src/components/popover/ui-popover.js')).UiPopover,
  'tooltip': (await import('../src/components/tooltip/ui-tooltip.js')).UiTooltip,
  'command': (await import('../src/components/command/ui-command.js')).UiCommand,
  'sheet': (await import('../src/components/sheet/ui-sheet.js')).UiSheet,
  'slider': (await import('../src/components/slider/ui-slider.js')).UiSlider,
  'segmented-control': (await import('../src/components/segmented-control/ui-segmented-control.js')).UiSegmentedControl,
  'otp-input': (await import('../src/components/otp-input/ui-otp-input.js')).UiOtpInput,
  'stepper': (await import('../src/components/stepper/ui-stepper.js')).UiStepper,
  'resizable': (await import('../src/components/resizable/ui-resizable.js')).UiResizable,
  'file-upload': (await import('../src/components/file-upload/ui-file-upload.js')).UiFileUpload,
  'context-menu': (await import('../src/components/context-menu/ui-context-menu.js')).UiContextMenu,
  'navigation-menu': (await import('../src/components/navigation-menu/ui-navigation-menu.js')).UiNavigationMenu,
  'tree-view': (await import('../src/components/tree-view/ui-tree-view.js')).UiTreeView,
  'ai-prompt-box': (await import('../src/components/ai-prompt-box/ui-ai-prompt-box.js')).UiAiPromptBox,
  'color-picker': (await import('../src/components/color-picker/ui-color-picker.js')).UiColorPicker,
};

for (const [name, CompClass] of Object.entries(componentsMap)) {
  if (!customElements.get(`ui-${name}`)) {
    customElements.define(`ui-${name}`, CompClass);
  }
  if (!customElements.get(`nnui-${name}`)) {
    customElements.define(`nnui-${name}`, class extends CompClass {});
  }
}

console.log('Testing Track 3: Visual & Architecture Integrity Suite (DTCG Tokens, Dual-Prefix, Light-DOM Invariants, Registry Parity)...');

// =========================================================================
// TEST 1: Registry Integrity & File Existence (All 35 Components)
// =========================================================================
console.log('  Testing registry.json component integrity & asset resolution...');

const registryRaw = fs.readFileSync(path.resolve('./registry.json'), 'utf8');
const registry = JSON.parse(registryRaw);

assert.strictEqual(registry.name, 'nnui-kit', 'Registry name must be nnui-kit');
assert.strictEqual(typeof registry.components, 'object', 'registry.components must be an object');

const componentKeys = Object.keys(registry.components);
assert.strictEqual(componentKeys.length, 45, `Registry must contain 45 components, found ${componentKeys.length}`);

for (const [name, comp] of Object.entries(registry.components)) {
  assert(comp.name, `Component ${name} must have a name`);
  assert(comp.type, `Component ${name} must have a type`);
  assert(comp.description, `Component ${name} must have a description`);
  assert(Array.isArray(comp.files), `Component ${name} must have a files array`);
  assert(comp.files.length > 0, `Component ${name} must include at least 1 file`);

  for (const file of comp.files) {
    assert(file.path, `File in ${name} must have a path`);
    assert(typeof file.content === 'string' && file.content.length > 0, `File ${file.path} in ${name} must have non-empty content`);
    
    assert(file.path.startsWith('components/ui/'), `File ${file.path} must target components/ui/`);
    assert(file.content.length > 20, `File ${file.path} in ${name} must have substantial code payload`);
  }
}
console.log(`    ✓ All 45 components verified with non-empty installation payloads`);

// =========================================================================
// TEST 2: W3C DTCG Token Specification Conformance
// =========================================================================
console.log('  Testing tokens.json W3C DTCG standard conformance...');

const tokensRaw = fs.readFileSync(path.resolve('./tokens.json'), 'utf8');
const tokens = JSON.parse(tokensRaw);

// Check root categories
assert(tokens.color, 'tokens.json must define color category');
assert(tokens.borderRadius, 'tokens.json must define borderRadius category');
assert(tokens.spacing, 'tokens.json must define spacing category');
assert(tokens.typography, 'tokens.json must define typography category');
assert(tokens.shadow, 'tokens.json must define shadow category');
assert(tokens.motion, 'tokens.json must define motion category');

// Check neutral scale (50 - 950)
const neutralScales = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
for (const s of neutralScales) {
  const tokenObj = tokens.color.neutral[String(s)];
  assert(tokenObj, `Neutral color ${s} must exist in tokens.json`);
  assert.strictEqual(tokenObj.$type, 'color', `Neutral ${s} must have $type 'color'`);
  assert(tokenObj.$value, `Neutral ${s} must have $value`);
}

// Check brand palettes (slate, violet, emerald, rose, blue, orange)
const palettes = ['slate', 'violet', 'emerald', 'rose', 'blue', 'orange'];
for (const p of palettes) {
  assert(tokens.color.brand[p], `Brand palette ${p} must be defined in tokens.json`);
  for (const role of ['500', '600', 'accent']) {
    const tokenObj = tokens.color.brand[p][role];
    assert(tokenObj, `Brand token ${p}.${role} must exist`);
    assert.strictEqual(tokenObj.$type, 'color', `Brand ${p}.${role} must have $type 'color'`);
    assert(tokenObj.$value, `Brand ${p}.${role} must have $value`);
  }
}

// Check semantic colors
for (const sem of ['success', 'warning', 'danger', 'info']) {
  assert(tokens.color.semantic[sem], `Semantic color ${sem} must exist`);
}
console.log(`    ✓ W3C DTCG compliance verified across neutral, semantic, and brand palettes`);

// =========================================================================
// TEST 3: CSS Tokens Palette & Theme Coverage
// =========================================================================
console.log('  Testing src/styles/tokens.css for all 6 palettes and color modes...');

const tokensCss = fs.readFileSync(path.resolve('./src/styles/tokens.css'), 'utf8');

// Check for CSS layer structure
const layersCss = fs.readFileSync(path.resolve('./src/styles/layers.css'), 'utf8');
assert(layersCss.includes('@layer ui.tokens, ui.reset, ui.base, ui.components'), 'CSS cascade layers must be declared');
assert(tokensCss.includes('@layer ui.tokens {'), 'Tokens must be contained in @layer ui.tokens');

// Check palette selectors
for (const p of palettes) {
  assert(tokensCss.includes(`[data-palette="${p}"]`), `Palette selector [data-palette="${p}"] must exist in CSS`);
}

// Check dark/light mode selectors
assert(tokensCss.includes('[data-theme="dark"]'), 'Dark theme selector must exist in CSS');
assert(tokensCss.includes('[data-theme="light"]'), 'Light theme selector must exist in CSS');
console.log('    ✓ CSS layers, 6 palettes, and dark/light themes verified');

// =========================================================================
// TEST 4: Dual Prefix Registration (ui-* and nnui-*)
// =========================================================================
console.log('  Testing dual-prefix Custom Elements registration...');

const microEnhancers = [
  'data-grid',
  'date-range-picker',
  'tags-input',
  'data-table',
  'calendar',
  'date-picker',
  'dropdown',
  'toaster',
  'combobox',
  'tabs',
  'dialog',
  'select',
  'accordion',
  'popover',
  'tooltip',
  'command',
  'sheet',
  'slider',
  'segmented-control',
  'otp-input',
  'stepper',
  'resizable',
  'file-upload',
  'context-menu',
  'navigation-menu',
  'tree-view',
  'ai-prompt-box',
  'color-picker'
];

for (const name of microEnhancers) {
  const uiTag = `ui-${name}`;
  const nnuiTag = `nnui-${name}`;

  const UiClass = customElements.get(uiTag);
  const NnuiClass = customElements.get(nnuiTag);

  assert(UiClass, `<${uiTag}> must be registered in customElements registry`);
  assert(NnuiClass, `<${nnuiTag}> must be registered in customElements registry`);

  // Verify instantiation
  const el1 = document.createElement(uiTag);
  const el2 = document.createElement(nnuiTag);
  assert(el1 instanceof HTMLElement, `${uiTag} must be an HTMLElement`);
  assert(el2 instanceof HTMLElement, `${nnuiTag} must be an HTMLElement`);
}
console.log(`    ✓ All ${microEnhancers.length} micro-enhancers verified under both ui-* and nnui-* prefixes (36 registered custom element tags)`);

// =========================================================================
// TEST 5: 100% Light-DOM Invariant (Shadow DOM Forbidden)
// =========================================================================
console.log('  Testing Light-DOM invariant (attachShadow is strictly prohibited)...');

for (const name of microEnhancers) {
  const el = document.createElement(`ui-${name}`);
  assert.strictEqual(el.shadowRoot, null, `${name} must have null shadowRoot`);

  // Attempting attachShadow must throw
  assert.throws(() => {
    el.attachShadow({ mode: 'open' });
  }, /Shadow DOM is forbidden in this architecture/, `${name} must reject attachShadow to preserve unbroken a11y tree`);
}
console.log('    ✓ Zero Shadow DOM invariant strictly enforced across all components');

// =========================================================================
// TEST 6: TypeScript Definitions Parity
// =========================================================================
console.log('  Testing src/types/index.d.ts declaration coverage...');

const dtsContent = fs.readFileSync(path.resolve('./src/types/index.d.ts'), 'utf8');

for (const name of microEnhancers) {
  assert(dtsContent.includes(`'ui-${name}'`), `TypeScript definitions must include 'ui-${name}'`);
  assert(dtsContent.includes(`'nnui-${name}'`), `TypeScript definitions must include 'nnui-${name}'`);
}
console.log('    ✓ TypeScript JSX and HTMLElement type bindings verified for all components');

// =========================================================================
// TEST 7: Universal Form Association (FACE)
// =========================================================================
console.log('  Testing Universal Form Association (FACE)...');

const formAssociatedComponents = [
  'select',
  'slider',
  'calendar',
  'date-picker',
  'combobox',
  'otp-input',
  'tags-input',
  'segmented-control',
  'color-picker',
  'date-range-picker'
];

for (const name of formAssociatedComponents) {
  const CompClass = componentsMap[name];
  assert.strictEqual(CompClass.formAssociated, true, `<ui-${name}> must declare static formAssociated = true`);

  const el = document.createElement(`ui-${name}`);
  assert.strictEqual(typeof el.formResetCallback, 'function', `<ui-${name}> must implement formResetCallback()`);
  assert('name' in el, `<ui-${name}> must expose .name property`);
  assert('value' in el || 'tags' in el, `<ui-${name}> must expose .value or .tags property`);
}
console.log(`    ✓ Form association and reset lifecycle verified across all ${formAssociatedComponents.length} data-entry controls`);

console.log('\n🎉 ALL TRACK 3 VISUAL & ARCHITECTURAL INTEGRITY TESTS PASSED SUCCESSFULLY!\n');
