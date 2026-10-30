import { BaseLightElement } from '../../utils/base-element.js';
import { Keys } from '../../utils/a11y.js';

/**
 * <ui-ai-tool-call> Micro-Enhancer
 * Accessible, platform-native agent tool execution inspector in Light-DOM.
 * 
 * Features:
 * - Dynamic execution state indicators: 'pending', 'running', 'success', 'error'
 * - Real-time execution latency display badge (e.g. "142ms", "1.2s")
 * - Collapsible arguments and output stream inspector with spring physics
 * - Automatic inspection tray wrapper for children elements
 * - Built-in Retry action trigger dispatching 'retry' CustomEvent
 * - One-click payload copy trigger with visual feedback
 * - 100% Light-DOM, zero Shadow DOM traps
 */
export class UiAiToolCall extends BaseLightElement {
  static get observedAttributes() {
    return ['name', 'tool-name', 'status', 'latency', 'open', 'collapsible'];
  }

  get name() {
    return this.getAttribute('name') || this.getAttribute('tool-name') || 'tool_call';
  }

  set name(val) {
    if (val) this.setAttributeSafe('name', val);
    else this.removeAttributeSafe('name');
  }

  get status() {
    return this.getAttribute('status') || 'pending';
  }

  set status(val) {
    if (val) this.setAttributeSafe('status', val);
    else this.removeAttributeSafe('status');
  }

  get latency() {
    return this.getAttribute('latency') || '';
  }

  set latency(val) {
    if (val) this.setAttributeSafe('latency', val);
    else this.removeAttributeSafe('latency');
  }

  get open() {
    return this.hasAttribute('open');
  }

  set open(val) {
    if (val) this.setAttributeSafe('open', '');
    else this.removeAttributeSafe('open');
  }

  get collapsible() {
    return this.getAttribute('collapsible') !== 'false';
  }

  set collapsible(val) {
    if (val === false) this.setAttributeSafe('collapsible', 'false');
    else this.removeAttributeSafe('collapsible');
  }

  getAiState() {
    return {
      name: this.name,
      status: this.status,
      latency: this.latency,
      open: this.open,
      collapsible: this.collapsible,
      argsContent: this._getArgsContent(),
      outputContent: this._getOutputContent(),
    };
  }

  init() {
    this.setAttributeSafe('data-ui', 'ai-tool-call');
    this.setAttributeSafe('role', 'region');
    this.setAttributeSafe('aria-label', `Tool Execution: ${this.name}`);

    this._scaffoldHeader();
    this._scaffoldInspector();
    this._syncState();
    this._bindEvents();
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (!this._initialized || oldVal === newVal) return;

    if (name === 'status' || name === 'latency' || name === 'name' || name === 'tool-name') {
      this._syncState();
    } else if (name === 'open') {
      this._syncOpen();
    }
  }

  _getArgsContent() {
    const el = this.querySelector('[data-part="args"], [data-part="arguments"], [data-part="payload"]');
    return el ? el.textContent?.trim() || '' : '';
  }

  _getOutputContent() {
    const el = this.querySelector('[data-part="output"], [data-part="result"]');
    return el ? el.textContent?.trim() || '' : '';
  }

  _scaffoldInspector() {
    let inspector = this.querySelector(':scope > [data-part="inspector"]');
    if (!inspector) {
      const nonHeaderChildren = Array.from(this.children).filter(
        (child) => child.getAttribute('data-part') !== 'header'
      );
      if (nonHeaderChildren.length > 0) {
        inspector = document.createElement('div');
        inspector.setAttribute('data-part', 'inspector');
        nonHeaderChildren.forEach((child) => inspector.appendChild(child));
        this.appendChild(inspector);
      }
    }
  }

  _scaffoldHeader() {
    let header = this.querySelector('[data-part="header"]');
    if (!header) {
      header = document.createElement('div');
      header.setAttribute('data-part', 'header');

      const infoGroup = document.createElement('div');
      infoGroup.setAttribute('data-part', 'info');

      const icon = document.createElement('span');
      icon.setAttribute('data-part', 'icon');
      icon.innerHTML = this._getToolIcon(this.name);

      const nameEl = document.createElement('span');
      nameEl.setAttribute('data-part', 'name');
      nameEl.textContent = this.name;

      const statusBadge = document.createElement('span');
      statusBadge.setAttribute('data-part', 'status-badge');

      const latencyBadge = document.createElement('span');
      latencyBadge.setAttribute('data-part', 'latency');

      infoGroup.appendChild(icon);
      infoGroup.appendChild(nameEl);
      infoGroup.appendChild(statusBadge);
      infoGroup.appendChild(latencyBadge);

      const actions = document.createElement('div');
      actions.setAttribute('data-part', 'actions');

      const retryBtn = document.createElement('button');
      retryBtn.setAttribute('data-part', 'retry');
      retryBtn.setAttribute('type', 'button');
      retryBtn.setAttribute('title', 'Retry tool execution');
      retryBtn.setAttribute('aria-label', 'Retry tool execution');
      retryBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" fill="none" stroke-width="2.2">
          <polyline points="1 4 1 10 7 10"/>
          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
        </svg>
      `;

      const copyBtn = document.createElement('button');
      copyBtn.setAttribute('data-part', 'copy');
      copyBtn.setAttribute('type', 'button');
      copyBtn.setAttribute('title', 'Copy payload');
      copyBtn.setAttribute('aria-label', 'Copy payload');
      copyBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" fill="none" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
        <span data-part="copy-label">Copy</span>
      `;

      const toggleBtn = document.createElement('button');
      toggleBtn.setAttribute('data-part', 'toggle');
      toggleBtn.setAttribute('type', 'button');
      toggleBtn.setAttribute('title', 'Toggle inspector tray');
      toggleBtn.setAttribute('aria-label', 'Toggle inspector tray');
      toggleBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" stroke-width="2.2">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      `;

      actions.appendChild(retryBtn);
      actions.appendChild(copyBtn);
      actions.appendChild(toggleBtn);

      header.appendChild(infoGroup);
      header.appendChild(actions);

      this.prepend(header);
    }
  }

  _getToolIcon(name) {
    const n = (name || '').toLowerCase();
    if (n.includes('query') || n.includes('sql') || n.includes('database') || n.includes('db') || n.includes('data')) {
      return `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>`;
    }
    if (n.includes('deploy') || n.includes('pod') || n.includes('k8s') || n.includes('kube') || n.includes('cloud') || n.includes('docker')) {
      return `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`;
    }
    if (n.includes('command') || n.includes('exec') || n.includes('bash') || n.includes('shell') || n.includes('run') || n.includes('sh')) {
      return `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>`;
    }
    if (n.includes('search') || n.includes('web') || n.includes('browse') || n.includes('fetch') || n.includes('http') || n.includes('api')) {
      return `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`;
    }
    if (n.includes('file') || n.includes('write') || n.includes('read') || n.includes('edit')) {
      return `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`;
    }
    // Default wrench icon
    return `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`;
  }

  _syncState() {
    this.setAttributeSafe('data-status', this.status);

    const nameEl = this.querySelector('[data-part="name"]');
    if (nameEl) nameEl.textContent = this.name;

    const iconEl = this.querySelector('[data-part="icon"]');
    if (iconEl) iconEl.innerHTML = this._getToolIcon(this.name);

    const statusBadge = this.querySelector('[data-part="status-badge"]');
    if (statusBadge) {
      statusBadge.setAttribute('data-status', this.status);
      switch (this.status) {
        case 'running':
          statusBadge.innerHTML = `<span class="ui-tool-spinner"></span> Running`;
          break;
        case 'approval-required':
        case 'requires-approval':
          statusBadge.innerHTML = `<svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" fill="none" stroke-width="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Approval Required`;
          break;
        case 'success':
          statusBadge.innerHTML = `<svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" fill="none" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Success`;
          break;
        case 'error':
          statusBadge.innerHTML = `<svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" fill="none" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Failed`;
          break;
        case 'pending':
        default:
          statusBadge.innerHTML = `● Pending`;
          break;
      }
    }

    const latencyEl = this.querySelector('[data-part="latency"]');
    if (latencyEl) {
      if (this.latency) {
        latencyEl.textContent = this.latency;
        latencyEl.style.display = 'inline-flex';
      } else {
        latencyEl.style.display = 'none';
      }
    }

    const retryBtn = this.querySelector('[data-part="retry"]');
    if (retryBtn) {
      retryBtn.style.display = (this.status === 'error' || this.status === 'success') ? 'inline-flex' : 'none';
    }

    this._syncOpen();
  }

  _syncOpen() {
    const header = this.querySelector('[data-part="header"]');
    const inspector = this.querySelector(':scope > [data-part="inspector"], [data-part="body"]');
    const isOpen = this.open;

    if (header) {
      this.setAttributeSafe(header, 'aria-expanded', String(isOpen));
    }
    if (inspector) {
      this.setAttributeSafe(inspector, 'aria-hidden', String(!isOpen));
    }
  }

  _bindEvents() {
    const header = this.querySelector('[data-part="header"]');
    if (header) {
      this.listen(header, 'click', (e) => {
        if (e.target.closest('[data-part="retry"]') || e.target.closest('[data-part="copy"]')) {
          return;
        }
        if (!this.collapsible) return;
        this.open = !this.open;
        this.dispatch('toggle', { open: this.open, name: this.name, status: this.status });
      });

      this.listen(header, 'keydown', (e) => {
        if (e.key === Keys.ENTER || e.key === Keys.SPACE || e.key === Keys.SPACEBAR) {
          e.preventDefault();
          if (this.collapsible) {
            this.open = !this.open;
            this.dispatch('toggle', { open: this.open, name: this.name, status: this.status });
          }
        }
      });
    }

    const retryBtn = this.querySelector('[data-part="retry"]');
    if (retryBtn) {
      this.listen(retryBtn, 'click', (e) => {
        e.stopPropagation();
        this.status = 'running';
        this.dispatch('retry', {
          name: this.name,
          args: this._getArgsContent(),
        });
      });
    }

    const copyBtn = this.querySelector('[data-part="copy"]');
    if (copyBtn) {
      this.listen(copyBtn, 'click', (e) => {
        e.stopPropagation();
        this._handleCopy();
      });
    }
  }

  async _handleCopy() {
    let args = this._getArgsContent();
    let output = this._getOutputContent();

    try {
      if (typeof args === 'string' && (args.startsWith('{') || args.startsWith('['))) {
        args = JSON.parse(args);
      }
    } catch {}

    try {
      if (typeof output === 'string' && (output.startsWith('{') || output.startsWith('['))) {
        output = JSON.parse(output);
      }
    } catch {}

    const payload = JSON.stringify({ name: this.name, status: this.status, latency: this.latency, args, output }, null, 2);

    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(payload);
      }
      this._flashCopiedState();
      this.dispatch('copy', { payload });
    } catch {
      // Fallback
    }
  }

  _flashCopiedState() {
    const label = this.querySelector('[data-part="copy-label"]');
    if (!label) return;
    const prev = label.textContent;
    label.textContent = 'Copied!';
    setTimeout(() => {
      label.textContent = prev;
    }, 1600);
  }
}
