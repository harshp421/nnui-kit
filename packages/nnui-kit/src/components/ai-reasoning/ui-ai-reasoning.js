import { BaseLightElement } from '../../utils/base-element.js';
import { Keys } from '../../utils/a11y.js';

/**
 * <ui-ai-reasoning> Micro-Enhancer
 * Accessible, platform-native chain-of-thought & reasoning disclosure in Light-DOM.
 * 
 * Features:
 * - Real-time elapsed thinking timer ("Thinking (3.4s)..." -> "Thought for 4.2s")
 * - Dynamic status states: 'thinking' (pulsing aura) and 'done' (settled emerald sparkle)
 * - Spring-animated collapsible disclosure tray with WAI-ARIA disclosure pattern
 * - Built-in copy thoughts trigger with visual feedback
 * - Optional auto-collapse when streaming completes (auto-collapse="true")
 * - 100% Light-DOM, zero Shadow DOM traps
 */
export class UiAiReasoning extends BaseLightElement {
  static get observedAttributes() {
    return ['status', 'duration', 'open', 'collapsed', 'auto-collapse', 'collapsible'];
  }

  get status() {
    return this.getAttribute('status') || 'thinking';
  }

  set status(val) {
    if (val) this.setAttributeSafe('status', val);
    else this.removeAttributeSafe('status');
  }

  get duration() {
    const d = parseFloat(this.getAttribute('duration'));
    return isNaN(d) ? this._elapsedSeconds : d;
  }

  set duration(val) {
    if (val !== null && val !== undefined) this.setAttributeSafe('duration', String(val));
    else this.removeAttributeSafe('duration');
  }

  get open() {
    if (this.hasAttribute('open')) {
      const val = this.getAttribute('open');
      return val !== 'false';
    }
    if (this.hasAttribute('collapsed')) {
      return this.getAttribute('collapsed') === 'false';
    }
    return false;
  }

  set open(val) {
    if (val) {
      this.setAttributeSafe('open', '');
      this.removeAttributeSafe('collapsed');
    } else {
      this.removeAttributeSafe('open');
      this.removeAttributeSafe('collapsed');
    }
  }

  get collapsed() {
    return !this.open;
  }

  set collapsed(val) {
    this.open = !val;
  }

  get autoCollapse() {
    return this.hasAttribute('auto-collapse');
  }

  set autoCollapse(val) {
    if (val) this.setAttributeSafe('auto-collapse', '');
    else this.removeAttributeSafe('auto-collapse');
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
      status: this.status,
      duration: this.duration,
      open: this.open,
      autoCollapse: this.autoCollapse,
      collapsible: this.collapsible,
      streamContentLength: this._getStreamContent().length,
    };
  }

  init() {
    this.setAttributeSafe('data-ui', 'ai-reasoning');
    this.setAttributeSafe('role', 'region');
    this.setAttributeSafe('aria-label', 'AI Reasoning Thoughts');

    this._startTime = Date.now();
    this._elapsedSeconds = 0;
    this._timerId = null;

    this._scaffoldHeader();
    this._syncState();
    this._bindEvents();

    if (this.status === 'thinking') {
      this._startTimer();
    }
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (!this._initialized || oldVal === newVal) return;

    if (name === 'status') {
      if (newVal === 'done') {
        this._stopTimer();
        if (this.autoCollapse) {
          this.open = false;
        }
      } else if (newVal === 'thinking') {
        this._startTime = Date.now() - (this._elapsedSeconds * 1000);
        this._startTimer();
      }
      this._syncState();
      this.dispatch('statuschange', { status: newVal, duration: this.duration });
    } else if (name === 'open' || name === 'collapsed') {
      this._syncOpen();
    } else if (name === 'duration') {
      this._updateSummaryText();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._stopTimer();
  }

  _getStreamContent() {
    const stream = this.querySelector(':scope > [data-part="stream"], :scope > [data-part="content"], :scope > [data-part="body"]');
    return stream ? stream.textContent?.trim() || '' : '';
  }

  _scaffoldHeader() {
    // Clean up any legacy or misplaced trigger element
    const legacyTrigger = this.querySelector(':scope > [data-part="trigger"]');
    if (legacyTrigger) {
      legacyTrigger.remove();
    }

    let header = this.querySelector(':scope > [data-part="header"]');
    if (!header) {
      header = document.createElement('div');
      header.setAttribute('data-part', 'header');

      const beacon = document.createElement('span');
      beacon.setAttribute('data-part', 'beacon');
      beacon.innerHTML = `
        <svg data-icon="sparkle" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2.2">
          <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83"/>
        </svg>
      `;

      const summary = document.createElement('span');
      summary.setAttribute('data-part', 'summary');

      const actions = document.createElement('div');
      actions.setAttribute('data-part', 'actions');

      const copyBtn = document.createElement('button');
      copyBtn.setAttribute('data-part', 'copy');
      copyBtn.setAttribute('type', 'button');
      copyBtn.setAttribute('title', 'Copy thoughts');
      copyBtn.setAttribute('aria-label', 'Copy thoughts');
      copyBtn.innerHTML = `
        <svg data-icon="copy" viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" fill="none" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
        <span data-part="copy-label">Copy</span>
      `;

      const toggleBtn = document.createElement('button');
      toggleBtn.setAttribute('data-part', 'toggle');
      toggleBtn.setAttribute('type', 'button');
      toggleBtn.setAttribute('title', 'Toggle reasoning tray');
      toggleBtn.setAttribute('aria-label', 'Toggle reasoning tray');
      toggleBtn.innerHTML = `
        <svg data-icon="chevron" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" stroke-width="2.2">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      `;

      actions.appendChild(copyBtn);
      actions.appendChild(toggleBtn);

      header.appendChild(beacon);
      header.appendChild(summary);
      header.appendChild(actions);

      this.prepend(header);
    }
  }

  _startTimer() {
    this._stopTimer();
    this._timerId = setInterval(() => {
      this._elapsedSeconds = (Date.now() - this._startTime) / 1000;
      this._updateSummaryText();
    }, 100);
  }

  _stopTimer() {
    if (this._timerId) {
      clearInterval(this._timerId);
      this._timerId = null;
    }
  }

  _updateSummaryText() {
    const summary = this.querySelector('[data-part="summary"]');
    if (!summary) return;

    const dur = this.duration.toFixed(1);
    if (this.status === 'thinking') {
      summary.textContent = `Thinking (${dur}s)...`;
    } else {
      summary.textContent = `Thought for ${dur} seconds`;
    }
  }

  _syncState() {
    this.setAttributeSafe('data-status', this.status);
    this._updateSummaryText();
    this._syncOpen();
  }

  _syncOpen() {
    const header = this.querySelector(':scope > [data-part="header"]');
    const stream = this.querySelector(':scope > [data-part="stream"], :scope > [data-part="content"], :scope > [data-part="body"]');
    const isOpen = this.open;

    if (isOpen) {
      this.setAttributeSafe('data-open', '');
    } else {
      this.removeAttributeSafe('data-open');
    }

    if (header) {
      this.setAttributeSafe(header, 'aria-expanded', String(isOpen));
    }
    if (stream) {
      this.setAttributeSafe(stream, 'aria-hidden', String(!isOpen));
    }
  }

  _bindEvents() {
    const header = this.querySelector(':scope > [data-part="header"]');
    if (header) {
      this.listen(header, 'click', (e) => {
        if (e.target.closest('[data-part="copy"]')) {
          this._handleCopy();
          return;
        }
        if (!this.collapsible) return;
        this.open = !this.open;
        this.dispatch('toggle', { open: this.open, duration: this.duration });
      });

      this.listen(header, 'keydown', (e) => {
        if (e.key === Keys.ENTER || e.key === Keys.SPACE || e.key === Keys.SPACEBAR) {
          e.preventDefault();
          if (this.collapsible) {
            this.open = !this.open;
            this.dispatch('toggle', { open: this.open, duration: this.duration });
          }
        }
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
    const content = this._getStreamContent();
    if (!content) return;

    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(content);
      }
      this._flashCopiedState();
      this.dispatch('copy', { text: content });
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
