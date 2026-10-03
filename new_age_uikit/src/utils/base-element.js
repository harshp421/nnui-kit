/**
 * BaseLightElement
 * Base class for all Tier 2 Micro-Enhancers.
 * 
 * Enforces key architectural invariants:
 * 1. Zero Shadow DOM: Elements reside in Light-DOM for unbroken a11y trees.
 * 2. Mutate Attributes, Never Nodes: V-DOM safe (React 19, Vue 3, Svelte 5).
 * 3. Lifecycle-safe event listener registration and cleanup.
 */
export class BaseLightElement extends HTMLElement {
  constructor() {
    super();
    this._cleanups = [];
    this._initialized = false;
  }

  /**
   * Forbid attachShadow to enforce unbroken accessibility trees.
   */
  attachShadow() {
    throw new Error(
      `[${this.tagName.toLowerCase()}] Shadow DOM is forbidden in this architecture to preserve native accessibility and form association.`
    );
  }

  connectedCallback() {
    if (!this._initialized) {
      if (this.childElementCount === 0) {
        queueMicrotask(() => {
          if (!this.isConnected || this._initialized) return;
          this.init();
          this._initialized = true;
        });
      } else {
        this.init();
        this._initialized = true;
      }
    }
  }

  disconnectedCallback() {
    this._cleanups.forEach((cleanup) => {
      try {
        cleanup();
      } catch (e) {
        console.error(e);
      }
    });
    this._cleanups = [];
    this._initialized = false;
    this.destroy();
  }

  /**
   * Override in subclasses for initialization logic.
   */
  init() {}

  /**
   * Override in subclasses for teardown logic.
   */
  destroy() {}

  /**
   * Safe event listener that automatically unbinds on disconnectedCallback.
   */
  listen(target, type, listener, options) {
    if (!target) return;
    target.addEventListener(type, listener, options);
    this._cleanups.push(() => {
      target.removeEventListener(type, listener, options);
    });
  }

  /**
   * Standardized native lowercase event dispatcher.
   */
  dispatch(type, detail = {}) {
    const event = new CustomEvent(type, {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail,
    });
    return this.dispatchEvent(event);
  }

  /**
   * Helper to set attribute without triggering unnecessary DOM thrashing.
   */
  setAttributeSafe(node, name, value) {
    if (!node) return;
    if (value === null || value === false) {
      if (node.hasAttribute(name)) node.removeAttribute(name);
    } else {
      const stringVal = value === true ? '' : String(value);
      if (node.getAttribute(name) !== stringVal) {
        node.setAttribute(name, stringVal);
      }
    }
  }

  /**
   * Diagnostic helper to warn developers when AI-generated markup is missing expected parts.
   */
  warnIfMissing(selector, description = '') {
    if (typeof window !== 'undefined' && !this.querySelector(selector)) {
      console.warn(
        `[NNUI-KIT] <${this.tagName.toLowerCase()}>: Missing expected child "${selector}" (${description}). ` +
        `Make sure your template includes this element for proper functionality.`
      );
    }
  }
}
