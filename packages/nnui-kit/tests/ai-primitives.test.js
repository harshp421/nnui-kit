/**
 * Automated Verification Suite for Phase 2: Agentic AI UI Primitives
 * Tests <ui-ai-reasoning>, <ui-ai-tool-call>, and <ui-ai-approval>
 */

import { GlobalWindow } from 'happy-dom';

const window = new GlobalWindow();
globalThis.window = window;
globalThis.document = window.document;
globalThis.HTMLElement = window.HTMLElement;
globalThis.customElements = window.customElements;
globalThis.CustomEvent = window.CustomEvent;
globalThis.Event = window.Event;
globalThis.requestAnimationFrame = (fn) => setTimeout(fn, 16);
globalThis.cancelAnimationFrame = (id) => clearTimeout(id);

import assert from 'node:assert';

const { UiAiReasoning } = await import('../src/components/ai-reasoning/ui-ai-reasoning.js');
const { UiAiToolCall } = await import('../src/components/ai-tool-call/ui-ai-tool-call.js');
const { UiAiApproval } = await import('../src/components/ai-approval/ui-ai-approval.js');
const { UiAiPromptBox } = await import('../src/components/ai-prompt-box/ui-ai-prompt-box.js');

if (!customElements.get('ui-ai-reasoning')) {
  customElements.define('ui-ai-reasoning', UiAiReasoning);
}
if (!customElements.get('ui-ai-tool-call')) {
  customElements.define('ui-ai-tool-call', UiAiToolCall);
}
if (!customElements.get('ui-ai-approval')) {
  customElements.define('ui-ai-approval', UiAiApproval);
}
if (!customElements.get('ui-ai-prompt-box')) {
  customElements.define('ui-ai-prompt-box', UiAiPromptBox);
}

console.log('Testing Phase 2: Agentic AI UI Primitives Suite...\n');

// =========================================================================
// TEST 1: <ui-ai-reasoning>
// =========================================================================
console.log('  Testing <ui-ai-reasoning>...');
{
  const reasoning = document.createElement('ui-ai-reasoning');
  reasoning.setAttribute('status', 'thinking');
  reasoning.innerHTML = `
    <div data-part="stream">
      Analyzing customer query and extracting order metadata from context...
    </div>
  `;
  document.body.appendChild(reasoning);

  // Scaffolding check
  const header = reasoning.querySelector('[data-part="header"]');
  assert(header, 'Header must be scaffolded');
  const beacon = reasoning.querySelector('[data-part="beacon"]');
  assert(beacon, 'Beacon must be scaffolded');
  const summary = reasoning.querySelector('[data-part="summary"]');
  assert(summary, 'Summary text must be scaffolded');
  const copyBtn = reasoning.querySelector('[data-part="copy"]');
  assert(copyBtn, 'Copy button must be scaffolded');
  const toggleBtn = reasoning.querySelector('[data-part="toggle"]');
  assert(toggleBtn, 'Toggle button must be scaffolded');

  assert.strictEqual(reasoning.status, 'thinking', 'Default status must be thinking');
  assert(summary.textContent.includes('Thinking'), 'Summary must show Thinking while in progress');

  // Open disclosure test
  assert.strictEqual(reasoning.open, false, 'Default open state is false');
  reasoning.open = true;
  assert.strictEqual(reasoning.open, true, 'open getter must return true');
  assert.strictEqual(header.getAttribute('aria-expanded'), 'true', 'aria-expanded must be true');

  // Toggle event
  let toggled = false;
  reasoning.addEventListener('toggle', (e) => {
    toggled = true;
    assert.strictEqual(typeof e.detail.open, 'boolean');
  });
  header.click();
  assert(toggled, 'Clicking header must toggle and emit toggle event');

  // Done transition and auto-collapse test
  reasoning.autoCollapse = true;
  reasoning.open = true;
  reasoning.status = 'done';
  assert.strictEqual(reasoning.status, 'done', 'Status must transition to done');
  assert.strictEqual(reasoning.open, false, 'Auto-collapse must fold drawer on done');
  assert(summary.textContent.includes('Thought for'), 'Summary must show Thought for on completion');

  // AI Introspection protocol
  const aiState = reasoning.inspectAI();
  assert(aiState, 'inspectAI() must return introspection object');
  assert.strictEqual(aiState.tag, 'ui-ai-reasoning');
  assert.strictEqual(aiState.liveState.status, 'done');
  assert(aiState.liveState.streamContentLength > 0, 'Stream content length must be tracked');

  // Auto-scroll verification
  assert.strictEqual(reasoning.autoScroll, true, 'Default autoScroll must be true');
  reasoning.autoScroll = false;
  assert.strictEqual(reasoning.autoScroll, false, 'autoScroll setter must toggle');
  assert.strictEqual(typeof reasoning.scrollToBottom, 'function', 'scrollToBottom method must exist');
  reasoning.scrollToBottom();

  document.body.removeChild(reasoning);
  console.log('    ✓ <ui-ai-reasoning> passed (timer, auto-collapse, disclosure, inspectAI)');
}

// =========================================================================
// TEST 2: <ui-ai-tool-call>
// =========================================================================
console.log('  Testing <ui-ai-tool-call>...');
{
  const tool = document.createElement('ui-ai-tool-call');
  tool.setAttribute('name', 'run_command');
  tool.setAttribute('status', 'running');
  tool.setAttribute('latency', '142ms');
  tool.innerHTML = `
    <div data-part="inspector">
      <div data-part="args">{"command": "npm test"}</div>
      <div data-part="output">✓ 14 suites passed</div>
    </div>
  `;
  document.body.appendChild(tool);

  // Scaffolding check
  const header = tool.querySelector('[data-part="header"]');
  assert(header, 'Header must be scaffolded');
  const nameEl = tool.querySelector('[data-part="name"]');
  assert.strictEqual(nameEl.textContent, 'run_command', 'Tool name must render');
  const statusBadge = tool.querySelector('[data-part="status-badge"]');
  assert(statusBadge, 'Status badge must render');
  const latencyBadge = tool.querySelector('[data-part="latency"]');
  assert.strictEqual(latencyBadge.textContent, '142ms', 'Latency must display');

  // Status transitions
  tool.status = 'success';
  assert.strictEqual(tool.status, 'success');
  assert(statusBadge.textContent.includes('Success'), 'Status badge must show Success');

  tool.status = 'error';
  assert.strictEqual(tool.status, 'error');
  assert(statusBadge.textContent.includes('Failed'), 'Status badge must show Failed');

  tool.status = 'approval-required';
  assert.strictEqual(tool.status, 'approval-required');
  assert(statusBadge.textContent.includes('Approval Required'), 'Status badge must show Approval Required');

  // Retry event
  let retried = false;
  tool.addEventListener('retry', (e) => {
    retried = true;
    assert.strictEqual(e.detail.name, 'run_command');
  });

  const retryBtn = tool.querySelector('[data-part="retry"]');
  assert(retryBtn, 'Retry button must exist');
  retryBtn.click();
  assert(retried, 'Clicking retry must dispatch retry CustomEvent');
  assert.strictEqual(tool.status, 'running', 'Clicking retry must set status to running');

  // AI Introspection protocol
  const aiState = tool.inspectAI();
  assert(aiState, 'inspectAI() must return introspection object');
  assert.strictEqual(aiState.tag, 'ui-ai-tool-call');
  assert.strictEqual(aiState.liveState.name, 'run_command');

  document.body.removeChild(tool);
  console.log('    ✓ <ui-ai-tool-call> passed (status badges, latency, retry trigger, inspectAI)');
}

// =========================================================================
// TEST 3: <ui-ai-approval>
// =========================================================================
console.log('  Testing <ui-ai-approval>...');
{
  const approval = document.createElement('ui-ai-approval');
  approval.setAttribute('severity', 'critical');
  approval.setAttribute('action-name', 'Drop production database');
  approval.innerHTML = `
    <div data-part="payload">
      DROP TABLE users CASCADE;
    </div>
  `;
  document.body.appendChild(approval);

  // Scaffolding check
  const header = approval.querySelector('[data-part="header"]');
  assert(header, 'Header must be scaffolded');
  const title = approval.querySelector('[data-part="title"]');
  assert.strictEqual(title.textContent, 'Drop production database', 'Title must match action name');
  const severityBadge = approval.querySelector('[data-part="severity-badge"]');
  assert.strictEqual(severityBadge.textContent, 'Critical Risk', 'Critical severity must be rendered');
  const actions = approval.querySelector('[data-part="actions"]');
  assert(actions, 'Actions bar must be scaffolded');

  assert.strictEqual(approval.status, 'pending', 'Initial status must be pending');

  // Approve action
  let approved = false;
  approval.addEventListener('approve', (e) => {
    approved = true;
    assert.strictEqual(e.detail.action, 'Drop production database');
    assert.strictEqual(e.detail.severity, 'critical');
  });

  const approveBtn = approval.querySelector('[data-part="approve"]');
  assert(approveBtn, 'Approve button must exist');
  approveBtn.click();

  assert(approved, 'Clicking approve must emit approve CustomEvent');
  assert.strictEqual(approval.status, 'approved', 'Status must transition to approved');
  assert.strictEqual(actions.style.display, 'none', 'Action buttons must hide once settled');

  const auditBadge = approval.querySelector('[data-part="audit-badge"]');
  assert(auditBadge, 'Audit badge must appear');
  assert(auditBadge.textContent.includes('Approved by User'));

  // Reject action on second element
  const approval2 = document.createElement('ui-ai-approval');
  approval2.setAttribute('severity', 'warning');
  approval2.setAttribute('action-name', 'Delete unindexed logs');
  document.body.appendChild(approval2);

  let rejected = false;
  approval2.addEventListener('reject', (e) => {
    rejected = true;
    assert.strictEqual(e.detail.action, 'Delete unindexed logs');
  });

  approval2.reject('Safety check failed');
  assert(rejected, 'Calling reject() must emit reject CustomEvent');
  assert.strictEqual(approval2.status, 'rejected', 'Status must transition to rejected');

  // AI Introspection protocol
  const aiState2 = approval2.inspectAI();
  assert(aiState2, 'inspectAI() must return introspection object');
  assert.strictEqual(aiState2.tag, 'ui-ai-approval');
  assert.strictEqual(aiState2.liveState.status, 'rejected');

  document.body.removeChild(approval);
  document.body.removeChild(approval2);

  // Hotkey isolation test: ensure typing 'a' or 'r' inside child input does NOT trigger approve/reject
  const approvalIsolation = document.createElement('ui-ai-approval');
  approvalIsolation.innerHTML = `
    <div data-part="payload">
      <input type="text" id="test-reason-input" value="" />
    </div>
  `;
  document.body.appendChild(approvalIsolation);
  const inputChild = approvalIsolation.querySelector('#test-reason-input');

  let isolatedApproved = false;
  approvalIsolation.addEventListener('approve', () => { isolatedApproved = true; });

  // Simulate typing 'a' in input child
  const keyEventInInput = new window.KeyboardEvent('keydown', { key: 'a', bubbles: true, cancelable: true });
  Object.defineProperty(keyEventInInput, 'target', { value: inputChild });
  inputChild.dispatchEvent(keyEventInInput);
  assert.strictEqual(isolatedApproved, false, 'Typing "a" in child input must NOT approve action');

  // Simulate Ctrl+A (Select All)
  const ctrlAEvent = new window.KeyboardEvent('keydown', { key: 'a', ctrlKey: true, bubbles: true, cancelable: true });
  approvalIsolation.dispatchEvent(ctrlAEvent);
  assert.strictEqual(isolatedApproved, false, 'Pressing Ctrl+A must NOT approve action');

  // Simulate direct hotkey 'a' on container
  const validHotkeyEvent = new window.KeyboardEvent('keydown', { key: 'a', bubbles: true, cancelable: true });
  approvalIsolation.dispatchEvent(validHotkeyEvent);
  assert.strictEqual(isolatedApproved, true, 'Direct hotkey "a" on container must approve action');
  assert.strictEqual(approvalIsolation.status, 'approved');

  document.body.removeChild(approvalIsolation);

  console.log('    ✓ <ui-ai-approval> passed (risk severity, approve/reject lifecycle, hotkey isolation, audit badge, inspectAI)');
}

// =========================================================================
// TEST 4: <ui-ai-prompt-box> (IME, Multimodal paste/drop)
// =========================================================================
console.log('  Testing <ui-ai-prompt-box>...');
{
  const promptBox = document.createElement('ui-ai-prompt-box');
  document.body.appendChild(promptBox);
  promptBox.init();

  const textarea = promptBox.querySelector('textarea');
  assert(textarea, 'Textarea must be scaffolded');

  // IME composition test
  let submitted = false;
  promptBox.addEventListener('submit', () => { submitted = true; });

  promptBox.value = 'nihao';
  const imeEnter = new window.KeyboardEvent('keydown', { key: 'Enter', isComposing: true, bubbles: true, cancelable: true });
  textarea.dispatchEvent(imeEnter);
  assert.strictEqual(submitted, false, 'IME Enter must NOT submit prompt');

  // Standard Enter test
  const standardEnter = new window.KeyboardEvent('keydown', { key: 'Enter', isComposing: false, bubbles: true, cancelable: true });
  textarea.dispatchEvent(standardEnter);
  assert.strictEqual(submitted, true, 'Standard Enter must submit prompt');

  // Multimodal File Paste test
  let pastedFiles = null;
  promptBox.addEventListener('filepaste', (e) => {
    pastedFiles = e.detail.files;
  });

  const fakeFile = { name: 'screenshot.png', type: 'image/png', size: 1024 };
  const pasteEvent = new window.Event('paste', { bubbles: true, cancelable: true });
  pasteEvent.clipboardData = { files: [fakeFile], items: [] };
  textarea.dispatchEvent(pasteEvent);

  assert(pastedFiles, 'Pasting files must dispatch filepaste event');
  assert.strictEqual(pastedFiles.length, 1);
  assert.strictEqual(pastedFiles[0].name, 'screenshot.png');

  // Drag & Drop test
  const dragoverEvent = new window.Event('dragover', { bubbles: true, cancelable: true });
  promptBox.dispatchEvent(dragoverEvent);
  assert(promptBox.hasAttribute('data-dragover'), 'dragover must set data-dragover');

  let droppedFiles = null;
  promptBox.addEventListener('filedrop', (e) => {
    droppedFiles = e.detail.files;
  });

  const dropEvent = new window.Event('drop', { bubbles: true, cancelable: true });
  dropEvent.dataTransfer = { files: [fakeFile] };
  promptBox.dispatchEvent(dropEvent);
  assert(!promptBox.hasAttribute('data-dragover'), 'drop must clear data-dragover');
  assert(droppedFiles, 'drop must dispatch filedrop event');
  assert.strictEqual(droppedFiles[0].name, 'screenshot.png');

  document.body.removeChild(promptBox);
  console.log('    ✓ <ui-ai-prompt-box> passed (IME guard, standard Enter, filepaste, filedrop)');
}

console.log('\n🎉 ALL AGENTIC AI UI PRIMITIVES PASSED SUCCESSFULLY!\n');
