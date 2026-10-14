import { BaseLightElement } from '../../utils/base-element.js';

/**
 * <ui-dialog> Micro-Enhancer
 * Wraps native HTML <dialog> in Light-DOM with focus restoration & backdrop dismiss.
 */
export class UiDialog extends BaseLightElement {
  static get observedAttributes() {
    return ['open'];
  }

  get isOpen() {
    return this._dialog ? this._dialog.hasAttribute('open') : false;
  }

  init() {
    this.setAttributeSafe(this, 'data-ui', 'dialog-container');
    this._dialog = this.querySelector('dialog');
    this._trigger = null;

    if (!this._dialog) {
      console.warn(`[NNUI-KIT] <${this.tagName.toLowerCase()}> is missing expected <dialog> element. Add a <dialog> element inside.`);
      return;
    }

    this._setupDialog();
    this._bindEvents();
  }

  _setupDialog() {
    this.setAttributeSafe(this._dialog, 'data-ui', 'dialog');
    if (this.hasAttribute('open') && !this._dialog.open) {
      this.showModal();
    }
  }

  _bindEvents() {
    // 1. Trigger click inside <ui-dialog> (e.g. <button data-part="trigger">)
    this.listen(this, 'click', (e) => {
      const trigger = e.target.closest('[data-part="trigger"], [data-trigger]');
      if (trigger && (!this._dialog || !this._dialog.contains(trigger))) {
        e.preventDefault();
        this.showModal(trigger);
      }
    });

    // 2. Global trigger support for external buttons with data-dialog-target="id"
    this.listen(document, 'click', (e) => {
      if (!this.id) return;
      const trigger = e.target.closest(`[data-dialog-target="${this.id}"], [data-target="${this.id}"]`);
      if (trigger && !this.contains(trigger)) {
        e.preventDefault();
        this.showModal(trigger);
      }
    });

    // 3. Backdrop click dismiss (native <dialog> backdrop click has e.target === dialog)
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
        this.close('backdrop');
      }
    });

    // 4. Close button click delegation ([data-part="dialog-close"], [data-part="close"], [data-close])
    this.listen(this._dialog, 'click', (e) => {
      const closeBtn = e.target.closest('[data-part="dialog-close"], [data-part="close"], [data-close]');
      if (closeBtn && this._dialog.contains(closeBtn)) {
        e.preventDefault();
        this.close('button');
      }
    });

    // 5. Native cancel event (Esc key)
    this.listen(this._dialog, 'cancel', (e) => {
      this.removeAttribute('open');
      this.dispatch('close', { reason: 'escape' });
      this._restoreFocus();
    });

    // 6. Native close event
    this.listen(this._dialog, 'close', () => {
      this.removeAttribute('open');
      this.dispatch('close', { reason: 'api' });
      this._restoreFocus();
    });
  }

  showModal(triggerElement = null) {
    if (!this._dialog || this.isOpen) return;
    this._trigger = triggerElement || document.activeElement;
    this._dialog.showModal();
    this.setAttributeSafe(this, 'open', '');
    this.dispatch('open');
  }

  close(reason = 'programmatic') {
    if (!this._dialog || !this.isOpen) return;
    this._dialog.close();
    this.removeAttribute('open');
    this.dispatch('close', { reason });
    this._restoreFocus();
  }

  _restoreFocus() {
    if (this._trigger && typeof this._trigger.focus === 'function') {
      this._trigger.focus();
      this._trigger = null;
    }
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'open' && this._dialog) {
      if (newVal !== null && !this.isOpen) {
        this.showModal();
      } else if (newVal === null && this.isOpen) {
        this.close();
      }
    }
  }
}
