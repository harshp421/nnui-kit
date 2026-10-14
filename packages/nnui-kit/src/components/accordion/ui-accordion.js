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

  get collapsible() {
    return this.getAttribute('collapsible') !== 'false';
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

    this.setAttributeSafe(item, 'data-state', open ? 'open' : 'closed');
    if (trigger) {
      this.setAttributeSafe(trigger, 'aria-expanded', open ? 'true' : 'false');
    }
    if (content) {
      if (open) {
        content.removeAttribute('hidden');
      } else {
        content.setAttribute('hidden', '');
      }
    }
  }
}
