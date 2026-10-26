import { BaseLightElement } from '../../utils/base-element.js';

let activeToaster = null;
let toastCounter = 0;

/**
 * <ui-toaster> Micro-Enhancer
 * Lightweight, stacked toast notification viewport in Light-DOM.
 */
export class UiToaster extends BaseLightElement {
  static get observedAttributes() {
    return ['position', 'expand', 'max', 'limit'];
  }

  get position() {
    return this.getAttribute('position') || 'bottom-right';
  }

  set position(val) {
    if (val) this.setAttribute('position', val);
    else this.removeAttribute('position');
  }

  get expand() {
    return this.hasAttribute('expand');
  }

  set expand(val) {
    if (val) this.setAttribute('expand', '');
    else this.removeAttribute('expand');
  }

  get max() {
    const val = this.getAttribute('max') || this.getAttribute('limit');
    return val ? parseInt(val, 10) : 3;
  }

  set max(val) {
    if (val) this.setAttribute('max', String(val));
    else this.removeAttribute('max');
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
    // 1. Deduplication: If identical toast is already active, shake & restart timer instead of piling up
    const activeToasts = Array.from(this.querySelectorAll('[data-ui="toast"]:not([data-state="closed"])'));
    const duplicate = activeToasts.find(
      (t) => t.dataset.toastTitle === title && t.dataset.type === type && t.dataset.toastDesc === (description || '')
    );
    if (duplicate) {
      duplicate.setAttribute('data-shake', 'true');
      setTimeout(() => duplicate.removeAttribute('data-shake'), 350);
      if (typeof duplicate._restartTimer === 'function') {
        duplicate._restartTimer();
      }
      return { id: duplicate.id, dismiss: duplicate._dismiss, element: duplicate };
    }

    // 2. Strict visible limit: Prevent flooding the screen (default 3 max)
    const maxAllowed = Math.max(1, this.max || 3);
    if (activeToasts.length >= maxAllowed) {
      const excess = activeToasts.length - maxAllowed + 1;
      for (let i = 0; i < excess; i++) {
        const oldest = activeToasts[i];
        if (typeof oldest._dismiss === 'function') {
          oldest._dismiss();
        } else {
          oldest.remove();
        }
      }
    }

    const id = `toast-${++toastCounter}`;
    const toastEl = document.createElement('div');
    toastEl.id = id;
    toastEl.setAttribute('data-ui', 'toast');
    toastEl.setAttribute('data-type', type);
    toastEl.setAttribute('data-state', 'open');
    toastEl.setAttribute('role', type === 'error' ? 'alert' : 'status');
    toastEl.setAttribute('aria-live', type === 'error' ? 'assertive' : 'polite');
    toastEl.dataset.toastTitle = title;
    toastEl.dataset.toastDesc = description || '';

    const icons = {
      default: '',
      success: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ui-toast-svg ui-toast-svg--success"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`,
      error: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ui-toast-svg ui-toast-svg--error"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>`,
      warning: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ui-toast-svg ui-toast-svg--warning"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
      info: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ui-toast-svg ui-toast-svg--info"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`,
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
        <button type="button" data-part="toast-close" aria-label="Dismiss"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>
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

    toastEl._restartTimer = () => {
      pauseTimer();
      remaining = duration;
      startTimer();
    };
    toastEl._dismiss = dismiss;

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
