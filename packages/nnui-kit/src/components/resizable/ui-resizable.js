import { BaseLightElement } from '../../utils/base-element.js';
import { Keys } from '../../utils/a11y.js';

/**
 * <ui-resizable> Micro-Enhancer
 * Accessible resizable panel layout in Light-DOM.
 * 
 * Features:
 * - Horizontal and vertical split orientations
 * - Mouse & touch dragging with pointer capture
 * - Full WAI-ARIA separator pattern (role="separator", aria-valuenow, Arrow keys)
 * - Min/max panel size constraints
 * - Dispatches 'resize' CustomEvent with { sizes: [number, number] }
 */
export class UiResizable extends BaseLightElement {
  static get observedAttributes() {
    return ['orientation', 'disabled'];
  }

  get orientation() {
    return this.getAttribute('orientation') || 'horizontal';
  }

  set orientation(val) {
    this.setAttributeSafe('orientation', val);
    this._syncOrientation();
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
    this.setAttributeSafe('data-ui', 'resizable');
    this._syncOrientation();

    this._panels = Array.from(this.querySelectorAll('[data-part="panel"]'));
    this._handles = Array.from(this.querySelectorAll('[data-part="handle"], [role="separator"]'));

    this._initPanels();
    this._bindEvents();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue || !this._initialized) return;
    if (name === 'orientation') {
      this._syncOrientation();
    }
  }

  _syncOrientation() {
    this.setAttributeSafe('data-orientation', this.orientation);
    const isVert = this.orientation === 'vertical';
    this.style.display = 'flex';
    this.style.flexDirection = isVert ? 'column' : 'row';
    this.style.width = '100%';
    this.style.height = isVert ? '100%' : 'auto';
  }

  _initPanels() {
    if (this._panels.length < 2) return;

    // Read default sizes or divide evenly
    let total = 0;
    const sizes = this._panels.map((p) => {
      const s = parseFloat(p.getAttribute('data-size') || p.getAttribute('data-default-size'));
      return isNaN(s) ? 0 : s;
    });

    total = sizes.reduce((a, b) => a + b, 0);

    if (total === 0) {
      const even = 100 / this._panels.length;
      this._sizes = this._panels.map(() => even);
    } else {
      this._sizes = sizes.map(s => (s / total) * 100);
    }

    this._applySizes();

    this._handles.forEach((handle, idx) => {
      handle.setAttribute('role', 'separator');
      handle.setAttribute('tabindex', this.disabled ? '-1' : '0');
      handle.setAttribute('aria-orientation', this.orientation);
      handle.setAttribute('aria-valuenow', Math.round(this._sizes[idx] || 50));
      handle.setAttribute('aria-valuemin', '10');
      handle.setAttribute('aria-valuemax', '90');
    });
  }

  _applySizes() {
    this._panels.forEach((p, idx) => {
      const sz = this._sizes[idx] || 50;
      p.style.flex = `${sz} 1 0px`;
      p.setAttribute('data-size', sz.toFixed(2));
    });
  }

  _bindEvents() {
    this._handles.forEach((handle, handleIndex) => {
      let isDragging = false;
      let startPos = 0;
      let startSizes = [];

      const onPointerDown = (e) => {
        if (this.disabled || e.button !== 0) return;
        e.preventDefault();

        isDragging = true;
        handle.setPointerCapture?.(e.pointerId);
        handle.setAttribute('data-dragging', 'true');
        document.body.style.userSelect = 'none';

        startPos = this.orientation === 'vertical' ? e.clientY : e.clientX;
        startSizes = [...this._sizes];

        const onPointerMove = (moveEvt) => {
          if (!isDragging) return;
          const currentPos = this.orientation === 'vertical' ? moveEvt.clientY : moveEvt.clientX;
          const deltaPx = currentPos - startPos;

          const rect = this.getBoundingClientRect();
          const totalDimension = this.orientation === 'vertical' ? rect.height : rect.width;
          if (totalDimension <= 0) return;

          const deltaPercent = (deltaPx / totalDimension) * 100;
          this._adjustSizes(handleIndex, deltaPercent, startSizes);
        };

        const onPointerUp = (upEvt) => {
          if (!isDragging) return;
          isDragging = false;
          handle.releasePointerCapture?.(upEvt.pointerId);
          handle.removeAttribute('data-dragging');
          document.body.style.userSelect = '';

          window.removeEventListener('pointermove', onPointerMove);
          window.removeEventListener('pointerup', onPointerUp);
          window.removeEventListener('pointercancel', onPointerUp);
        };

        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
        window.addEventListener('pointercancel', onPointerUp);
      };

      this.listen(handle, 'pointerdown', onPointerDown);

      // Keyboard navigation
      this.listen(handle, 'keydown', (e) => {
        if (this.disabled) return;
        const step = e.shiftKey ? 5 : 1;
        let delta = 0;

        if (this.orientation === 'horizontal') {
          if (e.key === Keys.ARROW_LEFT) delta = -step;
          else if (e.key === Keys.ARROW_RIGHT) delta = step;
        } else {
          if (e.key === Keys.ARROW_UP) delta = -step;
          else if (e.key === Keys.ARROW_DOWN) delta = step;
        }

        if (delta !== 0) {
          e.preventDefault();
          this._adjustSizes(handleIndex, delta, this._sizes);
        }
      });
    });
  }

  _adjustSizes(handleIndex, deltaPercent, baseSizes) {
    if (!baseSizes || baseSizes.length < 2) return;

    const leftIdx = handleIndex;
    const rightIdx = handleIndex + 1;

    if (rightIdx >= baseSizes.length) return;

    const minSize = 10;
    const maxSize = 90;

    let newLeft = baseSizes[leftIdx] + deltaPercent;
    let newRight = baseSizes[rightIdx] - deltaPercent;

    if (newLeft < minSize) {
      newRight -= (minSize - newLeft);
      newLeft = minSize;
    } else if (newLeft > maxSize) {
      newRight += (newLeft - maxSize);
      newLeft = maxSize;
    }

    if (newRight < minSize) {
      newLeft -= (minSize - newRight);
      newRight = minSize;
    }

    this._sizes[leftIdx] = newLeft;
    this._sizes[rightIdx] = newRight;

    this._applySizes();

    const handle = this._handles[handleIndex];
    if (handle) {
      handle.setAttribute('aria-valuenow', Math.round(newLeft));
    }

    this.dispatch('resize', { sizes: [...this._sizes] });
  }

  getSizes() {
    return [...(this._sizes || [])];
  }
}
