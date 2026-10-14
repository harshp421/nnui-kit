import { BaseLightElement } from '../../utils/base-element.js';
import { Keys } from '../../utils/a11y.js';

/**
 * <ui-otp-input> Micro-Enhancer
 * Accessible One-Time Password (OTP) / PIN verification code input in Light-DOM.
 * 
 * Features:
 * - Auto-advancing focus on single digit entry
 * - Backspace deletes and navigates to previous slot
 * - ArrowLeft / ArrowRight navigation
 * - Clipboard paste distribution across all slots
 * - Mobile-friendly inputmode="numeric" and autocomplete="one-time-code"
 * - 'input' and 'change' CustomEvents with { value, isComplete }
 */
export class UiOtpInput extends BaseLightElement {
  static get observedAttributes() {
    return ['length', 'value', 'disabled', 'type', 'mask'];
  }

  get length() {
    const len = parseInt(this.getAttribute('length'), 10);
    return isNaN(len) || len <= 0 ? 6 : len;
  }

  get value() {
    const slots = this._getSlots();
    return slots.map(s => s.value || '').join('');
  }

  set value(val) {
    const str = String(val || '');
    const slots = this._getSlots();
    slots.forEach((slot, idx) => {
      slot.value = str[idx] || '';
    });
    this._syncState();
  }

  get isComplete() {
    return this.value.length === this.length;
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
    this._syncState();
  }

  init() {
    this.setAttributeSafe('data-ui', 'otp-input');
    this.setAttributeSafe('role', 'group');
    this.setAttributeSafe('aria-label', this.getAttribute('aria-label') || 'One-Time Password Input');

    this._setupSlots();
    this._syncState();
    this._bindEvents();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue || !this._initialized) return;
    if (name === 'value') {
      this.value = newValue;
    } else if (name === 'disabled') {
      this._syncState();
    }
  }

  _getSlots() {
    return Array.from(this.querySelectorAll('[data-part="slot"], input[data-slot]'));
  }

  _setupSlots() {
    let slots = this._getSlots();

    // If slots are not authored in template, generate them
    if (slots.length === 0) {
      const container = this.querySelector('[data-part="container"]') || this;
      const count = this.length;
      for (let i = 0; i < count; i++) {
        const input = document.createElement('input');
        input.setAttribute('data-part', 'slot');
        input.setAttribute('data-index', String(i));
        input.type = this.getAttribute('type') === 'password' || this.hasAttribute('mask') ? 'password' : 'text';
        input.inputMode = this.getAttribute('type') === 'text' ? 'text' : 'numeric';
        input.pattern = '[0-9]*';
        input.maxLength = 1;
        input.autocomplete = i === 0 ? 'one-time-code' : 'off';
        input.className = 'ui-otp-slot';
        container.appendChild(input);
      }
      slots = this._getSlots();
    } else {
      slots.forEach((slot, i) => {
        slot.setAttribute('data-index', String(i));
        slot.maxLength = 1;
        if (!slot.inputMode) slot.inputMode = 'numeric';
        if (i === 0 && !slot.autocomplete) slot.autocomplete = 'one-time-code';
      });
    }

    // Populate initial value if attribute is set
    const initVal = this.getAttribute('value');
    if (initVal) {
      this.value = initVal;
    }
  }

  _syncState() {
    const slots = this._getSlots();
    const isDisabled = this.disabled;

    slots.forEach((slot) => {
      slot.disabled = isDisabled;
      this.setAttributeSafe(slot, 'data-filled', slot.value ? 'true' : 'false');
    });
  }

  _bindEvents() {
    const slots = this._getSlots();

    slots.forEach((slot, idx) => {
      this.listen(slot, 'input', (e) => {
        const val = slot.value;
        // If user typed more than 1 character into single slot (e.g. autofill)
        if (val.length > 1) {
          this._distributeValue(val, idx);
          return;
        }

        this.setAttributeSafe(slot, 'data-filled', val ? 'true' : 'false');

        if (val && idx < slots.length - 1) {
          slots[idx + 1].focus();
          slots[idx + 1].select();
        }

        this._emitChange();
      });

      this.listen(slot, 'keydown', (e) => {
        if (this.disabled) return;

        if (e.key === Keys.BACKSPACE) {
          if (!slot.value && idx > 0) {
            e.preventDefault();
            slots[idx - 1].value = '';
            this.setAttributeSafe(slots[idx - 1], 'data-filled', 'false');
            slots[idx - 1].focus();
            this._emitChange();
          } else {
            this.setAttributeSafe(slot, 'data-filled', 'false');
            setTimeout(() => this._emitChange(), 0);
          }
        } else if (e.key === Keys.ARROW_LEFT && idx > 0) {
          e.preventDefault();
          slots[idx - 1].focus();
          slots[idx - 1].select();
        } else if (e.key === Keys.ARROW_RIGHT && idx < slots.length - 1) {
          e.preventDefault();
          slots[idx + 1].focus();
          slots[idx + 1].select();
        }
      });

      this.listen(slot, 'paste', (e) => {
        e.preventDefault();
        const clipboard = e.clipboardData || window.clipboardData;
        if (!clipboard) return;

        const pastedData = clipboard.getData('text').trim();
        this._distributeValue(pastedData, idx);
      });

      this.listen(slot, 'focus', () => {
        slot.select();
      });
    });
  }

  _distributeValue(str, startIndex = 0) {
    const slots = this._getSlots();
    const chars = str.split('');
    let lastFilled = startIndex;

    chars.forEach((char, i) => {
      const targetSlot = slots[startIndex + i];
      if (targetSlot) {
        targetSlot.value = char;
        this.setAttributeSafe(targetSlot, 'data-filled', 'true');
        lastFilled = startIndex + i;
      }
    });

    const nextIndex = Math.min(lastFilled + 1, slots.length - 1);
    slots[nextIndex].focus();

    this._emitChange();
  }

  _emitChange() {
    const val = this.value;
    const complete = this.isComplete;

    this.dispatch('input', { value: val, isComplete: complete });
    if (complete) {
      this.dispatch('change', { value: val, isComplete: true });
    }
  }

  clear() {
    const slots = this._getSlots();
    slots.forEach((s) => {
      s.value = '';
      this.setAttributeSafe(s, 'data-filled', 'false');
    });
    if (slots.length > 0) slots[0].focus();
    this._emitChange();
  }
}
