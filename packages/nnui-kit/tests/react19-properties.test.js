import assert from 'node:assert';
import { GlobalWindow } from 'happy-dom';

const window = new GlobalWindow();
globalThis.window = window;
globalThis.document = window.document;
globalThis.HTMLElement = window.HTMLElement;
globalThis.customElements = window.customElements;
globalThis.CustomEvent = window.CustomEvent;

// Polyfill HTMLDialogElement and Popover in happy-dom if needed
if (!window.HTMLDialogElement.prototype.showModal) {
  window.HTMLDialogElement.prototype.showModal = function() {
    this.open = true;
    this.setAttribute('open', '');
  };
}
if (!window.HTMLDialogElement.prototype.close) {
  window.HTMLDialogElement.prototype.close = function() {
    this.open = false;
    this.removeAttribute('open');
  };
}

// Import individual component classes
const { UiToaster } = await import('../src/components/toast/ui-toast.js');
const { UiAccordion } = await import('../src/components/accordion/ui-accordion.js');
const { UiTabs } = await import('../src/components/tabs/ui-tabs.js');
const { UiSlider } = await import('../src/components/slider/ui-slider.js');
const { UiSelect } = await import('../src/components/select/ui-select.js');
const { UiDialog } = await import('../src/components/dialog/ui-dialog.js');
const { UiPopover } = await import('../src/components/popover/ui-popover.js');
const { UiDropdown } = await import('../src/components/dropdown/ui-dropdown.js');
const { UiDatePicker } = await import('../src/components/date-picker/ui-date-picker.js');
const { UiDataGrid } = await import('../src/components/data-grid/ui-data-grid.js');
const { UiDataTable } = await import('../src/components/data-table/ui-data-table.js');
const { UiTooltip } = await import('../src/components/tooltip/ui-tooltip.js');
const { UiNavigationMenu } = await import('../src/components/navigation-menu/ui-navigation-menu.js');
const { UiTreeView } = await import('../src/components/tree-view/ui-tree-view.js');
const { UiOtpInput } = await import('../src/components/otp-input/ui-otp-input.js');
const { UiTagsInput } = await import('../src/components/tags-input/ui-tags-input.js');
const { UiFileUpload } = await import('../src/components/file-upload/ui-file-upload.js');
const { UiAiPromptBox } = await import('../src/components/ai-prompt-box/ui-ai-prompt-box.js');
const { UiColorPicker } = await import('../src/components/color-picker/ui-color-picker.js');
const { UiCombobox } = await import('../src/components/combobox/ui-combobox.js');
const { UiContextMenu } = await import('../src/components/context-menu/ui-context-menu.js');
const { UiDateRangePicker } = await import('../src/components/date-range-picker/ui-date-range-picker.js');
const { UiStepper } = await import('../src/components/stepper/ui-stepper.js');

const defineIfMissing = (tag, cls) => {
  if (!customElements.get(tag)) {
    customElements.define(tag, cls);
  }
};

defineIfMissing('ui-toaster', UiToaster);
defineIfMissing('ui-accordion', UiAccordion);
defineIfMissing('ui-tabs', UiTabs);
defineIfMissing('ui-slider', UiSlider);
defineIfMissing('ui-select', UiSelect);
defineIfMissing('ui-dialog', UiDialog);
defineIfMissing('ui-popover', UiPopover);
defineIfMissing('ui-dropdown', UiDropdown);
defineIfMissing('ui-date-picker', UiDatePicker);
defineIfMissing('ui-data-grid', UiDataGrid);
defineIfMissing('ui-data-table', UiDataTable);
defineIfMissing('ui-tooltip', UiTooltip);
defineIfMissing('ui-navigation-menu', UiNavigationMenu);
defineIfMissing('ui-tree-view', UiTreeView);
defineIfMissing('ui-otp-input', UiOtpInput);
defineIfMissing('ui-tags-input', UiTagsInput);
defineIfMissing('ui-file-upload', UiFileUpload);
defineIfMissing('ui-ai-prompt-box', UiAiPromptBox);
defineIfMissing('ui-color-picker', UiColorPicker);
defineIfMissing('ui-combobox', UiCombobox);
defineIfMissing('ui-context-menu', UiContextMenu);
defineIfMissing('ui-date-range-picker', UiDateRangePicker);
defineIfMissing('ui-stepper', UiStepper);

console.log('Testing React 19 Direct Property Assignment Compatibility...');

// 1. UiToaster
const toaster = document.createElement('ui-toaster');
document.body.appendChild(toaster);
assert.doesNotThrow(() => {
  toaster.position = 'top-right';
  toaster.expand = true;
}, 'toaster.position and expand assignment should not throw in React 19');
assert.strictEqual(toaster.position, 'top-right');
assert.strictEqual(toaster.expand, true);
console.log('  ✓ <ui-toaster> position & expand assignment passed');

// 2. UiAccordion
const accordion = document.createElement('ui-accordion');
document.body.appendChild(accordion);
assert.doesNotThrow(() => {
  accordion.type = 'multiple';
  accordion.collapsible = false;
}, 'accordion.type and collapsible assignment should not throw');
assert.strictEqual(accordion.type, 'multiple');
assert.strictEqual(accordion.collapsible, false);
console.log('  ✓ <ui-accordion> type & collapsible assignment passed');

// 3. UiTabs
const tabs = document.createElement('ui-tabs');
document.body.appendChild(tabs);
assert.doesNotThrow(() => {
  tabs.value = 'tab-2';
  tabs.orientation = 'vertical';
}, 'tabs.orientation assignment should not throw');
assert.strictEqual(tabs.value, 'tab-2');
assert.strictEqual(tabs.orientation, 'vertical');
console.log('  ✓ <ui-tabs> value & orientation assignment passed');

// 4. UiSlider
const slider = document.createElement('ui-slider');
document.body.appendChild(slider);
assert.doesNotThrow(() => {
  slider.min = 10;
  slider.max = 200;
  slider.step = 5;
  slider.disabled = true;
}, 'slider properties assignment should not throw');
assert.strictEqual(slider.min, 10);
assert.strictEqual(slider.max, 200);
assert.strictEqual(slider.step, 5);
assert.strictEqual(slider.disabled, true);
console.log('  ✓ <ui-slider> min, max, step, disabled assignment passed');

// 5. UiSelect
const select = document.createElement('ui-select');
document.body.appendChild(select);
assert.doesNotThrow(() => {
  select.name = 'country';
  select.required = true;
  select.disabled = true;
  select.isOpen = false;
  select.form = null;
}, 'select properties assignment should not throw');
assert.strictEqual(select.name, 'country');
assert.strictEqual(select.required, true);
assert.strictEqual(select.disabled, true);
console.log('  ✓ <ui-select> properties assignment passed');

// 6. UiDialog, UiPopover, UiDropdown, UiDatePicker
const dialog = document.createElement('ui-dialog');
const popover = document.createElement('ui-popover');
const dropdown = document.createElement('ui-dropdown');
const datePicker = document.createElement('ui-date-picker');
assert.doesNotThrow(() => {
  dialog.isOpen = false;
  popover.isOpen = false;
  dropdown.isOpen = false;
  datePicker.isOpen = false;
}, 'isOpen assignment should not throw');
console.log('  ✓ <ui-dialog>, <ui-popover>, <ui-dropdown>, <ui-date-picker> isOpen passed');

// 7. UiDataGrid and UiDataTable
const dataGrid = document.createElement('ui-data-grid');
const dataTable = document.createElement('ui-data-table');
assert.doesNotThrow(() => {
  dataGrid.rowHeight = 48;
  dataGrid.overscan = 10;
  dataGrid.totalRows = 100;
  dataGrid.filteredCount = 50;
  dataGrid.selectedCount = 2;
  dataTable.totalPages = 5;
}, 'grid and table properties assignment should not throw');
assert.strictEqual(dataGrid.rowHeight, 48);
assert.strictEqual(dataGrid.overscan, 10);
console.log('  ✓ <ui-data-grid> and <ui-data-table> properties passed');

// 8. UiTooltip, UiNavigationMenu, UiTreeView, UiOtpInput, UiTagsInput, UiFileUpload
const tooltip = document.createElement('ui-tooltip');
const nav = document.createElement('ui-navigation-menu');
const tree = document.createElement('ui-tree-view');
const otp = document.createElement('ui-otp-input');
const tags = document.createElement('ui-tags-input');
const upload = document.createElement('ui-file-upload');
const aiPrompt = document.createElement('ui-ai-prompt-box');
const colorPicker = document.createElement('ui-color-picker');
const combobox = document.createElement('ui-combobox');
const contextMenu = document.createElement('ui-context-menu');
const dateRange = document.createElement('ui-date-range-picker');
const stepper = document.createElement('ui-stepper');

assert.doesNotThrow(() => {
  tooltip.delay = 200;
  nav.delay = 300;
  nav.disabled = true;
  tree.selectionMode = 'multiple';
  tree.disabled = true;
  otp.length = 4;
  otp.isComplete = true;
  tags.maxTags = 5;
  upload.accept = 'image/*';
  upload.multiple = true;
  upload.maxSize = 1048576;
  aiPrompt.maxRows = 8;
  colorPicker.name = 'brandColor';
  colorPicker.isOpen = false;
  combobox.isOpen = false;
  contextMenu.isOpen = false;
  dateRange.isOpen = false;
  stepper.orientation = 'vertical';
}, 'remaining component properties assignment should not throw');

assert.strictEqual(tooltip.delay, 200);
assert.strictEqual(nav.delay, 300);
assert.strictEqual(tree.selectionMode, 'multiple');
assert.strictEqual(otp.length, 4);
assert.strictEqual(tags.maxTags, 5);
assert.strictEqual(upload.accept, 'image/*');
assert.strictEqual(upload.multiple, true);
assert.strictEqual(upload.maxSize, 1048576);
assert.strictEqual(aiPrompt.maxRows, 8);
assert.strictEqual(colorPicker.name, 'brandColor');
assert.strictEqual(stepper.orientation, 'vertical');

console.log('  ✓ <ui-tooltip>, <ui-navigation-menu>, <ui-tree-view>, <ui-otp-input>, <ui-tags-input>, <ui-file-upload>, etc. passed');

console.log('\n🎉 ALL REACT 19 PROPERTY RECONCILIATION TESTS PASSED 100%!\n');
