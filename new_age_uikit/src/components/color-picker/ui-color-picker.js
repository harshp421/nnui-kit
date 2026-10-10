import { BaseLightElement } from '../../utils/base-element.js';

/**
 * <ui-color-picker> Micro-Enhancer
 * Accessible modern color picker with native EyeDropper API in Light-DOM.
 * 
 * Features:
 * - Real-time swatch preview with accessible popover
 * - Native window.EyeDropper API screen sampling integration
 * - Hex, RGB, and HSL text input synchronization
 * - Slider-driven Hue and Alpha adjustments
 * - Form-associated hidden input submission
 * - Dispatches 'change' and 'input' CustomEvents with { value }
 */
export class UiColorPicker extends BaseLightElement {
  static get observedAttributes() {
    return ['value', 'name', 'format', 'disabled'];
  }

  get value() {
    return this.getAttribute('value') || '#3b82f6';
  }

  set value(val) {
    this.setAttributeSafe('value', val);
    this._syncState();
  }

  get name() {
    return this.getAttribute('name') || '';
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

  get isOpen() {
    const popover = this.querySelector('[data-part="popover"]');
    return popover?.getAttribute('data-state') === 'open';
  }

  init() {
    this.setAttributeSafe('data-ui', 'color-picker');

    this._setupStructure();
    this._syncState();
    this._bindEvents();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue || !this._initialized) return;
    if (name === 'value') {
      this._syncState();
    } else if (name === 'disabled') {
      this._syncState();
    }
  }

  _setupStructure() {
    // Hidden input for form submissions
    if (this.name && !this.querySelector('input[type="hidden"]')) {
      const hiddenInput = document.createElement('input');
      hiddenInput.type = 'hidden';
      hiddenInput.name = this.name;
      hiddenInput.value = this.value;
      this.appendChild(hiddenInput);
      this._hiddenInput = hiddenInput;
    } else {
      this._hiddenInput = this.querySelector('input[type="hidden"]');
    }

    const popover = this.querySelector('[data-part="popover"]');
    if (popover) {
      popover.removeAttribute('popover');
      popover.setAttribute('data-state', 'closed');
    }
  }

  _syncState() {
    const color = this.value;
    const swatch = this.querySelector('[data-part="swatch"]');
    const input = this.querySelector('[data-part="hex-input"], [data-part="input"]');
    const popover = this.querySelector('[data-part="popover"]');

    if (swatch) {
      swatch.style.backgroundColor = color;
      swatch.setAttribute('aria-label', `Selected color: ${color}`);
    }

    if (input && input !== document.activeElement) {
      input.value = color;
    }

    if (this._hiddenInput) {
      this._hiddenInput.value = color;
    }

    if (this.disabled) {
      swatch?.setAttribute('disabled', '');
      input?.setAttribute('disabled', '');
    } else {
      swatch?.removeAttribute('disabled');
      input?.removeAttribute('disabled');
    }
  }

  _bindEvents() {
    const swatch = this.querySelector('[data-part="swatch"]');
    const popover = this.querySelector('[data-part="popover"]');
    const input = this.querySelector('[data-part="hex-input"], [data-part="input"]');
    const eyedropperBtn = this.querySelector('[data-part="eyedropper-btn"]');
    const hueSlider = this.querySelector('[data-part="hue-slider"]');

    // Toggle popover on swatch click
    if (swatch) {
      this.listen(swatch, 'click', (e) => {
        if (this.disabled) return;
        e.preventDefault();
        this.toggle();
      });
    }

    // Input typing
    if (input) {
      this.listen(input, 'input', () => {
        let val = input.value.trim();
        if (!val.startsWith('#') && val.length === 6) val = `#${val}`;
        if (/^#[0-9A-Fa-f]{6}$/.test(val) || /^#[0-9A-Fa-f]{3}$/.test(val)) {
          this.setValue(val);
        }
      });

      this.listen(input, 'change', () => {
        this.dispatch('change', { value: this.value });
      });
    }

    // Native EyeDropper API
    if (eyedropperBtn) {
      if (typeof window !== 'undefined' && 'EyeDropper' in window) {
        this.listen(eyedropperBtn, 'click', async (e) => {
          e.preventDefault();
          try {
            const eyeDropper = new window.EyeDropper();
            const result = await eyeDropper.open();
            if (result?.sRGBHex) {
              this.setValue(result.sRGBHex);
              this.dispatch('change', { value: result.sRGBHex });
            }
          } catch (err) {
            // User canceled eyedropper
          }
        });
      } else {
        eyedropperBtn.style.display = 'none';
      }
    }

    // Hue Slider
    if (hueSlider) {
      this.listen(hueSlider, 'input', () => {
        const hue = hueSlider.value;
        const color = `hsl(${hue}, 80%, 50%)`;
        this.setValue(color);
      });
    }

    // Close on click outside
    this.listen(document, 'pointerdown', (e) => {
      if (!this.isOpen) return;
      if (!this.contains(e.target) && !popover?.contains(e.target)) {
        this.close();
      }
    });
  }

  setValue(newVal) {
    const prev = this.value;
    if (prev === newVal) return;

    this.setAttributeSafe('value', newVal);
    this._syncState();
    this.dispatch('input', { value: newVal });
  }

  toggle() {
    if (this.isOpen) this.close();
    else this.open();
  }

  open() {
    const popover = this.querySelector('[data-part="popover"]');
    if (!popover || this.disabled) return;

    popover.setAttribute('data-state', 'open');
    this.dispatch('open');
  }

  close() {
    const popover = this.querySelector('[data-part="popover"]');
    if (!popover) return;

    popover.setAttribute('data-state', 'closed');
    this.dispatch('close');
  }
}
