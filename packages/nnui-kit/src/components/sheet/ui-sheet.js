import { BaseLightElement } from '../../utils/base-element.js';

/**
 * UiSheet
 * Platform-Native, Light-DOM Slide-Out Sheet / Drawer.
 * 
 * Invariants:
 * 1. Zero Shadow DOM: Pure Light-DOM rendering.
 * 2. Uses native browser <dialog> top-layer for guaranteed focus-trap & accessibility.
 * 3. Sides: right (default), left, top, bottom.
 */
export class UiSheet extends BaseLightElement {
  static get observedAttributes() {
    return ['open', 'side'];
  }

  constructor() {
    super();
    this._isOpen = false;
    this._isClosing = false;
  }

  init() {
    this.warnIfMissing('dialog[data-part="dialog"]', 'Native dialog sheet element');

    this._dialog = this.querySelector('dialog[data-part="dialog"]');
    this._trigger = this.querySelector('[data-part="trigger"]');

    if (!this.hasAttribute('side')) {
      this.setAttribute('side', 'right');
    }

    this._setupTrigger();
    this._setupDialog();
    this._setupCloseButtons();
  }

  _setupTrigger() {
    if (this._trigger) {
      this.listen(this._trigger, 'click', (e) => {
        e.preventDefault();
        this.showModal(this._trigger);
      });
    }
  }

  _setupDialog() {
    if (!this._dialog) return;

    // Click on backdrop dismisses the sheet
    this.listen(this._dialog, 'click', (e) => {
      const rect = this._dialog.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInDialog && !this._isClosing) {
        this.close('backdrop');
      }
    });

    this.listen(this._dialog, 'keydown', (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (!this._isClosing) {
          this.close('escape');
        }
      }
    });

    this.listen(this._dialog, 'close', () => {
      this._isOpen = false;
      this._isClosing = false;
      this.removeAttribute('open');
      this.removeAttribute('data-closing');
      this.dispatch('close');
    });
  }

  _setupCloseButtons() {
    const closeBtns = this.querySelectorAll('[data-part="close"]');
    closeBtns.forEach((btn) => {
      this.listen(btn, 'click', () => {
        this.close('close-button');
      });
    });
  }

  showModal(triggerElement = null) {
    if (!this._dialog) return;
    this._triggerElement = triggerElement || this._trigger;

    this._dialog.showModal();
    this._isOpen = true;
    this._isClosing = false;
    this.setAttribute('open', '');
    this.removeAttribute('data-closing');
    this.dispatch('open');
  }

  open() {
    this.showModal();
  }

  close(reason = 'programmatic') {
    if (!this._dialog || !this._dialog.open || this._isClosing) return;

    this._isClosing = true;
    this.removeAttribute('open');
    this.setAttribute('data-closing', 'true');

    // Wait for slide-out CSS transition before calling native dialog.close()
    const handleTransitionEnd = () => {
      this._dialog.removeEventListener('animationend', handleTransitionEnd);
      this._dialog.removeEventListener('transitionend', handleTransitionEnd);
      if (this._dialog.open) {
        this._dialog.close(reason);
      }
      this._isClosing = false;
      this.removeAttribute('data-closing');
      if (this._triggerElement) {
        try {
          this._triggerElement.focus();
        } catch (_) {}
      }
    };

    this._dialog.addEventListener('animationend', handleTransitionEnd, { once: true });
    this._dialog.addEventListener('transitionend', handleTransitionEnd, { once: true });

    // Fallback timer in case transitions are disabled in user styles
    setTimeout(handleTransitionEnd, 300);
  }

  toggle() {
    if (this._isOpen) {
      this.close();
    } else {
      this.showModal();
    }
  }

  get side() {
    return this.getAttribute('side') || 'right';
  }

  set side(val) {
    this.setAttribute('side', val);
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'open') {
      if (newVal !== null && !this._isOpen) {
        this.showModal();
      } else if (newVal === null && this._isOpen && !this._isClosing) {
        this.close();
      }
    }
  }
}
