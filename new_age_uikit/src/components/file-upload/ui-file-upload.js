import { BaseLightElement } from '../../utils/base-element.js';

/**
 * <ui-file-upload> Micro-Enhancer
 * Accessible drag-and-drop file upload manager in Light-DOM.
 * 
 * Features:
 * - HTML5 drag-and-drop with data-dragging="true" visual feedback
 * - File size and MIME type acceptance validation
 * - Clipboard image/document paste support
 * - Native hidden <input type="file"> integration
 * - 'change' CustomEvent with { files, rejectedFiles }
 */
export class UiFileUpload extends BaseLightElement {
  static get observedAttributes() {
    return ['accept', 'multiple', 'max-size', 'disabled'];
  }

  constructor() {
    super();
    this._files = [];
  }

  get files() {
    return [...this._files];
  }

  get accept() {
    return this.getAttribute('accept') || '';
  }

  get multiple() {
    return this.hasAttribute('multiple');
  }

  get maxSize() {
    const val = parseInt(this.getAttribute('max-size'), 10);
    return isNaN(val) ? Infinity : val;
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
  }

  init() {
    this.setAttributeSafe('data-ui', 'file-upload');

    this._setupNativeInput();
    this._bindEvents();
  }

  _setupNativeInput() {
    let input = this.querySelector('input[type="file"]');
    if (!input) {
      input = document.createElement('input');
      input.type = 'file';
      input.setAttribute('data-part', 'native-input');
      input.style.display = 'none';
      this.appendChild(input);
    }

    if (this.accept) input.accept = this.accept;
    if (this.multiple) input.multiple = true;
    if (this.disabled) input.disabled = true;

    this._nativeInput = input;
  }

  _bindEvents() {
    const dropzone = this.querySelector('[data-part="dropzone"]') || this;
    const trigger = this.querySelector('[data-part="trigger"]') || dropzone;

    // Trigger click opens file browser dialog
    this.listen(trigger, 'click', (e) => {
      if (this.disabled) return;
      if (e.target !== this._nativeInput && !e.target.closest('[data-part="remove-file"]')) {
        this._nativeInput?.click();
      }
    });

    // Native file input change
    if (this._nativeInput) {
      this.listen(this._nativeInput, 'change', () => {
        if (this._nativeInput.files && this._nativeInput.files.length > 0) {
          this._handleSelectedFiles(Array.from(this._nativeInput.files));
        }
      });
    }

    // Drag and Drop
    let dragCounter = 0;

    this.listen(dropzone, 'dragenter', (e) => {
      if (this.disabled) return;
      e.preventDefault();
      e.stopPropagation();
      dragCounter++;
      this.setAttributeSafe(dropzone, 'data-dragging', 'true');
    });

    this.listen(dropzone, 'dragover', (e) => {
      if (this.disabled) return;
      e.preventDefault();
      e.stopPropagation();
    });

    this.listen(dropzone, 'dragleave', (e) => {
      if (this.disabled) return;
      e.preventDefault();
      e.stopPropagation();
      dragCounter--;
      if (dragCounter <= 0) {
        dragCounter = 0;
        this.removeAttributeSafe(dropzone, 'data-dragging');
      }
    });

    this.listen(dropzone, 'drop', (e) => {
      if (this.disabled) return;
      e.preventDefault();
      e.stopPropagation();
      dragCounter = 0;
      this.removeAttributeSafe(dropzone, 'data-dragging');

      if (e.dataTransfer && e.dataTransfer.files.length > 0) {
        this._handleSelectedFiles(Array.from(e.dataTransfer.files));
      }
    });

    // Paste file from clipboard
    this.listen(this, 'paste', (e) => {
      if (this.disabled) return;
      const items = e.clipboardData?.items;
      if (!items) return;

      const pastedFiles = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].kind === 'file') {
          const file = items[i].getAsFile();
          if (file) pastedFiles.push(file);
        }
      }

      if (pastedFiles.length > 0) {
        e.preventDefault();
        this._handleSelectedFiles(pastedFiles);
      }
    });

    // Remove file listener
    this.listen(this, 'click', (e) => {
      const removeBtn = e.target.closest('[data-part="remove-file"]');
      if (!removeBtn) return;
      e.stopPropagation();

      const itemEl = removeBtn.closest('[data-part="file-item"]');
      const filename = itemEl?.getAttribute('data-filename');
      if (filename) {
        this.removeFile(filename);
      }
    });
  }

  _handleSelectedFiles(newFiles) {
    const accepted = [];
    const rejected = [];
    const max = this.maxSize;
    const acceptTypes = this.accept ? this.accept.split(',').map(s => s.trim().toLowerCase()) : [];

    newFiles.forEach((file) => {
      // Validate size
      if (file.size > max) {
        rejected.push({ file, reason: 'size' });
        return;
      }

      // Validate MIME type / extension
      if (acceptTypes.length > 0) {
        const ext = `.${file.name.split('.').pop().toLowerCase()}`;
        const match = acceptTypes.some((type) => {
          if (type.startsWith('.')) return ext === type;
          if (type.endsWith('/*')) {
            const prefix = type.replace('/*', '');
            return file.type.startsWith(prefix);
          }
          return file.type === type;
        });

        if (!match) {
          rejected.push({ file, reason: 'type' });
          return;
        }
      }

      accepted.push(file);
    });

    if (this.multiple) {
      this._files = [...this._files, ...accepted];
    } else {
      this._files = accepted.slice(0, 1);
    }

    this._renderFileList();
    this.dispatch('change', { files: [...this._files], rejectedFiles: rejected });
  }

  _renderFileList() {
    const list = this.querySelector('[data-part="file-list"]');
    if (!list) return;

    list.innerHTML = '';
    this._files.forEach((file) => {
      const li = document.createElement('li');
      li.setAttribute('data-part', 'file-item');
      li.setAttribute('data-filename', file.name);
      li.className = 'ui-file-item';

      const info = document.createElement('div');
      info.className = 'ui-file-info';

      const nameSpan = document.createElement('span');
      nameSpan.className = 'ui-file-name';
      nameSpan.textContent = file.name;

      const sizeSpan = document.createElement('span');
      sizeSpan.className = 'ui-file-size';
      sizeSpan.textContent = this._formatBytes(file.size);

      info.appendChild(nameSpan);
      info.appendChild(sizeSpan);

      const delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.setAttribute('data-part', 'remove-file');
      delBtn.className = 'ui-file-remove';
      delBtn.setAttribute('aria-label', `Remove ${file.name}`);
      delBtn.textContent = '✕';

      li.appendChild(info);
      li.appendChild(delBtn);
      list.appendChild(li);
    });
  }

  _formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  }

  removeFile(name) {
    this._files = this._files.filter(f => f.name !== name);
    this._renderFileList();
    this.dispatch('change', { files: [...this._files] });
  }

  clear() {
    this._files = [];
    if (this._nativeInput) this._nativeInput.value = '';
    this._renderFileList();
    this.dispatch('change', { files: [] });
  }
}
