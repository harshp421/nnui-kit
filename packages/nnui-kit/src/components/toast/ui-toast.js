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
      loading: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="ui-toast-svg ui-toast-svg--loading ui-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`,
    };

    const iconHtml = icons[type]
      ? `<span data-part="toast-icon" data-type="${type}">${icons[type]}</span>`
      : '';

    const actionHtml = action
      ? `<button type="button" data-part="toast-action" class="ui-toast-action-btn">${action.label}</button>`
      : '';

    const hasProgressBar = duration > 0 && duration !== Infinity && type !== 'loading';
    const progressHtml = hasProgressBar
      ? `<div data-part="toast-progress" style="animation: uiToastProgress ${duration}ms linear forwards;"></div>`
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
      ${progressHtml}
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

    const update = ({ title: newTitle, description: newDesc, type: newType, duration: newDuration = 4000 } = {}) => {
      if (newTitle !== undefined) {
        const titleEl = toastEl.querySelector('[data-part="toast-title"]');
        if (titleEl) titleEl.textContent = newTitle;
        toastEl.dataset.toastTitle = newTitle;
      }
      if (newDesc !== undefined) {
        let descEl = toastEl.querySelector('[data-part="toast-description"]');
        if (!descEl && newDesc) {
          descEl = document.createElement('div');
          descEl.setAttribute('data-part', 'toast-description');
          toastEl.querySelector('[data-part="toast-text"]')?.appendChild(descEl);
        }
        if (descEl) descEl.textContent = newDesc;
        toastEl.dataset.toastDesc = newDesc;
      }
      if (newType) {
        toastEl.setAttribute('data-type', newType);
        const iconContainer = toastEl.querySelector('[data-part="toast-icon"]');
        if (iconContainer && icons[newType]) {
          iconContainer.setAttribute('data-type', newType);
          iconContainer.innerHTML = icons[newType];
        }
      }
      if (newDuration > 0 && newDuration !== Infinity) {
        pauseTimer();
        remaining = newDuration;
        startTimer();
        let progress = toastEl.querySelector('[data-part="toast-progress"]');
        if (!progress) {
          progress = document.createElement('div');
          progress.setAttribute('data-part', 'toast-progress');
          toastEl.appendChild(progress);
        }
        progress.style.animation = 'none';
        void progress.offsetHeight; // trigger reflow
        progress.style.animation = `uiToastProgress ${newDuration}ms linear forwards`;
      }
    };

    toastEl._restartTimer = () => {
      pauseTimer();
      remaining = duration;
      startTimer();
    };
    toastEl._dismiss = dismiss;
    toastEl._update = update;

    // Prepend or append depending on top/bottom
    if (this.position.startsWith('top')) {
      this.prepend(toastEl);
    } else {
      this.appendChild(toastEl);
    }

    startTimer();
    return { id, dismiss, update, element: toastEl };
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

export function toast(input, maybeOptions = {}) {
  const toaster = ensureToaster();
  const options = (typeof input === 'object' && input !== null)
    ? { ...input, ...maybeOptions }
    : { title: input, ...maybeOptions };

  return toaster.createToast({
    title: options.title || '',
    description: options.description || '',
    type: options.type || 'default',
    duration: options.duration !== undefined ? options.duration : 4000,
    action: options.action || null,
    onDismiss: options.onDismiss || null,
  });
}

toast.success = (input, options = {}) => toast(input, { ...options, type: 'success' });
toast.error = (input, options = {}) => toast(input, { ...options, type: 'error' });
toast.warning = (input, options = {}) => toast(input, { ...options, type: 'warning' });
toast.info = (input, options = {}) => toast(input, { ...options, type: 'info' });
toast.loading = (input, options = {}) => toast(input, { ...options, type: 'loading', duration: Infinity });

toast.promise = async function (promise, { loading = 'Loading...', success = 'Success', error = 'Error' } = {}) {
  const loadingTitle = typeof loading === 'string' ? loading : (loading?.title || 'Loading...');
  const loadingOpts = typeof loading === 'object' ? loading : {};
  const toastRef = toast.loading(loadingTitle, loadingOpts);

  try {
    const result = await (typeof promise === 'function' ? promise() : promise);
    const successOpts = typeof success === 'function' ? success(result) : success;
    const title = typeof successOpts === 'string' ? successOpts : (successOpts?.title || 'Action completed');
    const opts = typeof successOpts === 'object' ? successOpts : {};
    toastRef.update({ title, ...opts, type: 'success', duration: 4000 });
    return result;
  } catch (err) {
    const errorOpts = typeof error === 'function' ? error(err) : error;
    const title = typeof errorOpts === 'string' ? errorOpts : (errorOpts?.title || (err?.message || 'Action failed'));
    const opts = typeof errorOpts === 'object' ? errorOpts : {};
    toastRef.update({ title, ...opts, type: 'error', duration: 5000 });
    throw err;
  }
};

toast.dismiss = (id) => {
  if (!id) {
    document.querySelectorAll('[data-ui="toast"]').forEach((t) => t.remove());
    return;
  }
  const el = document.getElementById(id);
  if (el) el.remove();
};
