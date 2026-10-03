import { BaseLightElement } from '../../utils/base-element.js';
import { Keys, getNextIndex, generateUniqueId } from '../../utils/a11y.js';
import { applyPositionFallback } from '../../utils/anchor-fallback.js';

/**
 * <ui-dropdown> Micro-Enhancer
 * WAI-ARIA APG Compliant Dropdown Menu Pattern in Light-DOM.
 * Invariant: Mutates attributes, never nodes.
 */
export class UiDropdown extends BaseLightElement {
  static get observedAttributes() {
    return ['open'];
  }

  get isOpen() {
    return this.hasAttribute('open') || this._menu?.getAttribute('data-state') === 'open';
  }

  init() {
    this.setAttributeSafe(this, 'data-ui', 'dropdown');
    this._trigger = this.querySelector('[data-part="trigger"], button');
    this._menu = this.querySelector('[data-part="menu"], [role="menu"], ul, ol, div');
    this._activeIndex = -1;

    if (!this._trigger || !this._menu) return;

    this._setupARIA();
    this._bindEvents();
  }

  _getItems() {
    if (!this._menu) return [];
    return Array.from(
      this._menu.querySelectorAll('[data-part="item"], [role="menuitem"], li, button')
    ).filter((item) => !item.hasAttribute('disabled') && item.getAttribute('aria-disabled') !== 'true');
  }

  _setupARIA() {
    const baseId = this.id || generateUniqueId('dropdown');
    const menuId = this._menu.id || `${baseId}-menu`;

    this.setAttributeSafe(this._trigger, 'aria-haspopup', 'menu');
    this.setAttributeSafe(this._trigger, 'aria-expanded', 'false');
    this.setAttributeSafe(this._trigger, 'aria-controls', menuId);

    this.setAttributeSafe(this._menu, 'id', menuId);
    this.setAttributeSafe(this._menu, 'role', 'menu');
    this.setAttributeSafe(this._menu, 'data-state', 'closed');
    this.setAttributeSafe(this._menu, 'tabindex', '-1');

    this._getItems().forEach((item, idx) => {
      const itemId = item.id || `${baseId}-item-${idx}`;
      this.setAttributeSafe(item, 'id', itemId);
      this.setAttributeSafe(item, 'role', 'menuitem');
      this.setAttributeSafe(item, 'tabindex', '-1');
    });
  }

  _bindEvents() {
    // 1. Trigger click toggle
    this.listen(this._trigger, 'click', (e) => {
      e.preventDefault();
      this.toggle();
    });

    // 2. Keyboard navigation on trigger
    this.listen(this._trigger, 'keydown', (e) => {
      if (e.key === Keys.ARROW_DOWN || e.key === Keys.ENTER || e.key === Keys.SPACE) {
        e.preventDefault();
        this.open(0);
      } else if (e.key === Keys.ARROW_UP) {
        e.preventDefault();
        const items = this._getItems();
        this.open(items.length - 1);
      }
    });

    // 3. Keyboard navigation inside menu
    this.listen(this._menu, 'keydown', (e) => {
      const items = this._getItems();
      if (!items.length) return;

      switch (e.key) {
        case Keys.ARROW_DOWN:
          e.preventDefault();
          this._focusItem(getNextIndex(this._activeIndex, items.length, 1));
          break;
        case Keys.ARROW_UP:
          e.preventDefault();
          this._focusItem(getNextIndex(this._activeIndex, items.length, -1));
          break;
        case Keys.HOME:
          e.preventDefault();
          this._focusItem(0);
          break;
        case Keys.END:
          e.preventDefault();
          this._focusItem(items.length - 1);
          break;
        case Keys.ENTER:
        case Keys.SPACE: {
          e.preventDefault();
          if (this._activeIndex >= 0 && items[this._activeIndex]) {
            this.selectItem(items[this._activeIndex]);
          }
          break;
        }
        case Keys.ESCAPE:
          e.preventDefault();
          this.close();
          this._trigger?.focus();
          break;
        case Keys.TAB:
          this.close();
          break;
      }
    });

    // 4. Click delegation on menu items
    this.listen(this._menu, 'click', (e) => {
      const item = e.target.closest('[data-part="item"], [role="menuitem"], li, button');
      if (item && this._menu.contains(item)) {
        if (item.hasAttribute('disabled') || item.getAttribute('aria-disabled') === 'true') {
          return;
        }
        this.selectItem(item);
      }
    });

    // 5. Dismiss on pointerdown outside
    this.listen(document, 'pointerdown', (e) => {
      if (!this.contains(e.target) && this.isOpen) {
        this.close();
      }
    });

    // 6. Reposition on scroll / resize
    const onScrollOrResize = () => {
      if (this.isOpen) {
        this._reposition();
      }
    };
    this.listen(window, 'resize', onScrollOrResize, { passive: true });
    this.listen(window, 'scroll', onScrollOrResize, { passive: true });
  }

  _reposition() {
    if (!this._trigger || !this._menu) return;
    applyPositionFallback(this._trigger, this._menu, 'bottom', 6);
  }

  _focusItem(index) {
    const items = this._getItems();
    if (!items.length) return;

    items.forEach((item, idx) => {
      const isFocused = idx === index;
      this.setAttributeSafe(item, 'data-focused', isFocused ? 'true' : 'false');
      this.setAttributeSafe(item, 'tabindex', isFocused ? '0' : '-1');
    });

    this._activeIndex = index;
    if (items[index]) {
      items[index].focus();
    }
  }

  open(focusIndex = -1) {
    if (!this._menu) return;
    this.setAttributeSafe(this, 'open', '');
    this.setAttributeSafe(this._trigger, 'aria-expanded', 'true');
    this.setAttributeSafe(this._menu, 'data-state', 'open');

    this._reposition();
    requestAnimationFrame(() => {
      this._reposition();
      if (focusIndex >= 0) {
        this._focusItem(focusIndex);
      } else {
        this._menu.focus();
      }
    });

    this.dispatch('open');
  }

  close() {
    if (!this._menu) return;
    this.removeAttribute('open');
    this.setAttributeSafe(this._trigger, 'aria-expanded', 'false');
    this.setAttributeSafe(this._menu, 'data-state', 'closed');
    this._activeIndex = -1;

    const items = this._getItems();
    items.forEach((item) => {
      this.setAttributeSafe(item, 'data-focused', 'false');
      this.setAttributeSafe(item, 'tabindex', '-1');
    });

    this.dispatch('close');
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  selectItem(item) {
    const value = item.dataset.value || item.getAttribute('value') || item.textContent.trim();
    const label = item.textContent.trim();

    this.dispatch('select', { value, label, item });
    this.close();
    this._trigger?.focus();
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'open') {
      if (newVal !== null && !this.isOpen) {
        this.open();
      } else if (newVal === null && this.isOpen) {
        this.close();
      }
    }
  }
}
