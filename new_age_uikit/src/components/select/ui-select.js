import { BaseLightElement } from '../../utils/base-element.js';
import { Keys, getNextIndex, generateUniqueId } from '../../utils/a11y.js';

/**
 * <ui-select> Micro-Enhancer
 * Custom dropdown with native form integration via ElementInternals.
 * Invariant: Mutates attributes, never nodes. Light-DOM native.
 */
export class UiSelect extends BaseLightElement {
  static formAssociated = true;

  static get observedAttributes() {
    return ['value', 'name', 'required', 'disabled', 'open'];
  }

  constructor() {
    super();
    // ElementInternals provides seamless integration into native <form> submission & validation
    if (typeof this.attachInternals === 'function') {
      this._internals = this.attachInternals();
    }
  }

  get form() {
    return this._internals ? this._internals.form : null;
  }

  get name() {
    return this.getAttribute('name') || '';
  }

  set name(val) {
    this.setAttributeSafe(this, 'name', val);
  }

  get value() {
    return this.getAttribute('value') || '';
  }

  set value(val) {
    this.setAttributeSafe(this, 'value', val);
    this._updateFormValue(val);
    this._syncState();
  }

  get isOpen() {
    return this.hasAttribute('open');
  }

  get required() {
    return this.hasAttribute('required');
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }

  init() {
    this.setAttributeSafe(this, 'data-ui', 'select');
    this._trigger = this.querySelector('[data-part="trigger"], button');
    this._valueDisplay = this.querySelector('[data-part="value"], span');
    this._listbox = this.querySelector('[data-part="listbox"], [role="listbox"], ul, ol');
    this._activeIndex = -1;

    // Dev-mode diagnostics for AI generation issues
    this.warnIfMissing('[data-part="trigger"], button', 'Trigger button');
    this.warnIfMissing('[data-part="listbox"], [role="listbox"], ul, ol', 'Dropdown listbox container');

    this._setupStructure();
    this._syncState();
    this._bindEvents();
  }

  _getOptions() {
    return Array.from(this.querySelectorAll('[data-part="option"], [role="option"], li'));
  }

  _setupStructure() {
    const baseId = this.id || generateUniqueId('select');
    const listboxId = this._listbox?.id || `${baseId}-listbox`;

    if (this._trigger) {
      this.setAttributeSafe(this._trigger, 'role', 'combobox');
      this.setAttributeSafe(this._trigger, 'aria-haspopup', 'listbox');
      this.setAttributeSafe(this._trigger, 'aria-expanded', 'false');
      this.setAttributeSafe(this._trigger, 'aria-controls', listboxId);
      this.setAttributeSafe(this._trigger, 'tabindex', this.disabled ? '-1' : '0');
    }

    if (this._listbox) {
      this.setAttributeSafe(this._listbox, 'id', listboxId);
      this.setAttributeSafe(this._listbox, 'role', 'listbox');
      this.setAttributeSafe(this._listbox, 'data-state', 'closed');
      this.setAttributeSafe(this._listbox, 'tabindex', '-1');
    }

    this._getOptions().forEach((option, idx) => {
      const optId = option.id || `${baseId}-opt-${idx}`;
      this.setAttributeSafe(option, 'id', optId);
      this.setAttributeSafe(option, 'role', 'option');
      this.setAttributeSafe(option, 'aria-selected', 'false');
    });

    // Default value check
    if (!this.value && this._getOptions().length > 0) {
      const selectedOpt = this._getOptions().find((opt) => opt.hasAttribute('selected') || opt.getAttribute('aria-selected') === 'true');
      if (selectedOpt) {
        this.value = selectedOpt.dataset.value || selectedOpt.textContent.trim();
      }
    }
  }

  _updateFormValue(val) {
    if (this._internals) {
      this._internals.setFormValue(val);
      // Native constraint validation
      if (this.required && !val) {
        this._internals.setValidity({ valueMissing: true }, 'Please select an option.', this._trigger);
      } else {
        this._internals.setValidity({});
      }
    }
  }

  _syncState() {
    const options = this._getOptions();
    const currentVal = this.value;

    let matchedOption = null;

    options.forEach((opt, index) => {
      const optVal = opt.dataset.value || opt.textContent.trim();
      const isSelected = optVal === currentVal;
      if (isSelected) {
        matchedOption = opt;
        this._activeIndex = index;
      }
      this.setAttributeSafe(opt, 'aria-selected', isSelected ? 'true' : 'false');
    });

    if (this._valueDisplay && matchedOption) {
      this._valueDisplay.textContent = matchedOption.textContent.trim();
    }
  }

  _bindEvents() {
    if (!this._trigger) return;

    // Trigger click
    this.listen(this._trigger, 'click', (e) => {
      if (this.disabled) return;
      e.preventDefault();
      this.toggle();
    });

    // Keyboard navigation
    this.listen(this, 'keydown', (e) => this._handleKeydown(e));

    // Option selection click delegation
    this.listen(this, 'click', (e) => {
      const option = e.target.closest('[data-part="option"], [role="option"]');
      if (option && this.contains(option)) {
        this.selectOption(option);
      }
    });

    // Outside click dismiss
    this.listen(document, 'pointerdown', (e) => {
      if (!this.contains(e.target) && this.isOpen) {
        this.close();
      }
    });
  }

  _handleKeydown(e) {
    if (this.disabled) return;
    const options = this._getOptions();

    switch (e.key) {
      case Keys.ENTER:
      case Keys.SPACE:
      case Keys.SPACEBAR:
        e.preventDefault();
        if (!this.isOpen) {
          this.open();
        } else if (this._activeIndex >= 0 && options[this._activeIndex]) {
          this.selectOption(options[this._activeIndex]);
        }
        break;

      case Keys.ARROW_DOWN:
        e.preventDefault();
        if (!this.isOpen) {
          this.open();
        } else {
          this._activeIndex = getNextIndex(this._activeIndex, options.length, 1);
          this._highlightOption(options[this._activeIndex]);
        }
        break;

      case Keys.ARROW_UP:
        e.preventDefault();
        if (!this.isOpen) {
          this.open();
        } else {
          this._activeIndex = getNextIndex(this._activeIndex, options.length, -1);
          this._highlightOption(options[this._activeIndex]);
        }
        break;

      case Keys.ESCAPE:
        if (this.isOpen) {
          e.preventDefault();
          this.close();
          this._trigger?.focus();
        }
        break;

      case Keys.TAB:
        this.close();
        break;
    }
  }

  _highlightOption(optionNode) {
    this._getOptions().forEach((opt) => {
      if (opt === optionNode) {
        this.setAttributeSafe(opt, 'data-focused', 'true');
        opt.scrollIntoView({ block: 'nearest' });
      } else {
        this.setAttributeSafe(opt, 'data-focused', 'false');
      }
    });
  }

  selectOption(optionNode) {
    if (!optionNode) return;
    const value = optionNode.dataset.value || optionNode.textContent.trim();
    const prev = this.value;

    this.value = value;
    this.close();
    this._trigger?.focus();

    this.dispatch('change', { value, previousValue: prev });
    this.dispatch('input', { value });
  }

  open() {
    if (this.isOpen || this.disabled) return;
    this.setAttributeSafe(this, 'open', '');
    if (this._trigger) this.setAttributeSafe(this._trigger, 'aria-expanded', 'true');
    if (this._listbox) this.setAttributeSafe(this._listbox, 'data-state', 'open');

    const options = this._getOptions();
    if (this._activeIndex >= 0 && options[this._activeIndex]) {
      this._highlightOption(options[this._activeIndex]);
    }
  }

  close() {
    if (!this.isOpen) return;
    this.removeAttribute('open');
    if (this._trigger) this.setAttributeSafe(this._trigger, 'aria-expanded', 'false');
    if (this._listbox) this.setAttributeSafe(this._listbox, 'data-state', 'closed');
  }

  toggle() {
    if (this.isOpen) this.close();
    else this.open();
  }

  // Native formResetCallback support
  formResetCallback() {
    const defaultOpt = this._getOptions().find((opt) => opt.hasAttribute('default-selected') || opt.hasAttribute('selected'));
    this.value = defaultOpt ? (defaultOpt.dataset.value || defaultOpt.textContent.trim()) : '';
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal !== newVal && this._initialized) {
      if (name === 'value') {
        this._updateFormValue(newVal);
        this._syncState();
      }
    }
  }
}
