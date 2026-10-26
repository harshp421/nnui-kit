import { BaseLightElement } from '../../utils/base-element.js';
import { Keys, getNextIndex } from '../../utils/a11y.js';

/**
 * <ui-navigation-menu> Micro-Enhancer
 * Accessible top-level application navigation and mega-menu in Light-DOM.
 * 
 * Features:
 * - WAI-ARIA APG Menubar pattern (role="menubar", role="menuitem")
 * - Roving tabindex across top items with ArrowLeft / ArrowRight
 * - ArrowDown to enter submenus, Escape to close
 * - Hover intent timer to prevent flicker
 * - Top-layer Popover API submenu positioning
 */
export class UiNavigationMenu extends BaseLightElement {
  static get observedAttributes() {
    return ['delay', 'disabled'];
  }

  get delay() {
    const d = parseInt(this.getAttribute('delay'), 10);
    return isNaN(d) ? 150 : d;
  }

  set delay(val) {
    if (val !== null && val !== undefined) this.setAttributeSafe('delay', String(val));
    else this.removeAttributeSafe('delay');
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }

  set disabled(val) {
    if (val) this.setAttributeSafe('disabled', '');
    else this.removeAttributeSafe('disabled');
  }

  init() {
    if (this._initialized) return;
    this.setAttributeSafe('data-ui', 'navigation-menu');

    this._nav = this.querySelector('[data-part="menubar"], [data-part="list"], nav') || this;
    this.setAttributeSafe(this._nav, 'role', 'menubar');

    this._activeItem = null;
    this._hoverTimeout = null;

    this._setupStructure();
    this._bindEvents();
  }

  _getItems() {
    return Array.from(this.querySelectorAll('[data-part="item"]'));
  }

  _getTriggers() {
    return Array.from(this.querySelectorAll('[data-part="trigger"]'));
  }

  _setupStructure() {
    const items = this._getItems();
    const triggers = this._getTriggers();

    triggers.forEach((trigger, idx) => {
      trigger.setAttribute('role', 'menuitem');
      trigger.setAttribute('tabindex', idx === 0 ? '0' : '-1');
      trigger.setAttribute('aria-haspopup', 'true');
      trigger.setAttribute('aria-expanded', 'false');

      const content = trigger.closest('[data-part="item"]')?.querySelector('[data-part="content"]');
      if (content) {
        content.setAttribute('role', 'menu');
        content.removeAttribute('popover');
        content.setAttribute('data-state', 'closed');
      }
    });
  }

  _bindEvents() {
    const items = this._getItems();

    items.forEach((item) => {
      const trigger = item.querySelector('[data-part="trigger"]');
      const content = item.querySelector('[data-part="content"]');
      if (!trigger || !content) return;

      // Click toggle
      this.listen(trigger, 'click', (e) => {
        if (this.disabled) return;
        e.preventDefault();
        const isOpen = trigger.getAttribute('aria-expanded') === 'true';
        if (isOpen) {
          this.closeItem(item);
        } else {
          this.openItem(item);
        }
      });

      // Hover with delay
      this.listen(item, 'mouseenter', () => {
        if (this.disabled) return;
        clearTimeout(this._hoverTimeout);
        this._hoverTimeout = setTimeout(() => {
          this.openItem(item);
        }, this.delay);
      });

      this.listen(item, 'mouseleave', () => {
        if (this.disabled) return;
        clearTimeout(this._hoverTimeout);
        this._hoverTimeout = setTimeout(() => {
          this.closeItem(item);
        }, this.delay + 50);
      });
    });

    // Keyboard roving focus across triggers
    this.listen(this, 'keydown', (e) => {
      if (this.disabled) return;
      const triggers = this._getTriggers();
      const currentIdx = triggers.indexOf(document.activeElement);

      if (currentIdx !== -1) {
        if (e.key === Keys.ARROW_RIGHT) {
          e.preventDefault();
          const nextIdx = getNextIndex(currentIdx, triggers.length, 1, true);
          triggers[nextIdx].focus();
        } else if (e.key === Keys.ARROW_LEFT) {
          e.preventDefault();
          const prevIdx = getNextIndex(currentIdx, triggers.length, -1, true);
          triggers[prevIdx].focus();
        } else if (e.key === Keys.ARROW_DOWN) {
          e.preventDefault();
          const item = triggers[currentIdx].closest('[data-part="item"]');
          this.openItem(item);
          const firstSubLink = item.querySelector('[data-part="content"] a, [data-part="content"] button');
          firstSubLink?.focus();
        }
      } else if (e.key === Keys.ESCAPE) {
        if (this._activeItem) {
          e.preventDefault();
          const trigger = this._activeItem.querySelector('[data-part="trigger"]');
          this.closeItem(this._activeItem);
          trigger?.focus();
        }
      }
    });

    // Document click to close
    this.listen(document, 'pointerdown', (e) => {
      if (!this.contains(e.target)) {
        this.closeAll();
      }
    });
  }

  openItem(item) {
    if (!item) return;
    this.closeAll();

    const trigger = item.querySelector('[data-part="trigger"]');
    const content = item.querySelector('[data-part="content"]');
    if (!trigger || !content) return;

    trigger.setAttribute('aria-expanded', 'true');
    content.setAttribute('data-state', 'open');

    this._activeItem = item;
    this.dispatch('open', { item });
  }

  closeItem(item) {
    if (!item) return;

    const trigger = item.querySelector('[data-part="trigger"]');
    const content = item.querySelector('[data-part="content"]');
    if (!trigger || !content) return;

    trigger.setAttribute('aria-expanded', 'false');
    content.setAttribute('data-state', 'closed');

    if (this._activeItem === item) {
      this._activeItem = null;
    }

    this.dispatch('close', { item });
  }

  closeAll() {
    this._getItems().forEach(it => this.closeItem(it));
  }
}
