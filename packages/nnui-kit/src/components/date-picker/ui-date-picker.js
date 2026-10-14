import { BaseLightElement } from '../../utils/base-element.js';
import { applyPositionFallback } from '../../utils/anchor-fallback.js';
import '../calendar/ui-calendar.js';

/**
 * <ui-date-picker> Micro-Enhancer
 * Composed Light-DOM date picker primitive combining popover and <ui-calendar>.
 * Form-associated via ElementInternals.
 */
export class UiDatePicker extends BaseLightElement {
  static formAssociated = true;

  static get observedAttributes() {
    return ['value', 'placeholder', 'disabled', 'open', 'min', 'max'];
  }

  constructor() {
    super();
    if (typeof this.attachInternals === 'function') {
      try {
        this._internals = this.attachInternals();
      } catch (e) {
        // Fallback for older environments
      }
    }
  }

  get value() {
    return this.getAttribute('value') || '';
  }

  set value(val) {
    this.setAttribute('value', val);
  }

  get isOpen() {
    return this.hasAttribute('open') || this._popover?.matches(':popover-open') || this._popover?.hasAttribute('open');
  }

  init() {
    this.setAttributeSafe(this, 'data-ui', 'date-picker');

    if (!this.querySelector('[data-part="trigger"]')) {
      this._buildSkeleton();
    }

    this._trigger = this.querySelector('[data-part="trigger"]');
    this._displayValue = this.querySelector('[data-part="display-value"]');
    this._clearBtn = this.querySelector('[data-part="clear-btn"]');
    this._popover = this.querySelector('[data-part="popover"]');
    this._calendar = this.querySelector('ui-calendar, [data-ui="calendar"]');

    if (this._popover) {
      this.setAttributeSafe(this._popover, 'popover', 'auto');
    }

    this._updateDisplay();
    this._syncConstraints();
    this._attachEvents();
    this._updateFormValue();
  }

  _buildSkeleton() {
    const placeholder = this.getAttribute('placeholder') || 'Pick a date...';
    this.innerHTML = `
      <button type="button" data-part="trigger" data-ui="button" data-variant="outline" class="ui-button ui-button--outline ui-date-picker-trigger" aria-haspopup="dialog" aria-expanded="false">
        <svg data-part="icon" class="ui-date-picker-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
          <line x1="16" x2="16" y1="2" y2="6"/>
          <line x1="8" x2="8" y1="2" y2="6"/>
          <line x1="3" x2="21" y1="10" y2="10"/>
        </svg>
        <span data-part="display-value">${placeholder}</span>
        <span data-part="clear-btn" class="ui-date-picker-clear-action" role="button" tabindex="-1" aria-label="Clear date" style="display: none;">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </span>
        <svg data-part="chevron" class="ui-date-picker-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>
      <div data-part="popover" popover="auto" class="ui-date-picker-popover">
        <ui-calendar></ui-calendar>
      </div>
    `;
  }

  _syncConstraints() {
    if (!this._calendar) return;
    if (this.hasAttribute('min')) {
      this._calendar.setAttribute('min', this.getAttribute('min'));
    } else {
      this._calendar.removeAttribute('min');
    }
    if (this.hasAttribute('max')) {
      this._calendar.setAttribute('max', this.getAttribute('max'));
    } else {
      this._calendar.removeAttribute('max');
    }
  }

  _reposition = () => {
    if (!this.isOpen || !this._popover) return;
    const trigger = (this._trigger && this._trigger.isConnected) ? this._trigger : this.querySelector('[data-part="trigger"]');
    if (!trigger) return;
    applyPositionFallback(trigger, this._popover, { placement: 'bottom-start', offset: 6 });
  };

  _attachEvents() {
    if (this._trigger) {
      this._trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggle();
      });
    }

    if (this._clearBtn) {
      this._clearBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.clear();
      });
    }

    if (this._calendar) {
      if (this.value) {
        this._calendar.setAttribute('value', this.value);
      }

      this._calendar.addEventListener('change', (e) => {
        const selected = e.detail.value;
        this.value = selected;
        this._updateDisplay();
        this._updateFormValue();
        this.close();

        this.dispatchEvent(new CustomEvent('change', {
          bubbles: true,
          detail: { value: selected, date: e.detail.date }
        }));
      });
    }

    // Dismiss on click outside
    document.addEventListener('click', (e) => {
      if (this.isOpen && !this.contains(e.target)) {
        this.close();
      }
    });

    this.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        e.preventDefault();
        this.close();
        this._trigger?.focus();
      }
    });
  }

  _updateDisplay() {
    if (!this._displayValue) return;
    const placeholder = this.getAttribute('placeholder') || 'Pick a date...';

    if (this.value) {
      const parts = this.value.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        if (!isNaN(d.getTime())) {
          this._displayValue.textContent = d.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
          if (this._clearBtn) this._clearBtn.style.display = 'inline-flex';
          this.setAttributeSafe(this, 'data-has-value', 'true');
          return;
        }
      }
      this._displayValue.textContent = this.value;
      if (this._clearBtn) this._clearBtn.style.display = 'inline-flex';
      this.setAttributeSafe(this, 'data-has-value', 'true');
    } else {
      this._displayValue.textContent = placeholder;
      if (this._clearBtn) this._clearBtn.style.display = 'none';
      this.removeAttribute('data-has-value');
    }
  }

  clear() {
    this.value = '';
    if (this._calendar) {
      this._calendar.clear?.();
    }
    this._updateDisplay();
    this._updateFormValue();
    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      detail: { value: '', date: null }
    }));
  }

  open() {
    if (this.hasAttribute('disabled') || this._isToggling) return;
    this._isToggling = true;
    try {
      if (!this.hasAttribute('open')) {
        this.setAttributeSafe(this, 'open', '');
      }
      this._trigger?.setAttribute('aria-expanded', 'true');

      this._syncConstraints();

      if (this._calendar) {
        if (this.value) {
          this._calendar.setAttribute('value', this.value);
          const parts = this.value.split('-');
          if (parts.length === 3) {
            this._calendar.month = parseInt(parts[1], 10);
            this._calendar.year = parseInt(parts[0], 10);
          }
        }
        this._calendar._render?.();
      }

      if (this._popover) {
        if (typeof this._popover.showPopover === 'function') {
          try {
            if (!this._popover.matches(':popover-open')) {
              this._popover.showPopover();
            }
          } catch (e) {
            this._popover.setAttribute('open', '');
          }
        } else {
          this._popover.setAttribute('open', '');
        }

        this._reposition();
        if (typeof requestAnimationFrame === 'function') {
          requestAnimationFrame(this._reposition);
        }
        setTimeout(this._reposition, 10);
      }

      if (typeof window !== 'undefined') {
        window.addEventListener('scroll', this._reposition, { passive: true, capture: true });
        window.addEventListener('resize', this._reposition, { passive: true });
      }

      this.dispatchEvent(new CustomEvent('open', { bubbles: true }));
    } finally {
      this._isToggling = false;
    }
  }

  close() {
    if (this._isToggling) return;
    this._isToggling = true;
    try {
      if (this.hasAttribute('open')) {
        this.removeAttribute('open');
      }
      this._trigger?.setAttribute('aria-expanded', 'false');

      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', this._reposition, { capture: true });
        window.removeEventListener('resize', this._reposition);
      }

      if (this._popover) {
        if (typeof this._popover.hidePopover === 'function') {
          try {
            if (this._popover.matches(':popover-open')) {
              this._popover.hidePopover();
            }
          } catch (e) {
            this._popover.removeAttribute('open');
          }
        } else {
          this._popover.removeAttribute('open');
        }
      }

      this.dispatchEvent(new CustomEvent('close', { bubbles: true }));
    } finally {
      this._isToggling = false;
    }
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  disconnectedCallback() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this._reposition, { capture: true });
      window.removeEventListener('resize', this._reposition);
    }
  }

  _updateFormValue() {
    if (this._internals && this._internals.setFormValue) {
      this._internals.setFormValue(this.value || null);
    }
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal === newVal) return;
    if (name === 'value') {
      this._updateDisplay();
      if (this._calendar) {
        this._calendar.setAttribute('value', newVal || '');
      }
      this._updateFormValue();
    } else if (name === 'open') {
      if (this.hasAttribute('open')) {
        this.open();
      } else {
        this.close();
      }
    } else if (name === 'min' || name === 'max') {
      this._syncConstraints();
      this._calendar?._render?.();
    } else if (name === 'disabled') {
      if (this._trigger) {
        if (this.hasAttribute('disabled')) {
          this._trigger.setAttribute('disabled', '');
        } else {
          this._trigger.removeAttribute('disabled');
        }
      }
    }
  }
}
