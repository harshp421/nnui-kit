import { BaseLightElement } from '../../utils/base-element.js';
import { Keys, applyRovingTabindex, getNextIndex } from '../../utils/a11y.js';

/**
 * <ui-dock> Micro-Enhancer
 * macOS-inspired floating application dock and action island in Light-DOM.
 * 
 * Features:
 * - Distance-weighted spring magnification on mousemove
 * - Ultra-smooth spring settlement using --ui-spring-snappy
 * - Full WAI-ARIA roving tabindex keyboard navigation (ArrowLeft, ArrowRight, Home, End)
 * - Automatic tooltips with aria-label mirroring
 * - Dispatches 'select' CustomEvent with { index, value, item }
 * - 100% Light-DOM, zero Shadow DOM traps
 */
export class UiDock extends BaseLightElement {
  static get observedAttributes() {
    return ['position', 'distance', 'max-scale', 'orientation'];
  }

  get position() {
    return this.getAttribute('position') || 'bottom';
  }

  set position(val) {
    if (val) this.setAttributeSafe('position', val);
    else this.removeAttributeSafe('position');
  }

  get distance() {
    const d = parseFloat(this.getAttribute('distance'));
    return isNaN(d) || d <= 0 ? 140 : d;
  }

  set distance(val) {
    if (val !== null && val !== undefined) this.setAttributeSafe('distance', String(val));
    else this.removeAttributeSafe('distance');
  }

  get maxScale() {
    const s = parseFloat(this.getAttribute('max-scale'));
    return isNaN(s) || s <= 1 ? 1.45 : s;
  }

  set maxScale(val) {
    if (val !== null && val !== undefined) this.setAttributeSafe('max-scale', String(val));
    else this.removeAttributeSafe('max-scale');
  }

  getAiState() {
    return {
      position: this.position,
      itemsCount: this._getItems().length,
      maxScale: this.maxScale,
      distance: this.distance,
    };
  }

  init() {
    this.setAttributeSafe('data-ui', 'dock');
    this.setAttributeSafe('role', 'toolbar');
    this.setAttributeSafe('aria-label', 'Application Dock');

    this._activeIndex = 0;
    this._rafId = null;

    this._setupItems();
    this._bindEvents();
  }

  _getItems() {
    return Array.from(this.querySelectorAll('[data-part="item"], button, a')).filter(
      (el) => el.parentElement === this || el.parentElement.getAttribute('data-part') === 'container'
    );
  }

  _setupItems() {
    const items = this._getItems();
    let hasActive = false;

    items.forEach((item, idx) => {
      this.setAttributeSafe(item, 'data-part', 'item');
      this.setAttributeSafe(item, 'tabindex', idx === 0 ? '0' : '-1');

      const isMarkedActive =
        item.hasAttribute('active') ||
        item.getAttribute('data-active') === 'true' ||
        item.getAttribute('aria-selected') === 'true';

      if (isMarkedActive && !hasActive) {
        this.setAttributeSafe(item, 'data-active', 'true');
        this.setAttributeSafe(item, 'aria-selected', 'true');
        this._activeIndex = idx;
        hasActive = true;
      }

      // Visible label scaffolding if data-label exists and no [data-part="label"] is present
      const labelText = item.getAttribute('data-label');
      if (labelText && !item.querySelector('[data-part="label"]')) {
        const lbl = document.createElement('span');
        lbl.setAttribute('data-part', 'label');
        lbl.textContent = labelText;
        item.appendChild(lbl);
      }

      // Tooltip scaffolding if aria-label/title exists and item has no visible label
      const tipText = item.getAttribute('aria-label') || item.getAttribute('title');
      if (tipText && !item.querySelector('[data-part="tooltip"]') && !item.querySelector('[data-part="label"]')) {
        const tip = document.createElement('span');
        tip.setAttribute('data-part', 'tooltip');
        tip.textContent = tipText;
        item.appendChild(tip);
      }
    });
  }

  _bindEvents() {
    this.listen(this, 'mousemove', (e) => this._onMouseMove(e));
    this.listen(this, 'mouseleave', () => this._onMouseLeave());
    this.listen(this, 'keydown', (e) => this._onKeyDown(e));
    this.listen(this, 'click', (e) => this._onClick(e));
  }

  _onMouseMove(e) {
    if (this._rafId) return;

    this._rafId = requestAnimationFrame(() => {
      this._rafId = null;
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      const maxDist = this.distance;
      const maxScale = this.maxScale;

      const items = this._getItems();
      items.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const dist = Math.abs(mouseX - centerX);

        if (dist < maxDist) {
          const factor = Math.cos((dist / maxDist) * (Math.PI / 2));
          const scale = 1 + (maxScale - 1) * factor;
          item.style.setProperty('--dock-scale', scale.toFixed(3));
          item.style.setProperty('--dock-translate-y', `${((-1 * (scale - 1) * 16)).toFixed(1)}px`);
        } else {
          item.style.setProperty('--dock-scale', '1');
          item.style.setProperty('--dock-translate-y', '0px');
        }
      });
    });
  }

  _onMouseLeave() {
    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
    const items = this._getItems();
    items.forEach((item) => {
      item.style.setProperty('--dock-scale', '1');
      item.style.setProperty('--dock-translate-y', '0px');
    });
  }

  _onKeyDown(e) {
    const items = this._getItems();
    if (items.length === 0) return;

    let targetIdx = this._activeIndex;

    switch (e.key) {
      case Keys.ARROW_RIGHT:
      case Keys.ARROW_DOWN:
        e.preventDefault();
        targetIdx = getNextIndex(this._activeIndex, items.length, 1, true);
        break;
      case Keys.ARROW_LEFT:
      case Keys.ARROW_UP:
        e.preventDefault();
        targetIdx = getNextIndex(this._activeIndex, items.length, -1, true);
        break;
      case Keys.HOME:
        e.preventDefault();
        targetIdx = 0;
        break;
      case Keys.END:
        e.preventDefault();
        targetIdx = items.length - 1;
        break;
      case Keys.ENTER:
      case Keys.SPACE:
      case Keys.SPACEBAR:
        e.preventDefault();
        if (items[this._activeIndex]) {
          items[this._activeIndex].click();
        }
        return;
      default:
        return;
    }

    if (targetIdx !== this._activeIndex && items[targetIdx]) {
      this._activeIndex = targetIdx;
      applyRovingTabindex(items, targetIdx, true);
    }
  }

  _onClick(e) {
    const item = e.target.closest('[data-part="item"], button, a');
    if (!item || !this.contains(item)) return;

    const items = this._getItems();
    const index = items.indexOf(item);
    if (index >= 0) {
      this._activeIndex = index;
      applyRovingTabindex(items, index, false);

      items.forEach((it, i) => {
        if (i === index) {
          this.setAttributeSafe(it, 'data-active', 'true');
          this.setAttributeSafe(it, 'aria-selected', 'true');
        } else {
          this.removeAttributeSafe(it, 'data-active');
          this.removeAttributeSafe(it, 'aria-selected');
        }
      });
    }

    const label =
      item.querySelector('[data-part="label"]')?.textContent?.trim() ||
      item.getAttribute('data-label') ||
      item.getAttribute('aria-label') ||
      '';

    this.dispatch('select', {
      index,
      value: item.getAttribute('data-value') || item.getAttribute('href') || label || item.textContent?.trim(),
      label,
      item,
    });
  }
}
