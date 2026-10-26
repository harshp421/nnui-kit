import { BaseLightElement } from '../../utils/base-element.js';

/**
 * <ui-tags-input> Micro-Enhancer
 * Accessible multi-token tag input with chip management and keyboard badge removal.
 * 
 * Features:
 * - Enter or comma to create new tags
 * - Backspace removes the last tag when input is empty
 * - Duplicate prevention & max tags limit
 * - Click-to-remove badge button
 * - Form associated / standard change events
 */
export class UiTagsInput extends BaseLightElement {
  static formAssociated = true;

  static get observedAttributes() {
    return ['placeholder', 'max-tags', 'disabled', 'delimiter', 'name', 'value'];
  }

  constructor() {
    super();
    this._tags = [];
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
    return this._tags.join(',');
  }

  set value(val) {
    if (typeof val === 'string') {
      this._tags = val ? val.split(',').map(s => s.trim()).filter(Boolean) : [];
      this._render();
      this._updateFormValue();
    }
  }

  get tags() {
    return [...this._tags];
  }

  set tags(val) {
    if (Array.isArray(val)) {
      this._tags = [...val];
      this._render();
      this._updateFormValue();
    }
  }

  get maxTags() {
    const val = parseInt(this.getAttribute('max-tags'), 10);
    return isNaN(val) ? Infinity : val;
  }

  set maxTags(val) {
    if (val !== null && val !== undefined) this.setAttributeSafe(this, 'max-tags', String(val));
    else this.removeAttributeSafe(this, 'max-tags');
  }

  init() {
    this.setAttributeSafe(this, 'data-ui', 'tags-input');
    this.setAttributeSafe(this, 'role', 'group');

    // Read initial tags from DOM if present or attribute
    const initialTagsAttr = this.getAttribute('value') || this.getAttribute('tags');
    if (initialTagsAttr) {
      this._tags = initialTagsAttr.split(',').map(s => s.trim()).filter(Boolean);
    } else {
      const existingChips = this.querySelectorAll('[data-part="tag"]');
      if (existingChips.length > 0) {
        this._tags = Array.from(existingChips).map(el => el.getAttribute('data-value') || el.textContent.replace('×', '').trim());
      }
    }

    this._setupElements();
    this._render();
  }

  _setupElements() {
    this.innerHTML = '';
    this.className = 'ui-tags-input-container';

    this._chipsWrapper = document.createElement('div');
    this._chipsWrapper.className = 'ui-tags-chips-wrapper';
    this.appendChild(this._chipsWrapper);

    this._input = document.createElement('input');
    this._input.type = 'text';
    this._input.setAttribute('data-part', 'input');
    this._input.className = 'ui-tags-input-field';
    this._input.placeholder = this.getAttribute('placeholder') || 'Add tag...';

    if (this.hasAttribute('disabled')) {
      this._input.disabled = true;
    }

    this.appendChild(this._input);

    // Event Listeners
    this._input.addEventListener('keydown', (e) => {
      const val = this._input.value.trim();

      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        if (val) {
          this.addTag(val);
          this._input.value = '';
        }
      } else if (e.key === 'Backspace' && !this._input.value && this._tags.length > 0) {
        e.preventDefault();
        const removed = this._tags[this._tags.length - 1];
        this.removeTag(removed);
      }
    });

    // Clicking anywhere in container focuses input
    this.addEventListener('click', (e) => {
      if (e.target !== this._input && !e.target.closest('[data-part="remove-tag"]')) {
        this._input.focus();
      }
    });
  }

  _render() {
    if (!this._chipsWrapper) return;
    this._chipsWrapper.innerHTML = '';

    this._tags.forEach((tag, idx) => {
      const chip = document.createElement('span');
      chip.setAttribute('data-part', 'tag');
      chip.setAttribute('data-value', tag);
      chip.className = 'ui-tag-badge';

      const label = document.createElement('span');
      label.textContent = tag;
      chip.appendChild(label);

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.setAttribute('data-part', 'remove-tag');
      removeBtn.setAttribute('aria-label', `Remove ${tag}`);
      removeBtn.className = 'ui-tag-remove-btn';
      removeBtn.textContent = '×';

      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.removeTag(tag);
        this._input.focus();
      });

      chip.appendChild(removeBtn);
      this._chipsWrapper.appendChild(chip);
    });

    // Update input visibility if maxTags reached
    if (this._tags.length >= this.maxTags) {
      this._input.style.display = 'none';
    } else {
      this._input.style.display = 'inline-block';
    }
  }

  addTag(tagText) {
    const clean = tagText.trim().replace(/^,+|,+$/g, '');
    if (!clean) return false;

    // Check duplicate
    if (this._tags.some(t => t.toLowerCase() === clean.toLowerCase())) {
      // Flash existing tag
      const existing = this._chipsWrapper.querySelector(`[data-value="${clean}"]`);
      if (existing) {
        existing.style.outline = '2px solid var(--ui-color-warning-500)';
        setTimeout(() => existing.style.outline = 'none', 600);
      }
      return false;
    }

    if (this._tags.length >= this.maxTags) return false;

    this._tags.push(clean);
    this._render();

    this.dispatchCustomEvent('change', {
      tags: [...this._tags],
      added: clean
    });

    return true;
  }

  removeTag(tagText) {
    const initialLen = this._tags.length;
    this._tags = this._tags.filter(t => t !== tagText);

    if (this._tags.length !== initialLen) {
      this._render();
      this.dispatchCustomEvent('change', {
        tags: [...this._tags],
        removed: tagText
      });
      return true;
    }
    return false;
  }

  clear() {
    this._tags = [];
    this._render();
    this._updateFormValue();
    this.dispatchCustomEvent('change', { tags: [] });
  }

  _updateFormValue() {
    if (this._internals) {
      this._internals.setFormValue(this._tags.join(','));
    }
  }

  formResetCallback() {
    const initialTagsAttr = this.getAttribute('value') || this.getAttribute('tags') || '';
    this._tags = initialTagsAttr ? initialTagsAttr.split(',').map(s => s.trim()).filter(Boolean) : [];
    this._render();
    this._updateFormValue();
  }
}

if (typeof customElements !== 'undefined') {
  if (!customElements.get('ui-tags-input')) {
    customElements.define('ui-tags-input', UiTagsInput);
  }
  if (!customElements.get('nnui-tags-input')) {
    customElements.define('nnui-tags-input', class extends UiTagsInput {});
  }
}
