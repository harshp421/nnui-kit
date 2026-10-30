/**
 * Craft Components Test Suite (<ui-sparkline>, <ui-dock>, <ui-timeline>)
 * 
 * Verifies:
 * 1. Zero Shadow DOM invariant (attachShadow throws)
 * 2. React 19 getter/setter property reflection
 * 3. DOM generation and SVG path calculations
 * 4. WAI-ARIA roles and keyboard navigation
 * 5. CustomEvent dispatches: hoverpoint, select, stepclick
 * 6. Element inspectAI() machine-readable protocol
 */

import { GlobalWindow } from 'happy-dom';
import assert from 'node:assert';

// Setup mock DOM environment
const window = new GlobalWindow();
globalThis.window = window;
globalThis.document = window.document;
globalThis.HTMLElement = window.HTMLElement;
globalThis.customElements = window.customElements;
globalThis.CustomEvent = window.CustomEvent;
globalThis.Event = window.Event;
globalThis.requestAnimationFrame = (fn) => setTimeout(fn, 0);
globalThis.cancelAnimationFrame = (id) => clearTimeout(id);

const { UiSparkline } = await import('../src/components/sparkline/ui-sparkline.js');
const { UiDock } = await import('../src/components/dock/ui-dock.js');
const { UiTimeline } = await import('../src/components/timeline/ui-timeline.js');

customElements.define('ui-sparkline', UiSparkline);
customElements.define('ui-dock', UiDock);
customElements.define('ui-timeline', UiTimeline);

// -----------------------------------------------------------------------------
// 1. Sparkline Verification
// -----------------------------------------------------------------------------
console.log('  Testing <ui-sparkline>...');
{
  const spark = document.createElement('ui-sparkline');
  assert(spark instanceof UiSparkline, 'Should instantiate UiSparkline');

  // Invariant: Zero Shadow DOM
  assert.throws(() => spark.attachShadow({ mode: 'open' }), /Shadow DOM is forbidden/);

  // React 19 property setters
  spark.data = [10, 25, 18, 35, 42];
  spark.color = 'var(--ui-color-accent-400)';
  spark.strokeWidth = 3;
  spark.fill = 'gradient';
  spark.hoverable = true;

  document.body.appendChild(spark);
  spark.init();

  assert.strictEqual(spark.getAttribute('role'), 'img');
  assert.strictEqual(spark.getAttribute('data-ui'), 'sparkline');
  assert(spark.querySelector('svg'), 'Should generate SVG container');
  assert(spark.querySelector('[data-part="line"]'), 'Should generate line path');
  assert(spark.querySelector('[data-part="area"]'), 'Should generate area gradient path');

  // Verify inspectAI()
  const ai = spark.inspectAI();
  assert.strictEqual(ai.protocol, 'nnui.ai.v1');
  assert.strictEqual(ai.liveState.pointsCount, 5);

  // Event dispatch test
  let hovered = null;
  spark.addEventListener('hoverpoint', (e) => {
    hovered = e.detail;
  });
  spark._onMouseMove({ clientX: 50, clientY: 20 });
  assert(hovered !== null, 'Should dispatch hoverpoint event');
  assert(typeof hovered.index === 'number', 'Event detail should include index');

  spark.remove();
  console.log('    ✓ <ui-sparkline> verified (SVG path, gradient area, hoverpoint event, inspectAI)');
}

// -----------------------------------------------------------------------------
// 2. Dock Verification
// -----------------------------------------------------------------------------
console.log('  Testing <ui-dock>...');
{
  const dock = document.createElement('ui-dock');
  assert(dock instanceof UiDock, 'Should instantiate UiDock');

  // Invariant: Zero Shadow DOM
  assert.throws(() => dock.attachShadow({ mode: 'open' }), /Shadow DOM is forbidden/);

  dock.innerHTML = `
    <button data-part="item" aria-label="Dashboard" data-value="dash">📊</button>
    <button data-part="item" aria-label="Messages" data-value="msg">💬</button>
    <button data-part="item" aria-label="Settings" data-value="sett">⚙️</button>
  `;

  // React 19 property setters
  dock.distance = 160;
  dock.maxScale = 1.5;
  dock.position = 'bottom';

  document.body.appendChild(dock);
  dock.init();

  assert.strictEqual(dock.getAttribute('role'), 'toolbar');
  assert.strictEqual(dock.getAttribute('data-ui'), 'dock');

  const items = dock.querySelectorAll('[data-part="item"]');
  assert.strictEqual(items.length, 3, 'Should detect 3 items');
  assert.strictEqual(items[0].getAttribute('tabindex'), '0', 'First item should have roving tabindex 0');
  assert.strictEqual(items[1].getAttribute('tabindex'), '-1', 'Second item should have tabindex -1');
  assert(items[0].querySelector('[data-part="tooltip"]'), 'Should auto-scaffold tooltip from aria-label');

  // Event dispatch test
  let selected = null;
  dock.addEventListener('select', (e) => {
    selected = e.detail;
  });
  items[1].click();
  assert(selected !== null, 'Clicking item should dispatch select event');
  assert.strictEqual(selected.value, 'msg', 'Selected value should match item data-value');

  // Verify inspectAI()
  const ai = dock.inspectAI();
  assert.strictEqual(ai.liveState.itemsCount, 3);
  assert.strictEqual(ai.liveState.maxScale, 1.5);

  dock.remove();
  console.log('    ✓ <ui-dock> verified (items scaffolding, roving tabindex, select event, inspectAI)');
}

// -----------------------------------------------------------------------------
// 3. Timeline Verification
// -----------------------------------------------------------------------------
console.log('  Testing <ui-timeline>...');
{
  const timeline = document.createElement('ui-timeline');
  assert(timeline instanceof UiTimeline, 'Should instantiate UiTimeline');

  // Invariant: Zero Shadow DOM
  assert.throws(() => timeline.attachShadow({ mode: 'open' }), /Shadow DOM is forbidden/);

  timeline.innerHTML = `
    <div data-part="item">
      <div data-part="content"><h5 data-part="title">Stage 1</h5></div>
    </div>
    <div data-part="item">
      <div data-part="content"><h5 data-part="title">Stage 2</h5></div>
    </div>
    <div data-part="item">
      <div data-part="content"><h5 data-part="title">Stage 3</h5></div>
    </div>
  `;

  // React 19 property setters
  timeline.orientation = 'vertical';
  timeline.activeStep = 1;

  document.body.appendChild(timeline);
  timeline.init();

  assert.strictEqual(timeline.getAttribute('role'), 'list');
  assert.strictEqual(timeline.getAttribute('data-ui'), 'timeline');

  const items = timeline.querySelectorAll('[data-part="item"]');
  assert.strictEqual(items.length, 3, 'Should have 3 timeline items');
  assert.strictEqual(items[0].getAttribute('data-status'), 'completed', 'Step 0 should be completed');
  assert.strictEqual(items[1].getAttribute('data-status'), 'active', 'Step 1 should be active');
  assert.strictEqual(items[2].getAttribute('data-status'), 'pending', 'Step 2 should be pending');

  assert(items[0].querySelector('[data-part="marker"]'), 'Should auto-scaffold marker');
  assert(items[0].querySelector('[data-part="connector"]'), 'Should auto-scaffold connector line');

  // Event dispatch test
  let clicked = null;
  timeline.addEventListener('stepclick', (e) => {
    clicked = e.detail;
  });
  items[0].click();
  assert(clicked !== null, 'Clicking step should dispatch stepclick event');
  assert.strictEqual(clicked.index, 0);
  assert.strictEqual(clicked.status, 'completed');

  // Verify inspectAI()
  const ai = timeline.inspectAI();
  assert.strictEqual(ai.liveState.activeStep, 1);
  assert.strictEqual(ai.liveState.itemsCount, 3);

  timeline.remove();
  console.log('    ✓ <ui-timeline> verified (status syncing, connector lines, stepclick event, inspectAI)');
}

console.log('🎉 ALL CRAFT COMPONENTS (SPARKLINE, DOCK, TIMELINE) PASSED SUCCESSFULLY!\n');
