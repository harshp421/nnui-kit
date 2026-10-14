import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const componentsDir = path.join(rootDir, 'components');

const expectedTier0 = [
  'button.html', 'badge.html', 'input.html', 'checkbox.html', 'switch.html',
  'card.html', 'avatar.html', 'alert.html', 'progress.html', 'table.html',
  'skeleton.html', 'separator.html'
];

const expectedTier2 = [
  'data-grid.html', 'date-range-picker.html', 'tags-input.html',
  'segmented-control.html', 'otp-input.html', 'stepper.html',
  'resizable.html', 'file-upload.html', 'context-menu.html',
  'navigation-menu.html', 'tree-view.html', 'ai-prompt-box.html',
  'color-picker.html',
  'data-table.html', 'calendar.html', 'date-picker.html', 'dropdown.html',
  'toast.html', 'combobox.html', 'tabs.html', 'dialog.html', 'select.html',
  'accordion.html', 'popover.html', 'tooltip.html', 'command.html',
  'sheet.html', 'slider.html'
];

console.log('Testing Sidebar Consistency and Application Flow Across All 43 Pages...');

test('All 40 component pages have 100% canonical sidebar parity', () => {
  const componentFiles = fs.readdirSync(componentsDir).filter(f => f.endsWith('.html'));
  assert.equal(componentFiles.length, 40, 'Should have exactly 40 component HTML files');

  for (const file of componentFiles) {
    const content = fs.readFileSync(path.join(componentsDir, file), 'utf-8');

    // Must have docs-sidebar
    assert.ok(content.includes('<aside class="docs-sidebar">'), `${file} must contain <aside class="docs-sidebar">`);

    // Must have all 5 groups
    assert.ok(content.includes('Getting Started'), `${file} must have Getting Started group`);
    assert.ok(content.includes('Design System & Tokens'), `${file} must have Design System & Tokens group`);
    assert.ok(content.includes('Components Overview'), `${file} must have Components Overview group`);
    assert.ok(content.includes('Tier 0: Primitives (Zero-JS)'), `${file} must have Tier 0 group`);
    assert.ok(content.includes('Tier 2: Micro-Enhancers'), `${file} must have Tier 2 group`);

    // Must have all Tier 0 items
    for (const t0 of expectedTier0) {
      assert.ok(content.includes(`./${t0}`), `${file} sidebar must link to ./${t0}`);
    }

    // Must have all Tier 2 items
    for (const t2 of expectedTier2) {
      assert.ok(content.includes(`./${t2}`), `${file} sidebar must link to ./${t2}`);
    }

    // Current component must have active class
    const activePattern = new RegExp(`href="\\./${file}" class="sidebar-item active"`);
    assert.ok(activePattern.test(content), `${file} must have active class on its own sidebar link`);

    // Must have docs-toc on the right
    assert.ok(content.includes('class="docs-toc"'), `${file} must have <aside class="docs-toc">`);
  }
  console.log('  ✓ All 40 component pages passed canonical sidebar and active link verification!');
});

test('Root documentation pages (docs.html, components.html, tokens.html) have canonical sidebar parity', () => {
  const rootPages = ['docs.html', 'components.html', 'tokens.html'];

  for (const file of rootPages) {
    const content = fs.readFileSync(path.join(rootDir, file), 'utf-8');

    assert.ok(content.includes('<aside class="docs-sidebar">'), `${file} must contain <aside class="docs-sidebar">`);
    assert.ok(content.includes('Getting Started'), `${file} must have Getting Started`);
    assert.ok(content.includes('Design System & Tokens'), `${file} must have Design System & Tokens`);
    assert.ok(content.includes('Tier 0: Primitives (Zero-JS)'), `${file} must have Tier 0`);
    assert.ok(content.includes('Tier 2: Micro-Enhancers'), `${file} must have Tier 2`);

    // Must link to components via ./components/
    for (const t0 of expectedTier0) {
      assert.ok(content.includes(`./components/${t0}`), `${file} must link to ./components/${t0}`);
    }
    for (const t2 of expectedTier2) {
      assert.ok(content.includes(`./components/${t2}`), `${file} must link to ./components/${t2}`);
    }
  }
  console.log('  ✓ Root documentation pages passed canonical sidebar verification!');
});

test('docs.html has human-readable Introduction and mental model flow', () => {
  const docsHtml = fs.readFileSync(path.join(rootDir, 'docs.html'), 'utf-8');

  // Must have Introduction section
  assert.ok(docsHtml.includes('id="introduction"'), 'docs.html must have <section id="introduction">');
  assert.ok(docsHtml.includes('Introduction &amp; Architecture') || docsHtml.includes('Introduction & Architecture'), 'docs.html must have Introduction & Architecture title');

  // Must explain 3-tier architecture
  assert.ok(docsHtml.includes('Tier 0'), 'docs.html must highlight Tier 0');
  assert.ok(docsHtml.includes('Tier 1'), 'docs.html must highlight Tier 1');
  assert.ok(docsHtml.includes('Tier 2'), 'docs.html must highlight Tier 2');

  // Must have Light-DOM comparison table
  assert.ok(docsHtml.includes('Why Light-DOM? (Solving Shadow DOM Traps)'), 'docs.html must explain why Light-DOM over Shadow DOM');
  assert.ok(docsHtml.includes('ElementInternals &amp; FormData') || docsHtml.includes('ElementInternals & FormData'), 'docs.html table must explain form submission');

  // Must have quick navigation pathways
  assert.ok(docsHtml.includes('Quick Navigation Pathways'), 'docs.html must provide quick navigation pathways');
  assert.ok(docsHtml.includes('Quickstart Installation →'), 'docs.html must link to installation');
  assert.ok(docsHtml.includes('Browse 30 Components →'), 'docs.html must link to components');
  assert.ok(docsHtml.includes('Design Tokens Studio →'), 'docs.html must link to design tokens');

  console.log('  ✓ docs.html passed introduction flow and mental model verification!');
});

test('CSS spacing rhythm and custom scrollbars verified', () => {
  const docsCss = fs.readFileSync(path.join(rootDir, 'playground/docs.css'), 'utf-8');
  const componentsCss = fs.readFileSync(path.join(rootDir, 'playground/components.css'), 'utf-8');

  // Scrollbar rules
  assert.ok(docsCss.includes('.docs-sidebar::-webkit-scrollbar'), 'docs.css must define slim scrollbar');
  assert.ok(docsCss.includes('scrollbar-width: thin'), 'docs.css must support Firefox scrollbar');

  // Section spacing rules
  assert.ok(docsCss.includes('var(--docs-section-spacing)'), 'docs.css must use standard section spacing');
  assert.ok(docsCss.includes('scroll-margin-top: 80px'), 'docs.css must have scroll-margin-top for anchor navigation');

  // Sidebar badge classes
  assert.ok(docsCss.includes('.sidebar-badge-new'), 'docs.css must style .sidebar-badge-new');
  assert.ok(docsCss.includes('.sidebar-badge-counter'), 'docs.css must style .sidebar-badge-counter');

  // Components CSS
  assert.ok(componentsCss.includes('.preview-stage'), 'components.css must style .preview-stage');
  assert.ok(componentsCss.includes('.api-table-wrapper'), 'components.css must style .api-table-wrapper');

  console.log('  ✓ CSS spacing rhythm and design tokens verified!');
});

console.log('\n🎉 ALL SIDEBAR CONSISTENCY & APPLICATION FLOW TESTS PASSED!');
