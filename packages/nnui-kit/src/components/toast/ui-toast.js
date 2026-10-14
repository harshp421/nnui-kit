import { BaseLightElement } from '../../utils/base-element.js';

let activeToaster = null;
let toastCounter = 0;

/**
 * <ui-toaster> Micro-Enhancer
 * Lightweight, stacked toast notification viewport in Light-DOM.
 */
export class UiToaster extends BaseLightElement {
  static get observedAttributes() {
    return ['position', 'expand'];
  }

  get position() {
    return this.getAttribute('position') || 'bottom-right';
  }

  init() {
    this.setAttributeSafe(this, 'data-ui', 'toaster');
    this.setAttributeSafe(this, 'role', 'region');
    this.setAttributeSafe(this, 'aria-label', 'Notifications');
    this.setAttributeSafe(this, 'position', this.position);

    activeToaster = this;
  }

  destroy() {
    if (activeToaster === this) {
      activeToaster = null;
    }
  }

  createToast({
    title = '',
    description = '',
    type = 'default',
    duration = 4000,
    action = null,
    onDismiss = null,
  } = {}) {
    const id = `toast-${++toastCounter}`;
    const toastEl = document.createElement('div');
    toastEl.id = id;
    toastEl.setAttribute('data-ui', 'toast');
    toastEl.setAttribute('data-type', type);
    toastEl.setAttribute('data-state', 'open');
    toastEl.setAttribute('role', type === 'error' ? 'alert' : 'status');
    toastEl.setAttribute('aria-live', type === 'error' ? 'assertive' : 'polite');

    const icons = {
      default: '',
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ',
    };

    const iconHtml = icons[type]
      ? `<span data-part="toast-icon" data-type="${type}">${icons[type]}</span>`
      : '';

    const actionHtml = action
      ? `<button type="button" data-part="toast-action" class="ui-button ui-button--xs">${action.label}</button>`
      : '';

    toastEl.innerHTML = `
      <div data-part="toast-content">
        ${iconHtml}
        <div data-part="toast-text">
          <div data-part="toast-title">${title}</div>
          ${description ? `<div data-part="toast-description">${description}</div>` : ''}
        </div>
      </div>
      <div data-part="toast-actions">
        ${actionHtml}
        <button type="button" data-part="toast-close" aria-label="Dismiss">✕</button>
      </div>
    `;

    // Action button listener
    if (action?.onClick) {
      const actionBtn = toastEl.querySelector('[data-part="toast-action"]');
      if (actionBtn) {
        actionBtn.addEventListener('click', (e) => {
          action.onClick(e);
          dismiss();
        });
      }
    }

    // Close button listener
    const closeBtn = toastEl.querySelector('[data-part="toast-close"]');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => dismiss());
    }

    // Auto-dismiss timer with hover pause
    let remaining = duration;
    let timerId = null;
    let startTime = Date.now();

    const startTimer = () => {
      if (duration <= 0 || duration === Infinity) return;
      startTime = Date.now();
      timerId = setTimeout(() => dismiss(), remaining);
    };

    const pauseTimer = () => {
      if (timerId) {
        clearTimeout(timerId);
        remaining -= Date.now() - startTime;
      }
    };

    toastEl.addEventListener('pointerenter', pauseTimer);
    toastEl.addEventListener('pointerleave', startTimer);

    const dismiss = () => {
      pauseTimer();
      toastEl.setAttribute('data-state', 'closed');
      toastEl.addEventListener('animationend', () => {
        toastEl.remove();
        if (typeof onDismiss === 'function') onDismiss(id);
      }, { once: true });

      // Fallback removal if animation disabled
      setTimeout(() => {
        if (toastEl.parentNode) {
          toastEl.remove();
          if (typeof onDismiss === 'function') onDismiss(id);
        }
      }, 250);
    };

    // Prepend or append depending on top/bottom
    if (this.position.startsWith('top')) {
      this.prepend(toastEl);
    } else {
      this.appendChild(toastEl);
    }

    startTimer();
    return { id, dismiss, element: toastEl };
  }
}

/**
 * Global toast dispatch helper
 */
function ensureToaster() {
  if (!activeToaster || !activeToaster.isConnected) {
    let existing = document.querySelector('ui-toaster, nnui-toaster');
    if (existing) {
      activeToaster = existing;
    } else {
      activeToaster = document.createElement('ui-toaster');
      document.body.appendChild(activeToaster);
    }
  }
  return activeToaster;
}

export function toast(title, options = {}) {
  const toaster = ensureToaster();
  return toaster.createToast({ title, ...options, type: options.type || 'default' });
}

toast.success = (title, options = {}) => toast(title, { ...options, type: 'success' });
toast.error = (title, options = {}) => toast(title, { ...options, type: 'error' });
toast.warning = (title, options = {}) => toast(title, { ...options, type: 'warning' });
toast.info = (title, options = {}) => toast(title, { ...options, type: 'info' });

toast.dismiss = (id) => {
  if (!id) {
    document.querySelectorAll('[data-ui="toast"]').forEach((t) => t.remove());
    return;
  }
  const el = document.getElementById(id);
  if (el) el.remove();
};
