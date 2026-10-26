import { BaseLightElement } from '../../utils/base-element.js';
import { Keys, getNextIndex, generateUniqueId } from '../../utils/a11y.js';

/**
 * <ui-combobox> Micro-Enhancer
 * WAI-ARIA 1.2 Combobox Pattern (Active-Descendant / Roving)
 * Invariant: Mutates attributes, never nodes. Light-DOM native.
 */
export class UiCombobox extends BaseLightElement {
  static formAssociated = true;

  static get observedAttributes() {
    return ['value', 'open', 'name', 'disabled'];
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

  get name() {
    return this.getAttribute('name') || '';
  }

  set name(val) {
    if (val) this.setAttributeSafe(this, 'name', val);
    else this.removeAttributeSafe(this, 'name');
  }

  get value() {
    return this.getAttribute('value') || '';
  }

  set value(val) {
    this.setAttributeSafe(this, 'value', val);
    this._updateFormValue(val);
  }

  get isOpen() {
    return this.hasAttribute('open');
  }

  set isOpen(val) {
    if (val) this.open();
    else this.close();
  }

  init() {
    this.setAttributeSafe(this, 'data-ui', 'combobox');
    this._input = this.querySelector('[data-part="input"], input');
    this._listbox = this.querySelector('[data-part="listbox"], [role="listbox"], ul, ol');
    this._activeIndex = -1;

    // Dev-mode diagnostics for AI generation issues
    this.warnIfMissing('[data-part="input"], input', 'Input search element');
    this.warnIfMissing('[data-part="listbox"], [role="listbox"], ul, ol', 'Dropdown listbox container');

    this._setupARIA();
    this._bindEvents();
  }

  _getOptions() {
    return Array.from(this.querySelectorAll('[data-part="option"], [role="option"], li'));
  }

  _getVisibleOptions() {
    return this._getOptions().filter((opt) => !opt.hasAttribute('hidden'));
  }

  _setupARIA() {
    const baseId = this.id || generateUniqueId('combobox');
    const listboxId = this._listbox?.id || `${baseId}-listbox`;

    if (this._input) {
      this.setAttributeSafe(this._input, 'role', 'combobox');
      this.setAttributeSafe(this._input, 'aria-autocomplete', 'list');
      this.setAttributeSafe(this._input, 'aria-expanded', 'false');
      this.setAttributeSafe(this._input, 'aria-controls', listboxId);
      this.setAttributeSafe(this._input, 'autocomplete', 'off');
    }

    if (this._listbox) {
      this.setAttributeSafe(this._listbox, 'id', listboxId);
      this.setAttributeSafe(this._listbox, 'role', 'listbox');
      this.setAttributeSafe(this._listbox, 'data-state', 'closed');
    }

    this._getOptions().forEach((option, index) => {
      const optionId = option.id || `${baseId}-opt-${index}`;
      this.setAttributeSafe(option, 'id', optionId);
      this.setAttributeSafe(option, 'role', 'option');
      this.setAttributeSafe(option, 'aria-selected', 'false');
    });
  }

  _bindEvents() {
    if (!this._input) return;

    // Focus & Input events
    this.listen(this._input, 'focus', () => this.open());
    this.listen(this._input, 'input', (e) => this._handleInput(e.target.value));

    // Keyboard navigation
    this.listen(this._input, 'keydown', (e) => this._handleKeydown(e));

    // Option selection
    this.listen(this, 'click', (e) => {
      const option = e.target.closest('[data-part="option"], [role="option"]');
      if (option && this.contains(option)) {
        this.selectOption(option);
      }
    });

    // Close on outside click
    this.listen(document, 'pointerdown', (e) => {
      if (!this.contains(e.target) && this.isOpen) {
        this.close();
      }
    });
  }

  _handleInput(query) {
    if (!this.isOpen) this.open();
    const cleanQuery = query.toLowerCase().trim();
    const options = this._getOptions();

    // Mutate attributes (hidden), never remove nodes
    options.forEach((opt) => {
      const text = (opt.textContent || '').toLowerCase();
      const value = (opt.dataset.value || '').toLowerCase();
      const matches = text.includes(cleanQuery) || value.includes(cleanQuery);
      if (matches) {
        opt.removeAttribute('hidden');
      } else {
        this.setAttributeSafe(opt, 'hidden', '');
      }
    });

    this._activeIndex = -1;
    this._highlightOption(null);
  }

  _handleKeydown(e) {
    const visible = this._getVisibleOptions();

    switch (e.key) {
      case Keys.ARROW_DOWN:
        e.preventDefault();
        if (!this.isOpen) {
          this.open();
        } else {
          this._activeIndex = getNextIndex(this._activeIndex, visible.length, 1);
          this._highlightOption(visible[this._activeIndex]);
        }
        break;

      case Keys.ARROW_UP:
        e.preventDefault();
        if (!this.isOpen) {
          this.open();
        } else {
          this._activeIndex = getNextIndex(this._activeIndex, visible.length, -1);
          this._highlightOption(visible[this._activeIndex]);
        }
        break;

      case Keys.ENTER:
        if (this.isOpen && this._activeIndex >= 0 && visible[this._activeIndex]) {
          e.preventDefault();
          this.selectOption(visible[this._activeIndex]);
        }
        break;

      case Keys.ESCAPE:
        if (this.isOpen) {
          e.preventDefault();
          this.close();
        }
        break;

      case Keys.TAB:
        this.close();
        break;
    }
  }

  _highlightOption(optionNode) {
    const options = this._getOptions();
    options.forEach((opt) => {
      if (opt === optionNode) {
        this.setAttributeSafe(opt, 'data-focused', 'true');
        if (this._input) {
          this.setAttributeSafe(this._input, 'aria-activedescendant', opt.id);
        }
        opt.scrollIntoView({ block: 'nearest' });
      } else {
        this.setAttributeSafe(opt, 'data-focused', 'false');
      }
    });

    if (!optionNode && this._input) {
      this._input.removeAttribute('aria-activedescendant');
    }
  }

  selectOption(optionNode) {
    if (!optionNode) return;
    const value = optionNode.dataset.value || optionNode.textContent.trim();
    const label = optionNode.textContent.trim();

    this._getOptions().forEach((node) => {
      this.setAttributeSafe(node, 'aria-selected', node === optionNode ? 'true' : 'false');
    });

    if (this._input) {
      this._input.value = label;
    }
    this.value = value;
    this.close();

    // Dispatch standard lowercase native event
    this.dispatch('change', { value, label });
  }

  open() {
    if (this.isOpen) return;
    this.setAttributeSafe(this, 'open', '');
    if (this._input) this.setAttributeSafe(this._input, 'aria-expanded', 'true');
    if (this._listbox) this.setAttributeSafe(this._listbox, 'data-state', 'open');
  }

  close() {
    if (!this.isOpen) return;
    this.removeAttribute('open');
    if (this._input) this.setAttributeSafe(this._input, 'aria-expanded', 'false');
    if (this._listbox) this.setAttributeSafe(this._listbox, 'data-state', 'closed');
    this._activeIndex = -1;
    this._highlightOption(null);
  }

  _updateFormValue(val = this.value) {
    if (this._internals) {
      this._internals.setFormValue(val);
    }
  }

  formResetCallback() {
    const defaultOpt = this._getOptions().find((opt) => opt.hasAttribute('selected') || opt.hasAttribute('default-selected'));
    const initialVal = defaultOpt ? (defaultOpt.dataset.value || defaultOpt.textContent.trim()) : (this.getAttribute('value') || '');
    this.value = initialVal;
    if (this._input) {
      this._input.value = defaultOpt ? defaultOpt.textContent.trim() : initialVal;
    }
    this._updateFormValue(initialVal);
  }
}
