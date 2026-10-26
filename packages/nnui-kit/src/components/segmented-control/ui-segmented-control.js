import { BaseLightElement } from '../../utils/base-element.js';
import { Keys, getNextIndex } from '../../utils/a11y.js';

/**
 * <ui-segmented-control> Micro-Enhancer
 * Accessible segmented pill control / toggle group in Light-DOM.
 * 
 * Features:
 * - WAI-ARIA APG Radiogroup pattern (role="radiogroup", role="radio")
 * - Roving tabindex with ArrowLeft / ArrowRight / Home / End
 * - Smooth sliding pill indicator with CSS transform
 * - Form-associated name/value integration
 * - Standard 'change' CustomEvent with { value }
 */
export class UiSegmentedControl extends BaseLightElement {
  static formAssociated = true;

  static get observedAttributes() {
    return ['value', 'name', 'disabled', 'size'];
  }

  constructor() {
    super();
    if (typeof this.attachInternals === 'function') {
      this._internals = this.attachInternals();
    }
  }

  get form() {
    return this._internals ? this._internals.form : null;
  }

  set form(_) {}

  get value() {
    return this.getAttribute('value') || '';
  }

  set value(val) {
    this.setAttributeSafe('value', val);
    this._syncState();
  }

  get name() {
    return this.getAttribute('name') || '';
  }

  set name(val) {
    this.setAttributeSafe('name', val);
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
    this.setAttributeSafe('data-ui', 'segmented-control');
    this.setAttributeSafe('role', 'radiogroup');

    this._setupStructure();
    this._syncState();
    this._bindEvents();

    // Listen for resize to update indicator position
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => this._updateIndicator());
      ro.observe(this);
      this._cleanups.push(() => ro.disconnect());
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue || !this._initialized) return;
    if (name === 'value' || name === 'disabled') {
      this._syncState();
    }
  }

  _getSegments() {
    return Array.from(this.querySelectorAll('[data-part="segment"], [role="radio"]'));
  }

  _setupStructure() {
    const segments = this._getSegments();
    if (segments.length === 0) return;

    // Ensure hidden input for form submission if name is present
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

    // Ensure indicator exists
    if (!this.querySelector('[data-part="indicator"]')) {
      const indicator = document.createElement('div');
      indicator.setAttribute('data-part', 'indicator');
      indicator.className = 'ui-segment-indicator';
      indicator.setAttribute('aria-hidden', 'true');
      this.prepend(indicator);
    }

    segments.forEach((seg, idx) => {
      const val = seg.getAttribute('data-value') || `opt-${idx}`;
      seg.setAttribute('data-value', val);
      seg.setAttribute('role', 'radio');
    });

    // Default to first segment if no value is set
    if (!this.value && segments.length > 0) {
      this.value = segments[0].getAttribute('data-value');
    }
  }

  _syncState() {
    const segments = this._getSegments();
    const currentVal = this.value;
    const isControlDisabled = this.disabled;

    let activeSegment = null;

    segments.forEach((seg) => {
      const isSelected = seg.getAttribute('data-value') === currentVal;
      const isDisabled = isControlDisabled || seg.hasAttribute('disabled');

      this.setAttributeSafe(seg, 'aria-checked', isSelected ? 'true' : 'false');
      this.setAttributeSafe(seg, 'data-state', isSelected ? 'checked' : 'unchecked');
      this.setAttributeSafe(seg, 'tabindex', isSelected && !isDisabled ? '0' : '-1');

      if (isDisabled) {
        this.setAttributeSafe(seg, 'aria-disabled', 'true');
      } else {
        this.removeAttributeSafe(seg, 'aria-disabled');
      }

      if (isSelected) {
        activeSegment = seg;
      }
    });

    if (this._hiddenInput) {
      this._hiddenInput.value = currentVal;
    }
    this._updateFormValue();

    this._updateIndicator(activeSegment);
  }

  _updateFormValue() {
    if (this._internals) {
      this._internals.setFormValue(this.value);
    }
  }

  formResetCallback() {
    const defaultSeg = this._getSegments().find(s => s.hasAttribute('default-selected') || s.hasAttribute('selected'));
    const initialVal = defaultSeg ? (defaultSeg.dataset.value || defaultSeg.getAttribute('value') || defaultSeg.textContent.trim()) : (this.getAttribute('value') || '');
    this.value = initialVal;
    this._syncState();
  }

  _updateIndicator(activeSegment = null) {
    const indicator = this.querySelector('[data-part="indicator"]');
    if (!indicator) return;

    if (!activeSegment) {
      activeSegment = this.querySelector('[data-part="segment"][data-state="checked"]');
    }

    if (!activeSegment || activeSegment.offsetWidth === 0) {
      indicator.style.opacity = '0';
      return;
    }

    indicator.style.opacity = '1';
    indicator.style.width = `${activeSegment.offsetWidth}px`;
    indicator.style.height = `${activeSegment.offsetHeight}px`;
    indicator.style.transform = `translate3d(${activeSegment.offsetLeft}px, ${activeSegment.offsetTop}px, 0)`;
  }

  _bindEvents() {
    this.listen(this, 'click', (e) => {
      const seg = e.target.closest('[data-part="segment"], [role="radio"]');
      if (!seg || this.disabled || seg.hasAttribute('disabled') || seg.getAttribute('aria-disabled') === 'true') return;

      const newVal = seg.getAttribute('data-value');
      if (newVal && newVal !== this.value) {
        this.select(newVal);
      }
    });

    this.listen(this, 'keydown', (e) => {
      if (this.disabled) return;
      const segments = this._getSegments().filter(s => !s.hasAttribute('disabled') && s.getAttribute('aria-disabled') !== 'true');
      if (segments.length === 0) return;

      const currentIdx = segments.findIndex(s => s.getAttribute('data-value') === this.value);
      let targetIdx = -1;

      switch (e.key) {
        case Keys.ARROW_RIGHT:
        case Keys.ARROW_DOWN:
          e.preventDefault();
          targetIdx = getNextIndex(currentIdx, segments.length, 1, true);
          break;
        case Keys.ARROW_LEFT:
        case Keys.ARROW_UP:
          e.preventDefault();
          targetIdx = getNextIndex(currentIdx, segments.length, -1, true);
          break;
        case Keys.HOME:
          e.preventDefault();
          targetIdx = 0;
          break;
        case Keys.END:
          e.preventDefault();
          targetIdx = segments.length - 1;
          break;
        case Keys.SPACE:
        case Keys.ENTER: {
          const focused = e.target.closest('[data-part="segment"]');
          if (focused && !focused.hasAttribute('disabled')) {
            e.preventDefault();
            this.select(focused.getAttribute('data-value'));
          }
          return;
        }
      }

      if (targetIdx !== -1 && targetIdx !== currentIdx) {
        const targetSeg = segments[targetIdx];
        const val = targetSeg.getAttribute('data-value');
        this.select(val);
        targetSeg.focus();
      }
    });
  }

  select(val) {
    const prev = this.value;
    if (prev === val) return;

    this.value = val;
    this.dispatch('change', { value: val, previousValue: prev });
  }
}
