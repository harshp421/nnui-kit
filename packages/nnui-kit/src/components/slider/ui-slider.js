import { BaseLightElement } from '../../utils/base-element.js';

/**
 * UiSlider
 * Platform-Native, Light-DOM Accessible Range Slider.
 * 
 * Invariants:
 * 1. Zero Shadow DOM: All child elements remain in Light-DOM.
 * 2. Form Associated: Uses ElementInternals (attachInternals) for native form submission.
 * 3. WAI-ARIA role="slider" with full keyboard and pointer dragging.
 */
export class UiSlider extends BaseLightElement {
  static formAssociated = true;

  static get observedAttributes() {
    return ['value', 'min', 'max', 'step', 'disabled', 'name'];
  }

  constructor() {
    super();
    if (typeof this.attachInternals === 'function') {
      this._internals = this.attachInternals();
    }
    this._value = 0;
    this._isDragging = false;
  }

  init() {
    // If no children were authored in template, auto-scaffold track, range & thumb
    if (this.childElementCount === 0) {
      const track = document.createElement('div');
      track.setAttribute('data-part', 'track');
      track.className = 'ui-slider-track';

      const range = document.createElement('div');
      range.setAttribute('data-part', 'range');
      range.className = 'ui-slider-range';
      track.appendChild(range);

      const thumb = document.createElement('div');
      thumb.setAttribute('data-part', 'thumb');
      thumb.className = 'ui-slider-thumb';

      this.appendChild(track);
      this.appendChild(thumb);
    } else {
      this.warnIfMissing('[data-part="track"]', 'Slider track');
      this.warnIfMissing('[data-part="thumb"]', 'Slider thumb');
    }

    this._track = this.querySelector('[data-part="track"]') || this;
    this._range = this.querySelector('[data-part="range"]');
    this._thumb = this.querySelector('[data-part="thumb"]');
    this._valueDisplay = this.querySelector('[data-part="value"]');

    // Parse initial value from attributes
    const initialVal = parseFloat(this.getAttribute('value')) || this.min;
    this._value = this._clamp(initialVal);

    this._setupAria();
    this._setupEvents();
    this._updateVisuals();
    this._updateFormValue();
  }

  _setupAria() {
    if (!this._thumb) return;

    this.setAttributeSafe(this._thumb, 'role', 'slider');
    this.setAttributeSafe(this._thumb, 'tabindex', this.disabled ? '-1' : '0');
    this.setAttributeSafe(this._thumb, 'aria-valuemin', this.min);
    this.setAttributeSafe(this._thumb, 'aria-valuemax', this.max);
    this.setAttributeSafe(this._thumb, 'aria-valuenow', this._value);
    this.setAttributeSafe(this._thumb, 'aria-orientation', 'horizontal');
  }

  _setupEvents() {
    if (this.disabled) return;

    // Keyboard controls on thumb
    if (this._thumb) {
      this.listen(this._thumb, 'keydown', (e) => {
        if (this.disabled) return;
        const step = this.step;
        let newValue = this._value;

        switch (e.key) {
          case 'ArrowRight':
          case 'ArrowUp':
            e.preventDefault();
            newValue += step;
            break;
          case 'ArrowLeft':
          case 'ArrowDown':
            e.preventDefault();
            newValue -= step;
            break;
          case 'PageUp':
            e.preventDefault();
            newValue += step * 10;
            break;
          case 'PageDown':
            e.preventDefault();
            newValue -= step * 10;
            break;
          case 'Home':
            e.preventDefault();
            newValue = this.min;
            break;
          case 'End':
            e.preventDefault();
            newValue = this.max;
            break;
          default:
            return;
        }

        this.value = newValue;
        this.dispatch('input', { value: this._value });
        this.dispatch('change', { value: this._value });
      });
    }

    // Pointer Dragging on Track or Thumb
    const onPointerDown = (e) => {
      if (this.disabled || e.button !== 0) return;
      this._isDragging = true;
      this.setPointerCapture?.(e.pointerId);
      this.setAttribute('data-dragging', 'true');
      if (this._thumb) this._thumb.focus();

      this._updateFromPointer(e);
      this.dispatch('input', { value: this._value });
    };

    const onPointerMove = (e) => {
      if (!this._isDragging || this.disabled) return;
      this._updateFromPointer(e);
      this.dispatch('input', { value: this._value });
    };

    const onPointerUp = (e) => {
      if (!this._isDragging) return;
      this._isDragging = false;
      this.removeAttribute('data-dragging');
      try {
        this.releasePointerCapture?.(e.pointerId);
      } catch (_) {}

      this._updateFromPointer(e);
      this.dispatch('change', { value: this._value });
    };

    this.listen(this, 'pointerdown', onPointerDown);
    this.listen(this, 'pointermove', onPointerMove);
    this.listen(this, 'pointerup', onPointerUp);
    this.listen(this, 'pointercancel', onPointerUp);
  }

  _updateFromPointer(e) {
    const trackRect = (this._track || this).getBoundingClientRect();
    if (trackRect.width === 0) return;

    const offsetX = Math.max(0, Math.min(e.clientX - trackRect.left, trackRect.width));
    const percent = offsetX / trackRect.width;

    const rawValue = this.min + percent * (this.max - this.min);
    this.value = rawValue;
  }

  _clamp(val) {
    const min = this.min;
    const max = this.max;
    const step = this.step;

    // Step snapping
    const stepped = Math.round((val - min) / step) * step + min;
    const clamped = Math.max(min, Math.min(max, stepped));
    return parseFloat(clamped.toFixed(4));
  }

  _updateVisuals() {
    const percent = ((this._value - this.min) / (this.max - this.min)) * 100;

    if (this._range) {
      this._range.style.width = `${percent}%`;
    }
    if (this._thumb) {
      this._thumb.style.left = `${percent}%`;
      this.setAttributeSafe(this._thumb, 'aria-valuenow', this._value);
    }
    if (this._valueDisplay) {
      this._valueDisplay.textContent = String(this._value);
    }
  }

  _updateFormValue() {
    if (this._internals) {
      this._internals.setFormValue(String(this._value));
    }
  }

  get form() {
    return this._internals ? this._internals.form : null;
  }

  set form(_) {}

  get name() {
    return this.getAttribute('name') || '';
  }

  set name(val) {
    if (val) this.setAttributeSafe('name', val);
    else this.removeAttributeSafe('name');
  }

  get value() {
    return this._value;
  }

  set value(val) {
    const clamped = this._clamp(Number(val));
    if (this._value !== clamped) {
      this._value = clamped;
      this.setAttributeSafe(this, 'value', clamped);
      this._updateVisuals();
      this._updateFormValue();
    }
  }

  get min() {
    return parseFloat(this.getAttribute('min')) || 0;
  }

  set min(val) {
    if (val !== null && val !== undefined) this.setAttribute('min', String(val));
    else this.removeAttribute('min');
  }

  get max() {
    return parseFloat(this.getAttribute('max')) || 100;
  }

  set max(val) {
    if (val !== null && val !== undefined) this.setAttribute('max', String(val));
    else this.removeAttribute('max');
  }

  get step() {
    return parseFloat(this.getAttribute('step')) || 1;
  }

  set step(val) {
    if (val !== null && val !== undefined) this.setAttribute('step', String(val));
    else this.removeAttribute('step');
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }

  set disabled(val) {
    if (val) this.setAttribute('disabled', '');
    else this.removeAttribute('disabled');
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'value' && newVal !== null) {
      const num = parseFloat(newVal);
      if (!isNaN(num) && num !== this._value) {
        this._value = this._clamp(num);
        this._updateVisuals();
        this._updateFormValue();
      }
    } else if (['min', 'max', 'step'].includes(name)) {
      this._value = this._clamp(this._value);
      this._setupAria();
      this._updateVisuals();
    } else if (name === 'disabled') {
      if (this._thumb) {
        this.setAttributeSafe(this._thumb, 'tabindex', this.disabled ? '-1' : '0');
      }
    }
  }

  formResetCallback() {
    const initialVal = parseFloat(this.getAttribute('value')) || this.min;
    this.value = initialVal;
  }
}
