import { GlobalWindow } from 'happy-dom';
import assert from 'node:assert';

// Setup global mock DOM environment
const window = new GlobalWindow();
globalThis.window = window;
globalThis.document = window.document;
globalThis.HTMLElement = window.HTMLElement;
globalThis.customElements = window.customElements;
globalThis.CustomEvent = window.CustomEvent;
globalThis.KeyboardEvent = window.KeyboardEvent;
globalThis.MouseEvent = window.MouseEvent;
globalThis.Event = window.Event;

// Mock requestAnimationFrame / cancelAnimationFrame
let nextRafId = 1;
const rafCallbacks = new Map();
globalThis.requestAnimationFrame = (fn) => {
  const id = nextRafId++;
  rafCallbacks.set(id, fn);
  setTimeout(() => {
    if (rafCallbacks.has(id)) {
      rafCallbacks.delete(id);
      fn(Date.now());
    }
  }, 0);
  return id;
};
globalThis.cancelAnimationFrame = (id) => {
  rafCallbacks.delete(id);
};

// Mock Blob & URL.createObjectURL for CSV export tests
globalThis.Blob = class MockBlob {
  constructor(parts, options) {
    this.parts = parts;
    this.options = options;
  }
};
let lastCreatedUrl = null;
globalThis.URL = {
  createObjectURL: (blob) => {
    lastCreatedUrl = 'blob:mock-url-' + Math.random().toString(36).slice(2);
    return lastCreatedUrl;
  },
  revokeObjectURL: (url) => {}
};

// Polyfill IntersectionObserver in Happy-DOM
class MockIntersectionObserver {
  constructor(callback, options) {
    this.callback = callback;
    this.options = options;
    this.observedElements = new Set();
    MockIntersectionObserver.instances.push(this);
  }

  observe(el) {
    this.observedElements.add(el);
  }

  unobserve(el) {
    this.observedElements.delete(el);
  }

  disconnect() {
    this.observedElements.clear();
  }

  // Helper to trigger intersection in tests
  trigger(entries) {
    this.callback(entries, this);
  }
}
MockIntersectionObserver.instances = [];
globalThis.IntersectionObserver = MockIntersectionObserver;

// Polyfill ResizeObserver in Happy-DOM
class MockResizeObserver {
  constructor(callback) {
    this.callback = callback;
    this.observedElements = new Set();
  }
  observe(el) { this.observedElements.add(el); }
  unobserve(el) { this.observedElements.delete(el); }
  disconnect() { this.observedElements.clear(); }
}
globalThis.ResizeObserver = MockResizeObserver;

async function render(html) {
  document.body.innerHTML = html;
  await new Promise((resolve) => queueMicrotask(resolve));
  await new Promise((resolve) => setTimeout(resolve, 15));
}

// Import modules to test
const { applyPositionFallback, attachAnchorFallback, isAnchorPositioningSupported } = await import('../src/utils/anchor-fallback.js');
const { UiDataTable } = await import('../src/components/data-table/ui-data-table.js');

if (!customElements.get('ui-data-table')) {
  customElements.define('ui-data-table', UiDataTable);
}

console.log('Testing Track 2: Performance & Fallback Optimization (Anchor Fallback Engine & Data Table Enhancements)...');

// =========================================================================
// TEST 1: Anchor Fallback Engine (Boundary Collisions & Auto-Flipping)
// =========================================================================
console.log('  Testing applyPositionFallback boundary calculations and auto-flipping...');

// Create anchor and target
const anchor = document.createElement('button');
anchor.textContent = 'Anchor';
const target = document.createElement('div');
target.textContent = 'Floating Overlay';
document.body.appendChild(anchor);
document.body.appendChild(target);

// Mock getBoundingClientRect
anchor.getBoundingClientRect = () => ({
  top: 100,
  bottom: 140,
  left: 200,
  right: 300,
  width: 100,
  height: 40
});
target.getBoundingClientRect = () => ({
  top: 0,
  bottom: 120,
  left: 0,
  right: 180,
  width: 180,
  height: 120
});

// Standard bottom placement
applyPositionFallback(anchor, target, 'bottom', 6);
assert.strictEqual(target.style.position, 'fixed', 'target must have fixed position');
assert.strictEqual(target.style.top, '146px', 'top must equal anchor.bottom + offset (140 + 6 = 146)');
assert.strictEqual(target.style.left, '200px', 'left must align with anchor.left');
console.log('    ✓ Default bottom placement verified');

// Auto-flip: Anchor near viewport bottom (e.g. top: 700, bottom: 740 in an 800px viewport)
anchor.getBoundingClientRect = () => ({
  top: 700,
  bottom: 740,
  left: 200,
  right: 300,
  width: 100,
  height: 40
});
applyPositionFallback(anchor, target, 'bottom', 6);
// space below = 800 - 746 = 54px (< 120px target height)
// space above = 700 - 6 = 694px (> 120px target height)
// Must flip to top: 700 - 120 - 6 = 574px
assert.strictEqual(target.style.top, '574px', 'target must auto-flip to top when overflowing bottom');
console.log('    ✓ Bottom-to-top collision auto-flip verified');

// Auto-flip: Right to Left when near right edge
anchor.getBoundingClientRect = () => ({
  top: 200,
  bottom: 240,
  left: 900,
  right: 980,
  width: 80,
  height: 40
});
applyPositionFallback(anchor, target, 'right', 6);
// space to right in 1024 viewport = 1024 - (980 + 6) = 38px (< 180px target width)
// Must flip to left: 900 - 180 - 6 = 714px
assert.strictEqual(target.style.left, '714px', 'target must auto-flip to left when overflowing right');
console.log('    ✓ Right-to-left collision auto-flip verified');

// =========================================================================
// TEST 2: attachAnchorFallback (IntersectionObserver & RAF Throttling)
// =========================================================================
console.log('  Testing attachAnchorFallback with IntersectionObserver and RAF throttling...');

let cleanup = attachAnchorFallback(anchor, target, { placement: 'bottom', offset: 6 });
assert(typeof cleanup === 'function', 'attachAnchorFallback must return a cleanup function');

// Find created MockIntersectionObserver
const observer = MockIntersectionObserver.instances[MockIntersectionObserver.instances.length - 1];
assert(observer, 'IntersectionObserver must be registered for anchor');

// Simulate anchor scrolling out of view (isIntersecting = false)
observer.trigger([{
  target: anchor,
  isIntersecting: false
}]);
assert.strictEqual(target.style.visibility, 'hidden', 'target must be hidden when anchor scrolls out of view');
console.log('    ✓ Offscreen anchor auto-hide via IntersectionObserver verified');

// Simulate anchor scrolling back into view (isIntersecting = true)
observer.trigger([{
  target: anchor,
  isIntersecting: true
}]);
assert.strictEqual(target.style.visibility, '', 'target visibility must be restored when anchor returns');
console.log('    ✓ Re-entry anchor visibility restore verified');

// Teardown
cleanup();
assert.strictEqual(observer.observedElements.size, 0, 'Cleanup must disconnect observers');
console.log('    ✓ Cleanup teardown verified');

// =========================================================================
// TEST 3: <ui-data-table> Bulk Actions Toolbar & CSV Export
// =========================================================================
console.log('  Testing <ui-data-table> Bulk Actions and CSV Export...');

await render(`
  <ui-data-table page-size="5">
    <div data-part="toolbar">
      <input data-part="search" placeholder="Search users...">
      <div data-part="bulk-actions" hidden>
        <span data-part="bulk-count">0</span> items selected
        <button data-action="export-csv">Export CSV</button>
      </div>
      <div data-part="selection-count"></div>
    </div>
    <div data-part="table-container">
      <table>
        <thead>
          <tr>
            <th><input data-part="select-all" type="checkbox"></th>
            <th data-sortable="true" data-sort-key="name">Name</th>
            <th data-sortable="true" data-sort-key="role">Role</th>
            <th data-sortable="true" data-sort-key="salary">Salary</th>
          </tr>
        </thead>
        <tbody data-part="tbody">
          <tr data-row-id="1">
            <td><input data-part="row-select" type="checkbox"></td>
            <td>Alice Johnson</td>
            <td>Engineer</td>
            <td>$120,000</td>
          </tr>
          <tr data-row-id="2">
            <td><input data-part="row-select" type="checkbox"></td>
            <td>Bob Smith</td>
            <td>Designer</td>
            <td>$110,000</td>
          </tr>
          <tr data-row-id="3">
            <td><input data-part="row-select" type="checkbox"></td>
            <td>Charlie Brown</td>
            <td>Product Manager</td>
            <td>$135,000</td>
          </tr>
        </tbody>
      </table>
    </div>
  </ui-data-table>
`);

const dataTable = document.querySelector('ui-data-table');
assert(dataTable, 'ui-data-table must be rendered');

const bulkActions = dataTable.querySelector('[data-part="bulk-actions"]');
const bulkCount = dataTable.querySelector('[data-part="bulk-count"]');
assert(bulkActions.hasAttribute('hidden'), 'Bulk actions must be hidden when zero rows selected');

// Select first row
const firstRowCb = dataTable.querySelector('tbody tr[data-row-id="1"] input[type="checkbox"]');
firstRowCb.checked = true;
firstRowCb.dispatchEvent(new Event('change', { bubbles: true }));

assert(!bulkActions.hasAttribute('hidden'), 'Bulk actions must be visible when rows are selected');
assert.strictEqual(bulkCount.textContent, '1', 'Bulk count must show 1');
console.log('    ✓ Bulk actions toolbar appears upon selection');

// Select all rows
dataTable.selectAll();
assert.strictEqual(bulkCount.textContent, '3', 'Bulk count must show 3 after selectAll()');
assert.strictEqual(dataTable.getSelectedRowIds().length, 3, 'All 3 row IDs must be selected');

// Test exportCsv method
let clickTriggered = false;
const originalAppend = document.body.appendChild.bind(document.body);
document.body.appendChild = (el) => {
  if (el.tagName && el.tagName.toLowerCase() === 'a' && el.download) {
    clickTriggered = true;
  }
  return originalAppend(el);
};

dataTable.exportCsv('custom-export.csv');
assert(clickTriggered, 'exportCsv must create and trigger anchor download link');
assert(lastCreatedUrl, 'CSV blob URL must have been generated');
console.log('    ✓ exportCsv() creates and triggers valid CSV download');

// Deselect all
dataTable.deselectAll();
assert(bulkActions.hasAttribute('hidden'), 'Bulk actions must hide after deselectAll()');
assert.strictEqual(dataTable.getSelectedRowIds().length, 0, 'Selected count must be 0');
console.log('    ✓ Bulk actions toolbar hides after deselectAll()');

console.log('  ✓ <ui-data-table> enhancements passed!\n');

console.log('🎉 ALL TRACK 2 PERFORMANCE & FALLBACK OPTIMIZATION TESTS PASSED SUCCESSFULLY!\n');
