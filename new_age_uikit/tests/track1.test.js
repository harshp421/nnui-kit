import { GlobalWindow } from 'happy-dom';
import assert from 'node:assert';

// Setup global window environment
const window = new GlobalWindow();
globalThis.window = window;
globalThis.document = window.document;
globalThis.HTMLElement = window.HTMLElement;
globalThis.customElements = window.customElements;
globalThis.CustomEvent = window.CustomEvent;
globalThis.KeyboardEvent = window.KeyboardEvent;
globalThis.MouseEvent = window.MouseEvent;
globalThis.Event = window.Event;
globalThis.requestAnimationFrame = (fn) => setTimeout(fn, 0);
globalThis.cancelAnimationFrame = (id) => clearTimeout(id);

// Mock CSS.supports
globalThis.CSS = {
  supports: () => false
};

// Polyfill showPopover / hidePopover
if (!window.HTMLElement.prototype.showPopover) {
  window.HTMLElement.prototype.showPopover = function() {
    this.setAttribute('data-popover-open', '');
    this.dispatchEvent(new CustomEvent('toggle', { detail: { newState: 'open' } }));
  };
}
if (!window.HTMLElement.prototype.hidePopover) {
  window.HTMLElement.prototype.hidePopover = function() {
    this.removeAttribute('data-popover-open');
    this.dispatchEvent(new CustomEvent('toggle', { detail: { newState: 'closed' } }));
  };
}

async function render(html) {
  document.body.innerHTML = html;
  await new Promise((resolve) => queueMicrotask(resolve));
  await new Promise((resolve) => setTimeout(resolve, 10));
}

// Import components
const { UiDataGrid } = await import('../src/components/data-grid/ui-data-grid.js');
const { UiDateRangePicker } = await import('../src/components/date-range-picker/ui-date-range-picker.js');
const { UiTagsInput } = await import('../src/components/tags-input/ui-tags-input.js');

console.log('Testing Track 1 Components (Virtualized Data Grid, Date Range Picker, Tags Input)...');

// =========================================================================
// TEST 1: <ui-data-grid> Virtualization with 15,000 Rows
// =========================================================================
console.log('  Testing <ui-data-grid> with 15,000 virtualized rows...');
await render(`
  <ui-data-grid row-height="40" overscan="5">
    <div data-part="viewport" style="height: 400px;">
      <div data-part="runway">
        <table data-part="grid-table">
          <thead></thead>
          <tbody data-part="virtual-tbody"></tbody>
        </table>
      </div>
    </div>
  </ui-data-grid>
`);

const grid = document.querySelector('ui-data-grid');
assert(grid, 'grid element must be found');

// Define columns
grid.setColumns([
  { key: 'id', label: 'ID', width: '80px', sortable: true },
  { key: 'symbol', label: 'Symbol', width: '120px', sortable: true },
  { key: 'price', label: 'Price', width: '120px', sortable: true },
  { key: 'status', label: 'Status', width: '100px', sortable: false }
]);

// Generate 15,000 rows
const testRows = [];
for (let i = 1; i <= 15000; i++) {
  testRows.push({
    id: i,
    symbol: i % 2 === 0 ? 'BTC/USD' : 'ETH/USD',
    price: (Math.random() * 50000 + 1000).toFixed(2),
    status: i % 3 === 0 ? 'Pending' : 'Completed'
  });
}

grid.setRows(testRows);

// 1. Check runway height calculation (15,000 rows * 40px = 600,000px)
const runway = grid.querySelector('[data-part="runway"]');
assert.strictEqual(runway.style.height, '600000px', 'Runway height must equal totalRows * rowHeight');

// 2. Check DOM virtualization constraint: ONLY ~25-35 rows in DOM, NOT 15,000!
const tbody = grid.querySelector('tbody[data-part="virtual-tbody"]');
const renderedRows = tbody.querySelectorAll('tr');
assert(renderedRows.length > 0 && renderedRows.length < 50, `Rendered DOM rows count (${renderedRows.length}) must be small window (~25-35), NOT 15,000!`);
console.log(`    ✓ Window virtualization verified: 15,000 data rows represented by only ${renderedRows.length} DOM nodes`);

// 3. Test Filtering
grid.setSearch('BTC/USD');
assert(grid.filteredCount > 7000, 'Search query must filter matching rows');
assert.strictEqual(grid.filteredCount, 7500, 'Exact 7,500 BTC rows must match');
assert.strictEqual(runway.style.height, `${7500 * 40}px`, 'Runway height must update on filter');
console.log('    ✓ Search filtering across 15,000 rows verified');

// Reset search
grid.setSearch('');
assert.strictEqual(grid.filteredCount, 15000, 'Search reset must restore all 15,000 rows');

// 4. Test Sorting
const idHeader = grid.querySelector('th[data-col-key="id"]');
assert(idHeader, 'ID column header must exist');
idHeader.click(); // Sort asc
assert.strictEqual(grid._sortKey, 'id');
assert.strictEqual(grid._sortDir, 'asc');
assert.strictEqual(grid._filteredRows[0].id, 1, 'First row must have id 1');

idHeader.click(); // Sort desc
assert.strictEqual(grid._sortKey, 'id');
assert.strictEqual(grid._sortDir, 'desc');
assert.strictEqual(grid._filteredRows[0].id, 15000, 'First row must have id 15000 when sorted descending');
console.log('    ✓ Fast sorting across 15,000 rows verified');

// 5. Test Streaming Append
const initialCount = grid.totalRows;
grid.appendRows([
  { id: 15001, symbol: 'SOL/USD', price: '145.20', status: 'Completed' },
  { id: 15002, symbol: 'SOL/USD', price: '146.50', status: 'Completed' }
]);
assert.strictEqual(grid.totalRows, initialCount + 2, 'Streaming appendRows must add rows');
assert.strictEqual(runway.style.height, `${(initialCount + 2) * 40}px`, 'Runway height must adapt to streamed rows');
console.log('    ✓ Streaming row append verified');

// 6. Test Row Selection
const firstRowCheckbox = tbody.querySelector('tr input[type="checkbox"]');
assert(firstRowCheckbox, 'Row checkbox must exist');
firstRowCheckbox.click();
assert.strictEqual(grid.selectedCount, 1, 'Single row select must increment selectedCount');

const selectAllCb = grid.querySelector('input[data-part="select-all"]');
selectAllCb.click(); // select all
assert.strictEqual(grid.selectedCount, grid.filteredCount, 'Select all must select all rows');
selectAllCb.click(); // unselect all
assert.strictEqual(grid.selectedCount, 0, 'Unselect all must clear selection');
console.log('    ✓ Selection management across virtualized set verified');

// 7. Test Class and Scroll Overflow Assignment
const viewport = grid.querySelector('[data-part="viewport"]');
assert(viewport.classList.contains('grid-viewport'), 'Viewport must have grid-viewport class');
assert.strictEqual(viewport.style.overflowY, 'auto', 'Viewport must have overflowY auto for scrolling');
const tableEl = grid.querySelector('[data-part="grid-table"]');
assert(tableEl.classList.contains('grid-table'), 'Table must have grid-table class');
console.log('    ✓ Viewport scroll container classes and overflow-y: auto verified');

// 8. Test Virtual Scrolling Simulation
viewport.scrollTop = 20000; // Scrolled down to row ~500
viewport.dispatchEvent(new Event('scroll'));
await new Promise((resolve) => setTimeout(resolve, 20));
const middleRows = tbody.querySelectorAll('tr:not(.grid-spacer)');
assert(middleRows.length > 0 && middleRows.length < 50, 'Scrolled window must maintain ~20-30 virtual rows');
const topSpacer = tbody.querySelector('.grid-spacer-top');
assert(topSpacer, 'Top spacer must exist when scrolled down');
assert(parseInt(topSpacer.style.height, 10) > 0, 'Top spacer height must be > 0 when scrolled');
console.log('    ✓ Virtual scrolling window and top/bottom spacer recalculation verified');

console.log('  ✓ <ui-data-grid> passed!\n');

// =========================================================================
// TEST 2: <ui-date-range-picker>
// =========================================================================
console.log('  Testing <ui-date-range-picker>...');
await render(`
  <ui-date-range-picker start-date="2026-10-01" end-date="2026-10-15"></ui-date-range-picker>
`);

const rangePicker = document.querySelector('ui-date-range-picker');
assert(rangePicker, 'ui-date-range-picker must be found');

assert(rangePicker.startDate instanceof Date, 'startDate must be a Date object');
assert.strictEqual(rangePicker.startDate.toISOString().split('T')[0], '2026-10-01');
assert.strictEqual(rangePicker.endDate.toISOString().split('T')[0], '2026-10-15');

let rangeChangeEvent = null;
rangePicker.addEventListener('change', (e) => {
  rangeChangeEvent = e.detail;
});

// Test preset
rangePicker._applyPreset('7d');
assert(rangeChangeEvent, 'change event must fire on preset');
assert(rangePicker.startDate instanceof Date, 'Preset must set startDate');
assert(rangePicker.endDate instanceof Date, 'Preset must set endDate');
console.log('    ✓ Presets and date range calculation verified');

// Test manual date clicks & non-destructive hover preview
rangePicker.open();
const btnOct5 = rangePicker._popover.querySelector('button[data-date="2026-10-05"]');
const btnOct12 = rangePicker._popover.querySelector('button[data-date="2026-10-12"]');
assert(btnOct5, 'Button for 2026-10-05 must exist in popover');
assert(btnOct12, 'Button for 2026-10-12 must exist in popover');

// Click first date
btnOct5.click();
assert.strictEqual(rangePicker._selectingEnd, true, 'First date click must enter _selectingEnd state');
assert.strictEqual(rangePicker._formatDate(rangePicker.startDate), '2026-10-05');
assert.strictEqual(rangePicker.endDate, null, 'First date click must clear endDate');

// Now popover contains current buttons for second date selection
const currentBtnOct12 = rangePicker._popover.querySelector('button[data-date="2026-10-12"]');
assert(currentBtnOct12, 'Button for 2026-10-12 must exist in popover');

// Hover over second date - must update in-range classes without destroying DOM
currentBtnOct12.dispatchEvent(new Event('mouseenter'));
const btnOct8 = rangePicker._popover.querySelector('button[data-date="2026-10-08"]');
assert.strictEqual(btnOct8.getAttribute('data-range'), 'in-range', 'Cell 8 must have data-range="in-range" on hover');
assert.strictEqual(currentBtnOct12.getAttribute('data-range'), 'end', 'Hovered cell must have data-range="end"');

// Click second date - currentBtnOct12 was preserved in DOM through hover, so click fires reliably!
currentBtnOct12.click();
assert.strictEqual(rangePicker._selectingEnd, false, 'Second date click must end selection mode');
assert.strictEqual(rangePicker._formatDate(rangePicker.startDate), '2026-10-05');
assert.strictEqual(rangePicker._formatDate(rangePicker.endDate), '2026-10-12');
assert.strictEqual(rangeChangeEvent.start, '2026-10-05', 'Change event start date must match');
assert.strictEqual(rangeChangeEvent.end, '2026-10-12', 'Change event end date must match');
console.log('    ✓ Interactive DOM date clicks, non-destructive hover, and second date selection verified');

// Test Popover Open / Close / Toggle lifecycle and removeAttributeSafe
assert.doesNotThrow(() => {
  rangePicker.open();
  assert.strictEqual(rangePicker.isOpen, true, 'rangePicker must be open after open()');
  rangePicker.close();
  assert.strictEqual(rangePicker.isOpen, false, 'rangePicker must be closed after close()');
  rangePicker.toggle();
  assert.strictEqual(rangePicker.isOpen, true, 'rangePicker must be open after toggle()');
  rangePicker.toggle();
  assert.strictEqual(rangePicker.isOpen, false, 'rangePicker must be closed after second toggle()');

  // Simulate popover toggle event (closed state)
  rangePicker._popover.dispatchEvent(new Event('toggle'));
}, 'open/close/toggle lifecycle and removeAttributeSafe must not throw');
console.log('    ✓ Popover open/close/toggle lifecycle and removeAttributeSafe verified');

console.log('  ✓ <ui-date-range-picker> passed!\n');

// =========================================================================
// TEST 3: <ui-tags-input>
// =========================================================================
console.log('  Testing <ui-tags-input>...');
await render(`
  <ui-tags-input tags="frontend,backend" max-tags="5"></ui-tags-input>
`);

const tagsInput = document.querySelector('ui-tags-input');
assert(tagsInput, 'ui-tags-input must be found');

assert.deepStrictEqual(tagsInput.tags, ['frontend', 'backend'], 'Initial tags must be parsed');

let tagsChangeEvent = null;
tagsInput.addEventListener('change', (e) => {
  tagsChangeEvent = e.detail;
});

// Add Tag
const added = tagsInput.addTag('devops');
assert(added, 'addTag must return true on success');
assert.deepStrictEqual(tagsInput.tags, ['frontend', 'backend', 'devops']);
assert.strictEqual(tagsChangeEvent.added, 'devops');

// Duplicate rejection
const dupAdded = tagsInput.addTag('frontend');
assert(!dupAdded, 'Duplicate tag must be rejected');
assert.strictEqual(tagsInput.tags.length, 3);

// Remove Tag
const removed = tagsInput.removeTag('backend');
assert(removed, 'removeTag must return true on success');
assert.deepStrictEqual(tagsInput.tags, ['frontend', 'devops']);
assert.strictEqual(tagsChangeEvent.removed, 'backend');

// Max tags limit
tagsInput.addTag('cloud');
tagsInput.addTag('security');
tagsInput.addTag('ai');
assert.strictEqual(tagsInput.tags.length, 5, 'Max 5 tags allowed');
const overflowAdded = tagsInput.addTag('overflow');
assert(!overflowAdded, 'Tag exceeding max-tags must be rejected');

console.log('  ✓ <ui-tags-input> passed!\n');

console.log('🎉 ALL TRACK 1 COMPONENTS (VIRTUALIZED DATA GRID, RANGE PICKER, TAGS) VERIFIED SUCCESSFULLY!');
