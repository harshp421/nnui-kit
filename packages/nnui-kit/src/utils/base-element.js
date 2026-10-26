/**
 * BaseLightElement
 * Base class for all Tier 2 Micro-Enhancers.
 * 
 * Enforces key architectural invariants:
 * 1. Zero Shadow DOM: Elements reside in Light-DOM for unbroken a11y trees.
 * 2. Mutate Attributes, Never Nodes: V-DOM safe (React 19, Vue 3, Svelte 5).
 * 3. Lifecycle-safe event listener registration and cleanup.
 */
// SSR-safe fallback when running in Node.js / Next.js Server Components
const SafeBaseElement = typeof globalThis.HTMLElement !== 'undefined'
  ? globalThis.HTMLElement
  : class FakeHTMLElement {};

export class BaseLightElement extends SafeBaseElement {
  constructor() {
    super();
    this._cleanups = [];
    this._initialized = false;
    this._ensureSettersForGetters();
  }

  /**
   * React 19 reconciler compatibility guard:
   * React 19 checks `'prop' in element` and executes `element[prop] = value`.
   * If a class prototype has a getter without a setter, JavaScript strict mode throws
   * "TypeError: Cannot set property X of #<Element> which has only a getter".
   * This guard automatically adds a reflecting setter if one was omitted on any subclass.
   */
  _ensureSettersForGetters() {
    let proto = Object.getPrototypeOf(this);
    while (proto && proto !== SafeBaseElement.prototype && proto !== Object.prototype) {
      const descriptors = Object.getOwnPropertyDescriptors(proto);
      for (const [prop, desc] of Object.entries(descriptors)) {
        if (desc.get && !desc.set) {
          Object.defineProperty(proto, prop, {
            get: desc.get,
            set(val) {
              const attr = prop.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());
              if (typeof val === 'boolean') {
                if (val) this.setAttribute(attr, '');
                else this.removeAttribute(attr);
              } else if (val !== null && val !== undefined) {
                this.setAttribute(attr, String(val));
              } else {
                this.removeAttribute(attr);
              }
            },
            configurable: true,
            enumerable: desc.enumerable,
          });
        }
      }
      proto = Object.getPrototypeOf(proto);
    }
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
    const CustomEventCtor = this.ownerDocument?.defaultView?.CustomEvent || (typeof window !== 'undefined' && window.CustomEvent) || CustomEvent;
    const event = new CustomEventCtor(type, {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail,
    });
    return this.dispatchEvent(event);
  }

  dispatchCustomEvent(type, detail = {}) {
    return this.dispatch(type, detail);
  }

  /**
   * Helper to set attribute without triggering unnecessary DOM thrashing.
   * Supports both (node, name, value) and (name, value) where node defaults to this.
   */
  setAttributeSafe(nodeOrName, nameOrValue, value) {
    let node = this;
    let attrName = nodeOrName;
    let val = nameOrValue;

    if (value !== undefined) {
      node = nodeOrName;
      attrName = nameOrValue;
      val = value;
    }

    if (!node || typeof node.setAttribute !== 'function') return;
    if (val === null || val === false) {
      if (node.hasAttribute(attrName)) node.removeAttribute(attrName);
    } else {
      const stringVal = val === true ? '' : String(val);
      if (node.getAttribute(attrName) !== stringVal) {
        node.setAttribute(attrName, stringVal);
      }
    }
  }

  /**
   * Helper to safely remove attribute without triggering unnecessary DOM thrashing.
   * Supports both (node, name) and (name) where node defaults to this.
   */
  removeAttributeSafe(nodeOrName, name) {
    let node = this;
    let attrName = nodeOrName;

    if (name !== undefined) {
      node = nodeOrName;
      attrName = name;
    }

    if (!node || typeof node.removeAttribute !== 'function') return;
    if (node.hasAttribute(attrName)) {
      node.removeAttribute(attrName);
    }
  }

  /**
   * Diagnostic helper to warn developers when AI-generated markup is missing expected parts.
   * Only triggers when children were provided but expected parts are absent (avoids false-positives
   * during deferred V-DOM/React mounting or before auto-scaffolding).
   */
  warnIfMissing(selector, description = '') {
    if (typeof window !== 'undefined' && this.childElementCount > 0 && !this.querySelector(selector)) {
      console.warn(
        `[NNUI-KIT] <${this.tagName.toLowerCase()}>: Missing expected child "${selector}" (${description}). ` +
        `Make sure your template includes this element for proper functionality.`
      );
    }
  }

  /**
   * Machine-Readable AI Component Introspection Protocol
   * Exposes live schema, ARIA state, attributes, state snapshots, and framework
   * snippets directly to AI coding agents (Claude, Cursor, Copilot, Antigravity)
   * and developer tooling.
   */
  inspectAI() {
    const tag = this.tagName.toLowerCase();
    const observedAttrs = this.constructor.observedAttributes || [];

    // Live attributes
    const liveAttrs = {};
    if (this.attributes) {
      for (const attr of this.attributes) {
        liveAttrs[attr.name] = attr.value;
      }
    }

    // Inspect child parts
    const parts = Array.from(this.querySelectorAll ? this.querySelectorAll('[data-part]') : []).map(el => el.getAttribute('data-part'));
    const uniqueParts = Array.from(new Set(parts));

    // Get current state snapshot
    const state = typeof this.getAiState === 'function' ? this.getAiState() : { ...liveAttrs };

    const result = {
      protocol: 'nnui.ai.v1',
      tag,
      version: '1.0.0',
      isLightDom: true,
      schema: {
        observedAttributes: observedAttrs,
        parts: uniqueParts,
        hasPersistence: this.hasAttribute ? this.hasAttribute('persist') : false,
        persistenceMode: this.getAttribute ? (this.getAttribute('persist') || null) : null,
        isCrossTabSynced: this.hasAttribute ? this.hasAttribute('sync') : false,
      },
      liveState: state,
      frameworkSnippets: {
        html: `<${tag}${Object.entries(liveAttrs).map(([k, v]) => ` ${k}="${v}"`).join('')}></${tag}>`,
        react19: `<${tag}${Object.entries(liveAttrs).map(([k, v]) => ` ${k}="${v}"`).join('')} />`,
        vue: `<${tag}${Object.entries(liveAttrs).map(([k, v]) => ` ${k}="${v}"`).join('')} />`,
        svelte: `<${tag}${Object.entries(liveAttrs).map(([k, v]) => ` ${k}="${v}"`).join('')} />`
      },
      diagnostics: typeof this.validateAiMarkup === 'function' ? this.validateAiMarkup() : []
    };

    // Make thenable so both synchronous property access (.protocol) and Promise calls (.then(...)) work
    result.then = function(onFulfilled, onRejected) {
      try {
        const val = typeof onFulfilled === 'function' ? onFulfilled(result) : result;
        return Promise.resolve(val);
      } catch (err) {
        if (typeof onRejected === 'function') {
          return Promise.resolve(onRejected(err));
        }
        return Promise.reject(err);
      }
    };
    result.catch = function(onRejected) {
      return result.then(null, onRejected);
    };

    return result;
  }
}

