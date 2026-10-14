import { GlobalWindow } from 'happy-dom';
import assert from 'node:assert';

// Setup mock browser environment
const window = new GlobalWindow();
globalThis.window = window;
globalThis.document = window.document;
globalThis.HTMLElement = window.HTMLElement;
globalThis.customElements = window.customElements;
globalThis.CustomEvent = window.CustomEvent;
globalThis.Event = window.Event;
globalThis.KeyboardEvent = window.KeyboardEvent;
globalThis.requestAnimationFrame = (fn) => setTimeout(fn, 0);

// Import components
const { UiSegmentedControl } = await import('../src/components/segmented-control/ui-segmented-control.js');
const { UiOtpInput } = await import('../src/components/otp-input/ui-otp-input.js');
const { UiStepper } = await import('../src/components/stepper/ui-stepper.js');
const { UiResizable } = await import('../src/components/resizable/ui-resizable.js');
const { UiFileUpload } = await import('../src/components/file-upload/ui-file-upload.js');
const { UiContextMenu } = await import('../src/components/context-menu/ui-context-menu.js');
const { UiNavigationMenu } = await import('../src/components/navigation-menu/ui-navigation-menu.js');
const { UiTreeView } = await import('../src/components/tree-view/ui-tree-view.js');
const { UiAiPromptBox } = await import('../src/components/ai-prompt-box/ui-ai-prompt-box.js');
const { UiColorPicker } = await import('../src/components/color-picker/ui-color-picker.js');

// Register components
const components = {
  'ui-segmented-control': UiSegmentedControl,
  'ui-otp-input': UiOtpInput,
  'ui-stepper': UiStepper,
  'ui-resizable': UiResizable,
  'ui-file-upload': UiFileUpload,
  'ui-context-menu': UiContextMenu,
  'ui-navigation-menu': UiNavigationMenu,
  'ui-tree-view': UiTreeView,
  'ui-ai-prompt-box': UiAiPromptBox,
  'ui-color-picker': UiColorPicker,
};

for (const [tag, cls] of Object.entries(components)) {
  if (!customElements.get(tag)) {
    customElements.define(tag, cls);
  }
}

console.log('Testing Track 4: Functional Verification of 10 New Platform-Native Components...');

// =========================================================================
// TEST 1: <ui-segmented-control>
// =========================================================================
console.log('  Testing <ui-segmented-control>...');
{
  const el = document.createElement('ui-segmented-control');
  el.innerHTML = `
    <button data-part="segment" data-value="daily">Daily</button>
    <button data-part="segment" data-value="weekly">Weekly</button>
    <button data-part="segment" data-value="monthly">Monthly</button>
  `;
  document.body.appendChild(el);
  el.init();

  assert.strictEqual(el.value, 'daily', 'Defaults to first segment');
  const segments = el.querySelectorAll('[data-part="segment"]');
  assert.strictEqual(segments[0].getAttribute('data-state'), 'checked');
  assert.strictEqual(segments[1].getAttribute('data-state'), 'unchecked');

  // Change selection
  let changedVal = '';
  el.addEventListener('change', (e) => { changedVal = e.detail.value; });
  segments[1].click();

  assert.strictEqual(el.value, 'weekly');
  assert.strictEqual(changedVal, 'weekly');
  assert.strictEqual(segments[1].getAttribute('data-state'), 'checked');
  assert.strictEqual(segments[0].getAttribute('data-state'), 'unchecked');

  document.body.removeChild(el);
  console.log('    ✓ <ui-segmented-control> passed!');
}

// =========================================================================
// TEST 2: <ui-otp-input>
// =========================================================================
console.log('  Testing <ui-otp-input>...');
{
  const el = document.createElement('ui-otp-input');
  el.setAttribute('length', '4');
  document.body.appendChild(el);
  el.init();

  const slots = el.querySelectorAll('[data-part="slot"]');
  assert.strictEqual(slots.length, 4, 'Generates 4 slots');

  let completionEvent = null;
  el.addEventListener('change', (e) => { completionEvent = e.detail; });

  // Simulate typing digits into slots
  slots[0].value = '1';
  slots[0].dispatchEvent(new Event('input', { bubbles: true }));
  slots[1].value = '2';
  slots[1].dispatchEvent(new Event('input', { bubbles: true }));
  slots[2].value = '3';
  slots[2].dispatchEvent(new Event('input', { bubbles: true }));
  slots[3].value = '4';
  slots[3].dispatchEvent(new Event('input', { bubbles: true }));

  assert.strictEqual(el.value, '1234');
  assert.strictEqual(el.isComplete, true);
  assert.notStrictEqual(completionEvent, null);
  assert.strictEqual(completionEvent.value, '1234');

  el.clear();
  assert.strictEqual(el.value, '');
  assert.strictEqual(el.isComplete, false);

  document.body.removeChild(el);
  console.log('    ✓ <ui-otp-input> passed!');
}

// =========================================================================
// TEST 3: <ui-stepper>
// =========================================================================
console.log('  Testing <ui-stepper>...');
{
  const el = document.createElement('ui-stepper');
  el.innerHTML = `
    <ol data-part="steplist">
      <li data-part="step" data-step="1">Step 1</li>
      <li data-part="step" data-step="2">Step 2</li>
      <li data-part="step" data-step="3">Step 3</li>
    </ol>
    <div data-part="panel" data-step="1">Content 1</div>
    <div data-part="panel" data-step="2">Content 2</div>
    <div data-part="panel" data-step="3">Content 3</div>
  `;
  document.body.appendChild(el);
  el.init();

  assert.strictEqual(el.activeStep, 1);
  const steps = el.querySelectorAll('[data-part="step"]');
  const panels = el.querySelectorAll('[data-part="panel"]');

  assert.strictEqual(steps[0].getAttribute('data-state'), 'current');
  assert.strictEqual(steps[1].getAttribute('data-state'), 'upcoming');
  assert.strictEqual(panels[0].getAttribute('data-state'), 'active');
  assert.strictEqual(panels[1].getAttribute('data-state'), 'inactive');

  // Advance step
  el.next();
  assert.strictEqual(el.activeStep, 2);
  assert.strictEqual(steps[0].getAttribute('data-state'), 'completed');
  assert.strictEqual(steps[1].getAttribute('data-state'), 'current');
  assert.strictEqual(panels[1].getAttribute('data-state'), 'active');
  assert.strictEqual(panels[0].getAttribute('data-state'), 'inactive');

  el.prev();
  assert.strictEqual(el.activeStep, 1);

  document.body.removeChild(el);
  console.log('    ✓ <ui-stepper> passed!');
}

// =========================================================================
// TEST 4: <ui-resizable>
// =========================================================================
console.log('  Testing <ui-resizable>...');
{
  const el = document.createElement('ui-resizable');
  el.innerHTML = `
    <div data-part="panel" data-size="30">Left</div>
    <div data-part="handle"></div>
    <div data-part="panel" data-size="70">Right</div>
  `;
  document.body.appendChild(el);
  el.init();

  const sizes = el.getSizes();
  assert.strictEqual(Math.round(sizes[0]), 30);
  assert.strictEqual(Math.round(sizes[1]), 70);

  const handle = el.querySelector('[data-part="handle"]');
  assert.strictEqual(handle.getAttribute('role'), 'separator');

  document.body.removeChild(el);
  console.log('    ✓ <ui-resizable> passed!');
}

// =========================================================================
// TEST 5: <ui-file-upload>
// =========================================================================
console.log('  Testing <ui-file-upload>...');
{
  const el = document.createElement('ui-file-upload');
  el.setAttribute('accept', 'image/*,.pdf');
  el.innerHTML = `
    <div data-part="dropzone">Drop here</div>
    <ul data-part="file-list"></ul>
  `;
  document.body.appendChild(el);
  el.init();

  const dropzone = el.querySelector('[data-part="dropzone"]');
  dropzone.dispatchEvent(new Event('dragenter', { bubbles: true }));
  assert.strictEqual(dropzone.getAttribute('data-dragging'), 'true');

  dropzone.dispatchEvent(new Event('dragleave', { bubbles: true }));
  assert.strictEqual(dropzone.getAttribute('data-dragging'), null);

  document.body.removeChild(el);
  console.log('    ✓ <ui-file-upload> passed!');
}

// =========================================================================
// TEST 6: <ui-context-menu>
// =========================================================================
console.log('  Testing <ui-context-menu>...');
{
  const el = document.createElement('ui-context-menu');
  el.innerHTML = `
    <div data-part="area">Right click zone</div>
    <div data-part="menu">
      <button data-part="item" data-value="copy">Copy</button>
      <button data-part="item" data-value="delete">Delete</button>
    </div>
  `;
  document.body.appendChild(el);
  el.init();

  const menu = el.querySelector('[data-part="menu"]');
  assert.strictEqual(menu.getAttribute('role'), 'menu');
  assert.strictEqual(menu.getAttribute('data-state'), 'closed');

  el.openAt(100, 150);
  assert.strictEqual(menu.getAttribute('data-state'), 'open');

  let selectedVal = '';
  el.addEventListener('select', (e) => { selectedVal = e.detail.value; });

  const copyBtn = el.querySelector('[data-value="copy"]');
  copyBtn.click();
  assert.strictEqual(selectedVal, 'copy');
  assert.strictEqual(menu.getAttribute('data-state'), 'closed');

  document.body.removeChild(el);
  console.log('    ✓ <ui-context-menu> passed!');
}

// =========================================================================
// TEST 7: <ui-navigation-menu>
// =========================================================================
console.log('  Testing <ui-navigation-menu>...');
{
  const el = document.createElement('ui-navigation-menu');
  el.innerHTML = `
    <nav data-part="menubar">
      <div data-part="item">
        <button data-part="trigger">Products</button>
        <div data-part="content"><a href="#">Link 1</a></div>
      </div>
    </nav>
  `;
  document.body.appendChild(el);

  const trigger = el.querySelector('[data-part="trigger"]');
  const content = el.querySelector('[data-part="content"]');

  assert.strictEqual(trigger.getAttribute('role'), 'menuitem');
  assert.strictEqual(trigger.getAttribute('aria-expanded'), 'false');
  assert.strictEqual(content.getAttribute('data-state'), 'closed');

  trigger.click();
  assert.strictEqual(trigger.getAttribute('aria-expanded'), 'true');
  assert.strictEqual(content.getAttribute('data-state'), 'open');

  trigger.click();
  assert.strictEqual(trigger.getAttribute('aria-expanded'), 'false');
  assert.strictEqual(content.getAttribute('data-state'), 'closed');

  document.body.removeChild(el);
  console.log('    ✓ <ui-navigation-menu> passed!');
}

// =========================================================================
// TEST 8: <ui-tree-view>
// =========================================================================
console.log('  Testing <ui-tree-view>...');
{
  const el = document.createElement('ui-tree-view');
  el.innerHTML = `
    <ul data-part="tree">
      <li data-part="item" data-value="src">
        <span data-part="label">src</span>
        <ul data-part="group">
          <li data-part="item" data-value="index.js"><span data-part="label">index.js</span></li>
        </ul>
      </li>
    </ul>
  `;
  document.body.appendChild(el);
  el.init();

  const rootItem = el.querySelector('[data-value="src"]');
  assert.strictEqual(rootItem.getAttribute('role'), 'treeitem');
  assert.strictEqual(rootItem.getAttribute('aria-expanded'), 'false');

  el.expandItem(rootItem);
  assert.strictEqual(rootItem.getAttribute('aria-expanded'), 'true');

  el.collapseItem(rootItem);
  assert.strictEqual(rootItem.getAttribute('aria-expanded'), 'false');

  document.body.removeChild(el);
  console.log('    ✓ <ui-tree-view> passed!');
}

// =========================================================================
// TEST 9: <ui-ai-prompt-box>
// =========================================================================
console.log('  Testing <ui-ai-prompt-box>...');
{
  const el = document.createElement('ui-ai-prompt-box');
  el.innerHTML = `
    <textarea data-part="input"></textarea>
    <div data-part="toolbar">
      <button data-part="submit-btn">Send</button>
      <button data-part="stop-btn">Stop</button>
    </div>
  `;
  document.body.appendChild(el);
  el.init();

  let submittedPrompt = '';
  el.addEventListener('submit', (e) => { submittedPrompt = e.detail.prompt; });

  el.value = 'How does CSS Anchor Positioning work?';
  el.submit();

  assert.strictEqual(submittedPrompt, 'How does CSS Anchor Positioning work?');
  assert.strictEqual(el.value, '', 'Clears input on submit');

  el.loading = true;
  assert.strictEqual(el.querySelector('[data-part="submit-btn"]').style.display, 'none');
  assert.strictEqual(el.querySelector('[data-part="stop-btn"]').style.display, 'inline-flex');

  document.body.removeChild(el);
  console.log('    ✓ <ui-ai-prompt-box> passed!');
}

// =========================================================================
// TEST 10: <ui-color-picker>
// =========================================================================
console.log('  Testing <ui-color-picker>...');
{
  const el = document.createElement('ui-color-picker');
  el.setAttribute('value', '#10b981');
  el.innerHTML = `
    <div data-part="swatch"></div>
    <div data-part="popover">
      <input data-part="hex-input" />
    </div>
  `;
  document.body.appendChild(el);
  el.init();

  assert.strictEqual(el.value, '#10b981');
  const swatch = el.querySelector('[data-part="swatch"]');
  assert.strictEqual(swatch.style.backgroundColor, '#10b981');

  el.toggle();
  assert.strictEqual(el.isOpen, true);

  el.toggle();
  assert.strictEqual(el.isOpen, false);

  document.body.removeChild(el);
  console.log('    ✓ <ui-color-picker> passed!');
}

console.log('\n🎉 ALL 10 NEW COMPONENTS VERIFIED AND PASSED SUCCESSFULLY!\n');
