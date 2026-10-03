/**
 * Global Documentation & Component ⌘K Search Palette
 * Mounts a native <ui-command> modal indexed across all 27 components and doc guides.
 */

export function initGlobalSearch() {
  if (document.getElementById('global-command-palette')) return;

  const isInSubfolder = window.location.pathname.includes('/components/');
  const compPrefix = isInSubfolder ? './' : './components/';
  const rootPrefix = isInSubfolder ? '../' : './';

  const components = [
    // Tier 0 Primitives
    { name: 'Button', tier: 0, url: `${compPrefix}button.html`, keywords: 'click action primary secondary button' },
    { name: 'Badge', tier: 0, url: `${compPrefix}badge.html`, keywords: 'tag pill chip status' },
    { name: 'Input', tier: 0, url: `${compPrefix}input.html`, keywords: 'text field form type enter textarea' },
    { name: 'Checkbox', tier: 0, url: `${compPrefix}checkbox.html`, keywords: 'toggle check select form radio' },
    { name: 'Switch', tier: 0, url: `${compPrefix}switch.html`, keywords: 'toggle boolean darkmode' },
    { name: 'Card', tier: 0, url: `${compPrefix}card.html`, keywords: 'box container stage tile' },
    { name: 'Avatar', tier: 0, url: `${compPrefix}avatar.html`, keywords: 'user profile picture image' },
    { name: 'Alert', tier: 0, url: `${compPrefix}alert.html`, keywords: 'warning error notice banner callout' },
    { name: 'Progress', tier: 0, url: `${compPrefix}progress.html`, keywords: 'bar loading meter percent' },
    { name: 'Table', tier: 0, url: `${compPrefix}table.html`, keywords: 'rows columns data grid semantic' },
    { name: 'Skeleton', tier: 0, url: `${compPrefix}skeleton.html`, keywords: 'placeholder loading shimmer' },
    { name: 'Separator', tier: 0, url: `${compPrefix}separator.html`, keywords: 'divider rule line hr' },

    // Tier 2 Micro-Enhancers
    { name: 'Data Table', tier: 2, url: `${compPrefix}data-table.html`, keywords: 'sort filter pagination slice row select checkbox table grid' },
    { name: 'Calendar', tier: 2, url: `${compPrefix}calendar.html`, keywords: 'date month year days grid picker' },
    { name: 'Date Picker', tier: 2, url: `${compPrefix}date-picker.html`, keywords: 'calendar popover select date form time' },
    { name: 'Dropdown Menu', tier: 2, url: `${compPrefix}dropdown.html`, keywords: 'popover menu context menu actions submenu' },
    { name: 'Toast / Toaster', tier: 2, url: `${compPrefix}toast.html`, keywords: 'notification snackbar alert popup message' },
    { name: 'Combobox', tier: 2, url: `${compPrefix}combobox.html`, keywords: 'autocomplete select search filter input' },
    { name: 'Tabs', tier: 2, url: `${compPrefix}tabs.html`, keywords: 'tablist switcher panels segment' },
    { name: 'Dialog', tier: 2, url: `${compPrefix}dialog.html`, keywords: 'modal popup prompt alertdialog window' },
    { name: 'Select', tier: 2, url: `${compPrefix}select.html`, keywords: 'native picker dropdown options choice' },
    { name: 'Accordion', tier: 2, url: `${compPrefix}accordion.html`, keywords: 'collapse expand details summary faq' },
    { name: 'Popover', tier: 2, url: `${compPrefix}popover.html`, keywords: 'anchor floating card trigger' },
    { name: 'Tooltip', tier: 2, url: `${compPrefix}tooltip.html`, keywords: 'hover hint info title' },
    { name: 'Command Palette', tier: 2, url: `${compPrefix}command.html`, keywords: 'spotlight search kbd k shortcut action' },
    { name: 'Sheet / Drawer', tier: 2, url: `${compPrefix}sheet.html`, keywords: 'sidebar slide drawer panel overlay' },
    { name: 'Slider', tier: 2, url: `${compPrefix}slider.html`, keywords: 'range track thumb volume percent' },
  ];

  const docs = [
    { name: 'Introduction & Philosophy', url: `${rootPrefix}docs.html#introduction`, keywords: 'overview light-dom philosophy zero shadow dom' },
    { name: 'Core Invariants', url: `${rootPrefix}docs.html#philosophy`, keywords: 'mutate attributes never nodes architecture' },
    { name: 'Installation & Setup', url: `${rootPrefix}docs.html#installation`, keywords: 'npm vite nextjs install quickstart' },
    { name: 'CLI Tooling (npx nnui)', url: `${rootPrefix}docs.html#cli`, keywords: 'cli add init list registry shadcn' },
    { name: 'CDN Quickstart (HTMX / Rails)', url: `${rootPrefix}docs.html#cdn`, keywords: 'cdn unpkg jsdelivr htmx django rails alpine' },
    { name: 'Theming & Tokens', url: `${rootPrefix}docs.html#theming`, keywords: 'colors radius customizer css variables' },
  ];

  const paletteWrapper = document.createElement('div');
  paletteWrapper.innerHTML = `
    <ui-command id="global-command-palette" shortcut="k">
      <dialog data-part="dialog" class="ui-dialog ui-command-dialog" style="max-width: 580px; width: 92%; padding: 0; border: 1px solid var(--ui-border-default); border-radius: var(--ui-radius-xl); background: var(--ui-bg-surface); box-shadow: var(--ui-shadow-2xl); overflow: hidden;">
        <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.85rem 1.25rem; border-bottom: 1px solid var(--ui-border-subtle); background: var(--ui-bg-surface);">
          <span style="color: var(--ui-text-muted); font-size: 1.1rem;">🔍</span>
          <input data-part="input" placeholder="Type a component or guide to search..." style="flex: 1; background: transparent; border: none; outline: none; font-size: 0.95rem; color: var(--ui-text-primary); font-family: inherit;" />
          <span style="font-size: 0.7rem; font-weight: 600; padding: 0.2rem 0.45rem; background: var(--ui-bg-subtle); border: 1px solid var(--ui-border-default); border-radius: 4px; color: var(--ui-text-muted);">ESC</span>
        </div>
        <div data-part="list" style="max-height: 380px; overflow-y: auto; padding: 0.5rem;">
          <div data-part="empty" hidden style="padding: 2.5rem 1rem; text-align: center; color: var(--ui-text-muted); font-size: 0.9rem;">
            No matching components or documentation guides found.
          </div>
          <div data-part="group" data-heading="Components" style="margin-bottom: 0.5rem;">
            <div style="font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--ui-text-muted); padding: 0.4rem 0.75rem 0.25rem;">Components (${components.length})</div>
            ${components.map(c => `
              <div data-part="item" data-value="${c.name.toLowerCase()}" data-keywords="${c.keywords}" data-url="${c.url}" style="display: flex; align-items: center; justify-content: space-between; padding: 0.55rem 0.75rem; border-radius: var(--ui-radius-md); cursor: pointer; transition: background 0.15s ease; color: var(--ui-text-primary); font-size: 0.875rem;">
                <div style="display: flex; align-items: center; gap: 0.6rem;">
                  <span style="color: var(--ui-color-brand-500); font-weight: 600;">#</span>
                  <span>${c.name}</span>
                </div>
                <span style="font-size: 0.7rem; padding: 0.15rem 0.45rem; border-radius: 4px; font-weight: 600; background: ${c.tier === 0 ? 'rgba(34,197,94,0.1)' : 'rgba(59,130,246,0.1)'}; color: ${c.tier === 0 ? '#22c55e' : '#3b82f6'};">
                  Tier ${c.tier}
                </span>
              </div>
            `).join('')}
          </div>
          <div data-part="group" data-heading="Documentation & Guides">
            <div style="font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--ui-text-muted); padding: 0.4rem 0.75rem 0.25rem;">Documentation</div>
            ${docs.map(d => `
              <div data-part="item" data-value="${d.name.toLowerCase()}" data-keywords="${d.keywords}" data-url="${d.url}" style="display: flex; align-items: center; justify-content: space-between; padding: 0.55rem 0.75rem; border-radius: var(--ui-radius-md); cursor: pointer; transition: background 0.15s ease; color: var(--ui-text-primary); font-size: 0.875rem;">
                <div style="display: flex; align-items: center; gap: 0.6rem;">
                  <span style="color: var(--ui-color-accent-400);">📖</span>
                  <span>${d.name}</span>
                </div>
                <span style="font-size: 0.75rem; color: var(--ui-text-muted);">Guide</span>
              </div>
            `).join('')}
          </div>
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

  // Attach search trigger clicks
  document.querySelectorAll('.docs-search-btn, [data-command-trigger]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      palette.open();
    });
  });
}
