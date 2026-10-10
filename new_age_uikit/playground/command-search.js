/**
 * Global Documentation & Component ⌘K Search Palette
 * Mounts a native <ui-command> modal indexed across all 40 components and documentation guides.
 */

export function initGlobalSearch() {
  if (document.getElementById('global-command-palette')) {
    attachTriggers();
    return;
  }

  const isInSubfolder = window.location.pathname.includes('/components/');
  const compPrefix = isInSubfolder ? './' : './components/';
  const rootPrefix = isInSubfolder ? '../' : './';

  const components = [
    // Tier 0: Primitives (Zero-JS)
    { name: 'Button', tier: 0, url: `${compPrefix}button.html`, icon: '🔘', keywords: 'click action primary secondary button submit ghost outline interactive' },
    { name: 'Badge', tier: 0, url: `${compPrefix}badge.html`, icon: '🏷️', keywords: 'tag pill chip status label count counter status metadata' },
    { name: 'Input', tier: 0, url: `${compPrefix}input.html`, icon: '📝', keywords: 'text field form type enter textarea email password form-control' },
    { name: 'Checkbox', tier: 0, url: `${compPrefix}checkbox.html`, icon: '☑️', keywords: 'toggle check select form radio box boolean choice' },
    { name: 'Switch', tier: 0, url: `${compPrefix}switch.html`, icon: '🎚️', keywords: 'toggle boolean darkmode state on off switch track' },
    { name: 'Card', tier: 0, url: `${compPrefix}card.html`, icon: '🃏', keywords: 'box container stage tile surface panel bento layout' },
    { name: 'Avatar', tier: 0, url: `${compPrefix}avatar.html`, icon: '👤', keywords: 'user profile picture image fallback initials status user' },
    { name: 'Alert', tier: 0, url: `${compPrefix}alert.html`, icon: '⚠️', keywords: 'warning error notice banner callout info danger success notification' },
    { name: 'Progress', tier: 0, url: `${compPrefix}progress.html`, icon: '📊', keywords: 'bar loading meter percent gauge task progress indicator' },
    { name: 'Table', tier: 0, url: `${compPrefix}table.html`, icon: '📋', keywords: 'rows columns data semantic grid tabular dataset' },
    { name: 'Skeleton', tier: 0, url: `${compPrefix}skeleton.html`, icon: '💀', keywords: 'placeholder loading shimmer wireframe pulse loader content' },
    { name: 'Separator', tier: 0, url: `${compPrefix}separator.html`, icon: '➖', keywords: 'divider rule line hr vertical horizontal break border' },

    // Tier 2: Micro-Enhancers
    { name: 'Virtualized Data Grid', tier: 2, url: `${compPrefix}data-grid.html`, icon: '⚡', keywords: 'virtualized data grid table 100k 15000 rows filter sort streaming infinite virtual scroll fast column' },
    { name: 'Date Range Picker', tier: 2, url: `${compPrefix}date-range-picker.html`, icon: '📆', keywords: 'date range calendar picker presets booking start end duration popover schedule' },
    { name: 'Tags Input', tier: 2, url: `${compPrefix}tags-input.html`, icon: '🏷️', keywords: 'tags input chips pills badges tokens keywords enter delete remove backspace multiple' },
    { name: 'Segmented Control', tier: 2, url: `${compPrefix}segmented-control.html`, icon: '🎛️', keywords: 'segmented control tabs pill slider toggle switch option view switcher segmented' },
    { name: 'OTP Input', tier: 2, url: `${compPrefix}otp-input.html`, icon: '🔢', keywords: 'otp input pin verification code 2fa mfa auth digit slot auto focus paste security' },
    { name: 'Stepper / Wizard', tier: 2, url: `${compPrefix}stepper.html`, icon: '🪜', keywords: 'stepper wizard pipeline multi-step form linear progression onboarding agent ai deployment steps' },
    { name: 'Resizable Panels', tier: 2, url: `${compPrefix}resizable.html`, icon: '↔️', keywords: 'resizable panels split layout pane divider drag handle columns flex resize' },
    { name: 'File Upload', tier: 2, url: `${compPrefix}file-upload.html`, icon: '📁', keywords: 'file upload dropzone drag drop attachment preview upload multiple progress upload' },
    { name: 'Context Menu', tier: 2, url: `${compPrefix}context-menu.html`, icon: '🖱️', keywords: 'context menu right click popup mouse custom trigger secondary actions contextmenu' },
    { name: 'Navigation Menu', tier: 2, url: `${compPrefix}navigation-menu.html`, icon: '🧭', keywords: 'navigation menu header navbar dropdown links site map megamenu flyout nav' },
    { name: 'Tree View', tier: 2, url: `${compPrefix}tree-view.html`, icon: '🌳', keywords: 'tree view folder file explorer directory hierarchical structure nodes chevron hierarchy' },
    { name: 'AI Prompt Box', tier: 2, url: `${compPrefix}ai-prompt-box.html`, icon: '🤖', keywords: 'ai prompt box chat input textarea token counter voice model stream llm send autonomous' },
    { name: 'Color Picker', tier: 2, url: `${compPrefix}color-picker.html`, icon: '🎨', keywords: 'color picker hex rgb hsl eyedropper swatch palette canvas slider theme' },
    { name: 'Data Table', tier: 2, url: `${compPrefix}data-table.html`, icon: '🗃️', keywords: 'sort filter pagination slice row select checkbox table grid bulk actions csv export' },
    { name: 'Calendar', tier: 2, url: `${compPrefix}calendar.html`, icon: '📅', keywords: 'date month year days grid picker a11y navigation schedule' },
    { name: 'Date Picker', tier: 2, url: `${compPrefix}date-picker.html`, icon: '🗓️', keywords: 'calendar popover select date form time dropdown anchor input' },
    { name: 'Dropdown Menu', tier: 2, url: `${compPrefix}dropdown.html`, icon: '📑', keywords: 'popover menu context actions submenu floating chevron menu items' },
    { name: 'Toast / Toaster', tier: 2, url: `${compPrefix}toast.html`, icon: '🍞', keywords: 'notification snackbar alert popup message sonner dismiss action toast' },
    { name: 'Combobox', tier: 2, url: `${compPrefix}combobox.html`, icon: '🔎', keywords: 'autocomplete select search filter input dropdown popover suggest' },
    { name: 'Tabs', tier: 2, url: `${compPrefix}tabs.html`, icon: '📑', keywords: 'tablist switcher panels segment roving tabindex keyboard tabs' },
    { name: 'Dialog', tier: 2, url: `${compPrefix}dialog.html`, icon: '🪟', keywords: 'modal popup prompt alertdialog window backdrop overlay dialog' },
    { name: 'Select', tier: 2, url: `${compPrefix}select.html`, icon: '🔽', keywords: 'native picker dropdown options choice form custom trigger select' },
    { name: 'Accordion', tier: 2, url: `${compPrefix}accordion.html`, icon: '🪗', keywords: 'collapse expand details summary faq chevron accordion disclosure' },
    { name: 'Popover', tier: 2, url: `${compPrefix}popover.html`, icon: '💬', keywords: 'anchor floating card trigger popover dialog flyout anchor' },
    { name: 'Tooltip', tier: 2, url: `${compPrefix}tooltip.html`, icon: '💡', keywords: 'hover hint info title delay positioning micro tip' },
    { name: 'Command Palette', tier: 2, url: `${compPrefix}command.html`, icon: '⌨️', keywords: 'spotlight search kbd k shortcut action command palette spotlight palette' },
    { name: 'Sheet / Drawer', tier: 2, url: `${compPrefix}sheet.html`, icon: '🗂️', keywords: 'sidebar slide drawer panel overlay offcanvas sheet slideout' },
    { name: 'Slider', tier: 2, url: `${compPrefix}slider.html`, icon: '🎚️', keywords: 'range track thumb volume percent slider progress drag' },
  ];

  const docs = [
    { name: 'Introduction & Mental Model', url: `${rootPrefix}docs.html#introduction`, icon: '📖', keywords: 'overview light-dom philosophy zero shadow dom mental model introduction core' },
    { name: 'Core Invariants & Rules', url: `${rootPrefix}docs.html#philosophy`, icon: '🛡️', keywords: 'mutate attributes never nodes architecture invariants philosophy principles' },
    { name: 'Installation & Quickstart', url: `${rootPrefix}docs.html#installation`, icon: '📦', keywords: 'npm vite nextjs react vue svelte install setup quickstart dependencies' },
    { name: 'CDN Quickstart (HTMX / Rails / Django)', url: `${rootPrefix}docs.html#cdn-backend`, icon: '🌐', keywords: 'cdn unpkg jsdelivr htmx django rails alpine backend ssr script tags' },
    { name: 'CLI Tooling (npx nnui)', url: `${rootPrefix}docs.html#cli-registry`, icon: '💻', keywords: 'cli add init list registry shadcn tooling commands' },
    { name: 'Architecture & Dual Prefix', url: `${rootPrefix}docs.html#architecture`, icon: '🏛️', keywords: 'architecture custom elements registration dual prefix ui nnui web components' },
    { name: 'Theming & Design Tokens', url: `${rootPrefix}docs.html#theming`, icon: '🎨', keywords: 'colors radius customizer css variables tokens themes palettes dark light' },
    { name: 'Design Tokens Specification', url: `${rootPrefix}tokens.html`, icon: '📐', keywords: 'tokens w3c dtcg colors typography spacing shadows radii palette design system' },
    { name: 'Components Catalog & Gallery', url: `${rootPrefix}components.html`, icon: '🧩', keywords: 'components gallery overview catalog all primitives micro-enhancers browse' },
  ];

  const paletteWrapper = document.createElement('div');
  paletteWrapper.innerHTML = `
    <ui-command id="global-command-palette" shortcut="none">
      <dialog data-part="dialog" class="ui-dialog ui-command-dialog" style="position: fixed; inset: 0; margin: 10vh auto auto auto; max-width: 620px; width: 92%; padding: 0; border: 1px solid var(--ui-border-default); border-radius: var(--ui-radius-xl, 14px); background: var(--ui-bg-surface); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.08); overflow: hidden; z-index: 10000;">
        <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.85rem 1.25rem; border-bottom: 1px solid var(--ui-border-default); background: var(--ui-bg-surface);">
          <span style="color: var(--ui-text-muted); font-size: 1.1rem; line-height: 1;">🔍</span>
          <input data-part="input" placeholder="Search 40 components, guides, tokens, and docs..." autocomplete="off" spellcheck="false" style="flex: 1; background: transparent; border: none; outline: none; font-size: 0.95rem; color: var(--ui-text-primary); font-family: inherit;" />
          <kbd style="font-family: inherit; font-size: 0.7rem; font-weight: 600; padding: 0.2rem 0.45rem; background: var(--ui-bg-subtle); border: 1px solid var(--ui-border-default); border-radius: 4px; color: var(--ui-text-muted); cursor: pointer;" onclick="document.getElementById('global-command-palette')?.close()">ESC</kbd>
        </div>
        <div data-part="list" style="max-height: 380px; overflow-y: auto; padding: 0.5rem;">
          <div data-part="empty" hidden style="padding: 2.5rem 1rem; text-align: center; color: var(--ui-text-muted); font-size: 0.9rem;">
            No matching components or documentation guides found.
          </div>
          <div data-part="group" data-heading="Components" style="margin-bottom: 0.75rem;">
            <div style="font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--ui-text-muted); padding: 0.4rem 0.75rem 0.25rem;">Components (${components.length})</div>
            ${components.map(c => `
              <div data-part="item" data-value="${c.name.toLowerCase()}" data-keywords="${c.keywords}" data-url="${c.url}" style="display: flex; align-items: center; justify-content: space-between; padding: 0.55rem 0.75rem; border-radius: var(--ui-radius-md, 6px); cursor: pointer; transition: background 0.12s ease; color: var(--ui-text-primary); font-size: 0.875rem;">
                <div style="display: flex; align-items: center; gap: 0.65rem;">
                  <span style="font-size: 1rem; line-height: 1;">${c.icon}</span>
                  <span style="font-weight: 500;">${c.name}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <span style="font-size: 0.7rem; padding: 0.15rem 0.45rem; border-radius: 4px; font-weight: 600; background: ${c.tier === 0 ? 'rgba(34,197,94,0.12)' : 'rgba(99,102,241,0.12)'}; color: ${c.tier === 0 ? '#22c55e' : 'var(--ui-color-brand-400, #818cf8)'};">
                    ${c.tier === 0 ? 'Tier 0 Primitive' : 'Tier 2 Enhancer'}
                  </span>
                </div>
              </div>
            `).join('')}
          </div>
          <div data-part="group" data-heading="Documentation & Guides">
            <div style="font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--ui-text-muted); padding: 0.4rem 0.75rem 0.25rem;">Documentation & Architecture (${docs.length})</div>
            ${docs.map(d => `
              <div data-part="item" data-value="${d.name.toLowerCase()}" data-keywords="${d.keywords}" data-url="${d.url}" style="display: flex; align-items: center; justify-content: space-between; padding: 0.55rem 0.75rem; border-radius: var(--ui-radius-md, 6px); cursor: pointer; transition: background 0.12s ease; color: var(--ui-text-primary); font-size: 0.875rem;">
                <div style="display: flex; align-items: center; gap: 0.65rem;">
                  <span style="font-size: 1rem; line-height: 1;">${d.icon}</span>
                  <span style="font-weight: 500;">${d.name}</span>
                </div>
                <span style="font-size: 0.7rem; padding: 0.15rem 0.45rem; border-radius: 4px; font-weight: 600; background: rgba(245, 158, 11, 0.12); color: #f59e0b;">
                  Guide
                </span>
              </div>
            `).join('')}
          </div>
        </div>
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 1rem; border-top: 1px solid var(--ui-border-default); background: var(--ui-bg-subtle); font-size: 0.75rem; color: var(--ui-text-muted);">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span><kbd style="font-family: inherit; font-size: 0.7rem; padding: 0.1rem 0.3rem; background: var(--ui-bg-surface); border: 1px solid var(--ui-border-default); border-radius: 3px;">↑</kbd> <kbd style="font-family: inherit; font-size: 0.7rem; padding: 0.1rem 0.3rem; background: var(--ui-bg-surface); border: 1px solid var(--ui-border-default); border-radius: 3px;">↓</kbd> Navigate</span>
            <span><kbd style="font-family: inherit; font-size: 0.7rem; padding: 0.1rem 0.3rem; background: var(--ui-bg-surface); border: 1px solid var(--ui-border-default); border-radius: 3px;">↵</kbd> Open</span>
            <span><kbd style="font-family: inherit; font-size: 0.7rem; padding: 0.1rem 0.3rem; background: var(--ui-bg-surface); border: 1px solid var(--ui-border-default); border-radius: 3px;">ESC</kbd> Close</span>
          </div>
          <span style="font-weight: 600; color: var(--ui-color-brand-400, #818cf8);">NNUI Universal Palette</span>
        </div>
      </dialog>
    </ui-command>
  `;

  document.body.appendChild(paletteWrapper.firstElementChild);

  const palette = document.getElementById('global-command-palette');
  if (!palette) return;

  palette.addEventListener('select', (e) => {
    const url = e.detail?.item?.getAttribute('data-url');
    if (url) {
      window.location.href = url;
    }
  });

  attachTriggers();
}

let triggersAttached = false;
function attachTriggers() {
  if (triggersAttached) return;
  triggersAttached = true;

  // Global delegated click listener for search triggers
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.docs-search-btn, [data-command-trigger]');
    if (btn) {
      e.preventDefault();
      openPalette();
    }
  });

  // Global keyboard shortcut listener for ⌘K / Ctrl+K
  window.addEventListener('keydown', (e) => {
    if (e.defaultPrevented) return;
    if ((e.metaKey || e.ctrlKey) && e.key && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      togglePalette();
    }
  });
}

export function openPalette() {
  let palette = document.getElementById('global-command-palette');
  if (!palette) {
    initGlobalSearch();
    palette = document.getElementById('global-command-palette');
  }
  if (palette) {
    if (typeof palette.open === 'function') {
      palette.open();
    } else {
      const dialog = palette.querySelector('dialog');
      if (dialog && !dialog.open) dialog.showModal();
    }
  }
}

export function togglePalette() {
  let palette = document.getElementById('global-command-palette');
  if (!palette) {
    initGlobalSearch();
    palette = document.getElementById('global-command-palette');
  }
  if (palette) {
    if (typeof palette.toggle === 'function') {
      palette.toggle();
    } else {
      const dialog = palette.querySelector('dialog');
      if (dialog) {
        if (dialog.open) dialog.close();
        else dialog.showModal();
      }
    }
  }
}

// Auto-initialize when loaded
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initGlobalSearch());
  } else {
    initGlobalSearch();
  }
}
