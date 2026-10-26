import { BaseLightElement } from '../../utils/base-element.js';
import { Keys, generateUniqueId } from '../../utils/a11y.js';

/**
 * <ui-tooltip> Micro-Enhancer
 * Accessible tooltip with hover/focus triggers, escape dismiss, and automatic ARIA bindings.
 */
export class UiTooltip extends BaseLightElement {
  static get observedAttributes() {
    return ['delay'];
  }

  get delay() {
    return parseInt(this.getAttribute('delay') || '150', 10);
  }

  set delay(val) {
    if (val !== null && val !== undefined) this.setAttributeSafe(this, 'delay', String(val));
    else this.removeAttributeSafe(this, 'delay');
  }

  init() {
    this.setAttributeSafe(this, 'data-ui', 'tooltip');
    this._trigger = this.querySelector('[data-part="trigger"]');
    this._content = this.querySelector('[data-part="content"], [data-ui="tooltip-content"]');
    this._timer = null;

    if (!this._trigger || !this._content) return;

    // Ensure content does not have stray popover attribute causing browser UA display:none
    if (this._content.hasAttribute('popover')) {
      this._content.removeAttribute('popover');
    }

    this._setupARIA();
    this._bindEvents();
  }

  _setupARIA() {
    const baseId = this.id || generateUniqueId('tooltip');
    const contentId = this._content.id || `${baseId}-content`;

    this.setAttributeSafe(this._content, 'id', contentId);
    this.setAttributeSafe(this._content, 'role', 'tooltip');
    this.setAttributeSafe(this._trigger, 'aria-describedby', contentId);
  }

  _bindEvents() {
    // Pointer hover
    this.listen(this, 'pointerenter', () => this.scheduleShow());
    this.listen(this, 'pointerleave', () => this.hide());

    // Focus triggers for keyboard accessibility
    this.listen(this._trigger, 'focusin', () => this.show());
    this.listen(this._trigger, 'focusout', () => this.hide());

    // Dismiss on Escape
    this.listen(window, 'keydown', (e) => {
      if (e.key === Keys.ESCAPE && this.getAttribute('data-state') === 'visible') {
        this.hide();
      }
    });
  }

  scheduleShow() {
    this.clearTimer();
    this._timer = setTimeout(() => {
      this.show();
    }, this.delay);
  }

  show() {
    this.clearTimer();
    this.setAttributeSafe(this, 'data-state', 'visible');
    if (this._content) {
      this.setAttributeSafe(this._content, 'data-state', 'visible');
    }
  }

  hide() {
    this.clearTimer();
    this.setAttributeSafe(this, 'data-state', 'hidden');
    if (this._content) {
      this.setAttributeSafe(this._content, 'data-state', 'hidden');
    }
  }

  clearTimer() {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
  }

  destroy() {
    this.clearTimer();
  }
}
