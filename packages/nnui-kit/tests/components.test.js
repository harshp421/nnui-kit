import { GlobalWindow } from 'happy-dom';
import assert from 'node:assert';

// 1. Setup global window environment
const window = new GlobalWindow();
globalThis.window = window;
globalThis.document = window.document;
globalThis.HTMLElement = window.HTMLElement;
globalThis.customElements = window.customElements;
globalThis.CustomEvent = window.CustomEvent;
globalThis.KeyboardEvent = window.KeyboardEvent;
globalThis.MouseEvent = window.MouseEvent;
globalThis.PointerEvent = window.PointerEvent || window.MouseEvent;
globalThis.Event = window.Event;
globalThis.requestAnimationFrame = (fn) => setTimeout(fn, 0);

// Mock CSS.supports
globalThis.CSS = {
  supports: () => false
};

// Polyfill HTMLDialogElement showModal/close if missing in happy-dom
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

// Polyfill showPopover / hidePopover
if (!window.HTMLElement.prototype.showPopover) {
  window.HTMLElement.prototype.showPopover = function() {
    this.setAttribute('data-popover-open', '');
  };
}
if (!window.HTMLElement.prototype.hidePopover) {
  window.HTMLElement.prototype.hidePopover = function() {
    this.removeAttribute('data-popover-open');
  };
}
if (!window.HTMLElement.prototype.matches) {
  window.HTMLElement.prototype.matches = function(sel) {
    return sel === ':popover-open' ? this.hasAttribute('data-popover-open') : false;
  };
}

async function render(html) {
  document.body.innerHTML = html;
  await new Promise((resolve) => queueMicrotask(resolve));
  await new Promise((resolve) => setTimeout(resolve, 10));
}

// 2. Import and register our library components directly
const { UiTabs } = await import('../src/components/tabs/ui-tabs.js');
const { UiCombobox } = await import('../src/components/combobox/ui-combobox.js');
const { UiDialog } = await import('../src/components/dialog/ui-dialog.js');
const { UiSelect } = await import('../src/components/select/ui-select.js');
const { UiAccordion } = await import('../src/components/accordion/ui-accordion.js');
const { UiPopover } = await import('../src/components/popover/ui-popover.js');
const { UiTooltip } = await import('../src/components/tooltip/ui-tooltip.js');
const { UiCommand } = await import('../src/components/command/ui-command.js');
const { UiSheet } = await import('../src/components/sheet/ui-sheet.js');
const { UiSlider } = await import('../src/components/slider/ui-slider.js');
const { UiDropdown } = await import('../src/components/dropdown/ui-dropdown.js');
const { UiToaster, toast } = await import('../src/components/toast/ui-toast.js');
const { UiDataTable } = await import('../src/components/data-table/ui-data-table.js');
const { UiCalendar } = await import('../src/components/calendar/ui-calendar.js');
const { UiDatePicker } = await import('../src/components/date-picker/ui-date-picker.js');

customElements.define('ui-tabs', UiTabs);
customElements.define('ui-combobox', UiCombobox);
customElements.define('ui-dialog', UiDialog);
customElements.define('ui-select', UiSelect);
customElements.define('ui-accordion', UiAccordion);
customElements.define('ui-popover', UiPopover);
customElements.define('ui-tooltip', UiTooltip);
customElements.define('ui-command', UiCommand);
customElements.define('ui-sheet', UiSheet);
customElements.define('ui-slider', UiSlider);
customElements.define('ui-dropdown', UiDropdown);
customElements.define('ui-toaster', UiToaster);
customElements.define('ui-data-table', UiDataTable);
customElements.define('ui-calendar', UiCalendar);
customElements.define('ui-date-picker', UiDatePicker);

console.log('Testing NNUI-KIT Components...');

// TEST 1: Dialog (<ui-dialog>)
{
  console.log('  Testing <ui-dialog>...');
  await render(`
    <ui-dialog id="test-dialog">
      <button data-part="trigger">Open</button>
      <dialog data-part="dialog">
        <button data-part="close">Close</button>
      </dialog>
    </ui-dialog>
  `);

  const uiDialog = document.querySelector('ui-dialog');
  const trigger = uiDialog.querySelector('[data-part="trigger"]');
  const dialogEl = uiDialog.querySelector('dialog');
  const closeBtn = uiDialog.querySelector('[data-part="close"]');

  assert.strictEqual(dialogEl.open, false, 'Dialog should start closed');

  // Click trigger -> opens modal
  trigger.click();
  assert.strictEqual(dialogEl.open, true, 'Dialog should be open after clicking trigger');
  assert.strictEqual(uiDialog.hasAttribute('open'), true, '<ui-dialog> should have open attribute');

  // Click close button -> closes modal
  closeBtn.click();
  assert.strictEqual(dialogEl.open, false, 'Dialog should be closed after clicking close button');
  assert.strictEqual(uiDialog.hasAttribute('open'), false, '<ui-dialog> should not have open attribute');

  console.log('  ✓ <ui-dialog> passed!');
}

// TEST 2: Accordion (<ui-accordion>)
{
  console.log('  Testing <ui-accordion>...');
  await render(`
    <ui-accordion type="single" collapsible>
      <div data-part="item" data-value="item-1">
        <button type="button" data-part="trigger">Trigger 1</button>
        <div data-part="content">Content 1</div>
      </div>
      <div data-part="item" data-value="item-2">
        <button type="button" data-part="trigger">Trigger 2</button>
        <div data-part="content">Content 2</div>
      </div>
    </ui-accordion>
  `);

  const accordion = document.querySelector('ui-accordion');
  const items = accordion.querySelectorAll('[data-part="item"]');
  const trigger1 = items[0].querySelector('[data-part="trigger"]');
  const trigger2 = items[1].querySelector('[data-part="trigger"]');
  const content1 = items[0].querySelector('[data-part="content"]');
  const content2 = items[1].querySelector('[data-part="content"]');

  assert.strictEqual(items[0].getAttribute('data-state'), 'closed', 'Item 1 should start closed');
  assert.strictEqual(content1.hasAttribute('hidden'), true, 'Content 1 should be hidden');

  // Click trigger 1 -> expands item 1
  trigger1.click();
  assert.strictEqual(items[0].getAttribute('data-state'), 'open', 'Item 1 should be open');
  assert.strictEqual(content1.hasAttribute('hidden'), false, 'Content 1 should not be hidden');

  // Click trigger 2 -> expands item 2, collapses item 1 (single mode)
  trigger2.click();
  assert.strictEqual(items[0].getAttribute('data-state'), 'closed', 'Item 1 should now be closed');
  assert.strictEqual(items[1].getAttribute('data-state'), 'open', 'Item 2 should now be open');
  assert.strictEqual(content2.hasAttribute('hidden'), false, 'Content 2 should not be hidden');

  // Click trigger 2 again -> collapses item 2 (collapsible)
  trigger2.click();
  assert.strictEqual(items[1].getAttribute('data-state'), 'closed', 'Item 2 should be closed when collapsed');

  console.log('  ✓ <ui-accordion> passed!');
}

// TEST 3: Popover (<ui-popover>)
{
  console.log('  Testing <ui-popover>...');
  await render(`
    <ui-popover>
      <button data-part="trigger">Toggle</button>
      <div data-part="content" popover>Popover Panel</div>
    </ui-popover>
  `);

  const popover = document.querySelector('ui-popover');
  const trigger = popover.querySelector('[data-part="trigger"]');
  const panel = popover.querySelector('[data-part="popover-panel"], [popover]');

  assert.ok(trigger.hasAttribute('popovertarget'), 'Trigger should have popovertarget attribute');
  assert.strictEqual(trigger.getAttribute('popovertarget'), panel.id, 'popovertarget should match panel id');

  // Programmatic show / hide
  popover.show();
  assert.strictEqual(panel.getAttribute('data-state'), 'open', 'Panel should be open after show()');

  popover.hide();
  assert.strictEqual(panel.getAttribute('data-state'), 'closed', 'Panel should be closed after hide()');

  console.log('  ✓ <ui-popover> passed!');
}

// TEST 4: Tooltip (<ui-tooltip>)
{
  console.log('  Testing <ui-tooltip>...');
  await render(`
    <ui-tooltip delay="0">
      <button data-part="trigger">Hover me</button>
      <div data-part="content">Tooltip message</div>
    </ui-tooltip>
  `);

  const tooltip = document.querySelector('ui-tooltip');
  const trigger = tooltip.querySelector('[data-part="trigger"]');
  const content = tooltip.querySelector('[data-part="content"]');

  assert.strictEqual(content.getAttribute('role'), 'tooltip', 'Content should have role=tooltip');
  assert.strictEqual(trigger.getAttribute('aria-describedby'), content.id, 'Trigger should describe content id');

  // Show
  tooltip.show();
  assert.strictEqual(tooltip.getAttribute('data-state'), 'visible', 'Tooltip should be visible');
  assert.strictEqual(content.getAttribute('data-state'), 'visible', 'Content should be visible');

  // Hide
  tooltip.hide();
  assert.strictEqual(tooltip.getAttribute('data-state'), 'hidden', 'Tooltip should be hidden');
  assert.strictEqual(content.getAttribute('data-state'), 'hidden', 'Content should be hidden');

  console.log('  ✓ <ui-tooltip> passed!');
}

// TEST 5: Tabs (<ui-tabs>)
{
  console.log('  Testing <ui-tabs>...');
  await render(`
    <ui-tabs value="tab-1">
      <div data-part="tablist">
        <button data-part="tab" data-value="tab-1">Tab 1</button>
        <button data-part="tab" data-value="tab-2">Tab 2</button>
      </div>
      <div data-part="tabpanel" data-value="tab-1">Panel 1</div>
      <div data-part="tabpanel" data-value="tab-2">Panel 2</div>
    </ui-tabs>
  `);

  const tabs = document.querySelector('ui-tabs');
  const tabButtons = tabs.querySelectorAll('[data-part="tab"]');
  const panels = tabs.querySelectorAll('[data-part="tabpanel"]');

  assert.strictEqual(tabButtons[0].getAttribute('aria-selected'), 'true', 'Tab 1 should be selected');
  assert.strictEqual(panels[0].getAttribute('data-state'), 'active', 'Panel 1 should be active');
  assert.strictEqual(panels[1].getAttribute('data-state'), 'inactive', 'Panel 2 should be inactive');

  // Switch to Tab 2
  tabButtons[1].click();
  assert.strictEqual(tabButtons[1].getAttribute('aria-selected'), 'true', 'Tab 2 should be selected');
  assert.strictEqual(panels[1].getAttribute('data-state'), 'active', 'Panel 2 should be active');
  assert.strictEqual(panels[0].getAttribute('data-state'), 'inactive', 'Panel 1 should be inactive');

  console.log('  ✓ <ui-tabs> passed!');
}

// TEST 6: Combobox (<ui-combobox>)
{
  console.log('  Testing <ui-combobox>...');
  await render(`
    <ui-combobox>
      <input data-part="input">
      <ul data-part="listbox">
        <li data-part="option" data-value="apple">Apple</li>
        <li data-part="option" data-value="banana">Banana</li>
      </ul>
    </ui-combobox>
  `);

  const combobox = document.querySelector('ui-combobox');
  const input = combobox.querySelector('[data-part="input"]');
  const options = combobox.querySelectorAll('[data-part="option"]');

  options[1].click();
  assert.strictEqual(combobox.value, 'banana', 'Combobox value should be banana');
  assert.strictEqual(input.value, 'Banana', 'Input text should update to Banana');

  console.log('  ✓ <ui-combobox> passed!');
}

// TEST 7: Select (<ui-select>)
{
  console.log('  Testing <ui-select>...');
  await render(`
    <ui-select value="opt-1">
      <button data-part="trigger"><span data-part="value"></span></button>
      <ul data-part="listbox">
        <li data-part="option" data-value="opt-1">Option 1</li>
        <li data-part="option" data-value="opt-2">Option 2</li>
      </ul>
    </ui-select>
  `);

  const select = document.querySelector('ui-select');
  const options = select.querySelectorAll('[data-part="option"]');
  const valueDisplay = select.querySelector('[data-part="value"]');

  assert.strictEqual(select.value, 'opt-1');
  assert.strictEqual(valueDisplay.textContent, 'Option 1');

  options[1].click();
  assert.strictEqual(select.value, 'opt-2');
  assert.strictEqual(valueDisplay.textContent, 'Option 2');

  console.log('  ✓ <ui-select> passed!');
}

// TEST 8: Command Palette (<ui-command>)
{
  console.log('  Testing <ui-command>...');
  await render(`
    <ui-command>
      <input data-part="input">
      <div data-part="list">
        <div data-part="item" data-value="home">Home</div>
        <div data-part="item" data-value="settings">Settings</div>
      </div>
    </ui-command>
  `);

  const command = document.querySelector('ui-command');
  const input = command.querySelector('[data-part="input"]');
  const items = command.querySelectorAll('[data-part="item"]');

  input.value = 'sett';
  input.dispatchEvent(new Event('input'));

  assert.strictEqual(items[0].hasAttribute('hidden'), true, 'Home item should be filtered out');
  assert.strictEqual(items[1].hasAttribute('hidden'), false, 'Settings item should remain visible');

  console.log('  ✓ <ui-command> passed!');
}

// TEST 9: Sheet (<ui-sheet>)
{
  console.log('  Testing <ui-sheet>...');
  await render(`
    <ui-sheet id="test-sheet" side="right">
      <button data-part="trigger">Open Sheet</button>
      <dialog data-part="dialog">
        <button data-part="close-btn">Close</button>
      </dialog>
    </ui-sheet>
  `);

  const sheet = document.querySelector('ui-sheet');
  const dialogEl = sheet.querySelector('dialog');
  const closeBtn = sheet.querySelector('[data-part="close-btn"]');

  sheet.showModal();
  assert.strictEqual(dialogEl.open, true, 'Sheet dialog should be open');
  assert.strictEqual(sheet.hasAttribute('open'), true, '<ui-sheet> should have open attribute');

  sheet.close();
  assert.strictEqual(sheet.hasAttribute('open'), false, '<ui-sheet> should not have open attribute');

  console.log('  ✓ <ui-sheet> passed!');
}

// TEST 10: Slider (<ui-slider>)
{
  console.log('  Testing <ui-slider>...');
  await render(`
    <ui-slider value="25" min="0" max="100" step="5">
      <div data-part="track">
        <div data-part="range"></div>
        <div data-part="thumb"></div>
      </div>
    </ui-slider>
  `);

  const slider = document.querySelector('ui-slider');
  assert.strictEqual(slider.value, 25, 'Slider initial value should be 25');

  slider.value = 60;
  assert.strictEqual(slider.value, 60, 'Slider value should update to 60');

  const thumb = slider.querySelector('[data-part="thumb"]');
  assert.strictEqual(thumb.getAttribute('aria-valuenow'), '60', 'Thumb ARIA valuenow should be 60');

  console.log('  ✓ <ui-slider> passed!');
}

// TEST 11: Dropdown Menu (<ui-dropdown>)
{
  console.log('  Testing <ui-dropdown>...');
  await render(`
    <ui-dropdown id="test-dropdown">
      <button data-part="trigger">Options ▾</button>
      <div data-part="menu">
        <button data-part="item" data-value="edit">Edit</button>
        <button data-part="item" data-value="duplicate">Duplicate</button>
        <div data-part="separator"></div>
        <button data-part="item" data-value="delete" data-variant="destructive">Delete</button>
      </div>
    </ui-dropdown>
  `);

  const dropdown = document.querySelector('ui-dropdown');
  const trigger = dropdown.querySelector('[data-part="trigger"]');
  const menu = dropdown.querySelector('[data-part="menu"]');
  const items = dropdown.querySelectorAll('[data-part="item"]');

  assert.strictEqual(menu.getAttribute('data-state'), 'closed', 'Menu should start closed');

  // Click trigger -> opens menu
  trigger.click();
  assert.strictEqual(dropdown.hasAttribute('open'), true, '<ui-dropdown> should have open attribute');
  assert.strictEqual(menu.getAttribute('data-state'), 'open', 'Menu should have data-state=open');

  // Select an item
  let selectedValue = null;
  dropdown.addEventListener('select', (e) => {
    selectedValue = e.detail.value;
  });

  items[1].click();
  assert.strictEqual(selectedValue, 'duplicate', 'Selected value should be duplicate');
  assert.strictEqual(menu.getAttribute('data-state'), 'closed', 'Menu should close after item selection');

  console.log('  ✓ <ui-dropdown> passed!');
}

// TEST 12: Toaster & Toast Helper (<ui-toaster>, toast)
{
  console.log('  Testing <ui-toaster> & toast()...');
  await render(`
    <ui-toaster position="bottom-right"></ui-toaster>
  `);

  const toaster = document.querySelector('ui-toaster');
  assert.strictEqual(toaster.position, 'bottom-right');

  // Dispatch toast
  const t = toast.success('Profile Updated', { description: 'Your changes have been saved.' });
  const toastEl = document.querySelector('[data-ui="toast"]');

  assert.ok(toastEl, 'Toast element should be present in document');
  assert.strictEqual(toastEl.getAttribute('data-type'), 'success');
  assert.strictEqual(toastEl.querySelector('[data-part="toast-title"]').textContent, 'Profile Updated');

  // Dismiss toast
  t.dismiss();
  assert.strictEqual(toastEl.getAttribute('data-state'), 'closed');

  console.log('  ✓ <ui-toaster> & toast() passed!');
}

// TEST 13: Data Table (<ui-data-table>)
{
  console.log('  Testing <ui-data-table>...');
  await render(`
    <ui-data-table page-size="2" sortable filterable selectable>
      <div data-part="toolbar">
        <input data-part="search" placeholder="Search...">
        <span data-part="selection-count">0 of 4 selected</span>
      </div>
      <div data-part="table-container">
        <table>
          <thead>
            <tr>
              <th><input type="checkbox" data-part="select-all"></th>
              <th data-sortable="true" data-sort-key="name">Name <span data-part="sort-icon">⇅</span></th>
              <th data-sortable="true" data-sort-key="role">Role <span data-part="sort-icon">⇅</span></th>
            </tr>
          </thead>
          <tbody data-part="tbody">
            <tr data-row-id="1">
              <td><input type="checkbox" data-part="row-select"></td>
              <td>Charlie</td>
              <td>Engineer</td>
            </tr>
            <tr data-row-id="2">
              <td><input type="checkbox" data-part="row-select"></td>
              <td>Alice</td>
              <td>Designer</td>
            </tr>
            <tr data-row-id="3">
              <td><input type="checkbox" data-part="row-select"></td>
              <td>Bob</td>
              <td>Manager</td>
            </tr>
            <tr data-row-id="4">
              <td><input type="checkbox" data-part="row-select"></td>
              <td>David</td>
              <td>Architect</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div data-part="pagination">
        <span data-part="pagination-info"></span>
        <button data-part="prev-btn">Prev</button>
        <button data-part="next-btn">Next</button>
      </div>
    </ui-data-table>
  `);

  const dt = document.querySelector('ui-data-table');
  const rows = dt.querySelectorAll('tbody tr');
  const searchInput = dt.querySelector('input[data-part="search"]');
  const nextBtn = dt.querySelector('[data-part="next-btn"]');
  const nameHeader = dt.querySelector('th[data-sort-key="name"]');
  const selectAll = dt.querySelector('input[data-part="select-all"]');

  // Verify pagination slice (page 1, size 2 -> rows 0, 1 visible, 2, 3 hidden)
  assert.strictEqual(dt.currentPage, 1);
  assert.strictEqual(dt.pageSize, 2);
  assert.strictEqual(dt.totalPages, 2);
  assert.strictEqual(rows[0].hasAttribute('hidden'), false, 'Row 1 should be visible');
  assert.strictEqual(rows[1].hasAttribute('hidden'), false, 'Row 2 should be visible');
  assert.strictEqual(rows[2].hasAttribute('hidden'), true, 'Row 3 should be hidden on page 1');
  assert.strictEqual(rows[3].hasAttribute('hidden'), true, 'Row 4 should be hidden on page 1');

  // Next page
  nextBtn.click();
  assert.strictEqual(dt.currentPage, 2);
  assert.strictEqual(rows[0].hasAttribute('hidden'), true, 'Row 1 should be hidden on page 2');
  assert.strictEqual(rows[2].hasAttribute('hidden'), false, 'Row 3 should be visible on page 2');

  // Search filter
  searchInput.value = 'Alice';
  searchInput.dispatchEvent(new window.Event('input', { bubbles: true }));
  assert.strictEqual(dt.currentPage, 1, 'Search should reset to page 1');
  assert.strictEqual(rows[1].hasAttribute('hidden'), false, 'Alice row should be visible');
  assert.strictEqual(rows[0].hasAttribute('hidden'), true, 'Charlie should be hidden');

  // Clear search
  searchInput.value = '';
  searchInput.dispatchEvent(new window.Event('input', { bubbles: true }));

  // Sort by Name Ascending
  nameHeader.click();
  assert.strictEqual(nameHeader.getAttribute('aria-sort'), 'ascending');
  const sortedTbodyRows = Array.from(dt.querySelectorAll('tbody tr'));
  // First item in DOM tbody should now be Alice
  assert(sortedTbodyRows[0].textContent.includes('Alice'), 'Alice should be first after sort asc');

  // Select All visible rows
  selectAll.click();
  assert.strictEqual(selectAll.checked, true);
  assert(dt.getSelectedRowIds().length > 0, 'Rows should be selected');

  console.log('  ✓ <ui-data-table> passed!');
}

// TEST 14: Calendar (<ui-calendar>)
{
  console.log('  Testing <ui-calendar>...');
  await render(`
    <ui-calendar value="2026-10-03" month="10" year="2026"></ui-calendar>
  `);

  const cal = document.querySelector('ui-calendar');
  const heading = cal.querySelector('[data-part="month-heading"]');
  const nextBtn = cal.querySelector('[data-part="next-month"]');
  const prevBtn = cal.querySelector('[data-part="prev-month"]');

  assert.strictEqual(heading.textContent, 'October 2026');

  const selectedBtn = cal.querySelector('[data-date="2026-10-03"]');
  assert.ok(selectedBtn, 'Selected day button must exist');
  assert.strictEqual(selectedBtn.getAttribute('data-selected'), 'true');

  // Navigate to Next Month
  nextBtn.click();
  assert.strictEqual(heading.textContent, 'November 2026');
  assert.strictEqual(cal.month, 11);

  // Select day in November
  let changedDate = null;
  cal.addEventListener('change', (e) => {
    changedDate = e.detail.value;
  });

  const nov15Btn = cal.querySelector('[data-date="2026-11-15"]');
  assert.ok(nov15Btn, 'Nov 15 button must exist');
  nov15Btn.click();

  assert.strictEqual(changedDate, '2026-11-15');
  assert.strictEqual(cal.value, '2026-11-15');
  assert.strictEqual(cal.querySelector('[data-date="2026-11-15"]').getAttribute('data-selected'), 'true');

  console.log('  ✓ <ui-calendar> passed!');
}

// TEST 15: Date Picker (<ui-date-picker>)
{
  console.log('  Testing <ui-date-picker>...');
  await render(`
    <ui-date-picker placeholder="Select event date..."></ui-date-picker>
  `);

  const picker = document.querySelector('ui-date-picker');
  const trigger = picker.querySelector('[data-part="trigger"]');
  const displayVal = picker.querySelector('[data-part="display-value"]');
  const cal = picker.querySelector('ui-calendar');

  assert.strictEqual(displayVal.textContent, 'Select event date...');

  // Open date picker
  picker.open();
  assert.strictEqual(picker.hasAttribute('open'), true);

  // Select date inside calendar
  let pickerChange = null;
  picker.addEventListener('change', (e) => {
    pickerChange = e.detail.value;
  });

  cal.selectDate('2026-12-25');
  assert.strictEqual(pickerChange, '2026-12-25');
  assert.strictEqual(picker.value, '2026-12-25');
  assert.strictEqual(picker.hasAttribute('open'), false, 'Picker should close after selection');
  assert(displayVal.textContent.includes('2026'), 'Display value should reflect selected year');

  console.log('  ✓ <ui-date-picker> passed!');
}

console.log('\n🎉 ALL 15 MICRO-ENHANCER COMPONENTS VERIFIED SUCCESSFULLY!\n');


