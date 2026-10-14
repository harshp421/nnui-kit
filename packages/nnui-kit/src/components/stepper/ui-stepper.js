import { BaseLightElement } from '../../utils/base-element.js';
import { attachPersistence } from '../../utils/persistence.js';

/**
 * <ui-stepper> Micro-Enhancer
 * Accessible multi-step workflow & progress wizard in Light-DOM.
 * 
 * Features:
 * - WAI-ARIA compliant step indicators (aria-current="step")
 * - Linear or non-linear workflow validation gating
 * - Synchronized panels with data-state="active|inactive"
 * - Programmatic API: next(), prev(), goToStep(n)
 * - Standard 'change' CustomEvent with { step, previousStep }
 * - Declarative Persistence: persist="url|session|local" [sync="cross-tab"]
 */
export class UiStepper extends BaseLightElement {
  static get observedAttributes() {
    return ['active-step', 'linear', 'orientation', 'persist', 'sync'];
  }

  get activeStep() {
    const val = parseInt(this.getAttribute('active-step'), 10);
    return isNaN(val) ? 1 : val;
  }

  set activeStep(val) {
    this.setAttributeSafe('active-step', String(val));
    this._syncState();
  }

  get linear() {
    return this.hasAttribute('linear') && this.getAttribute('linear') !== 'false';
  }

  set linear(val) {
    if (val) {
      this.setAttributeSafe('linear', '');
    } else {
      this.removeAttributeSafe('linear');
    }
  }

  get orientation() {
    return this.getAttribute('orientation') || 'horizontal';
  }

  getAiState() {
    return {
      activeStep: this.activeStep,
      totalSteps: this._getSteps().length,
      linear: this.linear,
      orientation: this.orientation
    };
  }

  init() {
    this.setAttributeSafe('data-ui', 'stepper');
    this.setAttributeSafe('data-orientation', this.orientation);

    this._setupStructure();
    this._syncState();
    this._bindEvents();

    // Setup Declarative Persistence & Cross-Tab Sync
    if (this.hasAttribute('persist') || this.hasAttribute('sync')) {
      const cleanupPersistence = attachPersistence(this, {
        keys: ['step'],
        getState: () => ({
          step: this.activeStep
        }),
        setState: (state) => {
          if (state.step !== undefined) {
            this.activeStep = Number(state.step);
          }
        }
      });
      this._cleanups.push(cleanupPersistence);
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue || !this._initialized) return;
    if (name === 'active-step') {
      this._syncState();
    } else if (name === 'orientation') {
      this.setAttributeSafe('data-orientation', newValue);
    }
  }

  _getSteps() {
    return Array.from(this.querySelectorAll('[data-part="step"]'));
  }

  _getPanels() {
    return Array.from(this.querySelectorAll('[data-part="panel"]'));
  }

  _setupStructure() {
    const steps = this._getSteps();
    const steplist = this.querySelector('[data-part="steplist"]');
    if (steplist) {
      steplist.setAttribute('role', 'list');
    }

    steps.forEach((step, idx) => {
      const stepNum = parseInt(step.getAttribute('data-step'), 10) || (idx + 1);
      step.setAttribute('data-step', String(stepNum));

      const trigger = step.querySelector('[data-part="trigger"]') || step;
      if (trigger.tagName.toLowerCase() === 'button' || step === trigger) {
        if (!trigger.hasAttribute('type') && trigger.tagName.toLowerCase() === 'button') {
          trigger.setAttribute('type', 'button');
        }
      }
    });

    if (!this.getAttribute('active-step') && steps.length > 0) {
      this.setAttributeSafe('active-step', '1');
    }
  }

  _syncState() {
    const steps = this._getSteps();
    const panels = this._getPanels();
    const current = this.activeStep;
    const isLinear = this.linear;

    steps.forEach((step) => {
      const stepNum = parseInt(step.getAttribute('data-step'), 10);
      const isCurrent = stepNum === current;
      const isCompleted = stepNum < current;
      const isUpcoming = stepNum > current;

      let state = 'upcoming';
      if (isCurrent) state = 'current';
      else if (isCompleted) state = 'completed';

      this.setAttributeSafe(step, 'data-state', state);

      if (isCurrent) {
        this.setAttributeSafe(step, 'aria-current', 'step');
      } else {
        this.removeAttributeSafe(step, 'aria-current');
      }

      const indicator = step.querySelector('[data-part="indicator"]');
      if (indicator) {
        this.setAttributeSafe(indicator, 'data-state', state);
        if (isCompleted) {
          indicator.setAttribute('data-completed', 'true');
          if (!indicator.hasAttribute('data-step-num')) {
            indicator.setAttribute('data-step-num', indicator.textContent.trim() || String(stepNum));
          }
          indicator.textContent = '✓';
        } else {
          indicator.removeAttribute('data-completed');
          const original = indicator.getAttribute('data-step-num');
          if (original) {
            indicator.textContent = original;
          }
        }
      }

      const trigger = step.querySelector('[data-part="trigger"]') || step;
      if (isLinear && isUpcoming) {
        this.setAttributeSafe(trigger, 'disabled', '');
        this.setAttributeSafe(trigger, 'aria-disabled', 'true');
      } else {
        this.removeAttributeSafe(trigger, 'disabled');
        this.removeAttributeSafe(trigger, 'aria-disabled');
      }
    });

    panels.forEach((panel) => {
      const panelStep = parseInt(panel.getAttribute('data-step'), 10);
      const isActive = panelStep === current;

      this.setAttributeSafe(panel, 'data-state', isActive ? 'active' : 'inactive');
      if (isActive) {
        panel.removeAttribute('hidden');
        this.setAttributeSafe(panel, 'aria-hidden', 'false');
      } else {
        panel.setAttribute('hidden', '');
        this.setAttributeSafe(panel, 'aria-hidden', 'true');
      }
    });
  }

  _bindEvents() {
    this.listen(this, 'click', (e) => {
      const stepEl = e.target.closest('[data-part="step"]');
      if (!stepEl) return;

      const trigger = e.target.closest('[data-part="trigger"]') || stepEl;
      if (trigger.hasAttribute('disabled') || trigger.getAttribute('aria-disabled') === 'true') return;

      const targetStep = parseInt(stepEl.getAttribute('data-step'), 10);
      if (!isNaN(targetStep) && targetStep !== this.activeStep) {
        if (this.linear && targetStep > this.activeStep + 1) return;
        this.goToStep(targetStep);
      }
    });
  }

  goToStep(stepNum) {
    const totalSteps = this._getSteps().length;
    const clamped = Math.max(1, Math.min(stepNum, totalSteps || stepNum));
    const prev = this.activeStep;

    if (clamped !== prev) {
      this.activeStep = clamped;
      this._persistState?.();
      this.dispatch('change', { step: clamped, previousStep: prev });
    }
  }

  next() {
    this.goToStep(this.activeStep + 1);
  }

  prev() {
    this.goToStep(this.activeStep - 1);
  }
}
