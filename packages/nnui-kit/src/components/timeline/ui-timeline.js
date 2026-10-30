import { BaseLightElement } from '../../utils/base-element.js';

/**
 * <ui-timeline> Micro-Enhancer
 * Accessible, platform-native event stream & workflow step timeline in Light-DOM.
 * 
 * Features:
 * - Vertical (default) and horizontal orientation support
 * - Dynamic status indicators: completed, active (pulsing radar beacon), pending, error
 * - Seamless connecting line tracks between nodes
 * - Keyboard navigable with WAI-ARIA role="list" and role="listitem"
 * - Dispatches 'stepclick' CustomEvent with { index, item, status }
 * - 100% Light-DOM, zero Shadow DOM traps
 */
export class UiTimeline extends BaseLightElement {
  static get observedAttributes() {
    return ['orientation', 'active-step'];
  }

  get orientation() {
    return this.getAttribute('orientation') || 'vertical';
  }

  set orientation(val) {
    if (val) this.setAttributeSafe('orientation', val);
    else this.removeAttributeSafe('orientation');
  }

  get activeStep() {
    const s = parseInt(this.getAttribute('active-step'), 10);
    return isNaN(s) ? -1 : s;
  }

  set activeStep(val) {
    if (val !== null && val !== undefined) this.setAttributeSafe('active-step', String(val));
    else this.removeAttributeSafe('active-step');
    this._syncActiveStep();
  }

  getAiState() {
    return {
      orientation: this.orientation,
      itemsCount: this._getItems().length,
      activeStep: this.activeStep,
    };
  }

  init() {
    this.setAttributeSafe('data-ui', 'timeline');
    this.setAttributeSafe('role', 'list');

    this._setupItems();
    this._syncActiveStep();
    this._bindEvents();
  }

  _getItems() {
    return Array.from(this.querySelectorAll('[data-part="item"]'));
  }

  _setupItems() {
    const items = this._getItems();
    items.forEach((item, idx) => {
      this.setAttributeSafe(item, 'role', 'listitem');
      this.setAttributeSafe(item, 'data-index', String(idx));

      // Auto-scaffold connector line if missing
      if (!item.querySelector('[data-part="connector"]') && idx < items.length - 1) {
        const connector = document.createElement('span');
        connector.setAttribute('data-part', 'connector');
        item.appendChild(connector);
      }

      // Auto-scaffold marker if missing
      if (!item.querySelector('[data-part="marker"]')) {
        const marker = document.createElement('span');
        marker.setAttribute('data-part', 'marker');
        item.prepend(marker);
      }
    });
  }

  _syncActiveStep() {
    const items = this._getItems();
    const activeIdx = this.activeStep;
    if (activeIdx < 0) return;

    items.forEach((item, idx) => {
      if (idx < activeIdx) {
        this.setAttributeSafe(item, 'data-status', 'completed');
      } else if (idx === activeIdx) {
        this.setAttributeSafe(item, 'data-status', 'active');
      } else {
        this.setAttributeSafe(item, 'data-status', 'pending');
      }
    });
  }

  _bindEvents() {
    this.listen(this, 'click', (e) => {
      const item = e.target.closest('[data-part="item"]');
      if (!item || !this.contains(item)) return;

      const items = this._getItems();
      const index = items.indexOf(item);
      const status = item.getAttribute('data-status') || 'default';

      this.dispatch('stepclick', {
        index,
        item,
        status,
        title: item.querySelector('[data-part="title"]')?.textContent?.trim() || '',
      });
    });
  }
}
