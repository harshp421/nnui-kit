import { BaseLightElement } from '../../utils/base-element.js';
import { generateUniqueId } from '../../utils/a11y.js';

/**
 * UiCommand
 * Platform-Native, Light-DOM Command Palette & Spotlight Search.
 * 
 * Invariants:
 * 1. Zero Shadow DOM: All child elements remain in Light-DOM.
 * 2. Mutate Attributes, Never Nodes: Filters using [hidden] rather than removing DOM nodes.
 * 3. WAI-ARIA APG active-descendant navigation.
 */
export class UiCommand extends BaseLightElement {
  static get observedAttributes() {
    return ['open', 'shortcut'];
  }

  constructor() {
    super();
    this._activeIndex = -1;
    this._isOpen = false;
  }

  init() {
    this.warnIfMissing('[data-part="input"]', 'Command input field');
    this.warnIfMissing('[data-part="item"]', 'Command item');

    this._dialog = this.querySelector('dialog[data-part="dialog"]');
    this._input = this.querySelector('[data-part="input"]');
    this._list = this.querySelector('[data-part="list"]') || this;
    this._empty = this.querySelector('[data-part="empty"]');

    this._setupDialog();
    this._setupInput();
    this._setupList();
    this._setupGlobalShortcut();

    // Initial filter run to index items
    this.filter('');
  }

  _setupDialog() {
    if (!this._dialog) return;

    // Handle backdrop click to close
    this.listen(this._dialog, 'click', (e) => {
      if (e.target !== this._dialog) return;
      const rect = this._dialog.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        this.close();
      }
    });

    this.listen(this._dialog, 'close', () => {
      this._isOpen = false;
      this.removeAttribute('open');
      this.dispatch('close');
    });

    this.listen(this._dialog, 'keydown', (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        this.close();
      }
    });
  }

  _setupInput() {
    if (!this._input) return;

    this.setAttributeSafe(this._input, 'role', 'combobox');
    this.setAttributeSafe(this._input, 'aria-autocomplete', 'list');
    this.setAttributeSafe(this._input, 'aria-expanded', 'true');

    // Input search typing
    this.listen(this._input, 'input', (e) => {
      this.filter(e.target.value);
    });

    // Keyboard navigation
    this.listen(this._input, 'keydown', (e) => {
      const items = this._getVisibleItems();
      if (!items.length) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          this._moveActive(1);
          break;
        case 'ArrowUp':
          e.preventDefault();
          this._moveActive(-1);
          break;
        case 'Enter':
          e.preventDefault();
          if (this._activeIndex >= 0 && this._activeIndex < items.length) {
            this.selectItem(items[this._activeIndex]);
          }
          break;
        case 'Home':
          e.preventDefault();
          this._setActive(0);
          break;
        case 'End':
          e.preventDefault();
          this._setActive(items.length - 1);
          break;
      }
    });
  }

  _setupList() {
    // Click on items
    this.listen(this._list, 'click', (e) => {
      const item = e.target.closest('[data-part="item"]');
      if (item && !item.hasAttribute('disabled')) {
        this.selectItem(item);
      }
    });

    // Mouse hover updates active item
    this.listen(this._list, 'mousemove', (e) => {
      const item = e.target.closest('[data-part="item"]');
      if (item && !item.hasAttribute('disabled')) {
        const items = this._getVisibleItems();
        const idx = items.indexOf(item);
        if (idx !== -1 && idx !== this._activeIndex) {
          this._setActive(idx);
        }
      }
    });
  }

  _setupGlobalShortcut() {
    // Only bind global shortcut if shortcut attribute is explicitly defined and not 'none'
    const shortcut = this.getAttribute('shortcut');
    if (!shortcut || shortcut === 'none') return;

    this.listen(window, 'keydown', (e) => {
      if (e.defaultPrevented) return;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === shortcut.toLowerCase()) {
        e.preventDefault();
        this.toggle();
      }
    });
  }

  _getVisibleItems() {
    return Array.from(this.querySelectorAll('[data-part="item"]')).filter(
      (item) => !item.hasAttribute('hidden') && item.style.display !== 'none'
    );
  }

  _moveActive(step) {
    const items = this._getVisibleItems();
    if (!items.length) return;

    let next = this._activeIndex + step;
    if (next < 0) next = items.length - 1;
    if (next >= items.length) next = 0;

    this._setActive(next);
  }

  _setActive(index) {
    const items = this._getVisibleItems();
    items.forEach((item, idx) => {
      const isActive = idx === index;
      this.setAttributeSafe(item, 'data-active', isActive ? 'true' : false);
      this.setAttributeSafe(item, 'aria-selected', isActive ? 'true' : false);
      if (isActive) {
        if (!item.id) item.id = generateUniqueId('cmd-item');
        if (this._input) {
          this.setAttributeSafe(this._input, 'aria-activedescendant', item.id);
        }
        item.scrollIntoView({ block: 'nearest' });
      }
    });
    this._activeIndex = index;
  }

  filter(query) {
    const q = (query || '').trim().toLowerCase();
    const items = Array.from(this.querySelectorAll('[data-part="item"]'));
    let visibleCount = 0;

    items.forEach((item) => {
      const value = (item.getAttribute('data-value') || '').toLowerCase();
      const text = item.textContent.toLowerCase();
      const keywords = (item.getAttribute('data-keywords') || '').toLowerCase();

      const matches = !q || value.includes(q) || text.includes(q) || keywords.includes(q);

      if (matches) {
        item.removeAttribute('hidden');
        visibleCount++;
      } else {
        item.setAttribute('hidden', '');
        item.removeAttribute('data-active');
        item.removeAttribute('aria-selected');
      }
    });

    // Check parent groups and hide empty ones
    const groups = Array.from(this.querySelectorAll('[data-part="group"]'));
    groups.forEach((group) => {
      const groupVisibleItems = group.querySelectorAll('[data-part="item"]:not([hidden])');
      if (groupVisibleItems.length === 0) {
        group.setAttribute('hidden', '');
      } else {
        group.removeAttribute('hidden');
      }
    });

    // Toggle empty state message
    if (this._empty) {
      if (visibleCount === 0) {
        this._empty.removeAttribute('hidden');
      } else {
        this._empty.setAttribute('hidden', '');
      }
    }

    // Reset active index to first item
    this._setActive(visibleCount > 0 ? 0 : -1);
  }

  selectItem(item) {
    const value = item.getAttribute('data-value') || item.textContent.trim();
    const label = item.textContent.trim();

    this.dispatch('change', { value, label, item });
    this.dispatch('select', { value, label, item });

    if (this._dialog && this._isOpen) {
      this.close();
    }
  }

  showModal(triggerElement = null) {
    if (this._dialog && !this._dialog.open) {
      this._dialog.showModal();
      this._isOpen = true;
      this.setAttribute('open', '');
      this.filter('');
      if (this._input) {
        this._input.value = '';
        setTimeout(() => this._input.focus(), 50);
      }
      this.dispatch('open');
    }
  }

  open() {
    this.showModal();
  }

  close() {
    if (this._dialog && this._dialog.open) {
      this._dialog.close();
      this._isOpen = false;
      this.removeAttribute('open');
    }
  }

  toggle() {
    if (this._isOpen || (this._dialog && this._dialog.open)) {
      this.close();
    } else {
      this.showModal();
    }
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'open') {
      if (newVal !== null && !this._isOpen) {
        this.showModal();
      } else if (newVal === null && this._isOpen) {
        this.close();
      }
    }
  }
}
