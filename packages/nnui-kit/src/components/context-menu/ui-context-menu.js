import { BaseLightElement } from '../../utils/base-element.js';
import { Keys } from '../../utils/a11y.js';

/**
 * <ui-context-menu> Micro-Enhancer
 * Accessible right-click context menu in Light-DOM.
 * 
 * Features:
 * - Native pointer coordinates positioning with boundary collision prevention
 * - Top-layer Popover API support with seamless fallback
 * - Keyboard navigation (ArrowUp, ArrowDown, Enter, Esc)
 * - Auto-dismiss on click outside or item activation
 * - Dispatches 'open', 'close', and 'select' CustomEvents
 */
export class UiContextMenu extends BaseLightElement {
  static get observedAttributes() {
    return ['disabled'];
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }

  set disabled(val) {
    if (val) {
      this.setAttributeSafe('disabled', '');
    } else {
      this.removeAttributeSafe('disabled');
    }
  }

  get isOpen() {
    const menu = this.querySelector('[data-part="menu"]');
    if (!menu) return false;
    return menu.matches?.(':popover-open') || menu.getAttribute('data-state') === 'open';
  }

  set isOpen(val) {
    if (val) this.open();
    else this.close();
  }

  init() {
    this.setAttributeSafe('data-ui', 'context-menu');

    this._menu = this.querySelector('[data-part="menu"]');
    this._area = this.querySelector('[data-part="area"]') || this;

    if (this._menu) {
      if (!this._menu.hasAttribute('popover')) {
        this._menu.setAttribute('popover', 'auto');
      }
      this._menu.setAttribute('role', 'menu');
      this.setAttributeSafe(this._menu, 'data-state', 'closed');
    }

    this._bindEvents();
  }

  _getItems() {
    if (!this._menu) return [];
    return Array.from(this._menu.querySelectorAll('[data-part="item"], [role="menuitem"], button'));
  }

  _bindEvents() {
    if (!this._area || !this._menu) return;

    this.listen(this._area, 'contextmenu', (e) => {
      if (this.disabled) return;
      e.preventDefault();
      this.openAt(e.clientX, e.clientY);
    });

    // Close when clicking item
    this.listen(this._menu, 'click', (e) => {
      const item = e.target.closest('[data-part="item"], [role="menuitem"]');
      if (item && !item.hasAttribute('disabled')) {
        const value = item.getAttribute('data-value') || item.textContent.trim();
        this.dispatch('select', { value, item });
        this.close();
      }
    });

    // Keyboard navigation
    this.listen(this._menu, 'keydown', (e) => {
      const items = this._getItems().filter(it => !it.hasAttribute('disabled'));
      if (items.length === 0) return;

      const currentIdx = items.indexOf(document.activeElement);

      if (e.key === Keys.ARROW_DOWN) {
        e.preventDefault();
        const next = currentIdx < items.length - 1 ? currentIdx + 1 : 0;
        items[next].focus();
      } else if (e.key === Keys.ARROW_UP) {
        e.preventDefault();
        const prev = currentIdx > 0 ? currentIdx - 1 : items.length - 1;
        items[prev].focus();
      } else if (e.key === Keys.ESCAPE) {
        e.preventDefault();
        this.close();
      }
    });

    // Sync state when native popover toggles
    this.listen(this._menu, 'toggle', (e) => {
      const isOpen = e.newState === 'open';
      this.setAttributeSafe(this._menu, 'data-state', isOpen ? 'open' : 'closed');
      if (isOpen) {
        this.dispatch('open');
      } else {
        this.dispatch('close');
      }
    });

    // Global click-outside fallback when popover API is not native
    this.listen(document, 'pointerdown', (e) => {
      if (!this.isOpen) return;
      if (!this._menu.contains(e.target)) {
        this.close();
      }
    });
  }

  openAt(clientX, clientY) {
    if (!this._menu) return;

    // Reset styles to calculate natural dimensions
    this._menu.style.position = 'fixed';
    this._menu.style.margin = '0';
    this._menu.style.inset = 'unset';
    this._menu.style.zIndex = '9999';

    // Show menu first so dimensions can be measured
    if (typeof this._menu.showPopover === 'function') {
      try {
        this._menu.showPopover();
      } catch (err) {
        // Fallback
        this._menu.setAttribute('data-state', 'open');
        this._menu.style.display = 'block';
      }
    } else {
      this._menu.setAttribute('data-state', 'open');
      this._menu.style.display = 'block';
    }

    this.setAttributeSafe(this._menu, 'data-state', 'open');

    // Calculate boundary collisions
    const menuWidth = this._menu.offsetWidth || 180;
    const menuHeight = this._menu.offsetHeight || 150;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let posX = clientX;
    let posY = clientY;

    if (posX + menuWidth > viewportWidth) {
      posX = Math.max(10, clientX - menuWidth);
    }
    if (posY + menuHeight > viewportHeight) {
      posY = Math.max(10, clientY - menuHeight);
    }

    this._menu.style.left = `${posX}px`;
    this._menu.style.top = `${posY}px`;

    // Focus first available item
    const items = this._getItems().filter(it => !it.hasAttribute('disabled'));
    if (items.length > 0) {
      setTimeout(() => items[0].focus(), 10);
    }

    this.dispatch('open', { x: posX, y: posY });
  }

  close() {
    if (!this._menu) return;

    if (typeof this._menu.hidePopover === 'function') {
      try {
        this._menu.hidePopover();
      } catch (err) {
        // Fallback
        this._menu.removeAttribute('data-state');
        this._menu.style.display = 'none';
      }
    } else {
      this._menu.removeAttribute('data-state');
      this._menu.style.display = 'none';
    }

    this.setAttributeSafe(this._menu, 'data-state', 'closed');
    this.dispatch('close');
  }
}
