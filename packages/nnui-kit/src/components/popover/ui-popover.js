import { BaseLightElement } from '../../utils/base-element.js';
import { applyPositionFallback } from '../../utils/anchor-fallback.js';
import { generateUniqueId } from '../../utils/a11y.js';

/**
 * <ui-popover> Micro-Enhancer
 * Couples Native Popover API with universal viewport positioning fallback.
 */
export class UiPopover extends BaseLightElement {
  init() {
    this.setAttributeSafe(this, 'data-ui', 'popover');
    this._trigger = this.querySelector('[data-part="trigger"]');
    this._panel = this.querySelector('[data-part="popover-panel"], [data-part="content"], [popover]');

    if (!this._trigger || !this._panel) return;

    this._setupPopover();
    this._bindEvents();
  }

  _setupPopover() {
    const baseId = this.id || generateUniqueId('popover');
    const panelId = this._panel.id || `${baseId}-panel`;

    this.setAttributeSafe(this._panel, 'id', panelId);
    this.setAttributeSafe(this._panel, 'popover', this._panel.getAttribute('popover') || 'auto');
    this.setAttributeSafe(this._panel, 'data-ui', 'popover-content');
    this.setAttributeSafe(this._panel, 'data-part', 'popover-panel');

    // Link trigger via native popovertarget
    this.setAttributeSafe(this._trigger, 'popovertarget', panelId);
    this.setAttributeSafe(this._trigger, 'aria-haspopup', 'dialog');
    this.setAttributeSafe(this._trigger, 'aria-expanded', 'false');
  }

  _bindEvents() {
    // Native Popover toggle event (fired whenever popover opens or closes)
    this.listen(this._panel, 'toggle', (e) => {
      const isOpen = e.newState === 'open';
      this.setAttributeSafe(this._trigger, 'aria-expanded', isOpen ? 'true' : 'false');
      this.setAttributeSafe(this._panel, 'data-state', isOpen ? 'open' : 'closed');

      if (isOpen) {
        // Wait one frame so browser calculates dimensions of top-layer element
        requestAnimationFrame(() => {
          this._reposition();
        });
      }

      this.dispatch('toggle', { open: isOpen });
    });

    // Fallback trigger click if browser lacks popovertarget handling
    this.listen(this._trigger, 'click', (e) => {
      if (typeof this._panel.showPopover === 'function') {
        // Handled natively by popovertarget, but guarantee position update
        requestAnimationFrame(() => {
          if (this._panel.matches(':popover-open')) {
            this._reposition();
          }
        });
      } else {
        // Fallback for non-popover supporting browsers
        e.preventDefault();
        const isOpen = this._panel.getAttribute('data-state') === 'open';
        if (isOpen) {
          this.hide();
        } else {
          this.show();
        }
      }
    });

    // Auto-update position on window resize or page scroll
    const onScrollOrResize = () => {
      if (this.isOpen) {
        this._reposition();
      }
    };

    this.listen(window, 'resize', onScrollOrResize, { passive: true });
    this.listen(window, 'scroll', onScrollOrResize, { passive: true });
  }

  get isOpen() {
    if (!this._panel) return false;
    return (
      (typeof this._panel.matches === 'function' && this._panel.matches(':popover-open')) ||
      this._panel.getAttribute('data-state') === 'open'
    );
  }

  set isOpen(val) {
    if (val) this.show();
    else this.hide();
  }

  _reposition() {
    if (!this._trigger || !this._panel) return;
    applyPositionFallback(this._trigger, this._panel, 'bottom', 8);
  }

  show() {
    if (!this._panel) return;
    this.setAttributeSafe(this._panel, 'data-state', 'open');
    if (this._trigger) {
      this.setAttributeSafe(this._trigger, 'aria-expanded', 'true');
    }
    if (typeof this._panel.showPopover === 'function') {
      try {
        if (!this._panel.matches(':popover-open')) {
          this._panel.showPopover();
        }
      } catch (e) {}
    }
    this._reposition();
  }

  hide() {
    if (!this._panel) return;
    this.setAttributeSafe(this._panel, 'data-state', 'closed');
    if (this._trigger) {
      this.setAttributeSafe(this._trigger, 'aria-expanded', 'false');
    }
    if (typeof this._panel.hidePopover === 'function') {
      try {
        if (this._panel.matches(':popover-open')) {
          this._panel.hidePopover();
        }
      } catch (e) {}
    }
  }
}
