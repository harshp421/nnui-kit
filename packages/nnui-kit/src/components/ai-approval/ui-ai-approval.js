import { BaseLightElement } from '../../utils/base-element.js';
import { Keys } from '../../utils/a11y.js';

/**
 * <ui-ai-approval> Micro-Enhancer
 * Accessible, platform-native Human-in-the-Loop (HITL) action governance in Light-DOM.
 * 
 * Features:
 * - Multi-tier risk severity classification: 'info', 'warning', 'critical'
 * - Dedicated payload & code diff inspection review slot
 * - Explicit Approve and Reject governance triggers dispatching 'approve' / 'reject'
 * - Settled audit state transition ('approved' / 'rejected')
 * - Built-in keyboard accessibility: 'A' or 'Enter' to approve, 'Escape' to reject
 * - 100% Light-DOM, zero Shadow DOM traps
 */
export class UiAiApproval extends BaseLightElement {
  static get observedAttributes() {
    return ['severity', 'status', 'action-name'];
  }

  get severity() {
    return this.getAttribute('severity') || 'warning';
  }

  set severity(val) {
    if (val) this.setAttributeSafe('severity', val);
    else this.removeAttributeSafe('severity');
  }

  get status() {
    return this.getAttribute('status') || 'pending';
  }

  set status(val) {
    if (val) this.setAttributeSafe('status', val);
    else this.removeAttributeSafe('status');
  }

  get actionName() {
    return this.getAttribute('action-name') || '';
  }

  set actionName(val) {
    if (val) this.setAttributeSafe('action-name', val);
    else this.removeAttributeSafe('action-name');
  }

  getAiState() {
    return {
      severity: this.severity,
      status: this.status,
      actionName: this.actionName,
      payloadContent: this._getPayloadContent(),
    };
  }

  init() {
    this.setAttributeSafe('data-ui', 'ai-approval');
    this.setAttributeSafe('role', 'alertdialog');
    this.setAttributeSafe('aria-labelledby', 'approval-heading');
    this.setAttributeSafe('tabindex', '0');

    this._scaffoldHeader();
    this._scaffoldActions();
    this._syncState();
    this._bindEvents();
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (!this._initialized || oldVal === newVal) return;
    this._syncState();
  }

  _getPayloadContent() {
    const el = this.querySelector('[data-part="payload"], [data-part="content"], [data-part="diff"]');
    return el ? el.textContent?.trim() || '' : '';
  }

  _scaffoldHeader() {
    let header = this.querySelector('[data-part="header"]');
    if (!header) {
      header = document.createElement('div');
      header.setAttribute('data-part', 'header');

      const titleGroup = document.createElement('div');
      titleGroup.setAttribute('data-part', 'title-group');

      const icon = document.createElement('span');
      icon.setAttribute('data-part', 'icon');
      icon.innerHTML = `
        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" stroke-width="2.2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      `;

      const heading = document.createElement('h5');
      heading.setAttribute('data-part', 'title');
      heading.setAttribute('id', 'approval-heading');
      heading.textContent = this.actionName || 'Action Authorization Required';

      titleGroup.appendChild(icon);
      titleGroup.appendChild(heading);

      const severityBadge = document.createElement('span');
      severityBadge.setAttribute('data-part', 'severity-badge');

      header.appendChild(titleGroup);
      header.appendChild(severityBadge);

      this.prepend(header);
    }
  }

  _scaffoldActions() {
    let actions = this.querySelector('[data-part="actions"]');
    if (!actions) {
      actions = document.createElement('div');
      actions.setAttribute('data-part', 'actions');

      const rejectBtn = document.createElement('button');
      rejectBtn.setAttribute('data-part', 'reject');
      rejectBtn.setAttribute('type', 'button');
      rejectBtn.innerHTML = `<span>✕ Reject Action</span>`;

      const approveBtn = document.createElement('button');
      approveBtn.setAttribute('data-part', 'approve');
      approveBtn.setAttribute('type', 'button');
      approveBtn.innerHTML = `<span>✓ Approve Action</span> <kbd>A</kbd>`;

      actions.appendChild(rejectBtn);
      actions.appendChild(approveBtn);

      this.appendChild(actions);
    }
  }

  _syncState() {
    this.setAttributeSafe('data-severity', this.severity);
    this.setAttributeSafe('data-status', this.status);

    const heading = this.querySelector('[data-part="title"]');
    if (heading && this.actionName) {
      heading.textContent = this.actionName;
    }

    const severityBadge = this.querySelector('[data-part="severity-badge"]');
    if (severityBadge) {
      severityBadge.setAttribute('data-severity', this.severity);
      switch (this.severity) {
        case 'critical':
          severityBadge.textContent = 'Critical Risk';
          break;
        case 'info':
          severityBadge.textContent = 'Standard Action';
          break;
        case 'warning':
        default:
          severityBadge.textContent = 'High Impact';
          break;
      }
    }

    const actions = this.querySelector('[data-part="actions"]');
    let auditBadge = this.querySelector('[data-part="audit-badge"]');

    if (this.status === 'approved') {
      if (actions) actions.style.display = 'none';
      if (!auditBadge) {
        auditBadge = document.createElement('div');
        auditBadge.setAttribute('data-part', 'audit-badge');
        auditBadge.setAttribute('data-status', 'approved');
        this.appendChild(auditBadge);
      }
      auditBadge.innerHTML = `✓ Approved by User`;
      auditBadge.style.display = 'flex';
    } else if (this.status === 'rejected') {
      if (actions) actions.style.display = 'none';
      if (!auditBadge) {
        auditBadge = document.createElement('div');
        auditBadge.setAttribute('data-part', 'audit-badge');
        auditBadge.setAttribute('data-status', 'rejected');
        this.appendChild(auditBadge);
      }
      auditBadge.innerHTML = `✕ Action Rejected by User`;
      auditBadge.style.display = 'flex';
    } else {
      if (actions) actions.style.display = 'flex';
      if (auditBadge) auditBadge.style.display = 'none';
    }
  }

  _bindEvents() {
    this.listen(this, 'click', (e) => {
      const approveBtn = e.target.closest('[data-part="approve"]');
      if (approveBtn) {
        e.stopPropagation();
        this.approve();
        return;
      }

      const rejectBtn = e.target.closest('[data-part="reject"]');
      if (rejectBtn) {
        e.stopPropagation();
        this.reject();
        return;
      }
    });

    this.listen(this, 'keydown', (e) => {
      if (this.status !== 'pending') return;

      if (e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        this.approve();
      } else if (e.key === Keys.ESCAPE || e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        this.reject();
      }
    });
  }

  approve() {
    if (this.status !== 'pending') return;
    this.status = 'approved';
    this.dispatch('approve', {
      action: this.actionName,
      severity: this.severity,
      payload: this._getPayloadContent(),
      timestamp: new Date().toISOString(),
    });
  }

  reject(reason = 'User declined action') {
    if (this.status !== 'pending') return;
    this.status = 'rejected';
    this.dispatch('reject', {
      action: this.actionName,
      severity: this.severity,
      reason,
      payload: this._getPayloadContent(),
      timestamp: new Date().toISOString(),
    });
  }
}
