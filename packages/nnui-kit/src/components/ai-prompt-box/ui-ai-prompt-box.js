import { BaseLightElement } from '../../utils/base-element.js';
import { attachPersistence } from '../../utils/persistence.js';

/**
 * <ui-ai-prompt-box> Micro-Enhancer
 * Accessible AI Copilot prompt box with auto-expanding textarea in Light-DOM.
 * 
 * Features:
 * - Zero-flicker auto-resizing textarea up to max-rows
 * - Enter to submit, Shift+Enter for new line
 * - Dynamic loading/generating state (submit button switches to stop button)
 * - Action toolbar with file attach and speech hooks
 * - Dispatches 'submit', 'stop', and 'input' CustomEvents
 * - Declarative Draft Persistence: persist="local|session" [sync="cross-tab"]
 */
export class UiAiPromptBox extends BaseLightElement {
  static get observedAttributes() {
    return ['max-rows', 'loading', 'disabled', 'placeholder', 'persist', 'sync'];
  }

  get maxRows() {
    const r = parseInt(this.getAttribute('max-rows'), 10);
    return isNaN(r) ? 6 : r;
  }

  set maxRows(val) {
    if (val !== null && val !== undefined) {
      this.setAttributeSafe('max-rows', String(val));
    } else {
      this.removeAttributeSafe('max-rows');
    }
  }

  get loading() {
    return this.hasAttribute('loading') && this.getAttribute('loading') !== 'false';
  }

  set loading(val) {
    if (val) {
      this.setAttributeSafe('loading', '');
    } else {
      this.removeAttributeSafe('loading');
    }
    this._syncState();
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

  get value() {
    return this._textarea?.value || '';
  }

  set value(val) {
    if (this._textarea) {
      this._textarea.value = val;
      this._autoResize();
    }
  }

  getAiState() {
    return {
      value: this.value,
      loading: this.loading,
      disabled: this.disabled,
      maxRows: this.maxRows
    };
  }

  init() {
    this.setAttributeSafe('data-ui', 'ai-prompt-box');

    this._textarea = this.querySelector('textarea, [data-part="input"]');
    if (!this._textarea) {
      this._textarea = document.createElement('textarea');
      this._textarea.setAttribute('data-part', 'input');
      this._textarea.placeholder = this.getAttribute('placeholder') || 'Ask AI anything... (Shift+Enter for newline)';
      this.prepend(this._textarea);
    }

    this._textarea.rows = 1;
    this._textarea.style.resize = 'none';
    this._textarea.style.overflowY = 'hidden';

    this._syncState();
    this._bindEvents();
    this._autoResize();

    // Setup Declarative Draft Persistence & Cross-Tab Sync
    if (this.hasAttribute('persist') || this.hasAttribute('sync')) {
      const cleanupPersistence = attachPersistence(this, {
        keys: ['draft'],
        getState: () => ({
          draft: this.value
        }),
        setState: (state) => {
          if (state.draft !== undefined && state.draft !== this.value) {
            this.value = state.draft;
            this._autoResize();
            this._syncState();
          }
        }
      });
      this._cleanups.push(cleanupPersistence);
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue || !this._initialized) return;
    if (name === 'loading' || name === 'disabled') {
      this._syncState();
    }
  }

  _syncState() {
    const isLoading = this.loading;
    const isDisabled = this.disabled;

    if (this._textarea) {
      this._textarea.disabled = isDisabled;
    }

    const submitBtn = this.querySelector('[data-part="submit-btn"]');
    const stopBtn = this.querySelector('[data-part="stop-btn"]');

    if (submitBtn) {
      submitBtn.style.display = isLoading ? 'none' : 'inline-flex';
      submitBtn.disabled = isDisabled || !this.value.trim();
    }

    if (stopBtn) {
      stopBtn.style.display = isLoading ? 'inline-flex' : 'none';
      stopBtn.disabled = isDisabled;
    }
  }

  _autoResize() {
    if (!this._textarea) return;

    this._textarea.style.height = 'auto';
    const computed = window.getComputedStyle ? window.getComputedStyle(this._textarea) : null;
    let lineHeight = 20;
    if (computed) {
      const parsedLH = parseFloat(computed.lineHeight);
      if (!isNaN(parsedLH) && parsedLH > 0) {
        lineHeight = parsedLH;
      } else {
        const fontSize = parseFloat(computed.fontSize) || 15;
        lineHeight = Math.round(fontSize * 1.35);
      }
    }
    const maxHeight = lineHeight * this.maxRows;

    if (this._textarea.scrollHeight > maxHeight) {
      this._textarea.style.height = `${maxHeight}px`;
      this._textarea.style.overflowY = 'auto';
    } else {
      this._textarea.style.height = `${Math.max(this._textarea.scrollHeight, lineHeight)}px`;
      this._textarea.style.overflowY = 'hidden';
    }
  }

  _bindEvents() {
    if (!this._textarea) return;

    this.listen(this._textarea, 'input', () => {
      this._autoResize();
      this._syncState();
      this._persistState?.();
      this.dispatch('input', { value: this.value });
    });

    this.listen(this._textarea, 'keydown', (e) => {
      // Do not submit during IME composition (Chinese, Japanese, Korean, Pinyin)
      if (e.isComposing || e.keyCode === 229) return;

      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.submit();
      }
    });

    // Multimodal Clipboard Paste (Screenshots, Images, Files)
    this.listen(this._textarea, 'paste', (e) => {
      const clipboardData = e.clipboardData;
      if (!clipboardData) return;

      const files = [];
      if (clipboardData.files && clipboardData.files.length > 0) {
        for (let i = 0; i < clipboardData.files.length; i++) {
          files.push(clipboardData.files[i]);
        }
      } else if (clipboardData.items) {
        for (let i = 0; i < clipboardData.items.length; i++) {
          const item = clipboardData.items[i];
          if (item.kind === 'file') {
            const file = item.getAsFile();
            if (file) files.push(file);
          }
        }
      }

      if (files.length > 0) {
        this.dispatch('filepaste', { files });
      }
    });

    // Multimodal Drag & Drop onto Prompt Box
    this.listen(this, 'dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!this.disabled && !this.loading) {
        this.setAttributeSafe('data-dragover', '');
      }
    });

    this.listen(this, 'dragleave', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.removeAttributeSafe('data-dragover');
    });

    this.listen(this, 'drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.removeAttributeSafe('data-dragover');
      if (this.disabled || this.loading) return;

      const dt = e.dataTransfer;
      if (dt && dt.files && dt.files.length > 0) {
        const files = Array.from(dt.files);
        this.dispatch('filedrop', { files });
      }
    });

    // Optional Attach Button Hookup with file input
    const attachBtn = this.querySelector('[data-part="attach-btn"]');
    const fileInput = this.querySelector('[data-part="file-input"], input[type="file"]');
    if (attachBtn && fileInput) {
      this.listen(attachBtn, 'click', (e) => {
        e.preventDefault();
        fileInput.click();
      });
      this.listen(fileInput, 'change', () => {
        const files = Array.from(fileInput.files || []);
        if (files.length > 0) {
          this.dispatch('fileattach', { files });
        }
      });
    }

    const submitBtn = this.querySelector('[data-part="submit-btn"]');
    if (submitBtn) {
      this.listen(submitBtn, 'click', (e) => {
        e.preventDefault();
        this.submit();
      });
    }

    const stopBtn = this.querySelector('[data-part="stop-btn"]');
    if (stopBtn) {
      this.listen(stopBtn, 'click', (e) => {
        e.preventDefault();
        this.stop();
      });
    }
  }

  submit() {
    if (this.disabled || this.loading) return;
    const text = this.value.trim();
    if (!text) return;

    this.dispatch('submit', { prompt: text });
    this.value = '';
    this._syncState();
    this._persistState?.();
  }

  stop() {
    this.dispatch('stop');
    this.loading = false;
  }

  clear() {
    this.value = '';
    this._syncState();
  }
}
