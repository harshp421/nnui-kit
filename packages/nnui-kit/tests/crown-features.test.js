import { GlobalWindow } from 'happy-dom';
import assert from 'node:assert';

// Setup mock browser environment
const window = new GlobalWindow({ url: 'http://localhost:5173/components/data-grid.html?demo-data-grid_search=ETH&demo-data-grid_sortKey=price&demo-data-grid_sortDir=desc' });
globalThis.window = window;
globalThis.document = window.document;
globalThis.HTMLElement = window.HTMLElement;
globalThis.customElements = window.customElements;
globalThis.CustomEvent = window.CustomEvent;
globalThis.Event = window.Event;
globalThis.KeyboardEvent = window.KeyboardEvent;
globalThis.requestAnimationFrame = (fn) => setTimeout(fn, 0);

// Mock BroadcastChannel
class MockBroadcastChannel {
  static channels = new Map();
  constructor(name) {
    this.name = name;
    if (!MockBroadcastChannel.channels.has(name)) {
      MockBroadcastChannel.channels.set(name, new Set());
    }
    MockBroadcastChannel.channels.get(name).add(this);
    this.onmessage = null;
  }
  postMessage(data) {
    const list = MockBroadcastChannel.channels.get(this.name) || new Set();
    for (const ch of list) {
      if (ch !== this && ch.onmessage) {
        ch.onmessage({ data });
      }
    }
  }
  close() {
    const list = MockBroadcastChannel.channels.get(this.name);
    if (list) list.delete(this);
  }
}
globalThis.BroadcastChannel = MockBroadcastChannel;

// Import Base and components
const { BaseLightElement } = await import('../src/utils/base-element.js');
const { attachPersistence } = await import('../src/utils/persistence.js');
const { UiDataGrid } = await import('../src/components/data-grid/ui-data-grid.js');
const { UiDateRangePicker } = await import('../src/components/date-range-picker/ui-date-range-picker.js');
const { UiStepper } = await import('../src/components/stepper/ui-stepper.js');
const { UiAiPromptBox } = await import('../src/components/ai-prompt-box/ui-ai-prompt-box.js');

if (!customElements.get('ui-data-grid')) customElements.define('ui-data-grid', UiDataGrid);
if (!customElements.get('ui-date-range-picker')) customElements.define('ui-date-range-picker', UiDateRangePicker);
if (!customElements.get('ui-stepper')) customElements.define('ui-stepper', UiStepper);
if (!customElements.get('ui-ai-prompt-box')) customElements.define('ui-ai-prompt-box', UiAiPromptBox);

console.log('Testing Crown Champion Features: Declarative Persistence, Cross-Tab Sync & AI Introspection...\n');

// =========================================================================
// TEST 1: AI Component Introspection Protocol (element.inspectAI())
// =========================================================================
console.log('  Testing AI Machine-Readable Introspection Protocol (element.inspectAI())...');
{
  const grid = document.createElement('ui-data-grid');
  grid.setAttribute('row-height', '44');
  grid.setAttribute('overscan', '8');
  grid.setAttribute('persist', 'url');
  grid.setAttribute('sync', '');
  document.body.appendChild(grid);
  grid.init();

  const inspection = grid.inspectAI();
  assert.strictEqual(inspection.protocol, 'nnui.ai.v1', 'Protocol identifier must match nnui.ai.v1');
  assert.strictEqual(inspection.tag, 'ui-data-grid');
  assert.strictEqual(inspection.isLightDom, true, 'isLightDom flag must be strictly true');
  assert.strictEqual(inspection.schema.hasPersistence, true, 'Reports persistence enabled');
  assert.strictEqual(inspection.schema.persistenceMode, 'url');
  assert.strictEqual(inspection.schema.isCrossTabSynced, true, 'Reports cross-tab sync enabled');
  assert(inspection.liveState, 'Must contain liveState snapshot');
  assert(inspection.frameworkSnippets.react19.includes('<ui-data-grid'), 'Must include valid React 19 snippet');
  assert(inspection.frameworkSnippets.vue.includes('<ui-data-grid'), 'Must include valid Vue snippet');
  assert(inspection.frameworkSnippets.svelte.includes('<ui-data-grid'), 'Must include valid Svelte snippet');

  // Verify inspectAI thenable Promise support (no TypeError on .then())
  let promiseResolved = false;
  await grid.inspectAI().then(data => {
    assert.strictEqual(data.protocol, 'nnui.ai.v1');
    promiseResolved = true;
  });
  assert.strictEqual(promiseResolved, true, 'inspectAI() must resolve properly when called with .then()');

  document.body.removeChild(grid);
  console.log('    ✓ inspectAI() protocol schema and framework code snippets verified');
}

// =========================================================================
// TEST 2: URL Persistence & Hydration on <ui-data-grid>
// =========================================================================
console.log('  Testing URL State Hydration on <ui-data-grid persist="url">...');
{
  const grid = document.createElement('ui-data-grid');
  grid.id = 'demo-data-grid';
  grid.setAttribute('persist', 'url');
  document.body.appendChild(grid);
  grid.init();

  grid.setColumns([
    { key: 'id', label: 'ID' },
    { key: 'symbol', label: 'Symbol' },
    { key: 'price', label: 'Price' }
  ]);
  grid.setRows([
    { id: 1, symbol: 'BTC/USD', price: 65000 },
    { id: 2, symbol: 'ETH/USD', price: 3500 },
    { id: 3, symbol: 'SOL/USD', price: 150 }
  ]);

  // Initial state was in URL: demo-data-grid_search=ETH&demo-data-grid_sortKey=price&demo-data-grid_sortDir=desc
  assert.strictEqual(grid._searchQuery, 'eth', 'Initial search query hydrated directly from URL query param');
  assert.strictEqual(grid._sortKey, 'price', 'Initial sortKey hydrated directly from URL query param');
  assert.strictEqual(grid._sortDir, 'desc', 'Initial sortDir hydrated directly from URL query param');
  assert.strictEqual(grid.filteredCount, 1, 'Only 1 row matches hydrated search');
  assert.strictEqual(grid._filteredRows[0].symbol, 'ETH/USD');

  // Verify header has proper aria-sort and sort icon
  const priceTh = grid.querySelector('th[data-col-key="price"]');
  assert.strictEqual(priceTh.getAttribute('aria-sort'), 'descending', 'Header aria-sort must reflect hydrated sort direction');
  assert.strictEqual(priceTh.querySelector('.grid-sort-icon').textContent, '▼', 'Header icon must reflect descending arrow');

  // Mutating search updates URL search params to clean ?grid_search=btc
  grid.setSearch('BTC');
  const currentUrl = window.location.search;
  assert(currentUrl.includes('grid_search=btc') || currentUrl.includes('demo-data-grid_search=btc'), 'URL search params updated on search change');

  // Clear search and test sorting by Order Type (action)
  grid.setSearch('');
  grid.setColumns([
    { key: 'id', label: 'ID', sortable: true },
    { key: 'action', label: 'Order Type', sortable: true },
    { key: 'price', label: 'Price', sortable: true }
  ]);
  grid.setRows([
    { id: 1, action: 'SELL', price: 100 },
    { id: 2, action: 'BUY', price: 200 },
    { id: 3, action: 'SELL', price: 300 },
    { id: 4, action: 'BUY', price: 400 }
  ]);

  // Click Order Type header to sort 'action' ascending
  const actionTh = grid.querySelector('th[data-col-key="action"]');
  actionTh.click();
  assert.strictEqual(grid._sortKey, 'action', 'Sorting action column sets _sortKey to action');
  assert.strictEqual(grid._sortDir, 'asc', 'First click sets direction to asc');
  assert.strictEqual(actionTh.getAttribute('aria-sort'), 'ascending', 'Header aria-sort is ascending');
  assert.strictEqual(actionTh.querySelector('.grid-sort-icon').textContent, '▲', 'Header icon shows ascending arrow');
  assert.deepStrictEqual(grid._filteredRows.map(r => r.action), ['BUY', 'BUY', 'SELL', 'SELL'], 'Rows sorted with BUY before SELL');
  assert(window.location.search.includes('grid_sortKey=action') && window.location.search.includes('grid_sortDir=asc'), 'URL search params contain grid_sortKey=action and grid_sortDir=asc');

  // Simulate refresh: create a new grid with URL containing ?grid_sortKey=action&grid_sortDir=asc
  const reloadGrid = document.createElement('ui-data-grid');
  reloadGrid.id = 'demo-data-grid';
  reloadGrid.setAttribute('data-persist-id', 'grid');
  reloadGrid.setAttribute('persist', 'url');
  document.body.appendChild(reloadGrid);
  reloadGrid.setColumns([
    { key: 'id', label: 'ID', sortable: true },
    { key: 'action', label: 'Order Type', sortable: true }
  ]);
  reloadGrid.setRows([
    { id: 1, action: 'SELL' },
    { id: 2, action: 'BUY' },
    { id: 3, action: 'SELL' },
    { id: 4, action: 'BUY' }
  ]);

  assert.strictEqual(reloadGrid._sortKey, 'action', 'On page reload, _sortKey is restored from URL');
  assert.strictEqual(reloadGrid._sortDir, 'asc', 'On page reload, _sortDir is restored from URL');
  const reloadedActionTh = reloadGrid.querySelector('th[data-col-key="action"]');
  assert.strictEqual(reloadedActionTh.getAttribute('aria-sort'), 'ascending', 'Reloaded header retains aria-sort=ascending');
  assert.strictEqual(reloadedActionTh.querySelector('.grid-sort-icon').textContent, '▲', 'Reloaded header retains ▲ icon');
  assert.deepStrictEqual(reloadGrid._filteredRows.map(r => r.action), ['BUY', 'BUY', 'SELL', 'SELL'], 'Reloaded rows remain sorted by action');

  document.body.removeChild(reloadGrid);
  document.body.removeChild(grid);
  console.log('    ✓ <ui-data-grid persist="url"> auto-hydrated and synchronized with URL (search & column sorting)');
}

// =========================================================================
// TEST 3: Cross-Tab State Synchronization Simulation via BroadcastChannel
// =========================================================================
console.log('  Testing Cross-Tab Synchronization on <ui-stepper sync>...');
{
  // Tab A Stepper
  const stepperA = document.createElement('ui-stepper');
  stepperA.id = 'checkout-wizard';
  stepperA.setAttribute('sync', '');
  stepperA.innerHTML = `
    <ol data-part="steplist">
      <li data-part="step" data-step="1">Step 1</li>
      <li data-part="step" data-step="2">Step 2</li>
      <li data-part="step" data-step="3">Step 3</li>
    </ol>
    <div data-part="panel" data-step="1">Panel 1</div>
    <div data-part="panel" data-step="2">Panel 2</div>
    <div data-part="panel" data-step="3">Panel 3</div>
  `;
  document.body.appendChild(stepperA);
  stepperA.init();

  // Tab B Stepper (same ID in second tab)
  const stepperB = document.createElement('ui-stepper');
  stepperB.id = 'checkout-wizard';
  stepperB.setAttribute('sync', '');
  stepperB.innerHTML = `
    <ol data-part="steplist">
      <li data-part="step" data-step="1">Step 1</li>
      <li data-part="step" data-step="2">Step 2</li>
      <li data-part="step" data-step="3">Step 3</li>
    </ol>
    <div data-part="panel" data-step="1">Panel 1</div>
    <div data-part="panel" data-step="2">Panel 2</div>
    <div data-part="panel" data-step="3">Panel 3</div>
  `;
  document.body.appendChild(stepperB);
  stepperB.init();

  assert.strictEqual(stepperA.activeStep, 1);
  assert.strictEqual(stepperB.activeStep, 1);

  // Tab A progresses to Step 2
  stepperA.goToStep(2);
  assert.strictEqual(stepperA.activeStep, 2);

  // BroadcastChannel should have synchronized Tab B to Step 2
  assert.strictEqual(stepperB.activeStep, 2, 'Tab B stepper synchronized to Step 2 via BroadcastChannel');

  document.body.removeChild(stepperA);
  document.body.removeChild(stepperB);
  console.log('    ✓ Cross-tab state synchronization verified across simulated tabs');
}

// =========================================================================
// TEST 4: Draft Autosave on <ui-ai-prompt-box persist="local">
// =========================================================================
console.log('  Testing Draft Persistence on <ui-ai-prompt-box persist="local">...');
{
  const promptBox = document.createElement('ui-ai-prompt-box');
  promptBox.id = 'copilot-draft';
  promptBox.setAttribute('persist', 'local');
  document.body.appendChild(promptBox);
  promptBox.init();

  promptBox.value = 'Refactor the data grid virtualization engine';
  promptBox._persistState();

  const saved = JSON.parse(window.localStorage.getItem('nnui_persist_copilot-draft'));
  assert(saved, 'Draft must be saved in localStorage');
  assert.strictEqual(saved.draft, 'Refactor the data grid virtualization engine');

  // Submit clears draft
  promptBox.submit();
  const cleared = JSON.parse(window.localStorage.getItem('nnui_persist_copilot-draft'));
  assert.strictEqual(cleared.draft, '', 'Submitting prompt clears persisted draft');

  document.body.removeChild(promptBox);
  console.log('    ✓ <ui-ai-prompt-box persist="local"> draft persistence and cleanup verified');
}

// =========================================================================
// TEST 5: Date Range Picker Persistence & Introspection
// =========================================================================
console.log('  Testing <ui-date-range-picker persist="local">...');
{
  const picker = document.createElement('ui-date-range-picker');
  picker.id = 'travel-picker';
  picker.setAttribute('persist', 'local');
  document.body.appendChild(picker);
  picker.init();

  picker.startDate = new Date(2026, 11, 10); // Dec 10, 2026
  picker.endDate = new Date(2026, 11, 25);   // Dec 25, 2026
  picker._persistState();

  const saved = JSON.parse(window.localStorage.getItem('nnui_persist_travel-picker'));
  assert(saved, 'Date range must be saved to localStorage');
  assert.strictEqual(saved.start, '2026-12-10');
  assert.strictEqual(saved.end, '2026-12-25');

  const inspection = picker.inspectAI();
  assert.strictEqual(inspection.liveState.startDate, '2026-12-10');
  assert.strictEqual(inspection.liveState.endDate, '2026-12-25');

  document.body.removeChild(picker);
  console.log('    ✓ <ui-date-range-picker> persistence and inspectAI() verified');
}

console.log('\n🎉 ALL CROWN CHAMPION FEATURE TESTS PASSED SUCCESSFULLY!\n');
