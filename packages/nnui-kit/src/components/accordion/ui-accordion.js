import { BaseLightElement } from '../../utils/base-element.js';
import { Keys, getNextIndex, generateUniqueId } from '../../utils/a11y.js';

/**
 * <ui-accordion> Micro-Enhancer
 * WAI-ARIA APG Compliant Accordion Pattern
 * Invariant: Mutates attributes, never nodes. Light-DOM native.
 */
export class UiAccordion extends BaseLightElement {
  static get observedAttributes() {
    return ['type', 'collapsible'];
  }

  get type() {
    return this.getAttribute('type') || 'single'; // 'single' | 'multiple'
  }

  set type(val) {
    if (val) this.setAttribute('type', val);
    else this.removeAttribute('type');
  }

  get collapsible() {
    return this.getAttribute('collapsible') !== 'false';
  }

  set collapsible(val) {
    if (val === false || val === 'false') {
      this.setAttribute('collapsible', 'false');
    } else {
      this.removeAttribute('collapsible');
    }
  }

  init() {
    this.setAttributeSafe(this, 'data-ui', 'accordion');
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
    const baseId = this.id || generateUniqueId('accordion');
    const items = this._getItems();

    items.forEach((item, index) => {
      const trigger = item.querySelector('[data-part="trigger"]');
      const content = item.querySelector('[data-part="content"]');

      if (trigger && content) {
        const triggerId = trigger.id || `${baseId}-trigger-${index}`;
        const contentId = content.id || `${baseId}-content-${index}`;

        this.setAttributeSafe(trigger, 'id', triggerId);
        this.setAttributeSafe(trigger, 'aria-controls', contentId);
        this.setAttributeSafe(content, 'id', contentId);
        this.setAttributeSafe(content, 'role', 'region');
        this.setAttributeSafe(content, 'aria-labelledby', triggerId);

        const isOpen = item.getAttribute('data-state') === 'open' || trigger.getAttribute('aria-expanded') === 'true';
        this.setAttributeSafe(trigger, 'aria-expanded', isOpen ? 'true' : 'false');
        this.setAttributeSafe(item, 'data-state', isOpen ? 'open' : 'closed');
        this.setAttributeSafe(content, 'data-state', isOpen ? 'open' : 'closed');

        // Ensure inner content wrapper for smooth CSS grid height animation
        if (!content.querySelector('[data-part="content-inner"]')) {
          const inner = document.createElement('div');
          inner.setAttribute('data-part', 'content-inner');
          while (content.firstChild) {
            inner.appendChild(content.firstChild);
          }
          content.appendChild(inner);
        }

        if (!isOpen) {
          content.setAttribute('hidden', '');
        } else {
          content.removeAttribute('hidden');
        }
      }
    });
  }

  _bindEvents() {
    // Click delegation
    this.listen(this, 'click', (e) => {
      const trigger = e.target.closest('[data-part="trigger"]');
      if (trigger && this.contains(trigger)) {
        e.preventDefault();
        const item = trigger.closest('[data-part="item"]');
        if (item) {
          this.toggleItem(item);
        }
      }
    });

    // Keyboard navigation (Up/Down/Home/End)
    this.listen(this, 'keydown', (e) => {
      const trigger = e.target.closest('[data-part="trigger"]');
      if (!trigger) return;

      const triggers = this._getTriggers();
      const currentIndex = triggers.indexOf(trigger);
      let nextIndex = -1;

      switch (e.key) {
        case Keys.ARROW_DOWN:
          e.preventDefault();
          nextIndex = getNextIndex(currentIndex, triggers.length, 1);
          break;
        case Keys.ARROW_UP:
          e.preventDefault();
          nextIndex = getNextIndex(currentIndex, triggers.length, -1);
          break;
        case Keys.HOME:
          e.preventDefault();
          nextIndex = 0;
          break;
        case Keys.END:
          e.preventDefault();
          nextIndex = triggers.length - 1;
          break;
      }

      if (nextIndex >= 0 && nextIndex !== currentIndex) {
        triggers[nextIndex]?.focus();
      }
    });
  }

  toggleItem(targetItem) {
    const isSingle = this.type === 'single';
    const isCurrentlyOpen = targetItem.getAttribute('data-state') === 'open';

    if (isCurrentlyOpen && !this.collapsible && isSingle) {
      return; // Cannot collapse if non-collapsible single mode
    }

    if (isSingle) {
      this._getItems().forEach((item) => {
        const shouldOpen = item === targetItem && !isCurrentlyOpen;
        this._setItemState(item, shouldOpen);
      });
    } else {
      this._setItemState(targetItem, !isCurrentlyOpen);
    }

    const value = targetItem.dataset.value || '';
    this.dispatch('change', {
      value,
      open: !isCurrentlyOpen,
    });
  }

  _setItemState(item, open) {
    const trigger = item.querySelector('[data-part="trigger"]');
    const content = item.querySelector('[data-part="content"]');

    if (open) {
      this.setAttributeSafe(item, 'data-state', 'open');
      if (trigger) {
        this.setAttributeSafe(trigger, 'aria-expanded', 'true');
      }
      if (content) {
        content.removeAttribute('hidden');
        this.setAttributeSafe(content, 'data-state', 'open');
      }
    } else {
      this.setAttributeSafe(item, 'data-state', 'closed');
      if (trigger) {
        this.setAttributeSafe(trigger, 'aria-expanded', 'false');
      }
      if (content) {
        this.setAttributeSafe(content, 'data-state', 'closed');
        // Smoothly wait for CSS transition to collapse before setting hidden
        let closed = false;
        const finalizeClose = () => {
          if (closed) return;
          closed = true;
          if (item.getAttribute('data-state') === 'closed') {
            content.setAttribute('hidden', '');
          }
          content.removeEventListener('transitionend', finalizeClose);
        };
        content.addEventListener('transitionend', finalizeClose, { once: true });
        setTimeout(finalizeClose, 280);
      }
    }
  }
}
