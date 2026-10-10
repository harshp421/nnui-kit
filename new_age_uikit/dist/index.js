var U = Object.defineProperty;
var Y = (h, t, e) => t in h ? U(h, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : h[t] = e;
var T = (h, t, e) => Y(h, typeof t != "symbol" ? t + "" : t, e);
const K = typeof globalThis.HTMLElement < "u" ? globalThis.HTMLElement : class {
};
class A extends K {
  constructor() {
    super(), this._cleanups = [], this._initialized = !1;
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
    this._initialized || (this.childElementCount === 0 ? queueMicrotask(() => {
      !this.isConnected || this._initialized || (this.init(), this._initialized = !0);
    }) : (this.init(), this._initialized = !0));
  }
  disconnectedCallback() {
    this._cleanups.forEach((t) => {
      try {
        t();
      } catch (e) {
        console.error(e);
      }
    }), this._cleanups = [], this._initialized = !1, this.destroy();
  }
  /**
   * Override in subclasses for initialization logic.
   */
  init() {
  }
  /**
   * Override in subclasses for teardown logic.
   */
  destroy() {
  }
  /**
   * Safe event listener that automatically unbinds on disconnectedCallback.
   */
  listen(t, e, i, s) {
    t && (t.addEventListener(e, i, s), this._cleanups.push(() => {
      t.removeEventListener(e, i, s);
    }));
  }
  /**
   * Standardized native lowercase event dispatcher.
   */
  dispatch(t, e = {}) {
    var a, r;
    const i = ((r = (a = this.ownerDocument) == null ? void 0 : a.defaultView) == null ? void 0 : r.CustomEvent) || typeof window < "u" && window.CustomEvent || CustomEvent, s = new i(t, {
      bubbles: !0,
      composed: !0,
      cancelable: !0,
      detail: e
    });
    return this.dispatchEvent(s);
  }
  dispatchCustomEvent(t, e = {}) {
    return this.dispatch(t, e);
  }
  /**
   * Helper to set attribute without triggering unnecessary DOM thrashing.
   * Supports both (node, name, value) and (name, value) where node defaults to this.
   */
  setAttributeSafe(t, e, i) {
    let s = this, a = t, r = e;
    if (i !== void 0 && (s = t, a = e, r = i), !(!s || typeof s.setAttribute != "function"))
      if (r === null || r === !1)
        s.hasAttribute(a) && s.removeAttribute(a);
      else {
        const o = r === !0 ? "" : String(r);
        s.getAttribute(a) !== o && s.setAttribute(a, o);
      }
  }
  /**
   * Helper to safely remove attribute without triggering unnecessary DOM thrashing.
   * Supports both (node, name) and (name) where node defaults to this.
   */
  removeAttributeSafe(t, e) {
    let i = this, s = t;
    e !== void 0 && (i = t, s = e), !(!i || typeof i.removeAttribute != "function") && i.hasAttribute(s) && i.removeAttribute(s);
  }
  /**
   * Diagnostic helper to warn developers when AI-generated markup is missing expected parts.
   */
  warnIfMissing(t, e = "") {
    typeof window < "u" && !this.querySelector(t) && console.warn(
      `[NNUI-KIT] <${this.tagName.toLowerCase()}>: Missing expected child "${t}" (${e}). Make sure your template includes this element for proper functionality.`
    );
  }
  /**
   * Machine-Readable AI Component Introspection Protocol
   * Exposes live schema, ARIA state, attributes, state snapshots, and framework
   * snippets directly to AI coding agents (Claude, Cursor, Copilot, Antigravity)
   * and developer tooling.
   */
  inspectAI() {
    const t = this.tagName.toLowerCase(), e = this.constructor.observedAttributes || [], i = {};
    if (this.attributes)
      for (const n of this.attributes)
        i[n.name] = n.value;
    const s = Array.from(this.querySelectorAll ? this.querySelectorAll("[data-part]") : []).map((n) => n.getAttribute("data-part")), a = Array.from(new Set(s)), r = typeof this.getAiState == "function" ? this.getAiState() : { ...i }, o = {
      protocol: "nnui.ai.v1",
      tag: t,
      version: "1.0.0",
      isLightDom: !0,
      schema: {
        observedAttributes: e,
        parts: a,
        hasPersistence: this.hasAttribute ? this.hasAttribute("persist") : !1,
        persistenceMode: this.getAttribute && this.getAttribute("persist") || null,
        isCrossTabSynced: this.hasAttribute ? this.hasAttribute("sync") : !1
      },
      liveState: r,
      frameworkSnippets: {
        html: `<${t}${Object.entries(i).map(([n, l]) => ` ${n}="${l}"`).join("")}></${t}>`,
        react19: `<${t}${Object.entries(i).map(([n, l]) => ` ${n}="${l}"`).join("")} />`,
        vue: `<${t}${Object.entries(i).map(([n, l]) => ` ${n}="${l}"`).join("")} />`,
        svelte: `<${t}${Object.entries(i).map(([n, l]) => ` ${n}="${l}"`).join("")} />`
      },
      diagnostics: typeof this.validateAiMarkup == "function" ? this.validateAiMarkup() : []
    };
    return o.then = function(n, l) {
      try {
        const d = typeof n == "function" ? n(o) : o;
        return Promise.resolve(d);
      } catch (d) {
        return typeof l == "function" ? Promise.resolve(l(d)) : Promise.reject(d);
      }
    }, o.catch = function(n) {
      return o.then(null, n);
    }, o;
  }
}
const c = {
  ENTER: "Enter",
  SPACE: " ",
  SPACEBAR: "Spacebar",
  ESCAPE: "Escape",
  ARROW_DOWN: "ArrowDown",
  ARROW_UP: "ArrowUp",
  ARROW_LEFT: "ArrowLeft",
  ARROW_RIGHT: "ArrowRight",
  HOME: "Home",
  END: "End",
  TAB: "Tab"
};
let j = 0;
function C(h = "ui") {
  return `${h}-${++j}-${Math.random().toString(36).slice(2, 7)}`;
}
function G(h, t, e = !1) {
  h.forEach((i, s) => {
    s === t ? (i.setAttribute("tabindex", "0"), e && i.focus()) : i.setAttribute("tabindex", "-1");
  });
}
function S(h, t, e, i = !0) {
  if (t === 0) return -1;
  let s = h + e;
  return i ? (s < 0 && (s = t - 1), s >= t && (s = 0)) : s = Math.max(0, Math.min(t - 1, s)), s;
}
class Q extends A {
  static get observedAttributes() {
    return ["value", "orientation"];
  }
  get value() {
    return this.getAttribute("value") || "";
  }
  set value(t) {
    this.setAttributeSafe(this, "value", t);
  }
  get orientation() {
    return this.getAttribute("orientation") || "horizontal";
  }
  init() {
    this.setAttributeSafe(this, "data-ui", "tabs"), this._getTabs().length === 0 && console.warn(`[NNUI-KIT] <${this.tagName.toLowerCase()}> has no tab triggers. Add buttons with data-part="tab" or role="tab".`), this._setupStructure(), this._syncState(), this._bindEvents();
  }
  _getTabs() {
    const t = this.querySelector('[data-part="tablist"], [role="tablist"]');
    return Array.from(t ? t.querySelectorAll('[data-part="tab"], [role="tab"], button') : this.querySelectorAll('[data-part="tab"], [role="tab"]'));
  }
  _getPanels() {
    return Array.from(this.querySelectorAll('[data-part="tabpanel"], [role="tabpanel"], div[data-part="tabpanel"]'));
  }
  _setupStructure() {
    const t = this._getTabs(), e = this._getPanels(), i = this.id || C("tabs");
    t.forEach((s, a) => {
      var l;
      const r = s.dataset.value || `tab-${a}`;
      s.dataset.value = r;
      const o = s.id || `${i}-trigger-${a}`, n = ((l = e[a]) == null ? void 0 : l.id) || `${i}-panel-${a}`;
      this.setAttributeSafe(s, "id", o), this.setAttributeSafe(s, "role", "tab"), this.setAttributeSafe(s, "aria-controls", n), e[a] && (this.setAttributeSafe(e[a], "id", n), this.setAttributeSafe(e[a], "role", "tabpanel"), this.setAttributeSafe(e[a], "aria-labelledby", o), e[a].dataset.value = r);
    }), !this.value && t.length > 0 && (this.value = t[0].dataset.value);
  }
  _syncState() {
    const t = this._getTabs(), e = this._getPanels(), i = this.value;
    t.forEach((s, a) => {
      const r = s.dataset.value === i;
      this.setAttributeSafe(s, "aria-selected", r ? "true" : "false"), this.setAttributeSafe(s, "data-state", r ? "active" : "inactive"), this.setAttributeSafe(s, "tabindex", r ? "0" : "-1");
    }), e.forEach((s) => {
      const a = s.dataset.value === i;
      this.setAttributeSafe(s, "data-state", a ? "active" : "inactive"), a ? s.removeAttribute("hidden") : this.setAttributeSafe(s, "hidden", "");
    });
  }
  _bindEvents() {
    this.listen(this, "click", (t) => {
      const e = t.target.closest('[data-part="tab"], [role="tab"]');
      e && this.contains(e) && this.selectTab(e.dataset.value);
    }), this.listen(this, "keydown", (t) => {
      const e = t.target.closest('[data-part="tab"], [role="tab"]');
      if (!e) return;
      const i = this._getTabs(), s = i.indexOf(e), a = this.orientation === "vertical";
      let r = -1;
      switch (t.key) {
        case c.ARROW_RIGHT:
          a || (t.preventDefault(), r = S(s, i.length, 1));
          break;
        case c.ARROW_LEFT:
          a || (t.preventDefault(), r = S(s, i.length, -1));
          break;
        case c.ARROW_DOWN:
          a && (t.preventDefault(), r = S(s, i.length, 1));
          break;
        case c.ARROW_UP:
          a && (t.preventDefault(), r = S(s, i.length, -1));
          break;
        case c.HOME:
          t.preventDefault(), r = 0;
          break;
        case c.END:
          t.preventDefault(), r = i.length - 1;
          break;
        case c.ENTER:
        case c.SPACE:
        case c.SPACEBAR:
          t.preventDefault(), this.selectTab(e.dataset.value);
          return;
      }
      if (r >= 0 && r !== s) {
        const o = i[r];
        G(i, r, !0), this.selectTab(o.dataset.value);
      }
    });
  }
  selectTab(t) {
    if (this.value === t) return;
    const e = this.value;
    this.value = t, this._syncState(), this.dispatch("change", {
      value: t,
      previousValue: e
    });
  }
  attributeChangedCallback(t, e, i) {
    e !== i && this._initialized && t === "value" && this._syncState();
  }
}
class J extends A {
  static get observedAttributes() {
    return ["value", "open"];
  }
  get value() {
    return this.getAttribute("value") || "";
  }
  set value(t) {
    this.setAttributeSafe(this, "value", t);
  }
  get isOpen() {
    return this.hasAttribute("open");
  }
  init() {
    this.setAttributeSafe(this, "data-ui", "combobox"), this._input = this.querySelector('[data-part="input"], input'), this._listbox = this.querySelector('[data-part="listbox"], [role="listbox"], ul, ol'), this._activeIndex = -1, this.warnIfMissing('[data-part="input"], input', "Input search element"), this.warnIfMissing('[data-part="listbox"], [role="listbox"], ul, ol', "Dropdown listbox container"), this._setupARIA(), this._bindEvents();
  }
  _getOptions() {
    return Array.from(this.querySelectorAll('[data-part="option"], [role="option"], li'));
  }
  _getVisibleOptions() {
    return this._getOptions().filter((t) => !t.hasAttribute("hidden"));
  }
  _setupARIA() {
    var i;
    const t = this.id || C("combobox"), e = ((i = this._listbox) == null ? void 0 : i.id) || `${t}-listbox`;
    this._input && (this.setAttributeSafe(this._input, "role", "combobox"), this.setAttributeSafe(this._input, "aria-autocomplete", "list"), this.setAttributeSafe(this._input, "aria-expanded", "false"), this.setAttributeSafe(this._input, "aria-controls", e), this.setAttributeSafe(this._input, "autocomplete", "off")), this._listbox && (this.setAttributeSafe(this._listbox, "id", e), this.setAttributeSafe(this._listbox, "role", "listbox"), this.setAttributeSafe(this._listbox, "data-state", "closed")), this._getOptions().forEach((s, a) => {
      const r = s.id || `${t}-opt-${a}`;
      this.setAttributeSafe(s, "id", r), this.setAttributeSafe(s, "role", "option"), this.setAttributeSafe(s, "aria-selected", "false");
    });
  }
  _bindEvents() {
    this._input && (this.listen(this._input, "focus", () => this.open()), this.listen(this._input, "input", (t) => this._handleInput(t.target.value)), this.listen(this._input, "keydown", (t) => this._handleKeydown(t)), this.listen(this, "click", (t) => {
      const e = t.target.closest('[data-part="option"], [role="option"]');
      e && this.contains(e) && this.selectOption(e);
    }), this.listen(document, "pointerdown", (t) => {
      !this.contains(t.target) && this.isOpen && this.close();
    }));
  }
  _handleInput(t) {
    this.isOpen || this.open();
    const e = t.toLowerCase().trim();
    this._getOptions().forEach((s) => {
      const a = (s.textContent || "").toLowerCase(), r = (s.dataset.value || "").toLowerCase();
      a.includes(e) || r.includes(e) ? s.removeAttribute("hidden") : this.setAttributeSafe(s, "hidden", "");
    }), this._activeIndex = -1, this._highlightOption(null);
  }
  _handleKeydown(t) {
    const e = this._getVisibleOptions();
    switch (t.key) {
      case c.ARROW_DOWN:
        t.preventDefault(), this.isOpen ? (this._activeIndex = S(this._activeIndex, e.length, 1), this._highlightOption(e[this._activeIndex])) : this.open();
        break;
      case c.ARROW_UP:
        t.preventDefault(), this.isOpen ? (this._activeIndex = S(this._activeIndex, e.length, -1), this._highlightOption(e[this._activeIndex])) : this.open();
        break;
      case c.ENTER:
        this.isOpen && this._activeIndex >= 0 && e[this._activeIndex] && (t.preventDefault(), this.selectOption(e[this._activeIndex]));
        break;
      case c.ESCAPE:
        this.isOpen && (t.preventDefault(), this.close());
        break;
      case c.TAB:
        this.close();
        break;
    }
  }
  _highlightOption(t) {
    this._getOptions().forEach((i) => {
      i === t ? (this.setAttributeSafe(i, "data-focused", "true"), this._input && this.setAttributeSafe(this._input, "aria-activedescendant", i.id), i.scrollIntoView({ block: "nearest" })) : this.setAttributeSafe(i, "data-focused", "false");
    }), !t && this._input && this._input.removeAttribute("aria-activedescendant");
  }
  selectOption(t) {
    if (!t) return;
    const e = t.dataset.value || t.textContent.trim(), i = t.textContent.trim();
    this._getOptions().forEach((s) => {
      this.setAttributeSafe(s, "aria-selected", s === t ? "true" : "false");
    }), this._input && (this._input.value = i), this.value = e, this.close(), this.dispatch("change", { value: e, label: i });
  }
  open() {
    this.isOpen || (this.setAttributeSafe(this, "open", ""), this._input && this.setAttributeSafe(this._input, "aria-expanded", "true"), this._listbox && this.setAttributeSafe(this._listbox, "data-state", "open"));
  }
  close() {
    this.isOpen && (this.removeAttribute("open"), this._input && this.setAttributeSafe(this._input, "aria-expanded", "false"), this._listbox && this.setAttributeSafe(this._listbox, "data-state", "closed"), this._activeIndex = -1, this._highlightOption(null));
  }
}
class X extends A {
  static get observedAttributes() {
    return ["open"];
  }
  get isOpen() {
    return this._dialog ? this._dialog.open || this._dialog.hasAttribute("open") : !1;
  }
  get open() {
    return this.isOpen;
  }
  set open(t) {
    !!t && t !== "false" && t !== 0 ? this.isOpen || (this.setAttributeSafe(this, "open", ""), this.showModal()) : this.isOpen && (this.removeAttribute("open"), this.close());
  }
  init() {
    this.setAttributeSafe(this, "data-ui", "dialog-container"), this._dialog = this.querySelector("dialog"), this._trigger = null, this._dialog && (this._setupDialog(), this._bindEvents()), this._observeDialogSlot();
  }
  _observeDialogSlot() {
    this._slotObserver || typeof MutationObserver > "u" || (this._slotObserver = new MutationObserver(() => {
      const t = this.querySelector("dialog");
      t && t !== this._dialog && (this._dialog = t, this._setupDialog(), this._bindEvents());
    }), this._slotObserver.observe(this, { childList: !0, subtree: !0 }));
  }
  teardown() {
    this._slotObserver && (this._slotObserver.disconnect(), this._slotObserver = null);
  }
  _setupDialog() {
    this._dialog && (this.setAttributeSafe(this._dialog, "data-ui", "dialog"), this.hasAttribute("open") && !this.isOpen && this.showModal());
  }
  _bindEvents() {
    this.listen(this, "click", (t) => {
      const e = t.target.closest('[data-part="trigger"], [data-trigger]');
      e && (!this._dialog || !this._dialog.contains(e)) && (t.preventDefault(), this.showModal(e));
    }), this.listen(document, "click", (t) => {
      if (!this.id) return;
      const e = t.target.closest(`[data-dialog-target="${this.id}"], [data-target="${this.id}"]`);
      e && !this.contains(e) && (t.preventDefault(), this.showModal(e));
    }), this.listen(this._dialog, "click", (t) => {
      if (t.target !== this._dialog) return;
      const e = this._dialog.getBoundingClientRect();
      e.top <= t.clientY && t.clientY <= e.top + e.height && e.left <= t.clientX && t.clientX <= e.left + e.width || this.close("backdrop");
    }), this.listen(this._dialog, "click", (t) => {
      const e = t.target.closest('[data-part="dialog-close"], [data-part="close"], [data-close]');
      e && this._dialog.contains(e) && (t.preventDefault(), this.close("button"));
    }), this.listen(this._dialog, "cancel", (t) => {
      this.removeAttribute("open"), this.dispatch("close", { reason: "escape" }), this._restoreFocus();
    }), this.listen(this._dialog, "close", () => {
      this.removeAttribute("open"), this.dispatch("close", { reason: "api" }), this._restoreFocus();
    });
  }
  showModal(t = null) {
    if (!(!this._dialog || this.isOpen)) {
      if (this._trigger = t || document.activeElement, typeof this._dialog.showModal == "function")
        try {
          this._dialog.open && this._dialog.close(), this._dialog.showModal();
        } catch {
          this._dialog.setAttribute("open", "");
        }
      else
        this._dialog.setAttribute("open", "");
      this.setAttributeSafe(this, "open", ""), this.dispatch("open");
    }
  }
  close(t = "programmatic") {
    if (!(!this._dialog || !this.isOpen)) {
      if (typeof this._dialog.close == "function")
        try {
          this._dialog.close();
        } catch {
          this._dialog.removeAttribute("open");
        }
      else
        this._dialog.removeAttribute("open");
      this.removeAttribute("open"), this.dispatch("close", { reason: t }), this._restoreFocus();
    }
  }
  _restoreFocus() {
    this._trigger && typeof this._trigger.focus == "function" && (this._trigger.focus(), this._trigger = null);
  }
  attributeChangedCallback(t, e, i) {
    if (t === "open" && this._dialog) {
      const s = i !== null && i !== "false";
      s && !this.isOpen ? this.showModal() : !s && this.isOpen && this.close();
    }
  }
}
class z extends A {
  static get observedAttributes() {
    return ["value", "name", "required", "disabled", "open"];
  }
  constructor() {
    super(), typeof this.attachInternals == "function" && (this._internals = this.attachInternals());
  }
  get form() {
    return this._internals ? this._internals.form : null;
  }
  get name() {
    return this.getAttribute("name") || "";
  }
  set name(t) {
    this.setAttributeSafe(this, "name", t);
  }
  get value() {
    return this.getAttribute("value") || "";
  }
  set value(t) {
    this.setAttributeSafe(this, "value", t), this._updateFormValue(t), this._syncState();
  }
  get isOpen() {
    return this.hasAttribute("open");
  }
  get required() {
    return this.hasAttribute("required");
  }
  get disabled() {
    return this.hasAttribute("disabled");
  }
  init() {
    this.setAttributeSafe(this, "data-ui", "select"), this._trigger = this.querySelector('[data-part="trigger"], button'), this._valueDisplay = this.querySelector('[data-part="value"], span'), this._listbox = this.querySelector('[data-part="listbox"], [role="listbox"], ul, ol'), this._activeIndex = -1, this.warnIfMissing('[data-part="trigger"], button', "Trigger button"), this.warnIfMissing('[data-part="listbox"], [role="listbox"], ul, ol', "Dropdown listbox container"), this._setupStructure(), this._syncState(), this._bindEvents();
  }
  _getOptions() {
    return Array.from(this.querySelectorAll('[data-part="option"], [role="option"], li'));
  }
  _setupStructure() {
    var i;
    const t = this.id || C("select"), e = ((i = this._listbox) == null ? void 0 : i.id) || `${t}-listbox`;
    if (this._trigger && (this.setAttributeSafe(this._trigger, "role", "combobox"), this.setAttributeSafe(this._trigger, "aria-haspopup", "listbox"), this.setAttributeSafe(this._trigger, "aria-expanded", "false"), this.setAttributeSafe(this._trigger, "aria-controls", e), this.setAttributeSafe(this._trigger, "tabindex", this.disabled ? "-1" : "0")), this._listbox && (this.setAttributeSafe(this._listbox, "id", e), this.setAttributeSafe(this._listbox, "role", "listbox"), this.setAttributeSafe(this._listbox, "data-state", "closed"), this.setAttributeSafe(this._listbox, "tabindex", "-1")), this._getOptions().forEach((s, a) => {
      const r = s.id || `${t}-opt-${a}`;
      this.setAttributeSafe(s, "id", r), this.setAttributeSafe(s, "role", "option"), this.setAttributeSafe(s, "aria-selected", "false");
    }), !this.value && this._getOptions().length > 0) {
      const s = this._getOptions().find((a) => a.hasAttribute("selected") || a.getAttribute("aria-selected") === "true");
      s && (this.value = s.dataset.value || s.textContent.trim());
    }
  }
  _updateFormValue(t) {
    this._internals && (this._internals.setFormValue(t), this.required && !t ? this._internals.setValidity({ valueMissing: !0 }, "Please select an option.", this._trigger) : this._internals.setValidity({}));
  }
  _syncState() {
    const t = this._getOptions(), e = this.value;
    let i = null;
    t.forEach((s, a) => {
      const o = (s.dataset.value || s.textContent.trim()) === e;
      o && (i = s, this._activeIndex = a), this.setAttributeSafe(s, "aria-selected", o ? "true" : "false");
    }), this._valueDisplay && i && (this._valueDisplay.textContent = i.textContent.trim());
  }
  _bindEvents() {
    this._trigger && (this.listen(this._trigger, "click", (t) => {
      this.disabled || (t.preventDefault(), this.toggle());
    }), this.listen(this, "keydown", (t) => this._handleKeydown(t)), this.listen(this, "click", (t) => {
      const e = t.target.closest('[data-part="option"], [role="option"]');
      e && this.contains(e) && this.selectOption(e);
    }), this.listen(document, "pointerdown", (t) => {
      !this.contains(t.target) && this.isOpen && this.close();
    }));
  }
  _handleKeydown(t) {
    var i;
    if (this.disabled) return;
    const e = this._getOptions();
    switch (t.key) {
      case c.ENTER:
      case c.SPACE:
      case c.SPACEBAR:
        t.preventDefault(), this.isOpen ? this._activeIndex >= 0 && e[this._activeIndex] && this.selectOption(e[this._activeIndex]) : this.open();
        break;
      case c.ARROW_DOWN:
        t.preventDefault(), this.isOpen ? (this._activeIndex = S(this._activeIndex, e.length, 1), this._highlightOption(e[this._activeIndex])) : this.open();
        break;
      case c.ARROW_UP:
        t.preventDefault(), this.isOpen ? (this._activeIndex = S(this._activeIndex, e.length, -1), this._highlightOption(e[this._activeIndex])) : this.open();
        break;
      case c.ESCAPE:
        this.isOpen && (t.preventDefault(), this.close(), (i = this._trigger) == null || i.focus());
        break;
      case c.TAB:
        this.close();
        break;
    }
  }
  _highlightOption(t) {
    this._getOptions().forEach((e) => {
      e === t ? (this.setAttributeSafe(e, "data-focused", "true"), e.scrollIntoView({ block: "nearest" })) : this.setAttributeSafe(e, "data-focused", "false");
    });
  }
  selectOption(t) {
    var s;
    if (!t) return;
    const e = t.dataset.value || t.textContent.trim(), i = this.value;
    this.value = e, this.close(), (s = this._trigger) == null || s.focus(), this.dispatch("change", { value: e, previousValue: i }), this.dispatch("input", { value: e });
  }
  open() {
    if (this.isOpen || this.disabled) return;
    this.setAttributeSafe(this, "open", ""), this._trigger && this.setAttributeSafe(this._trigger, "aria-expanded", "true"), this._listbox && this.setAttributeSafe(this._listbox, "data-state", "open");
    const t = this._getOptions();
    this._activeIndex >= 0 && t[this._activeIndex] && this._highlightOption(t[this._activeIndex]);
  }
  close() {
    this.isOpen && (this.removeAttribute("open"), this._trigger && this.setAttributeSafe(this._trigger, "aria-expanded", "false"), this._listbox && this.setAttributeSafe(this._listbox, "data-state", "closed"));
  }
  toggle() {
    this.isOpen ? this.close() : this.open();
  }
  // Native formResetCallback support
  formResetCallback() {
    const t = this._getOptions().find((e) => e.hasAttribute("default-selected") || e.hasAttribute("selected"));
    this.value = t ? t.dataset.value || t.textContent.trim() : "";
  }
  attributeChangedCallback(t, e, i) {
    e !== i && this._initialized && t === "value" && (this._updateFormValue(i), this._syncState());
  }
}
T(z, "formAssociated", !0);
class Z extends A {
  static get observedAttributes() {
    return ["type", "collapsible"];
  }
  get type() {
    return this.getAttribute("type") || "single";
  }
  get collapsible() {
    return this.getAttribute("collapsible") !== "false";
  }
  init() {
    this.setAttributeSafe(this, "data-ui", "accordion"), this._setupStructure(), this._bindEvents();
  }
  _getItems() {
    return Array.from(this.querySelectorAll('[data-part="item"]'));
  }
  _getTriggers() {
    return Array.from(this.querySelectorAll('[data-part="trigger"]'));
  }
  _setupStructure() {
    const t = this.id || C("accordion");
    this._getItems().forEach((i, s) => {
      const a = i.querySelector('[data-part="trigger"]'), r = i.querySelector('[data-part="content"]');
      if (a && r) {
        const o = a.id || `${t}-trigger-${s}`, n = r.id || `${t}-content-${s}`;
        this.setAttributeSafe(a, "id", o), this.setAttributeSafe(a, "aria-controls", n), this.setAttributeSafe(r, "id", n), this.setAttributeSafe(r, "role", "region"), this.setAttributeSafe(r, "aria-labelledby", o);
        const l = i.getAttribute("data-state") === "open" || a.getAttribute("aria-expanded") === "true";
        this.setAttributeSafe(a, "aria-expanded", l ? "true" : "false"), this.setAttributeSafe(i, "data-state", l ? "open" : "closed"), l ? r.removeAttribute("hidden") : r.setAttribute("hidden", "");
      }
    });
  }
  _bindEvents() {
    this.listen(this, "click", (t) => {
      const e = t.target.closest('[data-part="trigger"]');
      if (e && this.contains(e)) {
        t.preventDefault();
        const i = e.closest('[data-part="item"]');
        i && this.toggleItem(i);
      }
    }), this.listen(this, "keydown", (t) => {
      var r;
      const e = t.target.closest('[data-part="trigger"]');
      if (!e) return;
      const i = this._getTriggers(), s = i.indexOf(e);
      let a = -1;
      switch (t.key) {
        case c.ARROW_DOWN:
          t.preventDefault(), a = S(s, i.length, 1);
          break;
        case c.ARROW_UP:
          t.preventDefault(), a = S(s, i.length, -1);
          break;
        case c.HOME:
          t.preventDefault(), a = 0;
          break;
        case c.END:
          t.preventDefault(), a = i.length - 1;
          break;
      }
      a >= 0 && a !== s && ((r = i[a]) == null || r.focus());
    });
  }
  toggleItem(t) {
    const e = this.type === "single", i = t.getAttribute("data-state") === "open";
    if (i && !this.collapsible && e)
      return;
    e ? this._getItems().forEach((a) => {
      const r = a === t && !i;
      this._setItemState(a, r);
    }) : this._setItemState(t, !i);
    const s = t.dataset.value || "";
    this.dispatch("change", {
      value: s,
      open: !i
    });
  }
  _setItemState(t, e) {
    const i = t.querySelector('[data-part="trigger"]'), s = t.querySelector('[data-part="content"]');
    this.setAttributeSafe(t, "data-state", e ? "open" : "closed"), i && this.setAttributeSafe(i, "aria-expanded", e ? "true" : "false"), s && (e ? s.removeAttribute("hidden") : s.setAttribute("hidden", ""));
  }
}
const Ot = typeof window > "u" || typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("anchor-name", "--test") && (CSS.supports("position-area", "bottom span-right") || CSS.supports("inset-area", "bottom span-right"));
function R(h, t, e = "bottom", i = 6) {
  if (!h || !t) return;
  typeof e == "object" && e !== null && (i = e.offset ?? i, e = e.placement || "bottom");
  let s = "start", a = "bottom";
  if (typeof e == "string")
    if (e.includes("-")) {
      const m = e.split("-");
      a = m[0], s = m[1] || "start";
    } else
      a = e, s = "start";
  const r = h.getBoundingClientRect(), o = t.getBoundingClientRect(), n = window.innerWidth || (document.documentElement ? document.documentElement.clientWidth : 1200), l = window.innerHeight || (document.documentElement ? document.documentElement.clientHeight : 800);
  if (r.width === 0 && r.height === 0 && r.top === 0 && r.left === 0)
    return h.parentElement && h.parentElement.getBoundingClientRect().width > 0 ? R(h.parentElement, t, e, i) : void 0;
  const d = typeof e == "object" && e !== null && e.matchAnchorWidth || !1;
  let u = t.offsetWidth || o.width;
  if (!u || u <= 0) {
    const m = t.firstElementChild;
    if (m && (u = m.offsetWidth || m.getBoundingClientRect().width, !u || u <= 0)) {
      const _ = parseFloat(m.style.width || t.style.width);
      _ > 0 && (u = _);
    }
  }
  if (u >= n - 20) {
    const m = t.firstElementChild, _ = m ? m.offsetWidth || m.getBoundingClientRect().width : 0;
    u = _ > 0 && _ < n - 20 ? _ : n - 32;
  }
  (!u || u <= 0) && (u = 280), d && r.width > 0 && (u = r.width);
  let f = t.offsetHeight || o.height;
  if (!f || f <= 0) {
    const m = t.firstElementChild;
    if (m && (f = m.offsetHeight || m.getBoundingClientRect().height, !f || f <= 0)) {
      const _ = parseFloat(m.style.height || t.style.height);
      _ > 0 && (f = _);
    }
  }
  (!f || f <= 0) && (f = 320);
  let p = 0, g = 0;
  if (a === "bottom") {
    p = r.bottom + i, g = s === "end" ? r.right - u : r.left;
    const m = l - (r.bottom + i), _ = r.top - i;
    p + f > l && _ > m && _ >= f && (p = r.top - f - i);
  } else a === "top" ? (p = r.top - f - i, g = s === "end" ? r.right - u : r.left, p < 0 && r.bottom + f + i <= l && (p = r.bottom + i)) : a === "right" ? (p = r.top, g = r.right + i, g + u > n && r.left - u - i > 0 && (g = r.left - u - i)) : a === "left" && (p = r.top, g = r.left - u - i, g < 0 && r.right + u + i <= n && (g = r.right + i));
  g + u > n - 8 && (g = Math.max(8, n - u - 8)), g < 8 && (g = 8), p + f > l - 8 && (p = Math.max(8, l - f - 8)), p < 8 && (p = 8);
  const b = `${Math.round(p)}px`, v = `${Math.round(g)}px`;
  typeof t.style.setProperty == "function" && (t.style.setProperty("position", "fixed", "important"), t.style.setProperty("top", b, "important"), t.style.setProperty("left", v, "important"), t.style.setProperty("right", "auto", "important"), t.style.setProperty("bottom", "auto", "important"), t.style.setProperty("margin", "0", "important"), d && t.style.setProperty("width", `${Math.round(r.width)}px`, "important"), t.style.setProperty("max-width", "calc(100vw - 16px)", "important")), t.style.position = "fixed", t.style.top = b, t.style.left = v, t.style.right = "auto", t.style.bottom = "auto", t.style.margin = "0", d && (t.style.width = `${Math.round(r.width)}px`), t.style.maxWidth = "calc(100vw - 16px)";
}
function tt(h, t, e = {}) {
  let i = !0, s = null;
  const a = () => {
    i && (s || (s = requestAnimationFrame(() => {
      s = null, R(h, t, e.placement || "bottom", e.offset || 6);
    })));
  };
  R(h, t, e.placement || "bottom", e.offset || 6);
  let r = null;
  if (typeof IntersectionObserver < "u" && h instanceof HTMLElement) {
    r = new IntersectionObserver((n) => {
      for (const l of n)
        l.target === h && (i = l.isIntersecting, i ? (t.style && t.style.visibility === "hidden" && (t.style.visibility = ""), a()) : e.autoHideOnDisconnect !== !1 && t.style && (t.style.visibility = "hidden"));
    }, { threshold: [0, 0.1, 1] });
    try {
      r.observe(h);
    } catch {
    }
  }
  let o = null;
  if (typeof ResizeObserver < "u") {
    o = new ResizeObserver(() => {
      a();
    });
    try {
      h instanceof HTMLElement && o.observe(h), t instanceof HTMLElement && o.observe(t);
    } catch {
    }
  }
  return typeof window < "u" && (window.addEventListener("scroll", a, { passive: !0, capture: !0 }), window.addEventListener("resize", a, { passive: !0 })), () => {
    s && (cancelAnimationFrame(s), s = null), r && (r.disconnect(), r = null), o && (o.disconnect(), o = null), typeof window < "u" && (window.removeEventListener("scroll", a, { capture: !0 }), window.removeEventListener("resize", a)), t && t.style && t.style.visibility === "hidden" && (t.style.visibility = "");
  };
}
class et extends A {
  init() {
    this.setAttributeSafe(this, "data-ui", "popover"), this._trigger = this.querySelector('[data-part="trigger"]'), this._panel = this.querySelector('[data-part="popover-panel"], [data-part="content"], [popover]'), !(!this._trigger || !this._panel) && (this._setupPopover(), this._bindEvents());
  }
  _setupPopover() {
    const t = this.id || C("popover"), e = this._panel.id || `${t}-panel`;
    this.setAttributeSafe(this._panel, "id", e), this.setAttributeSafe(this._panel, "popover", this._panel.getAttribute("popover") || "auto"), this.setAttributeSafe(this._panel, "data-ui", "popover-content"), this.setAttributeSafe(this._panel, "data-part", "popover-panel"), this.setAttributeSafe(this._trigger, "popovertarget", e), this.setAttributeSafe(this._trigger, "aria-haspopup", "dialog"), this.setAttributeSafe(this._trigger, "aria-expanded", "false");
  }
  _bindEvents() {
    this.listen(this._panel, "toggle", (e) => {
      const i = e.newState === "open";
      this.setAttributeSafe(this._trigger, "aria-expanded", i ? "true" : "false"), this.setAttributeSafe(this._panel, "data-state", i ? "open" : "closed"), i && requestAnimationFrame(() => {
        this._reposition();
      }), this.dispatch("toggle", { open: i });
    }), this.listen(this._trigger, "click", (e) => {
      typeof this._panel.showPopover == "function" ? requestAnimationFrame(() => {
        this._panel.matches(":popover-open") && this._reposition();
      }) : (e.preventDefault(), this._panel.getAttribute("data-state") === "open" ? this.hide() : this.show());
    });
    const t = () => {
      this.isOpen && this._reposition();
    };
    this.listen(window, "resize", t, { passive: !0 }), this.listen(window, "scroll", t, { passive: !0 });
  }
  get isOpen() {
    return this._panel ? typeof this._panel.matches == "function" && this._panel.matches(":popover-open") || this._panel.getAttribute("data-state") === "open" : !1;
  }
  _reposition() {
    !this._trigger || !this._panel || R(this._trigger, this._panel, "bottom", 8);
  }
  show() {
    if (this._panel) {
      if (this.setAttributeSafe(this._panel, "data-state", "open"), this._trigger && this.setAttributeSafe(this._trigger, "aria-expanded", "true"), typeof this._panel.showPopover == "function")
        try {
          this._panel.matches(":popover-open") || this._panel.showPopover();
        } catch {
        }
      this._reposition();
    }
  }
  hide() {
    if (this._panel && (this.setAttributeSafe(this._panel, "data-state", "closed"), this._trigger && this.setAttributeSafe(this._trigger, "aria-expanded", "false"), typeof this._panel.hidePopover == "function"))
      try {
        this._panel.matches(":popover-open") && this._panel.hidePopover();
      } catch {
      }
  }
}
class it extends A {
  static get observedAttributes() {
    return ["delay"];
  }
  get delay() {
    return parseInt(this.getAttribute("delay") || "150", 10);
  }
  init() {
    this.setAttributeSafe(this, "data-ui", "tooltip"), this._trigger = this.querySelector('[data-part="trigger"]'), this._content = this.querySelector('[data-part="content"], [data-ui="tooltip-content"]'), this._timer = null, !(!this._trigger || !this._content) && (this._content.hasAttribute("popover") && this._content.removeAttribute("popover"), this._setupARIA(), this._bindEvents());
  }
  _setupARIA() {
    const t = this.id || C("tooltip"), e = this._content.id || `${t}-content`;
    this.setAttributeSafe(this._content, "id", e), this.setAttributeSafe(this._content, "role", "tooltip"), this.setAttributeSafe(this._trigger, "aria-describedby", e);
  }
  _bindEvents() {
    this.listen(this, "pointerenter", () => this.scheduleShow()), this.listen(this, "pointerleave", () => this.hide()), this.listen(this._trigger, "focusin", () => this.show()), this.listen(this._trigger, "focusout", () => this.hide()), this.listen(window, "keydown", (t) => {
      t.key === c.ESCAPE && this.getAttribute("data-state") === "visible" && this.hide();
    });
  }
  scheduleShow() {
    this.clearTimer(), this._timer = setTimeout(() => {
      this.show();
    }, this.delay);
  }
  show() {
    this.clearTimer(), this.setAttributeSafe(this, "data-state", "visible"), this._content && this.setAttributeSafe(this._content, "data-state", "visible");
  }
  hide() {
    this.clearTimer(), this.setAttributeSafe(this, "data-state", "hidden"), this._content && this.setAttributeSafe(this._content, "data-state", "hidden");
  }
  clearTimer() {
    this._timer && (clearTimeout(this._timer), this._timer = null);
  }
  destroy() {
    this.clearTimer();
  }
}
class st extends A {
  static get observedAttributes() {
    return ["open", "shortcut"];
  }
  constructor() {
    super(), this._activeIndex = -1, this._isOpen = !1;
  }
  init() {
    this.warnIfMissing('[data-part="input"]', "Command input field"), this.warnIfMissing('[data-part="item"]', "Command item"), this._dialog = this.querySelector('dialog[data-part="dialog"]'), this._input = this.querySelector('[data-part="input"]'), this._list = this.querySelector('[data-part="list"]') || this, this._empty = this.querySelector('[data-part="empty"]'), this._setupDialog(), this._setupInput(), this._setupList(), this._setupGlobalShortcut(), this.filter("");
  }
  _setupDialog() {
    this._dialog && (this.listen(this._dialog, "click", (t) => {
      if (t.target !== this._dialog) return;
      const e = this._dialog.getBoundingClientRect();
      e.top <= t.clientY && t.clientY <= e.top + e.height && e.left <= t.clientX && t.clientX <= e.left + e.width || this.close();
    }), this.listen(this._dialog, "close", () => {
      this._isOpen = !1, this.removeAttribute("open"), this.dispatch("close");
    }), this.listen(this._dialog, "keydown", (t) => {
      t.key === "Escape" && (t.preventDefault(), this.close());
    }));
  }
  _setupInput() {
    this._input && (this.setAttributeSafe(this._input, "role", "combobox"), this.setAttributeSafe(this._input, "aria-autocomplete", "list"), this.setAttributeSafe(this._input, "aria-expanded", "true"), this.listen(this._input, "input", (t) => {
      this.filter(t.target.value);
    }), this.listen(this._input, "keydown", (t) => {
      const e = this._getVisibleItems();
      if (e.length)
        switch (t.key) {
          case "ArrowDown":
            t.preventDefault(), this._moveActive(1);
            break;
          case "ArrowUp":
            t.preventDefault(), this._moveActive(-1);
            break;
          case "Enter":
            t.preventDefault(), this._activeIndex >= 0 && this._activeIndex < e.length && this.selectItem(e[this._activeIndex]);
            break;
          case "Home":
            t.preventDefault(), this._setActive(0);
            break;
          case "End":
            t.preventDefault(), this._setActive(e.length - 1);
            break;
        }
    }));
  }
  _setupList() {
    this.listen(this._list, "click", (t) => {
      const e = t.target.closest('[data-part="item"]');
      e && !e.hasAttribute("disabled") && this.selectItem(e);
    }), this.listen(this._list, "mousemove", (t) => {
      const e = t.target.closest('[data-part="item"]');
      if (e && !e.hasAttribute("disabled")) {
        const s = this._getVisibleItems().indexOf(e);
        s !== -1 && s !== this._activeIndex && this._setActive(s);
      }
    });
  }
  _setupGlobalShortcut() {
    const t = this.getAttribute("shortcut");
    !t || t === "none" || this.listen(window, "keydown", (e) => {
      e.defaultPrevented || (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === t.toLowerCase() && (e.preventDefault(), this.toggle());
    });
  }
  _getVisibleItems() {
    return Array.from(this.querySelectorAll('[data-part="item"]')).filter(
      (t) => !t.hasAttribute("hidden") && t.style.display !== "none"
    );
  }
  _moveActive(t) {
    const e = this._getVisibleItems();
    if (!e.length) return;
    let i = this._activeIndex + t;
    i < 0 && (i = e.length - 1), i >= e.length && (i = 0), this._setActive(i);
  }
  _setActive(t) {
    this._getVisibleItems().forEach((i, s) => {
      const a = s === t;
      this.setAttributeSafe(i, "data-active", a ? "true" : !1), this.setAttributeSafe(i, "aria-selected", a ? "true" : !1), a && (i.id || (i.id = C("cmd-item")), this._input && this.setAttributeSafe(this._input, "aria-activedescendant", i.id), i.scrollIntoView({ block: "nearest" }));
    }), this._activeIndex = t;
  }
  filter(t) {
    const e = (t || "").trim().toLowerCase(), i = Array.from(this.querySelectorAll('[data-part="item"]'));
    let s = 0;
    i.forEach((r) => {
      const o = (r.getAttribute("data-value") || "").toLowerCase(), n = r.textContent.toLowerCase(), l = (r.getAttribute("data-keywords") || "").toLowerCase();
      !e || o.includes(e) || n.includes(e) || l.includes(e) ? (r.removeAttribute("hidden"), s++) : (r.setAttribute("hidden", ""), r.removeAttribute("data-active"), r.removeAttribute("aria-selected"));
    }), Array.from(this.querySelectorAll('[data-part="group"]')).forEach((r) => {
      r.querySelectorAll('[data-part="item"]:not([hidden])').length === 0 ? r.setAttribute("hidden", "") : r.removeAttribute("hidden");
    }), this._empty && (s === 0 ? this._empty.removeAttribute("hidden") : this._empty.setAttribute("hidden", "")), this._setActive(s > 0 ? 0 : -1);
  }
  selectItem(t) {
    const e = t.getAttribute("data-value") || t.textContent.trim(), i = t.textContent.trim();
    this.dispatch("change", { value: e, label: i, item: t }), this.dispatch("select", { value: e, label: i, item: t }), this._dialog && this._isOpen && this.close();
  }
  showModal(t = null) {
    this._dialog && !this._dialog.open && (this._dialog.showModal(), this._isOpen = !0, this.setAttribute("open", ""), this.filter(""), this._input && (this._input.value = "", setTimeout(() => this._input.focus(), 50)), this.dispatch("open"));
  }
  open() {
    this.showModal();
  }
  close() {
    this._dialog && this._dialog.open && (this._dialog.close(), this._isOpen = !1, this.removeAttribute("open"));
  }
  toggle() {
    this._isOpen || this._dialog && this._dialog.open ? this.close() : this.showModal();
  }
  attributeChangedCallback(t, e, i) {
    t === "open" && (i !== null && !this._isOpen ? this.showModal() : i === null && this._isOpen && this.close());
  }
}
class at extends A {
  static get observedAttributes() {
    return ["open", "side"];
  }
  constructor() {
    super(), this._isOpen = !1, this._isClosing = !1;
  }
  init() {
    this.warnIfMissing('dialog[data-part="dialog"]', "Native dialog sheet element"), this._dialog = this.querySelector('dialog[data-part="dialog"]'), this._trigger = this.querySelector('[data-part="trigger"]'), this.hasAttribute("side") || this.setAttribute("side", "right"), this._setupTrigger(), this._setupDialog(), this._setupCloseButtons();
  }
  _setupTrigger() {
    this._trigger && this.listen(this._trigger, "click", (t) => {
      t.preventDefault(), this.showModal(this._trigger);
    });
  }
  _setupDialog() {
    this._dialog && (this.listen(this._dialog, "click", (t) => {
      const e = this._dialog.getBoundingClientRect();
      !(e.top <= t.clientY && t.clientY <= e.top + e.height && e.left <= t.clientX && t.clientX <= e.left + e.width) && !this._isClosing && this.close("backdrop");
    }), this.listen(this._dialog, "keydown", (t) => {
      t.key === "Escape" && (t.preventDefault(), this._isClosing || this.close("escape"));
    }), this.listen(this._dialog, "close", () => {
      this._isOpen = !1, this._isClosing = !1, this.removeAttribute("open"), this.removeAttribute("data-closing"), this.dispatch("close");
    }));
  }
  _setupCloseButtons() {
    this.querySelectorAll('[data-part="close"]').forEach((e) => {
      this.listen(e, "click", () => {
        this.close("close-button");
      });
    });
  }
  showModal(t = null) {
    this._dialog && (this._triggerElement = t || this._trigger, this._dialog.showModal(), this._isOpen = !0, this._isClosing = !1, this.setAttribute("open", ""), this.removeAttribute("data-closing"), this.dispatch("open"));
  }
  open() {
    this.showModal();
  }
  close(t = "programmatic") {
    if (!this._dialog || !this._dialog.open || this._isClosing) return;
    this._isClosing = !0, this.removeAttribute("open"), this.setAttribute("data-closing", "true");
    const e = () => {
      if (this._dialog.removeEventListener("animationend", e), this._dialog.removeEventListener("transitionend", e), this._dialog.open && this._dialog.close(t), this._isClosing = !1, this.removeAttribute("data-closing"), this._triggerElement)
        try {
          this._triggerElement.focus();
        } catch {
        }
    };
    this._dialog.addEventListener("animationend", e, { once: !0 }), this._dialog.addEventListener("transitionend", e, { once: !0 }), setTimeout(e, 300);
  }
  toggle() {
    this._isOpen ? this.close() : this.showModal();
  }
  get side() {
    return this.getAttribute("side") || "right";
  }
  set side(t) {
    this.setAttribute("side", t);
  }
  attributeChangedCallback(t, e, i) {
    t === "open" && (i !== null && !this._isOpen ? this.showModal() : i === null && this._isOpen && !this._isClosing && this.close());
  }
}
class B extends A {
  static get observedAttributes() {
    return ["value", "min", "max", "step", "disabled", "name"];
  }
  constructor() {
    super(), typeof this.attachInternals == "function" && (this._internals = this.attachInternals()), this._value = 0, this._isDragging = !1;
  }
  init() {
    this.warnIfMissing('[data-part="track"]', "Slider track"), this.warnIfMissing('[data-part="thumb"]', "Slider thumb"), this._track = this.querySelector('[data-part="track"]') || this, this._range = this.querySelector('[data-part="range"]'), this._thumb = this.querySelector('[data-part="thumb"]'), this._valueDisplay = this.querySelector('[data-part="value"]');
    const t = parseFloat(this.getAttribute("value")) || this.min;
    this._value = this._clamp(t), this._setupAria(), this._setupEvents(), this._updateVisuals(), this._updateFormValue();
  }
  _setupAria() {
    this._thumb && (this.setAttributeSafe(this._thumb, "role", "slider"), this.setAttributeSafe(this._thumb, "tabindex", this.disabled ? "-1" : "0"), this.setAttributeSafe(this._thumb, "aria-valuemin", this.min), this.setAttributeSafe(this._thumb, "aria-valuemax", this.max), this.setAttributeSafe(this._thumb, "aria-valuenow", this._value), this.setAttributeSafe(this._thumb, "aria-orientation", "horizontal"));
  }
  _setupEvents() {
    if (this.disabled) return;
    this._thumb && this.listen(this._thumb, "keydown", (s) => {
      if (this.disabled) return;
      const a = this.step;
      let r = this._value;
      switch (s.key) {
        case "ArrowRight":
        case "ArrowUp":
          s.preventDefault(), r += a;
          break;
        case "ArrowLeft":
        case "ArrowDown":
          s.preventDefault(), r -= a;
          break;
        case "PageUp":
          s.preventDefault(), r += a * 10;
          break;
        case "PageDown":
          s.preventDefault(), r -= a * 10;
          break;
        case "Home":
          s.preventDefault(), r = this.min;
          break;
        case "End":
          s.preventDefault(), r = this.max;
          break;
        default:
          return;
      }
      this.value = r, this.dispatch("input", { value: this._value }), this.dispatch("change", { value: this._value });
    });
    const t = (s) => {
      var a;
      this.disabled || s.button !== 0 || (this._isDragging = !0, (a = this.setPointerCapture) == null || a.call(this, s.pointerId), this.setAttribute("data-dragging", "true"), this._thumb && this._thumb.focus(), this._updateFromPointer(s), this.dispatch("input", { value: this._value }));
    }, e = (s) => {
      !this._isDragging || this.disabled || (this._updateFromPointer(s), this.dispatch("input", { value: this._value }));
    }, i = (s) => {
      var a;
      if (this._isDragging) {
        this._isDragging = !1, this.removeAttribute("data-dragging");
        try {
          (a = this.releasePointerCapture) == null || a.call(this, s.pointerId);
        } catch {
        }
        this._updateFromPointer(s), this.dispatch("change", { value: this._value });
      }
    };
    this.listen(this, "pointerdown", t), this.listen(this, "pointermove", e), this.listen(this, "pointerup", i), this.listen(this, "pointercancel", i);
  }
  _updateFromPointer(t) {
    const e = (this._track || this).getBoundingClientRect();
    if (e.width === 0) return;
    const s = Math.max(0, Math.min(t.clientX - e.left, e.width)) / e.width, a = this.min + s * (this.max - this.min);
    this.value = a;
  }
  _clamp(t) {
    const e = this.min, i = this.max, s = this.step, a = Math.round((t - e) / s) * s + e, r = Math.max(e, Math.min(i, a));
    return parseFloat(r.toFixed(4));
  }
  _updateVisuals() {
    const t = (this._value - this.min) / (this.max - this.min) * 100;
    this._range && (this._range.style.width = `${t}%`), this._thumb && (this._thumb.style.left = `${t}%`, this.setAttributeSafe(this._thumb, "aria-valuenow", this._value)), this._valueDisplay && (this._valueDisplay.textContent = String(this._value));
  }
  _updateFormValue() {
    this._internals && this._internals.setFormValue(String(this._value));
  }
  get value() {
    return this._value;
  }
  set value(t) {
    const e = this._clamp(Number(t));
    this._value !== e && (this._value = e, this.setAttributeSafe(this, "value", e), this._updateVisuals(), this._updateFormValue());
  }
  get min() {
    return parseFloat(this.getAttribute("min")) || 0;
  }
  get max() {
    return parseFloat(this.getAttribute("max")) || 100;
  }
  get step() {
    return parseFloat(this.getAttribute("step")) || 1;
  }
  get disabled() {
    return this.hasAttribute("disabled");
  }
  set disabled(t) {
    t ? this.setAttribute("disabled", "") : this.removeAttribute("disabled");
  }
  attributeChangedCallback(t, e, i) {
    if (t === "value" && i !== null) {
      const s = parseFloat(i);
      !isNaN(s) && s !== this._value && (this._value = this._clamp(s), this._updateVisuals(), this._updateFormValue());
    } else ["min", "max", "step"].includes(t) ? (this._value = this._clamp(this._value), this._setupAria(), this._updateVisuals()) : t === "disabled" && this._thumb && this.setAttributeSafe(this._thumb, "tabindex", this.disabled ? "-1" : "0");
  }
}
T(B, "formAssociated", !0);
class rt extends A {
  static get observedAttributes() {
    return ["open"];
  }
  get isOpen() {
    var t;
    return this.hasAttribute("open") || ((t = this._menu) == null ? void 0 : t.getAttribute("data-state")) === "open";
  }
  init() {
    this.setAttributeSafe(this, "data-ui", "dropdown"), this._trigger = this.querySelector('[data-part="trigger"], button'), this._menu = this.querySelector('[data-part="menu"], [role="menu"], ul, ol, div'), this._activeIndex = -1, !(!this._trigger || !this._menu) && (this._setupARIA(), this._bindEvents());
  }
  _getItems() {
    return this._menu ? Array.from(
      this._menu.querySelectorAll('[data-part="item"], [role="menuitem"], li, button')
    ).filter((t) => !t.hasAttribute("disabled") && t.getAttribute("aria-disabled") !== "true") : [];
  }
  _setupARIA() {
    const t = this.id || C("dropdown"), e = this._menu.id || `${t}-menu`;
    this.setAttributeSafe(this._trigger, "aria-haspopup", "menu"), this.setAttributeSafe(this._trigger, "aria-expanded", "false"), this.setAttributeSafe(this._trigger, "aria-controls", e), this.setAttributeSafe(this._menu, "id", e), this.setAttributeSafe(this._menu, "role", "menu"), this.setAttributeSafe(this._menu, "data-state", "closed"), this.setAttributeSafe(this._menu, "tabindex", "-1"), this._getItems().forEach((i, s) => {
      const a = i.id || `${t}-item-${s}`;
      this.setAttributeSafe(i, "id", a), this.setAttributeSafe(i, "role", "menuitem"), this.setAttributeSafe(i, "tabindex", "-1");
    });
  }
  _bindEvents() {
    this.listen(this._trigger, "click", (e) => {
      e.preventDefault(), this.toggle();
    }), this.listen(this._trigger, "keydown", (e) => {
      if (e.key === c.ARROW_DOWN || e.key === c.ENTER || e.key === c.SPACE)
        e.preventDefault(), this.open(0);
      else if (e.key === c.ARROW_UP) {
        e.preventDefault();
        const i = this._getItems();
        this.open(i.length - 1);
      }
    }), this.listen(this._menu, "keydown", (e) => {
      var s;
      const i = this._getItems();
      if (i.length)
        switch (e.key) {
          case c.ARROW_DOWN:
            e.preventDefault(), this._focusItem(S(this._activeIndex, i.length, 1));
            break;
          case c.ARROW_UP:
            e.preventDefault(), this._focusItem(S(this._activeIndex, i.length, -1));
            break;
          case c.HOME:
            e.preventDefault(), this._focusItem(0);
            break;
          case c.END:
            e.preventDefault(), this._focusItem(i.length - 1);
            break;
          case c.ENTER:
          case c.SPACE: {
            e.preventDefault(), this._activeIndex >= 0 && i[this._activeIndex] && this.selectItem(i[this._activeIndex]);
            break;
          }
          case c.ESCAPE:
            e.preventDefault(), this.close(), (s = this._trigger) == null || s.focus();
            break;
          case c.TAB:
            this.close();
            break;
        }
    }), this.listen(this._menu, "click", (e) => {
      const i = e.target.closest('[data-part="item"], [role="menuitem"], li, button');
      if (i && this._menu.contains(i)) {
        if (i.hasAttribute("disabled") || i.getAttribute("aria-disabled") === "true")
          return;
        this.selectItem(i);
      }
    }), this.listen(document, "pointerdown", (e) => {
      !this.contains(e.target) && this.isOpen && this.close();
    });
    const t = () => {
      this.isOpen && this._reposition();
    };
    this.listen(window, "resize", t, { passive: !0 }), this.listen(window, "scroll", t, { passive: !0 });
  }
  _reposition() {
    !this._trigger || !this._menu || R(this._trigger, this._menu, "bottom", 6);
  }
  _focusItem(t) {
    const e = this._getItems();
    e.length && (e.forEach((i, s) => {
      const a = s === t;
      this.setAttributeSafe(i, "data-focused", a ? "true" : "false"), this.setAttributeSafe(i, "tabindex", a ? "0" : "-1");
    }), this._activeIndex = t, e[t] && e[t].focus());
  }
  open(t = -1) {
    this._menu && (this.setAttributeSafe(this, "open", ""), this.setAttributeSafe(this._trigger, "aria-expanded", "true"), this.setAttributeSafe(this._menu, "data-state", "open"), this._reposition(), requestAnimationFrame(() => {
      this._reposition(), t >= 0 ? this._focusItem(t) : this._menu.focus();
    }), this.dispatch("open"));
  }
  close() {
    if (!this._menu) return;
    this.removeAttribute("open"), this.setAttributeSafe(this._trigger, "aria-expanded", "false"), this.setAttributeSafe(this._menu, "data-state", "closed"), this._activeIndex = -1, this._getItems().forEach((e) => {
      this.setAttributeSafe(e, "data-focused", "false"), this.setAttributeSafe(e, "tabindex", "-1");
    }), this.dispatch("close");
  }
  toggle() {
    this.isOpen ? this.close() : this.open();
  }
  selectItem(t) {
    var s;
    const e = t.dataset.value || t.getAttribute("value") || t.textContent.trim(), i = t.textContent.trim();
    this.dispatch("select", { value: e, label: i, item: t }), this.close(), (s = this._trigger) == null || s.focus();
  }
  attributeChangedCallback(t, e, i) {
    t === "open" && (i !== null && !this.isOpen ? this.open() : i === null && this.isOpen && this.close());
  }
}
let D = null, nt = 0;
class ot extends A {
  static get observedAttributes() {
    return ["position", "expand"];
  }
  get position() {
    return this.getAttribute("position") || "bottom-right";
  }
  init() {
    this.setAttributeSafe(this, "data-ui", "toaster"), this.setAttributeSafe(this, "role", "region"), this.setAttributeSafe(this, "aria-label", "Notifications"), this.setAttributeSafe(this, "position", this.position), D = this;
  }
  destroy() {
    D === this && (D = null);
  }
  createToast({
    title: t = "",
    description: e = "",
    type: i = "default",
    duration: s = 4e3,
    action: a = null,
    onDismiss: r = null
  } = {}) {
    const o = `toast-${++nt}`, n = document.createElement("div");
    n.id = o, n.setAttribute("data-ui", "toast"), n.setAttribute("data-type", i), n.setAttribute("data-state", "open"), n.setAttribute("role", i === "error" ? "alert" : "status"), n.setAttribute("aria-live", i === "error" ? "assertive" : "polite");
    const l = {
      default: "",
      success: "✓",
      error: "✕",
      warning: "⚠",
      info: "ℹ"
    }, d = l[i] ? `<span data-part="toast-icon" data-type="${i}">${l[i]}</span>` : "", u = a ? `<button type="button" data-part="toast-action" class="ui-button ui-button--xs">${a.label}</button>` : "";
    if (n.innerHTML = `
      <div data-part="toast-content">
        ${d}
        <div data-part="toast-text">
          <div data-part="toast-title">${t}</div>
          ${e ? `<div data-part="toast-description">${e}</div>` : ""}
        </div>
      </div>
      <div data-part="toast-actions">
        ${u}
        <button type="button" data-part="toast-close" aria-label="Dismiss">✕</button>
      </div>
    `, a != null && a.onClick) {
      const y = n.querySelector('[data-part="toast-action"]');
      y && y.addEventListener("click", (x) => {
        a.onClick(x), _();
      });
    }
    const f = n.querySelector('[data-part="toast-close"]');
    f && f.addEventListener("click", () => _());
    let p = s, g = null, b = Date.now();
    const v = () => {
      s <= 0 || s === 1 / 0 || (b = Date.now(), g = setTimeout(() => _(), p));
    }, m = () => {
      g && (clearTimeout(g), p -= Date.now() - b);
    };
    n.addEventListener("pointerenter", m), n.addEventListener("pointerleave", v);
    const _ = () => {
      m(), n.setAttribute("data-state", "closed"), n.addEventListener("animationend", () => {
        n.remove(), typeof r == "function" && r(o);
      }, { once: !0 }), setTimeout(() => {
        n.parentNode && (n.remove(), typeof r == "function" && r(o));
      }, 250);
    };
    return this.position.startsWith("top") ? this.prepend(n) : this.appendChild(n), v(), { id: o, dismiss: _, element: n };
  }
}
function lt() {
  if (!D || !D.isConnected) {
    let h = document.querySelector("ui-toaster, nnui-toaster");
    h ? D = h : (D = document.createElement("ui-toaster"), document.body.appendChild(D));
  }
  return D;
}
function E(h, t = {}) {
  return lt().createToast({ title: h, ...t, type: t.type || "default" });
}
E.success = (h, t = {}) => E(h, { ...t, type: "success" });
E.error = (h, t = {}) => E(h, { ...t, type: "error" });
E.warning = (h, t = {}) => E(h, { ...t, type: "warning" });
E.info = (h, t = {}) => E(h, { ...t, type: "info" });
E.dismiss = (h) => {
  if (!h) {
    document.querySelectorAll('[data-ui="toast"]').forEach((e) => e.remove());
    return;
  }
  const t = document.getElementById(h);
  t && t.remove();
};
class ht extends A {
  static get observedAttributes() {
    return ["page-size", "page", "sort-key", "sort-dir", "search"];
  }
  get pageSize() {
    const t = parseInt(this.getAttribute("page-size"), 10);
    return isNaN(t) || t <= 0 ? 10 : t;
  }
  set pageSize(t) {
    this.setAttribute("page-size", String(t));
  }
  get currentPage() {
    const t = parseInt(this.getAttribute("page"), 10);
    return isNaN(t) || t <= 0 ? 1 : t;
  }
  set currentPage(t) {
    this.setAttribute("page", String(t));
  }
  get totalPages() {
    return Math.max(1, Math.ceil(this._filteredRows.length / this.pageSize));
  }
  init() {
    this.setAttributeSafe(this, "data-ui", "data-table"), this._tbody = this.querySelector('tbody[data-part="tbody"], tbody'), this._thead = this.querySelector("thead"), this._searchInput = this.querySelector('input[data-part="search"]'), this._selectAllCheckbox = this.querySelector('input[data-part="select-all"]'), this._prevBtn = this.querySelector('[data-part="prev-btn"]'), this._nextBtn = this.querySelector('[data-part="next-btn"]'), this._pageInfo = this.querySelector('[data-part="pagination-info"], [data-part="page-info"]'), this._selectionCount = this.querySelector('[data-part="selection-count"]'), this._bulkActions = this.querySelector('[data-part="bulk-actions"], [data-part="selection-bar"]'), this._bulkCount = this.querySelector('[data-part="bulk-count"]'), this._exportBtn = this.querySelector('[data-part="export-csv"], [data-action="export-csv"]'), this._exportBtn && this._exportBtn.addEventListener("click", () => this.exportCsv()), this._tbody && (this._allRows = Array.from(this._tbody.querySelectorAll("tr")), this._allRows.forEach((t, e) => {
      t.hasAttribute("data-row-id") || t.setAttribute("data-row-id", String(e + 1)), t._searchCache = t.textContent.toLowerCase();
    }), this._filteredRows = [...this._allRows], this._selectedIds = /* @__PURE__ */ new Set(), this._setupHeaders(), this._setupSearch(), this._setupPagination(), this._setupSelection(), this._applyFilterAndSort(), this._renderPage());
  }
  _setupHeaders() {
    this._thead && (this._sortHeaders = Array.from(
      this._thead.querySelectorAll('th[data-sortable="true"], th[data-sort-key]')
    ), this._sortHeaders.forEach((t) => {
      this.setAttributeSafe(t, "role", "columnheader"), this.setAttributeSafe(t, "tabindex", "0"), this.setAttributeSafe(t, "aria-sort", "none");
      const e = t.parentNode ? Array.from(t.parentNode.children).indexOf(t) : 0, i = () => this._handleHeaderClick(t, e);
      t.addEventListener("click", i), t.addEventListener("keydown", (s) => {
        (s.key === "Enter" || s.key === " ") && (s.preventDefault(), i());
      });
    }));
  }
  _handleHeaderClick(t, e) {
    const i = t.getAttribute("data-sort-key") || String(e), s = t.getAttribute("aria-sort");
    let a = "ascending";
    if (s === "ascending" ? a = "descending" : s === "descending" && (a = "none"), this._sortHeaders.forEach((r) => {
      r.setAttribute("aria-sort", "none");
      const o = r.querySelector('[data-part="sort-icon"], [data-part="sort-indicator"]');
      o && (o.textContent = "⇅");
    }), a !== "none") {
      t.setAttribute("aria-sort", a);
      const r = t.querySelector('[data-part="sort-icon"], [data-part="sort-indicator"]');
      r && (r.textContent = a === "ascending" ? "▲" : "▼"), this.setAttribute("sort-key", i), this.setAttribute("sort-dir", a === "ascending" ? "asc" : "desc"), this._sortColumn(e, a === "ascending" ? "asc" : "desc");
    } else
      this.removeAttribute("sort-key"), this.removeAttribute("sort-dir"), this._filteredRows.sort((r, o) => parseInt(r.getAttribute("data-row-id"), 10) - parseInt(o.getAttribute("data-row-id"), 10));
    this._renderPage(), this.dispatchEvent(new CustomEvent("sort", {
      bubbles: !0,
      detail: { key: i, direction: a }
    }));
  }
  _sortColumn(t, e) {
    const i = e === "asc" ? 1 : -1;
    this._filteredRows.sort((a, r) => {
      var p, g, b, v;
      const o = ((g = (p = a.children[t]) == null ? void 0 : p.textContent) == null ? void 0 : g.trim()) || "", n = ((v = (b = r.children[t]) == null ? void 0 : b.textContent) == null ? void 0 : v.trim()) || "", l = parseFloat(o.replace(/[^0-9.-]+/g, "")), d = parseFloat(n.replace(/[^0-9.-]+/g, ""));
      if (!isNaN(l) && !isNaN(d) && o.match(/[0-9]/) && n.match(/[0-9]/))
        return (l - d) * i;
      const u = Date.parse(o), f = Date.parse(n);
      return !isNaN(u) && !isNaN(f) && o.length > 5 && n.length > 5 ? (u - f) * i : o.localeCompare(n, void 0, { numeric: !0, sensitivity: "base" }) * i;
    });
    const s = document.createDocumentFragment();
    this._filteredRows.forEach((a) => s.appendChild(a)), this._tbody.appendChild(s);
  }
  _setupSearch() {
    this._searchInput && this._searchInput.addEventListener("input", () => {
      const t = this._searchInput.value.trim().toLowerCase();
      this.setAttribute("search", t), this.currentPage = 1, this._applyFilterAndSort(), this._renderPage(), this.dispatchEvent(new CustomEvent("filter", {
        bubbles: !0,
        detail: { query: t, matchCount: this._filteredRows.length }
      }));
    });
  }
  _applyFilterAndSort() {
    const t = (this.getAttribute("search") || "").toLowerCase();
    t ? this._filteredRows = this._allRows.filter((e) => e._searchCache.includes(t)) : this._filteredRows = [...this._allRows];
  }
  _setupPagination() {
    this._prevBtn && this._prevBtn.addEventListener("click", () => {
      this.currentPage > 1 && (this.currentPage = this.currentPage - 1, this._renderPage());
    }), this._nextBtn && this._nextBtn.addEventListener("click", () => {
      this.currentPage < this.totalPages && (this.currentPage = this.currentPage + 1, this._renderPage());
    });
  }
  _renderPage() {
    const t = this.currentPage, e = this.pageSize, i = this._filteredRows.length, s = this.totalPages, a = (t - 1) * e, r = a + e;
    if (this._allRows.forEach((n) => {
      n.setAttribute("hidden", "");
    }), this._filteredRows.slice(a, r).forEach((n) => {
      n.removeAttribute("hidden");
    }), this._prevBtn && (this._prevBtn.disabled = t <= 1), this._nextBtn && (this._nextBtn.disabled = t >= s), this._pageInfo) {
      const n = i === 0 ? 0 : a + 1, l = Math.min(r, i);
      this._pageInfo.textContent = `Showing ${n} to ${l} of ${i} row(s)`;
    }
    this._updateSelectAllState(), this.dispatchEvent(new CustomEvent("page-change", {
      bubbles: !0,
      detail: { page: t, totalPages: s, totalRows: i }
    }));
  }
  _setupSelection() {
    this._selectAllCheckbox && this._selectAllCheckbox.addEventListener("change", () => {
      const t = this._selectAllCheckbox.checked, e = (this.currentPage - 1) * this.pageSize;
      this._filteredRows.slice(e, e + this.pageSize).forEach((s) => {
        const a = s.getAttribute("data-row-id"), r = s.querySelector('input[data-part="row-select"], input[type="checkbox"]');
        r && (r.checked = t), t ? (s.setAttribute("data-selected", "true"), this._selectedIds.add(a)) : (s.removeAttribute("data-selected"), this._selectedIds.delete(a));
      }), this._updateSelectionDisplay();
    }), this._tbody.addEventListener("change", (t) => {
      const e = t.target.closest('input[data-part="row-select"], input[type="checkbox"]');
      if (!e) return;
      const i = e.closest("tr");
      if (!i) return;
      const s = i.getAttribute("data-row-id");
      e.checked ? (i.setAttribute("data-selected", "true"), this._selectedIds.add(s)) : (i.removeAttribute("data-selected"), this._selectedIds.delete(s)), this._updateSelectAllState(), this._updateSelectionDisplay();
    });
  }
  _updateSelectAllState() {
    if (!this._selectAllCheckbox) return;
    const t = (this.currentPage - 1) * this.pageSize, e = this._filteredRows.slice(t, t + this.pageSize);
    if (e.length === 0) {
      this._selectAllCheckbox.checked = !1, this._selectAllCheckbox.indeterminate = !1;
      return;
    }
    const i = e.filter(
      (s) => this._selectedIds.has(s.getAttribute("data-row-id"))
    ).length;
    i === e.length ? (this._selectAllCheckbox.checked = !0, this._selectAllCheckbox.indeterminate = !1) : i > 0 ? (this._selectAllCheckbox.checked = !1, this._selectAllCheckbox.indeterminate = !0) : (this._selectAllCheckbox.checked = !1, this._selectAllCheckbox.indeterminate = !1);
  }
  _updateSelectionDisplay() {
    const t = this._selectedIds.size, e = this._allRows.length;
    this._selectionCount && (this._selectionCount.textContent = `${t} of ${e} row(s) selected`), this._bulkActions && (t > 0 ? (this._bulkActions.removeAttribute("hidden"), this._bulkActions.setAttribute("data-visible", "true")) : (this._bulkActions.setAttribute("hidden", ""), this._bulkActions.removeAttribute("data-visible"))), this._bulkCount && (this._bulkCount.textContent = String(t)), this.dispatchEvent(new CustomEvent("selection-change", {
      bubbles: !0,
      detail: {
        selectedIds: Array.from(this._selectedIds),
        selectedCount: t
      }
    }));
  }
  /**
   * Export table contents (selected rows or all matching filtered rows) to CSV
   * @param {string} filename 
   */
  exportCsv(t = "export-table.csv") {
    if (!this._allRows || this._allRows.length === 0) return;
    const e = this._selectedIds.size > 0 ? this._allRows.filter((u) => this._selectedIds.has(u.getAttribute("data-row-id"))) : this._filteredRows;
    if (e.length === 0) return;
    const i = this._thead ? Array.from(this._thead.querySelectorAll("th")) : [], s = [], a = [];
    i.forEach((u, f) => {
      u.querySelector('input[type="checkbox"]') || (s.push(f), a.push(`"${(u.textContent || "").trim().replace(/"/g, '""')}"`));
    });
    const r = e.map((u) => s.map((f) => {
      const p = u.children[f];
      return `"${(p ? p.textContent.trim() : "").replace(/"/g, '""')}"`;
    }).join(",")), o = [a.join(","), ...r].join(`
`), n = new Blob([o], { type: "text/csv;charset=utf-8;" }), l = URL.createObjectURL(n), d = document.createElement("a");
    d.setAttribute("href", l), d.setAttribute("download", t), d.style.display = "none", document.body.appendChild(d), d.click(), document.body.removeChild(d), URL.revokeObjectURL(l);
  }
  // Public Methods
  nextPage() {
    this.currentPage < this.totalPages && (this.currentPage = this.currentPage + 1, this._renderPage());
  }
  prevPage() {
    this.currentPage > 1 && (this.currentPage = this.currentPage - 1, this._renderPage());
  }
  setPage(t) {
    t >= 1 && t <= this.totalPages && (this.currentPage = t, this._renderPage());
  }
  setSearch(t) {
    this._searchInput && (this._searchInput.value = t), this.setAttribute("search", t), this.currentPage = 1, this._applyFilterAndSort(), this._renderPage();
  }
  getSelectedRowIds() {
    return Array.from(this._selectedIds);
  }
  selectAll() {
    this._allRows.forEach((t) => {
      const e = t.getAttribute("data-row-id"), i = t.querySelector('input[type="checkbox"]');
      i && (i.checked = !0), t.setAttribute("data-selected", "true"), this._selectedIds.add(e);
    }), this._updateSelectAllState(), this._updateSelectionDisplay();
  }
  deselectAll() {
    this._allRows.forEach((t) => {
      const e = t.querySelector('input[type="checkbox"]');
      e && (e.checked = !1), t.removeAttribute("data-selected");
    }), this._selectedIds.clear(), this._updateSelectAllState(), this._updateSelectionDisplay();
  }
}
const ut = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
], dt = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
function k(h, t, e) {
  const i = String(t).padStart(2, "0"), s = String(e).padStart(2, "0");
  return `${h}-${i}-${s}`;
}
function M(h) {
  if (!h) return null;
  const t = h.split("-");
  if (t.length !== 3) return null;
  const e = parseInt(t[0], 10), i = parseInt(t[1], 10), s = parseInt(t[2], 10);
  return isNaN(e) || isNaN(i) || isNaN(s) ? null : { year: e, month: i, day: s };
}
class H extends A {
  static get observedAttributes() {
    return ["value", "month", "year", "min", "max", "disabled"];
  }
  constructor() {
    if (super(), typeof this.attachInternals == "function")
      try {
        this._internals = this.attachInternals();
      } catch {
      }
  }
  get value() {
    return this.getAttribute("value") || "";
  }
  set value(t) {
    this.setAttribute("value", t);
  }
  get month() {
    const t = parseInt(this.getAttribute("month"), 10);
    return isNaN(t) || t < 1 || t > 12 ? this._currentViewDate.getMonth() + 1 : t;
  }
  set month(t) {
    this.setAttribute("month", String(t));
  }
  get year() {
    const t = parseInt(this.getAttribute("year"), 10);
    return isNaN(t) ? this._currentViewDate.getFullYear() : t;
  }
  set year(t) {
    this.setAttribute("year", String(t));
  }
  init() {
    this.setAttributeSafe(this, "data-ui", "calendar");
    const t = M(this.value), e = /* @__PURE__ */ new Date();
    this._currentViewDate = t ? new Date(t.year, t.month - 1, t.day) : e, this._focusedDate = t ? new Date(t.year, t.month - 1, t.day) : new Date(e.getFullYear(), e.getMonth(), e.getDate()), this.querySelector('[data-part="calendar-header"]') || this._buildSkeleton(), this._cacheElements(), this._attachEvents(), this._render(), this._updateFormValue();
  }
  _buildSkeleton() {
    this.innerHTML = `
      <div data-part="calendar-header">
        <button type="button" data-part="prev-month" aria-label="Previous Month" class="ui-button ui-button--ghost ui-button--icon">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div data-part="month-heading" aria-live="polite"></div>
        <button type="button" data-part="next-month" aria-label="Next Month" class="ui-button ui-button--ghost ui-button--icon">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>
      <table data-part="calendar-grid" role="grid" aria-label="Calendar">
        <thead>
          <tr role="row">
            ${dt.map((t) => `<th role="columnheader" aria-label="${t}">${t}</th>`).join("")}
          </tr>
        </thead>
        <tbody data-part="calendar-body"></tbody>
      </table>
      <div data-part="calendar-footer" class="ui-calendar-footer">
        <button type="button" data-part="today-btn" class="ui-calendar-action-btn">Today</button>
        <button type="button" data-part="clear-btn" class="ui-calendar-action-btn">Clear</button>
      </div>
    `;
  }
  _cacheElements() {
    this._prevBtn = this.querySelector('[data-part="prev-month"]'), this._nextBtn = this.querySelector('[data-part="next-month"]'), this._heading = this.querySelector('[data-part="month-heading"]'), this._grid = this.querySelector('[data-part="calendar-grid"]'), this._tbody = this.querySelector('[data-part="calendar-body"]'), this._todayBtn = this.querySelector('[data-part="today-btn"]'), this._clearBtn = this.querySelector('[data-part="clear-btn"]');
  }
  _attachEvents() {
    this._prevBtn && this._prevBtn.addEventListener("click", (t) => {
      t.preventDefault(), this.prevMonth();
    }), this._nextBtn && this._nextBtn.addEventListener("click", (t) => {
      t.preventDefault(), this.nextMonth();
    }), this._todayBtn && this._todayBtn.addEventListener("click", (t) => {
      t.preventDefault();
      const e = /* @__PURE__ */ new Date(), i = k(e.getFullYear(), e.getMonth() + 1, e.getDate());
      this.selectDate(i);
    }), this._clearBtn && this._clearBtn.addEventListener("click", (t) => {
      t.preventDefault(), this.clear();
    }), this._tbody && this._tbody.addEventListener("click", (t) => {
      const e = t.target.closest('[data-part="day-btn"]');
      if (!e || e.hasAttribute("disabled")) return;
      const i = e.getAttribute("data-date");
      i && this.selectDate(i);
    }), this.addEventListener("keydown", (t) => this._handleKeydown(t));
  }
  _handleKeydown(t) {
    if (this.hasAttribute("disabled")) return;
    let e = !1;
    const i = new Date(this._focusedDate);
    switch (t.key) {
      case "ArrowLeft":
        i.setDate(i.getDate() - 1), e = !0;
        break;
      case "ArrowRight":
        i.setDate(i.getDate() + 1), e = !0;
        break;
      case "ArrowUp":
        i.setDate(i.getDate() - 7), e = !0;
        break;
      case "ArrowDown":
        i.setDate(i.getDate() + 7), e = !0;
        break;
      case "PageUp":
        t.shiftKey ? i.setFullYear(i.getFullYear() - 1) : i.setMonth(i.getMonth() - 1), e = !0;
        break;
      case "PageDown":
        t.shiftKey ? i.setFullYear(i.getFullYear() + 1) : i.setMonth(i.getMonth() + 1), e = !0;
        break;
      case "Home":
        i.setDate(i.getDate() - i.getDay()), e = !0;
        break;
      case "End":
        i.setDate(i.getDate() + (6 - i.getDay())), e = !0;
        break;
      case "Enter":
      case " ": {
        const s = this.querySelector(`[data-date="${k(i.getFullYear(), i.getMonth() + 1, i.getDate())}"]`);
        s && !s.hasAttribute("disabled") && (t.preventDefault(), this.selectDate(s.getAttribute("data-date")));
        return;
      }
    }
    if (e) {
      t.preventDefault(), this._focusedDate = i;
      const s = i.getMonth() + 1, a = i.getFullYear();
      (s !== this.month || a !== this.year) && (this.month = s, this.year = a, this._render());
      const r = this.querySelector(`[data-date="${k(i.getFullYear(), i.getMonth() + 1, i.getDate())}"]`);
      r && r.focus();
    }
  }
  _render() {
    const t = this.year, e = this.month;
    if (this._heading && (this._heading.textContent = `${ut[e - 1]} ${t}`), !this._tbody) return;
    const i = new Date(t, e - 1, 1).getDay(), s = new Date(t, e, 0).getDate(), a = new Date(t, e - 1, 0).getDate(), r = k((/* @__PURE__ */ new Date()).getFullYear(), (/* @__PURE__ */ new Date()).getMonth() + 1, (/* @__PURE__ */ new Date()).getDate()), o = this.value, n = this.getAttribute("min") || "", l = this.getAttribute("max") || "";
    let d = "", u = 1, f = 1;
    for (let p = 0; p < 6; p++) {
      d += '<tr role="row">';
      for (let g = 0; g < 7; g++) {
        let b, v, m = !1;
        if (p === 0 && g < i) {
          b = a - i + g + 1;
          const I = e === 1 ? 12 : e - 1, O = e === 1 ? t - 1 : t;
          v = k(O, I, b), m = !0;
        } else if (u > s) {
          b = f++;
          const I = e === 12 ? 1 : e + 1, O = e === 12 ? t + 1 : t;
          v = k(O, I, b), m = !0;
        } else
          b = u++, v = k(t, e, b);
        const _ = v === r, y = v === o, x = this._focusedDate && v === k(this._focusedDate.getFullYear(), this._focusedDate.getMonth() + 1, this._focusedDate.getDate());
        let w = this.hasAttribute("disabled");
        n && v < n && (w = !0), l && v > l && (w = !0), d += `
          <td role="gridcell" 
              aria-selected="${y ? "true" : "false"}"
              ${w ? 'aria-disabled="true"' : ""}>
            <button type="button"
                    data-part="day-btn"
                    data-date="${v}"
                    tabindex="${x ? "0" : "-1"}"
                    ${m ? 'data-outside="true"' : ""}
                    ${_ ? 'data-today="true"' : ""}
                    ${y ? 'data-selected="true"' : ""}
                    ${w ? "disabled" : ""}>
              ${b}
            </button>
          </td>
        `;
      }
      if (d += "</tr>", u > s && p >= 4)
        break;
    }
    this._tbody.innerHTML = d;
  }
  selectDate(t) {
    this.value = t;
    const e = M(t);
    e && (this._focusedDate = new Date(e.year, e.month - 1, e.day), (e.month !== this.month || e.year !== this.year) && (this.month = e.month, this.year = e.year)), this._render(), this._updateFormValue(), this.dispatchEvent(new CustomEvent("change", {
      bubbles: !0,
      detail: {
        value: t,
        date: e ? new Date(e.year, e.month - 1, e.day) : null
      }
    }));
  }
  clear() {
    this.value = "", this._render(), this._updateFormValue(), this.dispatchEvent(new CustomEvent("change", {
      bubbles: !0,
      detail: {
        value: "",
        date: null
      }
    }));
  }
  prevMonth() {
    let t = this.month - 1, e = this.year;
    t < 1 && (t = 12, e -= 1), this.month = t, this.year = e, this._render(), this.dispatchEvent(new CustomEvent("month-change", {
      bubbles: !0,
      detail: { year: e, month: t }
    }));
  }
  nextMonth() {
    let t = this.month + 1, e = this.year;
    t > 12 && (t = 1, e += 1), this.month = t, this.year = e, this._render(), this.dispatchEvent(new CustomEvent("month-change", {
      bubbles: !0,
      detail: { year: e, month: t }
    }));
  }
  _updateFormValue() {
    this._internals && this._internals.setFormValue && this._internals.setFormValue(this.value || null);
  }
  attributeChangedCallback(t, e, i) {
    if (e !== i)
      if (t === "value") {
        const s = M(i);
        s && (this._currentViewDate = new Date(s.year, s.month - 1, s.day), this._focusedDate = new Date(s.year, s.month - 1, s.day), (s.month !== this.month || s.year !== this.year) && (this.month = s.month, this.year = s.year)), this._render(), this._updateFormValue();
      } else (t === "month" || t === "year" || t === "disabled" || t === "min" || t === "max") && this._render();
  }
}
T(H, "formAssociated", !0);
class W extends A {
  constructor() {
    super();
    T(this, "_reposition", () => {
      if (!this.isOpen || !this._popover) return;
      const e = this._trigger && this._trigger.isConnected ? this._trigger : this.querySelector('[data-part="trigger"]');
      e && R(e, this._popover, { placement: "bottom-start", offset: 6 });
    });
    if (typeof this.attachInternals == "function")
      try {
        this._internals = this.attachInternals();
      } catch {
      }
  }
  static get observedAttributes() {
    return ["value", "placeholder", "disabled", "open", "min", "max"];
  }
  get value() {
    return this.getAttribute("value") || "";
  }
  set value(e) {
    this.setAttribute("value", e);
  }
  get isOpen() {
    var e, i;
    return this.hasAttribute("open") || ((e = this._popover) == null ? void 0 : e.matches(":popover-open")) || ((i = this._popover) == null ? void 0 : i.hasAttribute("open"));
  }
  init() {
    this.setAttributeSafe(this, "data-ui", "date-picker"), this.querySelector('[data-part="trigger"]') || this._buildSkeleton(), this._trigger = this.querySelector('[data-part="trigger"]'), this._displayValue = this.querySelector('[data-part="display-value"]'), this._clearBtn = this.querySelector('[data-part="clear-btn"]'), this._popover = this.querySelector('[data-part="popover"]'), this._calendar = this.querySelector('ui-calendar, [data-ui="calendar"]'), this._popover && this.setAttributeSafe(this._popover, "popover", "auto"), this._updateDisplay(), this._syncConstraints(), this._attachEvents(), this._updateFormValue();
  }
  _buildSkeleton() {
    const e = this.getAttribute("placeholder") || "Pick a date...";
    this.innerHTML = `
      <button type="button" data-part="trigger" data-ui="button" data-variant="outline" class="ui-button ui-button--outline ui-date-picker-trigger" aria-haspopup="dialog" aria-expanded="false">
        <svg data-part="icon" class="ui-date-picker-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
          <line x1="16" x2="16" y1="2" y2="6"/>
          <line x1="8" x2="8" y1="2" y2="6"/>
          <line x1="3" x2="21" y1="10" y2="10"/>
        </svg>
        <span data-part="display-value">${e}</span>
        <span data-part="clear-btn" class="ui-date-picker-clear-action" role="button" tabindex="-1" aria-label="Clear date" style="display: none;">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </span>
        <svg data-part="chevron" class="ui-date-picker-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>
      <div data-part="popover" popover="auto" class="ui-date-picker-popover">
        <ui-calendar></ui-calendar>
      </div>
    `;
  }
  _syncConstraints() {
    this._calendar && (this.hasAttribute("min") ? this._calendar.setAttribute("min", this.getAttribute("min")) : this._calendar.removeAttribute("min"), this.hasAttribute("max") ? this._calendar.setAttribute("max", this.getAttribute("max")) : this._calendar.removeAttribute("max"));
  }
  _attachEvents() {
    this._trigger && this._trigger.addEventListener("click", (e) => {
      e.preventDefault(), e.stopPropagation(), this.toggle();
    }), this._clearBtn && this._clearBtn.addEventListener("click", (e) => {
      e.preventDefault(), e.stopPropagation(), this.clear();
    }), this._calendar && (this.value && this._calendar.setAttribute("value", this.value), this._calendar.addEventListener("change", (e) => {
      const i = e.detail.value;
      this.value = i, this._updateDisplay(), this._updateFormValue(), this.close(), this.dispatchEvent(new CustomEvent("change", {
        bubbles: !0,
        detail: { value: i, date: e.detail.date }
      }));
    })), document.addEventListener("click", (e) => {
      this.isOpen && !this.contains(e.target) && this.close();
    }), this.addEventListener("keydown", (e) => {
      var i;
      e.key === "Escape" && this.isOpen && (e.preventDefault(), this.close(), (i = this._trigger) == null || i.focus());
    });
  }
  _updateDisplay() {
    if (!this._displayValue) return;
    const e = this.getAttribute("placeholder") || "Pick a date...";
    if (this.value) {
      const i = this.value.split("-");
      if (i.length === 3) {
        const s = new Date(parseInt(i[0], 10), parseInt(i[1], 10) - 1, parseInt(i[2], 10));
        if (!isNaN(s.getTime())) {
          this._displayValue.textContent = s.toLocaleDateString(void 0, {
            year: "numeric",
            month: "short",
            day: "numeric"
          }), this._clearBtn && (this._clearBtn.style.display = "inline-flex"), this.setAttributeSafe(this, "data-has-value", "true");
          return;
        }
      }
      this._displayValue.textContent = this.value, this._clearBtn && (this._clearBtn.style.display = "inline-flex"), this.setAttributeSafe(this, "data-has-value", "true");
    } else
      this._displayValue.textContent = e, this._clearBtn && (this._clearBtn.style.display = "none"), this.removeAttribute("data-has-value");
  }
  clear() {
    var e, i;
    this.value = "", this._calendar && ((i = (e = this._calendar).clear) == null || i.call(e)), this._updateDisplay(), this._updateFormValue(), this.dispatchEvent(new CustomEvent("change", {
      bubbles: !0,
      detail: { value: "", date: null }
    }));
  }
  open() {
    var e, i, s;
    if (!(this.hasAttribute("disabled") || this._isToggling)) {
      this._isToggling = !0;
      try {
        if (this.hasAttribute("open") || this.setAttributeSafe(this, "open", ""), (e = this._trigger) == null || e.setAttribute("aria-expanded", "true"), this._syncConstraints(), this._calendar) {
          if (this.value) {
            this._calendar.setAttribute("value", this.value);
            const a = this.value.split("-");
            a.length === 3 && (this._calendar.month = parseInt(a[1], 10), this._calendar.year = parseInt(a[0], 10));
          }
          (s = (i = this._calendar)._render) == null || s.call(i);
        }
        if (this._popover) {
          if (typeof this._popover.showPopover == "function")
            try {
              this._popover.matches(":popover-open") || this._popover.showPopover();
            } catch {
              this._popover.setAttribute("open", "");
            }
          else
            this._popover.setAttribute("open", "");
          this._reposition(), typeof requestAnimationFrame == "function" && requestAnimationFrame(this._reposition), setTimeout(this._reposition, 10);
        }
        typeof window < "u" && (window.addEventListener("scroll", this._reposition, { passive: !0, capture: !0 }), window.addEventListener("resize", this._reposition, { passive: !0 })), this.dispatchEvent(new CustomEvent("open", { bubbles: !0 }));
      } finally {
        this._isToggling = !1;
      }
    }
  }
  close() {
    var e;
    if (!this._isToggling) {
      this._isToggling = !0;
      try {
        if (this.hasAttribute("open") && this.removeAttribute("open"), (e = this._trigger) == null || e.setAttribute("aria-expanded", "false"), typeof window < "u" && (window.removeEventListener("scroll", this._reposition, { capture: !0 }), window.removeEventListener("resize", this._reposition)), this._popover)
          if (typeof this._popover.hidePopover == "function")
            try {
              this._popover.matches(":popover-open") && this._popover.hidePopover();
            } catch {
              this._popover.removeAttribute("open");
            }
          else
            this._popover.removeAttribute("open");
        this.dispatchEvent(new CustomEvent("close", { bubbles: !0 }));
      } finally {
        this._isToggling = !1;
      }
    }
  }
  toggle() {
    this.isOpen ? this.close() : this.open();
  }
  disconnectedCallback() {
    typeof window < "u" && (window.removeEventListener("scroll", this._reposition, { capture: !0 }), window.removeEventListener("resize", this._reposition));
  }
  _updateFormValue() {
    this._internals && this._internals.setFormValue && this._internals.setFormValue(this.value || null);
  }
  attributeChangedCallback(e, i, s) {
    var a, r;
    i !== s && (e === "value" ? (this._updateDisplay(), this._calendar && this._calendar.setAttribute("value", s || ""), this._updateFormValue()) : e === "open" ? this.hasAttribute("open") ? this.open() : this.close() : e === "min" || e === "max" ? (this._syncConstraints(), (r = (a = this._calendar) == null ? void 0 : a._render) == null || r.call(a)) : e === "disabled" && this._trigger && (this.hasAttribute("disabled") ? this._trigger.setAttribute("disabled", "") : this._trigger.removeAttribute("disabled")));
  }
}
T(W, "formAssociated", !0);
function q(h, t = {}) {
  if (typeof window > "u") return () => {
  };
  const e = h.getAttribute("persist") || t.defaultMode || null, i = h.hasAttribute("sync") || t.sync || !1;
  if (!e && !i) return () => {
  };
  let s = h.getAttribute("data-persist-id") || h.getAttribute("persist-id") || h.getAttribute("data-persist-key") || t.id;
  s || (s = (h.id || h.getAttribute("name") || h.tagName.toLowerCase()).replace(/^demo-/, "").replace(/-data-grid$/, "grid").replace(/data-grid/, "grid").replace(/^ui-/, "").replace(/^nnui-/, ""));
  const { getState: a, setState: r, keys: o = [] } = t;
  if (typeof a != "function" || typeof r != "function")
    return () => {
    };
  let n = null, l = !1;
  if (i && typeof BroadcastChannel < "u")
    try {
      n = new BroadcastChannel(`nnui_sync_${s}`), n.onmessage = (g) => {
        if (!(!g.data || g.data.source === s + "_" + d) && g.data.state) {
          l = !0;
          try {
            r(g.data.state, { remote: !0 });
          } finally {
            l = !1;
          }
        }
      };
    } catch (g) {
      console.warn("[Persistence] BroadcastChannel init error:", g);
    }
  const d = Math.random().toString(36).substring(2, 9), u = ct(e, s, o, h);
  if (u && Object.keys(u).length > 0) {
    l = !0;
    try {
      r(u, { initial: !0 });
    } finally {
      l = !1;
    }
  }
  const f = () => {
    if (l) return;
    const g = a();
    if (!g) return;
    const b = {};
    if (o.length > 0)
      for (const v of o)
        g[v] !== void 0 && (b[v] = g[v]);
    else
      Object.assign(b, g);
    if (e && pt(e, s, b, h), n)
      try {
        n.postMessage({
          source: s + "_" + d,
          id: s,
          state: b,
          timestamp: Date.now()
        });
      } catch (v) {
        console.warn("[Persistence] Broadcast error:", v);
      }
  };
  h._persistState = f;
  const p = () => {
    if (e === "url") {
      const g = V(s, o, h);
      if (g && Object.keys(g).length > 0) {
        l = !0;
        try {
          r(g, { popstate: !0 });
        } finally {
          l = !1;
        }
      }
    }
  };
  return e === "url" && window.addEventListener("popstate", p), () => {
    if (h._persistState === f && delete h._persistState, e === "url" && window.removeEventListener("popstate", p), n) {
      try {
        n.close();
      } catch {
      }
      n = null;
    }
  };
}
function ct(h, t, e, i) {
  return h === "url" ? V(t, e, i) : h === "session" ? L(window.sessionStorage, t) : h === "local" ? L(window.localStorage, t) : null;
}
function pt(h, t, e, i) {
  h === "url" ? ft(t, e, i) : h === "session" ? F(window.sessionStorage, t, e) : h === "local" && F(window.localStorage, t, e);
}
function L(h, t) {
  try {
    const e = h.getItem(`nnui_persist_${t}`);
    return e ? JSON.parse(e) : null;
  } catch {
    return null;
  }
}
function F(h, t, e) {
  try {
    h.setItem(`nnui_persist_${t}`, JSON.stringify(e));
  } catch {
  }
}
function V(h, t, e) {
  try {
    const i = new URLSearchParams(window.location.search), s = {}, a = (e == null ? void 0 : e.id) || "";
    for (const r of t) {
      const o = [r];
      r === "sortKey" ? o.push("sort", "sort_key") : r === "sortDir" ? o.push("sort_dir", "dir", "order") : r === "search" && o.push("q", "query");
      const n = [];
      for (const l of o)
        n.push(`${h}_${l}`), a && a !== h && n.push(`${a}_${l}`), n.push(`grid_${l}`), n.push(`demo-data-grid_${l}`), n.push(`data-grid_${l}`), n.push(l);
      for (const l of n)
        if (i.has(l)) {
          s[r] = gt(i.get(l));
          break;
        }
    }
    if (i.has(h))
      try {
        const r = JSON.parse(i.get(h));
        return { ...s, ...r };
      } catch {
      }
    else if (a && i.has(a))
      try {
        const r = JSON.parse(i.get(a));
        return { ...s, ...r };
      } catch {
      }
    return Object.keys(s).length > 0 ? s : null;
  } catch {
    return null;
  }
}
function ft(h, t, e) {
  try {
    const i = new URL(window.location.href), s = i.searchParams, a = (e == null ? void 0 : e.id) || "";
    for (const [o, n] of Object.entries(t)) {
      const l = `${h}_${o}`, d = a && a !== h ? `${a}_${o}` : null;
      n == null || n === "" || Array.isArray(n) && n.length === 0 ? (s.delete(l), d && s.delete(d), s.delete(o)) : typeof n == "object" ? (s.set(l, JSON.stringify(n)), d && s.delete(d)) : (s.set(l, String(n)), d && s.delete(d));
    }
    const r = i.pathname + (s.toString() ? "?" + s.toString() : "") + i.hash;
    r !== window.location.pathname + window.location.search + window.location.hash && window.history.replaceState(null, "", r);
  } catch {
  }
}
function gt(h) {
  if (h === "true") return !0;
  if (h === "false") return !1;
  if (!isNaN(h) && h.trim() !== "") return Number(h);
  if (h.startsWith("{") || h.startsWith("["))
    try {
      return JSON.parse(h);
    } catch {
    }
  return h;
}
class $ extends A {
  static get observedAttributes() {
    return ["row-height", "overscan", "sort-key", "sort-dir", "search", "streaming", "persist", "sync"];
  }
  constructor() {
    super(), this._rows = [], this._filteredRows = [], this._columns = [], this._selectedIds = /* @__PURE__ */ new Set(), this._lastSelectedIndex = -1, this._sortKey = null, this._sortDir = null, this._searchQuery = "", this._streamTimer = null, this._rafId = null, this._isInternalSync = !1;
  }
  get rowHeight() {
    const t = parseInt(this.getAttribute("row-height"), 10);
    return isNaN(t) || t <= 0 ? 40 : t;
  }
  get overscan() {
    const t = parseInt(this.getAttribute("overscan"), 10);
    return isNaN(t) || t < 0 ? 6 : t;
  }
  get totalRows() {
    return this._rows.length;
  }
  get filteredCount() {
    return this._filteredRows.length;
  }
  get selectedCount() {
    return this._selectedIds.size;
  }
  getAiState() {
    return {
      totalRows: this.totalRows,
      filteredCount: this.filteredCount,
      selectedCount: this.selectedCount,
      sortKey: this._sortKey,
      sortDir: this._sortDir,
      searchQuery: this._searchQuery,
      rowHeight: this.rowHeight,
      overscan: this.overscan
    };
  }
  attributeChangedCallback(t, e, i) {
    if (!(e === i || !this._initialized || this._isInternalSync))
      if (t === "sort-key" || t === "sort-dir") {
        const s = this.getAttribute("sort-key"), a = this.getAttribute("sort-dir") || "asc";
        (s !== this._sortKey || a !== this._sortDir) && this.sortBy(s, a);
      } else t === "search" && i !== this._searchQuery && this.setSearch(i || "");
  }
  init() {
    if (this.setAttributeSafe(this, "data-ui", "data-grid"), this.setAttributeSafe(this, "role", "region"), this.setAttributeSafe(this, "aria-label", this.getAttribute("aria-label") || "Data Grid"), !this._sortKey && this.hasAttribute("sort-key") && (this._sortKey = this.getAttribute("sort-key"), this._sortDir = this.getAttribute("sort-dir") || "asc"), !this._searchQuery && this.hasAttribute("search") && (this._searchQuery = (this.getAttribute("search") || "").toLowerCase().trim()), this._setupElements(), this._bindEvents(), this.hasAttribute("persist") || this.hasAttribute("sync")) {
      const e = q(this, {
        keys: ["search", "sortKey", "sortDir", "selected"],
        getState: () => ({
          search: this._searchQuery,
          sortKey: this._sortKey,
          sortDir: this._sortDir,
          selected: Array.from(this._selectedIds)
        }),
        setState: (i) => {
          if (i.search !== void 0 && i.search !== this._searchQuery) {
            this._searchQuery = (i.search || "").toLowerCase().trim(), this._isInternalSync = !0;
            try {
              this.setAttributeSafe(this, "search", this._searchQuery);
            } finally {
              this._isInternalSync = !1;
            }
            const s = this.querySelector('[data-part="search-input"]') || document.getElementById("grid-search-input");
            s && s.value !== i.search && (s.value = i.search), this._rows.length > 0 && (this._applyFilterAndSort(), this._updateVirtualWindow(), this._updateFooter());
          }
          if (i.sortKey !== void 0 && i.sortKey !== null) {
            this._sortKey = i.sortKey, this._sortDir = i.sortDir || "asc", this._isInternalSync = !0;
            try {
              this.setAttributeSafe(this, "sort-key", this._sortKey), this.setAttributeSafe(this, "sort-dir", this._sortDir);
            } finally {
              this._isInternalSync = !1;
            }
            this._thead && this._thead.querySelectorAll('th[data-sortable="true"]').forEach((s) => {
              const a = s.getAttribute("data-col-key") === this._sortKey;
              s.setAttribute("aria-sort", a ? this._sortDir === "asc" ? "ascending" : "descending" : "none");
              const r = s.querySelector(".grid-sort-icon");
              r && (r.textContent = a ? this._sortDir === "asc" ? "▲" : "▼" : "⇅");
            }), this._rows.length > 0 && (this._applyFilterAndSort(), this._updateVirtualWindow());
          } else if (i.sortKey === null) {
            this._sortKey = null, this._sortDir = null, this._isInternalSync = !0;
            try {
              this.removeAttributeSafe(this, "sort-key"), this.removeAttributeSafe(this, "sort-dir");
            } finally {
              this._isInternalSync = !1;
            }
            this._thead && this._thead.querySelectorAll('th[data-sortable="true"]').forEach((s) => {
              s.setAttribute("aria-sort", "none");
              const a = s.querySelector(".grid-sort-icon");
              a && (a.textContent = "⇅");
            }), this._rows.length > 0 && (this._applyFilterAndSort(), this._updateVirtualWindow());
          }
          Array.isArray(i.selected) && (this._selectedIds = new Set(i.selected), this._rows.length > 0 && (this._updateVirtualWindow(), this._updateSelectAllState(), this._updateFooter()));
        }
      });
      this._cleanups.push(e);
    }
    const t = this.querySelector('script[data-part="grid-data"]');
    if (t)
      try {
        const e = JSON.parse(t.textContent);
        e.columns && this.setColumns(e.columns), e.rows && this.setRows(e.rows);
      } catch (e) {
        console.error("[ui-data-grid] Failed to parse embedded grid-data JSON", e);
      }
    else {
      const e = this.querySelector('table:not([data-part="grid-table"])');
      e && this._extractFromExistingTable(e);
    }
  }
  _setupElements() {
    this._toolbar = this.querySelector('[data-part="toolbar"]'), this._toolbar || (this._toolbar = document.createElement("div"), this._toolbar.setAttribute("data-part", "toolbar"), this.firstChild ? this.insertBefore(this._toolbar, this.firstChild) : this.appendChild(this._toolbar)), this._toolbar.classList.add("grid-toolbar"), this._viewport = this.querySelector('[data-part="viewport"]'), this._viewport || (this._viewport = document.createElement("div"), this._viewport.setAttribute("data-part", "viewport"), this.appendChild(this._viewport)), this._viewport.classList.add("grid-viewport"), this._viewport.style.overflowY = "auto", this._runway = this._viewport.querySelector('[data-part="runway"]'), this._runway || (this._runway = document.createElement("div"), this._runway.setAttribute("data-part", "runway"), this._viewport.appendChild(this._runway)), this._runway.classList.add("grid-runway"), this._table = this._runway.querySelector('[data-part="grid-table"]'), this._table || (this._table = document.createElement("table"), this._table.setAttribute("data-part", "grid-table"), this._runway.appendChild(this._table)), this._table.setAttribute("role", "grid"), this._table.classList.add("grid-table", "ui-table"), this._thead = this._table.querySelector("thead"), this._thead || (this._thead = document.createElement("thead"), this._table.appendChild(this._thead)), this._tbody = this._table.querySelector('tbody[data-part="virtual-tbody"]'), this._tbody || (this._tbody = document.createElement("tbody"), this._tbody.setAttribute("data-part", "virtual-tbody"), this._table.appendChild(this._tbody)), this._tbody.classList.add("grid-tbody"), this._footer = this.querySelector('[data-part="footer"]'), this._footer || (this._footer = document.createElement("div"), this._footer.setAttribute("data-part", "footer"), this.appendChild(this._footer)), this._footer.classList.add("grid-footer");
  }
  _bindEvents() {
    const t = () => {
      this._rafId || (this._rafId = requestAnimationFrame(() => {
        this._updateVirtualWindow(), this._rafId = null;
      }));
    };
    if (this._viewport.addEventListener("scroll", t, { passive: !0 }), this._cleanups.push(() => {
      this._viewport.removeEventListener("scroll", t), this._rafId && cancelAnimationFrame(this._rafId);
    }), typeof ResizeObserver < "u") {
      const e = new ResizeObserver(() => {
        this._updateVirtualWindow();
      });
      e.observe(this._viewport), this._cleanups.push(() => e.disconnect());
    }
  }
  /**
   * Set columns schema
   * @param {Array<{ key: string, label: string, sortable?: boolean, width?: string, align?: string }>} columns
   */
  setColumns(t) {
    this._initialized || (this.init(), this._initialized = !0), this._columns = t, this._renderHeader(), this._sortKey && this._rows.length > 0 && this._applyFilterAndSort(), this._updateVirtualWindow();
  }
  /**
   * Set rows data
   * @param {Array<Object>} rows
   */
  setRows(t) {
    this._initialized || (this.init(), this._initialized = !0), this._rows = t.map((e, i) => ({
      ...e,
      _id: e.id != null ? String(e.id) : `row-${i}`,
      _searchStr: Object.values(e).join(" ").toLowerCase()
    })), this._applyFilterAndSort(), this._updateRunwayHeight(), this._updateVirtualWindow(), this._updateFooter();
  }
  /**
   * Append rows (for streaming or live updates)
   * @param {Array<Object>} newRows
   * @param {Object} options { autoScroll?: boolean }
   */
  appendRows(t, e = {}) {
    if (!t || t.length === 0) return;
    const i = this._rows.length, s = t.map((a, r) => ({
      ...a,
      _id: a.id != null ? String(a.id) : `row-${i + r}`,
      _searchStr: Object.values(a).join(" ").toLowerCase()
    }));
    if (this._rows.push(...s), !this._searchQuery)
      this._filteredRows.push(...s), this._sortKey && this._sortFilteredRows();
    else {
      const a = this._searchQuery, r = s.filter((o) => o._searchStr.includes(a));
      this._filteredRows.push(...r), this._sortKey && this._sortFilteredRows();
    }
    this._updateRunwayHeight(), e.autoScroll && (this._viewport.scrollTop = this._viewport.scrollHeight), this._updateVirtualWindow(), this._updateFooter(), this.dispatchCustomEvent("stream-update", {
      addedCount: t.length,
      totalCount: this._rows.length
    });
  }
  /**
   * Set active search query filter
   * @param {string} query
   */
  setSearch(t) {
    var e;
    this._searchQuery = (t || "").toLowerCase().trim(), this._isInternalSync = !0;
    try {
      this.setAttributeSafe(this, "search", this._searchQuery);
    } finally {
      this._isInternalSync = !1;
    }
    this._applyFilterAndSort(), this._viewport.scrollTop = 0, this._updateRunwayHeight(), this._updateVirtualWindow(), this._updateFooter(), (e = this._persistState) == null || e.call(this);
  }
  /**
   * Sort by a specific column key and direction ('asc' | 'desc' | null)
   * @param {string|null} key
   * @param {'asc'|'desc'|null} direction
   */
  sortBy(t, e = "asc") {
    var i;
    this._isInternalSync = !0;
    try {
      !t || !e ? (this._sortKey = null, this._sortDir = null, this.removeAttributeSafe(this, "sort-key"), this.removeAttributeSafe(this, "sort-dir")) : (this._sortKey = t, this._sortDir = e === "desc" ? "desc" : "asc", this.setAttributeSafe(this, "sort-key", this._sortKey), this.setAttributeSafe(this, "sort-dir", this._sortDir));
    } finally {
      this._isInternalSync = !1;
    }
    this._thead && this._thead.querySelectorAll('th[data-sortable="true"]').forEach((s) => {
      const a = this._sortKey && s.getAttribute("data-col-key") === this._sortKey;
      s.setAttribute("aria-sort", a ? this._sortDir === "asc" ? "ascending" : "descending" : "none");
      const r = s.querySelector(".grid-sort-icon");
      r && (r.textContent = a ? this._sortDir === "asc" ? "▲" : "▼" : "⇅");
    }), this._applyFilterAndSort(), this._updateVirtualWindow(), (i = this._persistState) == null || i.call(this), this.dispatchCustomEvent("sort", { key: this._sortKey, direction: this._sortDir });
  }
  _applyFilterAndSort() {
    if (!this._searchQuery)
      this._filteredRows = [...this._rows];
    else {
      const t = this._searchQuery;
      this._filteredRows = this._rows.filter((e) => e._searchStr.includes(t));
    }
    this._sortKey && this._sortFilteredRows();
  }
  _sortFilteredRows() {
    const t = this._sortKey, e = this._sortDir === "desc" ? -1 : 1;
    this._filteredRows.sort((i, s) => {
      const a = i[t], r = s[t];
      if (a == null && r == null) return 0;
      if (a == null) return 1;
      if (r == null) return -1;
      if (typeof a == "number" && typeof r == "number")
        return (a - r) * e;
      if (typeof a == "string" && typeof r == "string") {
        const o = a.replace(/[^0-9.-]/g, ""), n = r.replace(/[^0-9.-]/g, "");
        if (o !== "" && n !== "" && !isNaN(Number(o)) && !isNaN(Number(n)))
          return (Number(o) - Number(n)) * e;
      }
      if (typeof a == "string" && (a.includes("-") || a.includes("/") || a.includes(":"))) {
        const o = Date.parse(a), n = Date.parse(r);
        if (!isNaN(o) && !isNaN(n))
          return (o - n) * e;
      }
      return String(a).localeCompare(String(r), void 0, { numeric: !0, sensitivity: "base" }) * e;
    });
  }
  _renderHeader() {
    if (!this._thead) return;
    this._thead.innerHTML = "";
    const t = document.createElement("tr");
    t.setAttribute("role", "row");
    const e = document.createElement("th");
    e.setAttribute("role", "columnheader"), e.style.width = "44px", e.style.textAlign = "center";
    const i = document.createElement("input");
    i.type = "checkbox", i.setAttribute("data-part", "select-all"), i.setAttribute("aria-label", "Select all rows"), i.className = "ui-checkbox", i.addEventListener("change", () => {
      this._toggleSelectAll(i.checked);
    }), this._selectAllCheckbox = i, e.appendChild(i), t.appendChild(e), this._columns.forEach((s) => {
      const a = document.createElement("th");
      if (a.setAttribute("role", "columnheader"), a.setAttribute("tabindex", "0"), a.setAttribute("data-col-key", s.key), s.width && (a.style.width = s.width), s.align && (a.style.textAlign = s.align), s.sortable !== !1) {
        a.setAttribute("data-sortable", "true"), a.style.cursor = "pointer", a.style.userSelect = "none";
        const o = s.key === this._sortKey;
        o && this._sortDir ? a.setAttribute("aria-sort", this._sortDir === "asc" ? "ascending" : "descending") : a.setAttribute("aria-sort", "none");
        const n = document.createElement("span");
        n.textContent = s.label;
        const l = document.createElement("span");
        l.className = "grid-sort-icon", l.style.marginLeft = "0.35rem", l.style.fontSize = "0.75rem", l.textContent = o && this._sortDir ? this._sortDir === "asc" ? "▲" : "▼" : "⇅", a.appendChild(n), a.appendChild(l);
        const d = () => this._handleSort(s.key, a, l);
        a.addEventListener("click", d), a.addEventListener("keydown", (u) => {
          (u.key === "Enter" || u.key === " ") && (u.preventDefault(), d());
        });
      } else
        a.textContent = s.label;
      t.appendChild(a);
    }), this._thead.appendChild(t);
  }
  _handleSort(t, e, i) {
    let s = "asc";
    this._sortKey === t && (this._sortDir === "asc" ? s = "desc" : this._sortDir === "desc" && (s = null)), this.sortBy(s ? t : null, s);
  }
  _updateRunwayHeight() {
    if (!this._runway) return;
    const t = this._filteredRows.length * this.rowHeight;
    this._runway.style.height = `${t}px`;
  }
  _updateVirtualWindow() {
    if (!this._viewport || !this._tbody || this._columns.length === 0) return;
    const t = this._viewport.scrollTop, e = this._viewport.clientHeight || 450, i = this._filteredRows.length, s = this._columns.length + 1;
    if (i === 0) {
      this._tbody.innerHTML = `
        <tr role="row">
          <td colspan="${s}" style="text-align: center; padding: 3rem 1rem;">
            <div data-ui="empty">
              <div data-ui="empty-icon">🔍</div>
              <div data-ui="empty-title">No matching records</div>
              <div data-ui="empty-description">Try adjusting your search criteria</div>
            </div>
          </td>
        </tr>
      `, this._tbody.style.transform = "";
      return;
    }
    const a = Math.max(0, Math.floor(t / this.rowHeight) - this.overscan), r = Math.min(i, Math.ceil((t + e) / this.rowHeight) + this.overscan), o = a * this.rowHeight, n = Math.max(0, (i - r) * this.rowHeight);
    this._tbody.style.transform = "";
    const l = this._filteredRows.slice(a, r), d = document.createDocumentFragment();
    if (o > 0) {
      const u = document.createElement("tr");
      u.className = "grid-spacer grid-spacer-top", u.setAttribute("role", "presentation"), u.setAttribute("aria-hidden", "true"), u.style.cssText = `height: ${o}px; border: 0; padding: 0; margin: 0;`;
      const f = document.createElement("td");
      f.colSpan = s, f.style.cssText = `height: ${o}px; border: 0; padding: 0; margin: 0; line-height: 0; font-size: 0; background: transparent;`, u.appendChild(f), d.appendChild(u);
    }
    if (l.forEach((u, f) => {
      const p = a + f, g = this._selectedIds.has(u._id), b = document.createElement("tr");
      b.setAttribute("role", "row"), b.setAttribute("aria-rowindex", String(p + 1)), b.setAttribute("data-row-id", u._id), b.style.height = `${this.rowHeight}px`, g && b.setAttribute("data-selected", "true");
      const v = document.createElement("td");
      v.setAttribute("role", "gridcell"), v.style.width = "44px", v.style.textAlign = "center";
      const m = document.createElement("input");
      m.type = "checkbox", m.checked = g, m.className = "ui-checkbox", m.setAttribute("aria-label", `Select row ${p + 1}`), m.addEventListener("click", (_) => {
        _.stopPropagation(), this._handleRowSelect(u._id, p, _.shiftKey);
      }), v.appendChild(m), b.appendChild(v), this._columns.forEach((_) => {
        const y = document.createElement("td");
        y.setAttribute("role", "gridcell"), _.width && (y.style.width = _.width), _.align && (y.style.textAlign = _.align);
        const x = u[_.key];
        if (typeof _.render == "function") {
          const w = _.render(x, u);
          w instanceof HTMLElement ? y.appendChild(w) : y.innerHTML = String(w);
        } else
          y.textContent = x != null ? String(x) : "";
        b.appendChild(y);
      }), d.appendChild(b);
    }), n > 0) {
      const u = document.createElement("tr");
      u.className = "grid-spacer grid-spacer-bottom", u.setAttribute("role", "presentation"), u.setAttribute("aria-hidden", "true"), u.style.cssText = `height: ${n}px; border: 0; padding: 0; margin: 0;`;
      const f = document.createElement("td");
      f.colSpan = s, f.style.cssText = `height: ${n}px; border: 0; padding: 0; margin: 0; line-height: 0; font-size: 0; background: transparent;`, u.appendChild(f), d.appendChild(u);
    }
    this._tbody.innerHTML = "", this._tbody.appendChild(d), this._updateSelectAllState(), this._updateFooter();
  }
  _handleRowSelect(t, e, i) {
    var s;
    if (i && this._lastSelectedIndex !== -1) {
      const a = Math.min(this._lastSelectedIndex, e), r = Math.max(this._lastSelectedIndex, e);
      for (let o = a; o <= r; o++)
        this._filteredRows[o] && this._selectedIds.add(this._filteredRows[o]._id);
    } else
      this._selectedIds.has(t) ? this._selectedIds.delete(t) : this._selectedIds.add(t), this._lastSelectedIndex = e;
    this._updateVirtualWindow(), (s = this._persistState) == null || s.call(this), this.dispatchCustomEvent("selection-change", {
      selectedIds: Array.from(this._selectedIds),
      selectedCount: this._selectedIds.size
    });
  }
  _toggleSelectAll(t) {
    var e;
    t ? this._filteredRows.forEach((i) => this._selectedIds.add(i._id)) : this._selectedIds.clear(), this._updateVirtualWindow(), (e = this._persistState) == null || e.call(this), this.dispatchCustomEvent("selection-change", {
      selectedIds: Array.from(this._selectedIds),
      selectedCount: this._selectedIds.size
    });
  }
  _updateSelectAllState() {
    if (!this._selectAllCheckbox || this._filteredRows.length === 0) return;
    let t = !0, e = !1;
    for (const i of this._filteredRows)
      this._selectedIds.has(i._id) ? e = !0 : t = !1;
    this._selectAllCheckbox.checked = t && e, this._selectAllCheckbox.indeterminate = !t && e;
  }
  _escapeHtml(t) {
    return t ? String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;") : "";
  }
  _updateFooter() {
    if (!this._footer) return;
    const t = this._rows.length, e = this._filteredRows.length, i = this._selectedIds.size, s = this._tbody ? this._tbody.querySelectorAll("tr:not(.grid-spacer)").length : 0;
    this._footer.innerHTML = `
      <div class="grid-footer-content" style="display: flex; justify-content: space-between; align-items: center; width: 100%; font-size: 0.8rem; color: var(--ui-text-secondary); gap: 0.75rem; flex-wrap: wrap;">
        <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
          <span>Showing <strong style="color: var(--ui-text-primary);">${e.toLocaleString()}</strong> of ${t.toLocaleString()} rows</span>
          ${this._searchQuery ? `<span data-ui="badge" data-variant="secondary" style="font-size: 0.725rem; padding: 0.15rem 0.5rem;">Filter: "${this._escapeHtml(this._searchQuery)}"</span>` : ""}
          ${i > 0 ? `<span data-ui="badge" data-variant="default" style="font-size: 0.725rem; padding: 0.15rem 0.5rem; background: var(--ui-color-brand-600); color: white;">${i.toLocaleString()} selected</span>` : ""}
        </div>
        <div style="display: flex; align-items: center; gap: 1rem;">
          <span style="font-size: 0.75rem; color: var(--ui-text-muted); display: inline-flex; align-items: center; gap: 0.35rem;">
            <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--ui-color-success-500);"></span>
            ${s} active DOM rows
          </span>
          <span style="font-family: var(--ui-font-mono, monospace); font-size: 0.75rem; font-weight: 600; color: var(--ui-color-success-500); background: rgba(16, 185, 129, 0.1); padding: 0.2rem 0.5rem; border-radius: 4px; border: 1px solid rgba(16, 185, 129, 0.2);">⚡ 60 FPS Virtualized</span>
        </div>
      </div>
    `;
  }
  /**
   * Export currently filtered / selected dataset to CSV
   * @param {string} filename
   */
  exportCsv(t = "export-grid.csv") {
    const e = this._selectedIds.size > 0 ? this._rows.filter((l) => this._selectedIds.has(l._id)) : this._filteredRows;
    if (e.length === 0) return;
    const i = this._columns.map((l) => `"${l.label.replace(/"/g, '""')}"`).join(","), s = e.map((l) => this._columns.map((d) => `"${(l[d.key] != null ? String(l[d.key]) : "").replace(/"/g, '""')}"`).join(",")), a = [i, ...s].join(`
`), r = new Blob([a], { type: "text/csv;charset=utf-8;" }), o = URL.createObjectURL(r), n = document.createElement("a");
    n.setAttribute("href", o), n.setAttribute("download", t), n.style.display = "none", document.body.appendChild(n), n.click(), document.body.removeChild(n), URL.revokeObjectURL(o);
  }
  /**
   * Start mock live streaming of incoming rows
   */
  startStreaming(t = 400, e) {
    if (this._streamTimer) return;
    this.setAttributeSafe(this, "streaming", "true");
    const s = e || (() => {
      const a = ["BUY", "SELL", "TRANSFER", "SWAP"], r = ["BTC/USD", "ETH/USD", "SOL/USD", "NVDA", "AAPL", "GOOGL"], o = a[Math.floor(Math.random() * a.length)], n = r[Math.floor(Math.random() * r.length)], l = (Math.random() * 1e3 + 50).toFixed(2), d = (Math.random() * 5 + 0.1).toFixed(4);
      return [{
        id: `stream-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString(),
        symbol: n,
        action: o,
        price: `$${l}`,
        volume: d,
        status: Math.random() > 0.1 ? "Executed" : "Pending"
      }];
    });
    this._streamTimer = setInterval(() => {
      const a = s();
      this.appendRows(a);
    }, t);
  }
  stopStreaming() {
    this._streamTimer && (clearInterval(this._streamTimer), this._streamTimer = null, this.removeAttributeSafe(this, "streaming"));
  }
  destroy() {
    this.stopStreaming(), this._rafId && cancelAnimationFrame(this._rafId);
  }
}
typeof customElements < "u" && (customElements.get("ui-data-grid") || customElements.define("ui-data-grid", $), customElements.get("nnui-data-grid") || customElements.define("nnui-data-grid", class extends $ {
}));
class P extends A {
  constructor() {
    super();
    T(this, "_reposition", () => {
      if (!this.isOpen || !this._popover) return;
      const e = this._trigger && this._trigger.isConnected ? this._trigger : this.querySelector('[data-part="trigger"]');
      e && R(e, this._popover, { placement: "bottom-start", offset: 8 });
    });
    this._startDate = null, this._endDate = null, this._hoverDate = null, this._viewYear = (/* @__PURE__ */ new Date()).getFullYear(), this._viewMonth = (/* @__PURE__ */ new Date()).getMonth(), this._selectingEnd = !1;
  }
  static get observedAttributes() {
    return ["start-date", "end-date", "placeholder", "disabled", "open", "persist", "sync"];
  }
  get startDate() {
    return this._startDate;
  }
  set startDate(e) {
    this._startDate = e ? new Date(e) : null, this._renderTrigger(), this._renderCalendars();
  }
  get endDate() {
    return this._endDate;
  }
  set endDate(e) {
    this._endDate = e ? new Date(e) : null, this._renderTrigger(), this._renderCalendars();
  }
  get isOpen() {
    if (this._popover && typeof this._popover.matches == "function")
      try {
        return this._popover.matches(":popover-open") || this.hasAttribute("open");
      } catch {
      }
    return this.hasAttribute("open");
  }
  getAiState() {
    return {
      startDate: this._startDate ? this._formatDate(this._startDate) : null,
      endDate: this._endDate ? this._formatDate(this._endDate) : null,
      isOpen: this.isOpen,
      selectingEnd: this._selectingEnd
    };
  }
  init() {
    if (this.setAttributeSafe(this, "data-ui", "date-range-picker"), this.hasAttribute("start-date") && (this._startDate = new Date(this.getAttribute("start-date"))), this.hasAttribute("end-date") && (this._endDate = new Date(this.getAttribute("end-date"))), this._startDate && !isNaN(this._startDate.getTime()) && (this._viewYear = this._startDate.getFullYear(), this._viewMonth = this._startDate.getMonth()), this._setupDOM(), this._renderTrigger(), this._renderCalendars(), this.hasAttribute("persist") || this.hasAttribute("sync")) {
      const e = q(this, {
        keys: ["start", "end"],
        getState: () => ({
          start: this._startDate ? this._formatDate(this._startDate) : "",
          end: this._endDate ? this._formatDate(this._endDate) : ""
        }),
        setState: (i) => {
          i.start ? (this._startDate = new Date(i.start), this._viewYear = this._startDate.getFullYear(), this._viewMonth = this._startDate.getMonth()) : i.start === "" && (this._startDate = null), i.end ? this._endDate = new Date(i.end) : i.end === "" && (this._endDate = null), this._renderTrigger(), this._renderCalendars();
        }
      });
      this._cleanups.push(e);
    }
  }
  _setupDOM() {
    const e = `range-anchor-${Math.random().toString(36).substring(2, 9)}`, i = `range-popover-${Math.random().toString(36).substring(2, 9)}`;
    let s = this.querySelector('[data-part="trigger"]');
    s || (s = document.createElement("button"), s.type = "button", s.setAttribute("data-part", "trigger"), s.className = "ui-date-range-trigger", this.appendChild(s)), this._trigger = s, this._trigger.style.anchorName = `--${e}`, this._trigger.setAttribute("aria-haspopup", "dialog"), this._trigger.setAttribute("aria-expanded", "false");
    let a = this.querySelector('[data-part="popover"]');
    a || (a = document.createElement("div"), a.setAttribute("data-part", "popover"), a.setAttribute("popover", "auto"), a.id = i, a.className = "ui-date-range-popover", this.appendChild(a)), this._popover = a, this._popover.style.positionAnchor = `--${e}`, this._lastClosedTime = 0, this._trigger.addEventListener("click", (o) => {
      o.preventDefault(), !(Date.now() - this._lastClosedTime < 150) && this.toggle();
    }), this._popover.addEventListener("toggle", (o) => {
      var n, l;
      o.newState === "open" ? (this.setAttributeSafe(this, "open", ""), (n = this._trigger) == null || n.setAttribute("aria-expanded", "true"), this._reposition(), typeof requestAnimationFrame == "function" && requestAnimationFrame(this._reposition), setTimeout(this._reposition, 15), this.dispatchCustomEvent("open")) : (this._lastClosedTime = Date.now(), this.removeAttributeSafe(this, "open"), (l = this._trigger) == null || l.setAttribute("aria-expanded", "false"), this.dispatchCustomEvent("close"));
    });
    const r = tt(this._trigger, this._popover, {
      placement: "bottom-start",
      offset: 8
    });
    this._cleanups.push(r);
  }
  open() {
    var e;
    if (!this.hasAttribute("disabled")) {
      if (this._popover && typeof this._popover.showPopover == "function")
        try {
          this._popover.matches(":popover-open") || this._popover.showPopover();
        } catch {
          this._popover.setAttribute("open", "");
        }
      else this._popover && this._popover.setAttribute("open", "");
      this.setAttributeSafe(this, "open", ""), (e = this._trigger) == null || e.setAttribute("aria-expanded", "true"), this._reposition(), typeof requestAnimationFrame == "function" && requestAnimationFrame(this._reposition), setTimeout(this._reposition, 15), typeof window < "u" && (window.addEventListener("scroll", this._reposition, { passive: !0, capture: !0 }), window.addEventListener("resize", this._reposition, { passive: !0 })), this.dispatchCustomEvent("open");
    }
  }
  close() {
    var e;
    if (typeof window < "u" && (window.removeEventListener("scroll", this._reposition, { capture: !0 }), window.removeEventListener("resize", this._reposition)), this._popover && typeof this._popover.hidePopover == "function")
      try {
        this._popover.matches(":popover-open") && this._popover.hidePopover();
      } catch {
        this._popover.removeAttribute("open");
      }
    else this._popover && this._popover.removeAttribute("open");
    this.removeAttributeSafe(this, "open"), (e = this._trigger) == null || e.setAttribute("aria-expanded", "false"), this.dispatchCustomEvent("close");
  }
  toggle() {
    this.isOpen ? this.close() : this.open();
  }
  _formatDate(e) {
    if (!e || isNaN(e.getTime())) return "";
    const i = e.getFullYear(), s = String(e.getMonth() + 1).padStart(2, "0"), a = String(e.getDate()).padStart(2, "0");
    return `${i}-${s}-${a}`;
  }
  _formatDisplayDate(e) {
    return !e || isNaN(e.getTime()) ? "" : `${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][e.getMonth()]} ${String(e.getDate()).padStart(2, "0")}, ${e.getFullYear()}`;
  }
  _renderTrigger() {
    if (!this._trigger) return;
    const e = this._formatDisplayDate(this._startDate), i = this._formatDisplayDate(this._endDate), s = this.getAttribute("placeholder") || "Select date range...";
    let a = "";
    e && i ? a = `<span style="font-weight: 500;">${e}</span> <span style="color: var(--ui-text-muted); font-size: 0.8rem; margin: 0 0.25rem;">→</span> <span style="font-weight: 500;">${i}</span>` : e ? a = `<span style="font-weight: 500;">${e}</span> <span style="color: var(--ui-text-muted); font-size: 0.8rem; margin: 0 0.25rem;">→</span> <span style="color: var(--ui-text-muted);">Pick end date</span>` : a = `<span style="color: var(--ui-text-muted); font-weight: 400;">${s}</span>`, this._trigger.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.6rem; flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--ui-text-muted); flex-shrink: 0;">
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
          <line x1="16" x2="16" y1="2" y2="6"/>
          <line x1="8" x2="8" y1="2" y2="6"/>
          <line x1="3" x2="21" y1="10" y2="10"/>
        </svg>
        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${a}</span>
      </div>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--ui-text-muted); flex-shrink: 0; margin-left: 0.5rem;">
        <path d="m6 9 6 6 6-6"/>
      </svg>
    `;
  }
  _renderCalendars() {
    if (!this._popover) return;
    const e = new Date(this._viewYear, this._viewMonth, 1), i = new Date(this._viewYear, this._viewMonth + 1, 1), s = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    let a = "Select start and end dates", r = "";
    if (this._startDate && this._endDate) {
      a = `${this._formatDisplayDate(this._startDate)} → ${this._formatDisplayDate(this._endDate)}`;
      const o = Math.round(Math.abs((this._endDate.getTime() - this._startDate.getTime()) / (1e3 * 60 * 60 * 24))) + 1;
      r = `<span class="range-duration-badge">${o} day${o === 1 ? "" : "s"}</span>`;
    } else this._startDate && (a = `${this._formatDisplayDate(this._startDate)} → Pick end date`), r = '<span class="range-duration-badge" style="display: none;"></span>';
    this._popover.innerHTML = `
      <div class="range-picker-container">
        
        <!-- Header Presets Bar -->
        <div class="range-header-bar">
          <button type="button" class="range-preset-btn" data-preset="today">Today</button>
          <button type="button" class="range-preset-btn" data-preset="7d">Last 7 Days</button>
          <button type="button" class="range-preset-btn" data-preset="30d">Last 30 Days</button>
          <button type="button" class="range-preset-btn" data-preset="month">This Month</button>
        </div>

        <!-- Dual Calendars View (Side-by-side) -->
        <div class="range-calendars-wrapper">
          
          <!-- Month 1 (Left) -->
          <div class="range-calendar-pane">
            <div class="range-month-header">
              <button type="button" class="range-nav-btn range-nav-prev" aria-label="Previous month">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </button>
              <span class="range-month-title">
                ${s[e.getMonth()]} ${e.getFullYear()}
              </span>
              <span style="width: 28px; height: 28px; display: inline-block;"></span>
            </div>
            ${this._generateMonthGridHtml(e)}
          </div>

          <!-- Divider -->
          <div class="range-calendars-divider"></div>

          <!-- Month 2 (Right) -->
          <div class="range-calendar-pane">
            <div class="range-month-header">
              <span style="width: 28px; height: 28px; display: inline-block;"></span>
              <span class="range-month-title">
                ${s[i.getMonth()]} ${i.getFullYear()}
              </span>
              <button type="button" class="range-nav-btn range-nav-next" aria-label="Next month">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </button>
            </div>
            ${this._generateMonthGridHtml(i)}
          </div>

        </div>

        <!-- Footer Actions Bar -->
        <div class="range-footer-bar">
          <div class="range-summary-text">
            <span>${a}</span>
            ${r}
          </div>
          <div class="range-actions-group">
            <button type="button" class="range-btn-clear">Clear</button>
            <button type="button" class="range-btn-apply">Apply Range</button>
          </div>
        </div>

      </div>
    `, this._bindCalendarInteractions();
  }
  _generateMonthGridHtml(e) {
    const i = e.getFullYear(), s = e.getMonth(), a = new Date(i, s, 1).getDay(), r = new Date(i, s + 1, 0).getDate();
    let o = `
      <table class="range-grid-table">
        <thead>
          <tr>
            <th>Su</th><th>Mo</th><th>Tu</th><th>We</th><th>Th</th><th>Fr</th><th>Sa</th>
          </tr>
        </thead>
        <tbody>
          <tr>
    `;
    for (let p = 0; p < a; p++)
      o += "<td></td>";
    let n = 1, l = a;
    const d = this._normalizeDate(this._startDate), u = this._normalizeDate(this._endDate), f = this._normalizeDate(this._hoverDate);
    for (; n <= r; ) {
      l === 7 && (o += "</tr><tr>", l = 0);
      const p = new Date(i, s, n), g = this._normalizeDate(p), b = d && g.getTime() === d.getTime(), v = u && g.getTime() === u.getTime();
      let m = !1;
      if (d && u) {
        const I = Math.min(d.getTime(), u.getTime()), O = Math.max(d.getTime(), u.getTime());
        m = g.getTime() > I && g.getTime() < O;
      } else if (d && f && this._selectingEnd) {
        const I = Math.min(d.getTime(), f.getTime()), O = Math.max(d.getTime(), f.getTime());
        m = g.getTime() > I && g.getTime() < O;
      }
      let _ = "";
      b && v ? _ = "range-start range-end range-single" : b ? _ = "range-start" + (!u && !f ? " range-single" : "") : v ? _ = "range-end" : m && (_ = "in-range");
      const y = _ ? `class="${_}"` : "";
      let x = `data-date="${this._formatDate(p)}"`, w = "";
      b ? w = 'data-range="start"' : v ? w = 'data-range="end"' : m && (w = 'data-range="in-range"'), o += `
        <td ${y}>
          <button type="button" class="range-cell-btn" ${x} ${w}>
            ${n}
          </button>
        </td>
      `, n++, l++;
    }
    for (; l < 7 && l > 0; )
      o += "<td></td>", l++;
    return o += "</tr></tbody></table>", o;
  }
  _normalizeDate(e) {
    return !e || isNaN(e.getTime()) ? null : new Date(e.getFullYear(), e.getMonth(), e.getDate());
  }
  _bindCalendarInteractions() {
    if (!this._popover) return;
    const e = this._popover.querySelector(".range-nav-prev"), i = this._popover.querySelector(".range-nav-next");
    e && e.addEventListener("click", (o) => {
      o.stopPropagation(), this._viewMonth--, this._viewMonth < 0 && (this._viewMonth = 11, this._viewYear--), this._renderCalendars();
    }), i && i.addEventListener("click", (o) => {
      o.stopPropagation(), this._viewMonth++, this._viewMonth > 11 && (this._viewMonth = 0, this._viewYear++), this._renderCalendars();
    }), this._popover.querySelectorAll(".range-preset-btn").forEach((o) => {
      o.addEventListener("click", (n) => {
        n.stopPropagation();
        const l = o.getAttribute("data-preset");
        this._applyPreset(l);
      });
    }), this._popover.querySelectorAll(".range-cell-btn[data-date]").forEach((o) => {
      o.addEventListener("click", (n) => {
        n.stopPropagation();
        const l = o.getAttribute("data-date");
        if (!l) return;
        const [d, u, f] = l.split("-").map(Number);
        this._handleDateClick(new Date(d, u - 1, f));
      }), o.addEventListener("mouseenter", () => {
        if (this._selectingEnd) {
          const n = o.getAttribute("data-date");
          if (!n) return;
          const [l, d, u] = n.split("-").map(Number);
          this._updateHoverRange(new Date(l, d - 1, u));
        }
      });
    });
    const s = this._popover.querySelector(".range-calendars-wrapper");
    s && s.addEventListener("mouseleave", () => {
      this._selectingEnd && this._startDate && this._resetHoverToStart();
    });
    const a = this._popover.querySelector(".range-btn-apply");
    a && a.addEventListener("click", (o) => {
      o.stopPropagation(), this._startDate && this._endDate && this.dispatchCustomEvent("change", {
        start: this._formatDate(this._startDate),
        end: this._formatDate(this._endDate),
        range: [this._startDate, this._endDate]
      }), this.close();
    });
    const r = this._popover.querySelector(".range-btn-clear");
    r && r.addEventListener("click", (o) => {
      var n;
      o.stopPropagation(), this._startDate = null, this._endDate = null, this._hoverDate = null, this._selectingEnd = !1, this._renderTrigger(), this._renderCalendars(), (n = this._persistState) == null || n.call(this), this.dispatchCustomEvent("change", { start: null, end: null, range: [] });
    });
  }
  _updateHoverRange(e) {
    if (!this._popover || !this._selectingEnd || !this._startDate) return;
    this._hoverDate = e;
    const i = this._normalizeDate(this._startDate), s = this._normalizeDate(e);
    if (!i || !s) return;
    const a = i.getTime(), r = s.getTime(), o = Math.min(a, r), n = Math.max(a, r);
    this._popover.querySelectorAll(".range-cell-btn[data-date]").forEach((p) => {
      const g = p.getAttribute("data-date");
      if (!g) return;
      const [b, v, m] = g.split("-").map(Number), _ = new Date(b, v - 1, m).getTime(), y = p.closest("td");
      p.removeAttribute("data-range"), y && (y.className = ""), a === r ? _ === a && (p.setAttribute("data-range", "start"), y && (y.className = "range-start range-end range-single")) : r > a ? _ === a ? (p.setAttribute("data-range", "start"), y && (y.className = "range-start")) : _ === r ? (p.setAttribute("data-range", "end"), y && (y.className = "range-end")) : _ > o && _ < n && (p.setAttribute("data-range", "in-range"), y && (y.className = "in-range")) : _ === r ? (p.setAttribute("data-range", "start"), y && (y.className = "range-start")) : _ === a ? (p.setAttribute("data-range", "end"), y && (y.className = "range-end")) : _ > o && _ < n && (p.setAttribute("data-range", "in-range"), y && (y.className = "in-range"));
    });
    const d = this._popover.querySelector(".range-summary-text span");
    if (d) {
      const p = new Date(o), g = new Date(n);
      d.textContent = `${this._formatDisplayDate(p)} → ${this._formatDisplayDate(g)}`;
    }
    const u = this._popover.querySelector(".range-duration-badge"), f = Math.round(Math.abs((n - o) / (1e3 * 60 * 60 * 24))) + 1;
    u && (u.textContent = `${f} day${f === 1 ? "" : "s"}`, u.style.display = "inline-flex");
  }
  _resetHoverToStart() {
    if (!this._popover || !this._startDate) return;
    this._hoverDate = null;
    const e = this._normalizeDate(this._startDate), i = e ? e.getTime() : null;
    this._popover.querySelectorAll(".range-cell-btn[data-date]").forEach((o) => {
      const n = o.getAttribute("data-date");
      if (!n) return;
      const [l, d, u] = n.split("-").map(Number), f = new Date(l, d - 1, u).getTime(), p = o.closest("td");
      o.removeAttribute("data-range"), p && (p.className = ""), i && f === i && (o.setAttribute("data-range", "start"), p && (p.className = "range-start range-single"));
    });
    const a = this._popover.querySelector(".range-summary-text span");
    a && (a.textContent = `${this._formatDisplayDate(this._startDate)} → Pick end date`);
    const r = this._popover.querySelector(".range-duration-badge");
    r && (r.style.display = "none");
  }
  _handleDateClick(e) {
    var i;
    if (!this._startDate || this._startDate && this._endDate)
      this._startDate = e, this._endDate = null, this._hoverDate = null, this._selectingEnd = !0, this._renderTrigger(), this._renderCalendars();
    else if (this._startDate && !this._endDate) {
      const s = this._normalizeDate(this._startDate);
      this._normalizeDate(e).getTime() < s.getTime() ? (this._endDate = this._startDate, this._startDate = e) : this._endDate = e, this._selectingEnd = !1, this._hoverDate = null, this._renderTrigger(), this._renderCalendars(), this.close(), (i = this._persistState) == null || i.call(this), this.dispatchCustomEvent("change", {
        start: this._formatDate(this._startDate),
        end: this._formatDate(this._endDate),
        range: [this._startDate, this._endDate]
      });
    }
  }
  _applyPreset(e) {
    var s;
    const i = /* @__PURE__ */ new Date();
    i.setHours(0, 0, 0, 0), e === "today" ? (this._startDate = new Date(i), this._endDate = new Date(i)) : e === "7d" ? (this._endDate = new Date(i), this._startDate = new Date(i.getTime() - 8640 * 60 * 1e3)) : e === "30d" ? (this._endDate = new Date(i), this._startDate = new Date(i.getTime() - 696 * 60 * 60 * 1e3)) : e === "month" && (this._startDate = new Date(i.getFullYear(), i.getMonth(), 1), this._endDate = new Date(i.getFullYear(), i.getMonth() + 1, 0)), this._selectingEnd = !1, this._viewYear = this._startDate.getFullYear(), this._viewMonth = this._startDate.getMonth(), this._renderTrigger(), this._renderCalendars(), this.close(), (s = this._persistState) == null || s.call(this), this.dispatchCustomEvent("change", {
      start: this._formatDate(this._startDate),
      end: this._formatDate(this._endDate),
      range: [this._startDate, this._endDate]
    });
  }
  attributeChangedCallback(e, i, s) {
    i !== s && (e === "start-date" ? (this._startDate = s ? new Date(s) : null, this._startDate && !isNaN(this._startDate.getTime()) && (this._viewYear = this._startDate.getFullYear(), this._viewMonth = this._startDate.getMonth()), this._renderTrigger(), this._renderCalendars()) : e === "end-date" ? (this._endDate = s ? new Date(s) : null, this._renderTrigger(), this._renderCalendars()) : e === "open" ? s !== null && !this.isOpen ? this.open() : s === null && this.isOpen && this.close() : e === "disabled" && this._trigger && (this.hasAttribute("disabled") ? this._trigger.setAttribute("disabled", "") : this._trigger.removeAttribute("disabled")));
  }
  disconnectedCallback() {
    super.disconnectedCallback(), typeof window < "u" && (window.removeEventListener("scroll", this._reposition, { capture: !0 }), window.removeEventListener("resize", this._reposition));
  }
}
typeof customElements < "u" && (customElements.get("ui-date-range-picker") || customElements.define("ui-date-range-picker", P), customElements.get("nnui-date-range-picker") || customElements.define("nnui-date-range-picker", class extends P {
}));
class N extends A {
  static get observedAttributes() {
    return ["placeholder", "max-tags", "disabled", "delimiter"];
  }
  constructor() {
    super(), this._tags = [];
  }
  get tags() {
    return [...this._tags];
  }
  set tags(t) {
    Array.isArray(t) && (this._tags = [...t], this._render());
  }
  get maxTags() {
    const t = parseInt(this.getAttribute("max-tags"), 10);
    return isNaN(t) ? 1 / 0 : t;
  }
  init() {
    this.setAttributeSafe(this, "data-ui", "tags-input"), this.setAttributeSafe(this, "role", "group");
    const t = this.getAttribute("value") || this.getAttribute("tags");
    if (t)
      this._tags = t.split(",").map((e) => e.trim()).filter(Boolean);
    else {
      const e = this.querySelectorAll('[data-part="tag"]');
      e.length > 0 && (this._tags = Array.from(e).map((i) => i.getAttribute("data-value") || i.textContent.replace("×", "").trim()));
    }
    this._setupElements(), this._render();
  }
  _setupElements() {
    this.innerHTML = "", this.className = "ui-tags-input-container", this._chipsWrapper = document.createElement("div"), this._chipsWrapper.className = "ui-tags-chips-wrapper", this.appendChild(this._chipsWrapper), this._input = document.createElement("input"), this._input.type = "text", this._input.setAttribute("data-part", "input"), this._input.className = "ui-tags-input-field", this._input.placeholder = this.getAttribute("placeholder") || "Add tag...", this.hasAttribute("disabled") && (this._input.disabled = !0), this.appendChild(this._input), this._input.addEventListener("keydown", (t) => {
      const e = this._input.value.trim();
      if (t.key === "Enter" || t.key === ",")
        t.preventDefault(), e && (this.addTag(e), this._input.value = "");
      else if (t.key === "Backspace" && !this._input.value && this._tags.length > 0) {
        t.preventDefault();
        const i = this._tags[this._tags.length - 1];
        this.removeTag(i);
      }
    }), this.addEventListener("click", (t) => {
      t.target !== this._input && !t.target.closest('[data-part="remove-tag"]') && this._input.focus();
    });
  }
  _render() {
    this._chipsWrapper && (this._chipsWrapper.innerHTML = "", this._tags.forEach((t, e) => {
      const i = document.createElement("span");
      i.setAttribute("data-part", "tag"), i.setAttribute("data-value", t), i.className = "ui-tag-badge";
      const s = document.createElement("span");
      s.textContent = t, i.appendChild(s);
      const a = document.createElement("button");
      a.type = "button", a.setAttribute("data-part", "remove-tag"), a.setAttribute("aria-label", `Remove ${t}`), a.className = "ui-tag-remove-btn", a.textContent = "×", a.addEventListener("click", (r) => {
        r.stopPropagation(), this.removeTag(t), this._input.focus();
      }), i.appendChild(a), this._chipsWrapper.appendChild(i);
    }), this._tags.length >= this.maxTags ? this._input.style.display = "none" : this._input.style.display = "inline-block");
  }
  addTag(t) {
    const e = t.trim().replace(/^,+|,+$/g, "");
    if (!e) return !1;
    if (this._tags.some((i) => i.toLowerCase() === e.toLowerCase())) {
      const i = this._chipsWrapper.querySelector(`[data-value="${e}"]`);
      return i && (i.style.outline = "2px solid var(--ui-color-warning-500)", setTimeout(() => i.style.outline = "none", 600)), !1;
    }
    return this._tags.length >= this.maxTags ? !1 : (this._tags.push(e), this._render(), this.dispatchCustomEvent("change", {
      tags: [...this._tags],
      added: e
    }), !0);
  }
  removeTag(t) {
    const e = this._tags.length;
    return this._tags = this._tags.filter((i) => i !== t), this._tags.length !== e ? (this._render(), this.dispatchCustomEvent("change", {
      tags: [...this._tags],
      removed: t
    }), !0) : !1;
  }
  clear() {
    this._tags = [], this._render(), this.dispatchCustomEvent("change", { tags: [] });
  }
}
typeof customElements < "u" && (customElements.get("ui-tags-input") || customElements.define("ui-tags-input", N), customElements.get("nnui-tags-input") || customElements.define("nnui-tags-input", class extends N {
}));
class _t extends A {
  static get observedAttributes() {
    return ["value", "name", "disabled", "size"];
  }
  get value() {
    return this.getAttribute("value") || "";
  }
  set value(t) {
    this.setAttributeSafe("value", t), this._syncState();
  }
  get name() {
    return this.getAttribute("name") || "";
  }
  set name(t) {
    this.setAttributeSafe("name", t);
  }
  get disabled() {
    return this.hasAttribute("disabled");
  }
  set disabled(t) {
    t ? this.setAttributeSafe("disabled", "") : this.removeAttributeSafe("disabled"), this._syncState();
  }
  init() {
    if (this.setAttributeSafe("data-ui", "segmented-control"), this.setAttributeSafe("role", "radiogroup"), this._setupStructure(), this._syncState(), this._bindEvents(), typeof ResizeObserver < "u") {
      const t = new ResizeObserver(() => this._updateIndicator());
      t.observe(this), this._cleanups.push(() => t.disconnect());
    }
  }
  attributeChangedCallback(t, e, i) {
    e === i || !this._initialized || (t === "value" || t === "disabled") && this._syncState();
  }
  _getSegments() {
    return Array.from(this.querySelectorAll('[data-part="segment"], [role="radio"]'));
  }
  _setupStructure() {
    const t = this._getSegments();
    if (t.length !== 0) {
      if (this.name && !this.querySelector('input[type="hidden"]')) {
        const e = document.createElement("input");
        e.type = "hidden", e.name = this.name, e.value = this.value, this.appendChild(e), this._hiddenInput = e;
      } else
        this._hiddenInput = this.querySelector('input[type="hidden"]');
      if (!this.querySelector('[data-part="indicator"]')) {
        const e = document.createElement("div");
        e.setAttribute("data-part", "indicator"), e.className = "ui-segment-indicator", e.setAttribute("aria-hidden", "true"), this.prepend(e);
      }
      t.forEach((e, i) => {
        const s = e.getAttribute("data-value") || `opt-${i}`;
        e.setAttribute("data-value", s), e.setAttribute("role", "radio");
      }), !this.value && t.length > 0 && (this.value = t[0].getAttribute("data-value"));
    }
  }
  _syncState() {
    const t = this._getSegments(), e = this.value, i = this.disabled;
    let s = null;
    t.forEach((a) => {
      const r = a.getAttribute("data-value") === e, o = i || a.hasAttribute("disabled");
      this.setAttributeSafe(a, "aria-checked", r ? "true" : "false"), this.setAttributeSafe(a, "data-state", r ? "checked" : "unchecked"), this.setAttributeSafe(a, "tabindex", r && !o ? "0" : "-1"), o ? this.setAttributeSafe(a, "aria-disabled", "true") : this.removeAttributeSafe(a, "aria-disabled"), r && (s = a);
    }), this._hiddenInput && (this._hiddenInput.value = e), this._updateIndicator(s);
  }
  _updateIndicator(t = null) {
    const e = this.querySelector('[data-part="indicator"]');
    if (e) {
      if (t || (t = this.querySelector('[data-part="segment"][data-state="checked"]')), !t || t.offsetWidth === 0) {
        e.style.opacity = "0";
        return;
      }
      e.style.opacity = "1", e.style.width = `${t.offsetWidth}px`, e.style.height = `${t.offsetHeight}px`, e.style.transform = `translate3d(${t.offsetLeft}px, ${t.offsetTop}px, 0)`;
    }
  }
  _bindEvents() {
    this.listen(this, "click", (t) => {
      const e = t.target.closest('[data-part="segment"], [role="radio"]');
      if (!e || this.disabled || e.hasAttribute("disabled") || e.getAttribute("aria-disabled") === "true") return;
      const i = e.getAttribute("data-value");
      i && i !== this.value && this.select(i);
    }), this.listen(this, "keydown", (t) => {
      if (this.disabled) return;
      const e = this._getSegments().filter((a) => !a.hasAttribute("disabled") && a.getAttribute("aria-disabled") !== "true");
      if (e.length === 0) return;
      const i = e.findIndex((a) => a.getAttribute("data-value") === this.value);
      let s = -1;
      switch (t.key) {
        case c.ARROW_RIGHT:
        case c.ARROW_DOWN:
          t.preventDefault(), s = S(i, e.length, 1, !0);
          break;
        case c.ARROW_LEFT:
        case c.ARROW_UP:
          t.preventDefault(), s = S(i, e.length, -1, !0);
          break;
        case c.HOME:
          t.preventDefault(), s = 0;
          break;
        case c.END:
          t.preventDefault(), s = e.length - 1;
          break;
        case c.SPACE:
        case c.ENTER: {
          const a = t.target.closest('[data-part="segment"]');
          a && !a.hasAttribute("disabled") && (t.preventDefault(), this.select(a.getAttribute("data-value")));
          return;
        }
      }
      if (s !== -1 && s !== i) {
        const a = e[s], r = a.getAttribute("data-value");
        this.select(r), a.focus();
      }
    });
  }
  select(t) {
    const e = this.value;
    e !== t && (this.value = t, this.dispatch("change", { value: t, previousValue: e }));
  }
}
class bt extends A {
  static get observedAttributes() {
    return ["length", "value", "disabled", "type", "mask"];
  }
  get length() {
    const t = parseInt(this.getAttribute("length"), 10);
    return isNaN(t) || t <= 0 ? 6 : t;
  }
  get value() {
    return this._getSlots().map((e) => e.value || "").join("");
  }
  set value(t) {
    const e = String(t || "");
    this._getSlots().forEach((s, a) => {
      s.value = e[a] || "";
    }), this._syncState();
  }
  get isComplete() {
    return this.value.length === this.length;
  }
  get disabled() {
    return this.hasAttribute("disabled");
  }
  set disabled(t) {
    t ? this.setAttributeSafe("disabled", "") : this.removeAttributeSafe("disabled"), this._syncState();
  }
  init() {
    this.setAttributeSafe("data-ui", "otp-input"), this.setAttributeSafe("role", "group"), this.setAttributeSafe("aria-label", this.getAttribute("aria-label") || "One-Time Password Input"), this._setupSlots(), this._syncState(), this._bindEvents();
  }
  attributeChangedCallback(t, e, i) {
    e === i || !this._initialized || (t === "value" ? this.value = i : t === "disabled" && this._syncState());
  }
  _getSlots() {
    return Array.from(this.querySelectorAll('[data-part="slot"], input[data-slot]'));
  }
  _setupSlots() {
    let t = this._getSlots();
    if (t.length === 0) {
      const i = this.querySelector('[data-part="container"]') || this, s = this.length;
      for (let a = 0; a < s; a++) {
        const r = document.createElement("input");
        r.setAttribute("data-part", "slot"), r.setAttribute("data-index", String(a)), r.type = this.getAttribute("type") === "password" || this.hasAttribute("mask") ? "password" : "text", r.inputMode = this.getAttribute("type") === "text" ? "text" : "numeric", r.pattern = "[0-9]*", r.maxLength = 1, r.autocomplete = a === 0 ? "one-time-code" : "off", r.className = "ui-otp-slot", i.appendChild(r);
      }
      t = this._getSlots();
    } else
      t.forEach((i, s) => {
        i.setAttribute("data-index", String(s)), i.maxLength = 1, i.inputMode || (i.inputMode = "numeric"), s === 0 && !i.autocomplete && (i.autocomplete = "one-time-code");
      });
    const e = this.getAttribute("value");
    e && (this.value = e);
  }
  _syncState() {
    const t = this._getSlots(), e = this.disabled;
    t.forEach((i) => {
      i.disabled = e, this.setAttributeSafe(i, "data-filled", i.value ? "true" : "false");
    });
  }
  _bindEvents() {
    const t = this._getSlots();
    t.forEach((e, i) => {
      this.listen(e, "input", (s) => {
        const a = e.value;
        if (a.length > 1) {
          this._distributeValue(a, i);
          return;
        }
        this.setAttributeSafe(e, "data-filled", a ? "true" : "false"), a && i < t.length - 1 && (t[i + 1].focus(), t[i + 1].select()), this._emitChange();
      }), this.listen(e, "keydown", (s) => {
        this.disabled || (s.key === c.BACKSPACE ? !e.value && i > 0 ? (s.preventDefault(), t[i - 1].value = "", this.setAttributeSafe(t[i - 1], "data-filled", "false"), t[i - 1].focus(), this._emitChange()) : (this.setAttributeSafe(e, "data-filled", "false"), setTimeout(() => this._emitChange(), 0)) : s.key === c.ARROW_LEFT && i > 0 ? (s.preventDefault(), t[i - 1].focus(), t[i - 1].select()) : s.key === c.ARROW_RIGHT && i < t.length - 1 && (s.preventDefault(), t[i + 1].focus(), t[i + 1].select()));
      }), this.listen(e, "paste", (s) => {
        s.preventDefault();
        const a = s.clipboardData || window.clipboardData;
        if (!a) return;
        const r = a.getData("text").trim();
        this._distributeValue(r, i);
      }), this.listen(e, "focus", () => {
        e.select();
      });
    });
  }
  _distributeValue(t, e = 0) {
    const i = this._getSlots(), s = t.split("");
    let a = e;
    s.forEach((o, n) => {
      const l = i[e + n];
      l && (l.value = o, this.setAttributeSafe(l, "data-filled", "true"), a = e + n);
    });
    const r = Math.min(a + 1, i.length - 1);
    i[r].focus(), this._emitChange();
  }
  _emitChange() {
    const t = this.value, e = this.isComplete;
    this.dispatch("input", { value: t, isComplete: e }), e && this.dispatch("change", { value: t, isComplete: !0 });
  }
  clear() {
    const t = this._getSlots();
    t.forEach((e) => {
      e.value = "", this.setAttributeSafe(e, "data-filled", "false");
    }), t.length > 0 && t[0].focus(), this._emitChange();
  }
}
class mt extends A {
  static get observedAttributes() {
    return ["active-step", "linear", "orientation", "persist", "sync"];
  }
  get activeStep() {
    const t = parseInt(this.getAttribute("active-step"), 10);
    return isNaN(t) ? 1 : t;
  }
  set activeStep(t) {
    this.setAttributeSafe("active-step", String(t)), this._syncState();
  }
  get linear() {
    return this.hasAttribute("linear") && this.getAttribute("linear") !== "false";
  }
  set linear(t) {
    t ? this.setAttributeSafe("linear", "") : this.removeAttributeSafe("linear");
  }
  get orientation() {
    return this.getAttribute("orientation") || "horizontal";
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
    if (this.setAttributeSafe("data-ui", "stepper"), this.setAttributeSafe("data-orientation", this.orientation), this._setupStructure(), this._syncState(), this._bindEvents(), this.hasAttribute("persist") || this.hasAttribute("sync")) {
      const t = q(this, {
        keys: ["step"],
        getState: () => ({
          step: this.activeStep
        }),
        setState: (e) => {
          e.step !== void 0 && (this.activeStep = Number(e.step));
        }
      });
      this._cleanups.push(t);
    }
  }
  attributeChangedCallback(t, e, i) {
    e === i || !this._initialized || (t === "active-step" ? this._syncState() : t === "orientation" && this.setAttributeSafe("data-orientation", i));
  }
  _getSteps() {
    return Array.from(this.querySelectorAll('[data-part="step"]'));
  }
  _getPanels() {
    return Array.from(this.querySelectorAll('[data-part="panel"]'));
  }
  _setupStructure() {
    const t = this._getSteps(), e = this.querySelector('[data-part="steplist"]');
    e && e.setAttribute("role", "list"), t.forEach((i, s) => {
      const a = parseInt(i.getAttribute("data-step"), 10) || s + 1;
      i.setAttribute("data-step", String(a));
      const r = i.querySelector('[data-part="trigger"]') || i;
      (r.tagName.toLowerCase() === "button" || i === r) && !r.hasAttribute("type") && r.tagName.toLowerCase() === "button" && r.setAttribute("type", "button");
    }), !this.getAttribute("active-step") && t.length > 0 && this.setAttributeSafe("active-step", "1");
  }
  _syncState() {
    const t = this._getSteps(), e = this._getPanels(), i = this.activeStep, s = this.linear;
    t.forEach((a) => {
      const r = parseInt(a.getAttribute("data-step"), 10), o = r === i, n = r < i, l = r > i;
      let d = "upcoming";
      o ? d = "current" : n && (d = "completed"), this.setAttributeSafe(a, "data-state", d), o ? this.setAttributeSafe(a, "aria-current", "step") : this.removeAttributeSafe(a, "aria-current");
      const u = a.querySelector('[data-part="indicator"]');
      if (u)
        if (this.setAttributeSafe(u, "data-state", d), n)
          u.setAttribute("data-completed", "true"), u.hasAttribute("data-step-num") || u.setAttribute("data-step-num", u.textContent.trim() || String(r)), u.textContent = "✓";
        else {
          u.removeAttribute("data-completed");
          const p = u.getAttribute("data-step-num");
          p && (u.textContent = p);
        }
      const f = a.querySelector('[data-part="trigger"]') || a;
      s && l ? (this.setAttributeSafe(f, "disabled", ""), this.setAttributeSafe(f, "aria-disabled", "true")) : (this.removeAttributeSafe(f, "disabled"), this.removeAttributeSafe(f, "aria-disabled"));
    }), e.forEach((a) => {
      const o = parseInt(a.getAttribute("data-step"), 10) === i;
      this.setAttributeSafe(a, "data-state", o ? "active" : "inactive"), o ? (a.removeAttribute("hidden"), this.setAttributeSafe(a, "aria-hidden", "false")) : (a.setAttribute("hidden", ""), this.setAttributeSafe(a, "aria-hidden", "true"));
    });
  }
  _bindEvents() {
    this.listen(this, "click", (t) => {
      const e = t.target.closest('[data-part="step"]');
      if (!e) return;
      const i = t.target.closest('[data-part="trigger"]') || e;
      if (i.hasAttribute("disabled") || i.getAttribute("aria-disabled") === "true") return;
      const s = parseInt(e.getAttribute("data-step"), 10);
      if (!isNaN(s) && s !== this.activeStep) {
        if (this.linear && s > this.activeStep + 1) return;
        this.goToStep(s);
      }
    });
  }
  goToStep(t) {
    var a;
    const e = this._getSteps().length, i = Math.max(1, Math.min(t, e || t)), s = this.activeStep;
    i !== s && (this.activeStep = i, (a = this._persistState) == null || a.call(this), this.dispatch("change", { step: i, previousStep: s }));
  }
  next() {
    this.goToStep(this.activeStep + 1);
  }
  prev() {
    this.goToStep(this.activeStep - 1);
  }
}
class vt extends A {
  static get observedAttributes() {
    return ["orientation", "disabled"];
  }
  get orientation() {
    return this.getAttribute("orientation") || "horizontal";
  }
  set orientation(t) {
    this.setAttributeSafe("orientation", t), this._syncOrientation();
  }
  get disabled() {
    return this.hasAttribute("disabled");
  }
  set disabled(t) {
    t ? this.setAttributeSafe("disabled", "") : this.removeAttributeSafe("disabled");
  }
  init() {
    this.setAttributeSafe("data-ui", "resizable"), this._syncOrientation(), this._panels = Array.from(this.querySelectorAll('[data-part="panel"]')), this._handles = Array.from(this.querySelectorAll('[data-part="handle"], [role="separator"]')), this._initPanels(), this._bindEvents();
  }
  attributeChangedCallback(t, e, i) {
    e === i || !this._initialized || t === "orientation" && this._syncOrientation();
  }
  _syncOrientation() {
    this.setAttributeSafe("data-orientation", this.orientation);
    const t = this.orientation === "vertical";
    this.style.display = "flex", this.style.flexDirection = t ? "column" : "row", this.style.width = "100%", this.style.height = t ? "100%" : "auto";
  }
  _initPanels() {
    if (this._panels.length < 2) return;
    let t = 0;
    const e = this._panels.map((i) => {
      const s = parseFloat(i.getAttribute("data-size") || i.getAttribute("data-default-size"));
      return isNaN(s) ? 0 : s;
    });
    if (t = e.reduce((i, s) => i + s, 0), t === 0) {
      const i = 100 / this._panels.length;
      this._sizes = this._panels.map(() => i);
    } else
      this._sizes = e.map((i) => i / t * 100);
    this._applySizes(), this._handles.forEach((i, s) => {
      i.setAttribute("role", "separator"), i.setAttribute("tabindex", this.disabled ? "-1" : "0"), i.setAttribute("aria-orientation", this.orientation), i.setAttribute("aria-valuenow", Math.round(this._sizes[s] || 50)), i.setAttribute("aria-valuemin", "10"), i.setAttribute("aria-valuemax", "90");
    });
  }
  _applySizes() {
    this._panels.forEach((t, e) => {
      const i = this._sizes[e] || 50;
      t.style.flex = `${i} 1 0px`, t.setAttribute("data-size", i.toFixed(2));
    });
  }
  _bindEvents() {
    this._handles.forEach((t, e) => {
      let i = !1, s = 0, a = [];
      const r = (o) => {
        var d;
        if (this.disabled || o.button !== 0) return;
        o.preventDefault(), i = !0, (d = t.setPointerCapture) == null || d.call(t, o.pointerId), t.setAttribute("data-dragging", "true"), document.body.style.userSelect = "none", s = this.orientation === "vertical" ? o.clientY : o.clientX, a = [...this._sizes];
        const n = (u) => {
          if (!i) return;
          const p = (this.orientation === "vertical" ? u.clientY : u.clientX) - s, g = this.getBoundingClientRect(), b = this.orientation === "vertical" ? g.height : g.width;
          if (b <= 0) return;
          const v = p / b * 100;
          this._adjustSizes(e, v, a);
        }, l = (u) => {
          var f;
          i && (i = !1, (f = t.releasePointerCapture) == null || f.call(t, u.pointerId), t.removeAttribute("data-dragging"), document.body.style.userSelect = "", window.removeEventListener("pointermove", n), window.removeEventListener("pointerup", l), window.removeEventListener("pointercancel", l));
        };
        window.addEventListener("pointermove", n), window.addEventListener("pointerup", l), window.addEventListener("pointercancel", l);
      };
      this.listen(t, "pointerdown", r), this.listen(t, "keydown", (o) => {
        if (this.disabled) return;
        const n = o.shiftKey ? 5 : 1;
        let l = 0;
        this.orientation === "horizontal" ? o.key === c.ARROW_LEFT ? l = -n : o.key === c.ARROW_RIGHT && (l = n) : o.key === c.ARROW_UP ? l = -n : o.key === c.ARROW_DOWN && (l = n), l !== 0 && (o.preventDefault(), this._adjustSizes(e, l, this._sizes));
      });
    });
  }
  _adjustSizes(t, e, i) {
    if (!i || i.length < 2) return;
    const s = t, a = t + 1;
    if (a >= i.length) return;
    const r = 10, o = 90;
    let n = i[s] + e, l = i[a] - e;
    n < r ? (l -= r - n, n = r) : n > o && (l += n - o, n = o), l < r && (n -= r - l, l = r), this._sizes[s] = n, this._sizes[a] = l, this._applySizes();
    const d = this._handles[t];
    d && d.setAttribute("aria-valuenow", Math.round(n)), this.dispatch("resize", { sizes: [...this._sizes] });
  }
  getSizes() {
    return [...this._sizes || []];
  }
}
class yt extends A {
  static get observedAttributes() {
    return ["accept", "multiple", "max-size", "disabled"];
  }
  constructor() {
    super(), this._files = [];
  }
  get files() {
    return [...this._files];
  }
  get accept() {
    return this.getAttribute("accept") || "";
  }
  get multiple() {
    return this.hasAttribute("multiple");
  }
  get maxSize() {
    const t = parseInt(this.getAttribute("max-size"), 10);
    return isNaN(t) ? 1 / 0 : t;
  }
  get disabled() {
    return this.hasAttribute("disabled");
  }
  set disabled(t) {
    t ? this.setAttributeSafe("disabled", "") : this.removeAttributeSafe("disabled");
  }
  init() {
    this.setAttributeSafe("data-ui", "file-upload"), this._setupNativeInput(), this._bindEvents();
  }
  _setupNativeInput() {
    let t = this.querySelector('input[type="file"]');
    t || (t = document.createElement("input"), t.type = "file", t.setAttribute("data-part", "native-input"), t.style.display = "none", this.appendChild(t)), this.accept && (t.accept = this.accept), this.multiple && (t.multiple = !0), this.disabled && (t.disabled = !0), this._nativeInput = t;
  }
  _bindEvents() {
    const t = this.querySelector('[data-part="dropzone"]') || this, e = this.querySelector('[data-part="trigger"]') || t;
    this.listen(e, "click", (s) => {
      var a;
      this.disabled || s.target !== this._nativeInput && !s.target.closest('[data-part="remove-file"]') && ((a = this._nativeInput) == null || a.click());
    }), this._nativeInput && this.listen(this._nativeInput, "change", () => {
      this._nativeInput.files && this._nativeInput.files.length > 0 && this._handleSelectedFiles(Array.from(this._nativeInput.files));
    });
    let i = 0;
    this.listen(t, "dragenter", (s) => {
      this.disabled || (s.preventDefault(), s.stopPropagation(), i++, this.setAttributeSafe(t, "data-dragging", "true"));
    }), this.listen(t, "dragover", (s) => {
      this.disabled || (s.preventDefault(), s.stopPropagation());
    }), this.listen(t, "dragleave", (s) => {
      this.disabled || (s.preventDefault(), s.stopPropagation(), i--, i <= 0 && (i = 0, this.removeAttributeSafe(t, "data-dragging")));
    }), this.listen(t, "drop", (s) => {
      this.disabled || (s.preventDefault(), s.stopPropagation(), i = 0, this.removeAttributeSafe(t, "data-dragging"), s.dataTransfer && s.dataTransfer.files.length > 0 && this._handleSelectedFiles(Array.from(s.dataTransfer.files)));
    }), this.listen(this, "paste", (s) => {
      var o;
      if (this.disabled) return;
      const a = (o = s.clipboardData) == null ? void 0 : o.items;
      if (!a) return;
      const r = [];
      for (let n = 0; n < a.length; n++)
        if (a[n].kind === "file") {
          const l = a[n].getAsFile();
          l && r.push(l);
        }
      r.length > 0 && (s.preventDefault(), this._handleSelectedFiles(r));
    }), this.listen(this, "click", (s) => {
      const a = s.target.closest('[data-part="remove-file"]');
      if (!a) return;
      s.stopPropagation();
      const r = a.closest('[data-part="file-item"]'), o = r == null ? void 0 : r.getAttribute("data-filename");
      o && this.removeFile(o);
    });
  }
  _handleSelectedFiles(t) {
    const e = [], i = [], s = this.maxSize, a = this.accept ? this.accept.split(",").map((r) => r.trim().toLowerCase()) : [];
    t.forEach((r) => {
      if (r.size > s) {
        i.push({ file: r, reason: "size" });
        return;
      }
      if (a.length > 0) {
        const o = `.${r.name.split(".").pop().toLowerCase()}`;
        if (!a.some((l) => {
          if (l.startsWith(".")) return o === l;
          if (l.endsWith("/*")) {
            const d = l.replace("/*", "");
            return r.type.startsWith(d);
          }
          return r.type === l;
        })) {
          i.push({ file: r, reason: "type" });
          return;
        }
      }
      e.push(r);
    }), this.multiple ? this._files = [...this._files, ...e] : this._files = e.slice(0, 1), this._renderFileList(), this.dispatch("change", { files: [...this._files], rejectedFiles: i });
  }
  _renderFileList() {
    const t = this.querySelector('[data-part="file-list"]');
    t && (t.innerHTML = "", this._files.forEach((e) => {
      const i = document.createElement("li");
      i.setAttribute("data-part", "file-item"), i.setAttribute("data-filename", e.name), i.className = "ui-file-item";
      const s = document.createElement("div");
      s.className = "ui-file-info";
      const a = document.createElement("span");
      a.className = "ui-file-name", a.textContent = e.name;
      const r = document.createElement("span");
      r.className = "ui-file-size", r.textContent = this._formatBytes(e.size), s.appendChild(a), s.appendChild(r);
      const o = document.createElement("button");
      o.type = "button", o.setAttribute("data-part", "remove-file"), o.className = "ui-file-remove", o.setAttribute("aria-label", `Remove ${e.name}`), o.textContent = "✕", i.appendChild(s), i.appendChild(o), t.appendChild(i);
    }));
  }
  _formatBytes(t) {
    if (t === 0) return "0 B";
    const e = 1024, i = ["B", "KB", "MB", "GB"], s = Math.floor(Math.log(t) / Math.log(e));
    return `${(t / Math.pow(e, s)).toFixed(1)} ${i[s]}`;
  }
  removeFile(t) {
    this._files = this._files.filter((e) => e.name !== t), this._renderFileList(), this.dispatch("change", { files: [...this._files] });
  }
  clear() {
    this._files = [], this._nativeInput && (this._nativeInput.value = ""), this._renderFileList(), this.dispatch("change", { files: [] });
  }
}
class At extends A {
  static get observedAttributes() {
    return ["disabled"];
  }
  get disabled() {
    return this.hasAttribute("disabled");
  }
  set disabled(t) {
    t ? this.setAttributeSafe("disabled", "") : this.removeAttributeSafe("disabled");
  }
  get isOpen() {
    var e;
    const t = this.querySelector('[data-part="menu"]');
    return t ? ((e = t.matches) == null ? void 0 : e.call(t, ":popover-open")) || t.getAttribute("data-state") === "open" : !1;
  }
  init() {
    this.setAttributeSafe("data-ui", "context-menu"), this._menu = this.querySelector('[data-part="menu"]'), this._area = this.querySelector('[data-part="area"]') || this, this._menu && (this._menu.hasAttribute("popover") || this._menu.setAttribute("popover", "auto"), this._menu.setAttribute("role", "menu"), this.setAttributeSafe(this._menu, "data-state", "closed")), this._bindEvents();
  }
  _getItems() {
    return this._menu ? Array.from(this._menu.querySelectorAll('[data-part="item"], [role="menuitem"], button')) : [];
  }
  _bindEvents() {
    !this._area || !this._menu || (this.listen(this._area, "contextmenu", (t) => {
      this.disabled || (t.preventDefault(), this.openAt(t.clientX, t.clientY));
    }), this.listen(this._menu, "click", (t) => {
      const e = t.target.closest('[data-part="item"], [role="menuitem"]');
      if (e && !e.hasAttribute("disabled")) {
        const i = e.getAttribute("data-value") || e.textContent.trim();
        this.dispatch("select", { value: i, item: e }), this.close();
      }
    }), this.listen(this._menu, "keydown", (t) => {
      const e = this._getItems().filter((s) => !s.hasAttribute("disabled"));
      if (e.length === 0) return;
      const i = e.indexOf(document.activeElement);
      if (t.key === c.ARROW_DOWN) {
        t.preventDefault();
        const s = i < e.length - 1 ? i + 1 : 0;
        e[s].focus();
      } else if (t.key === c.ARROW_UP) {
        t.preventDefault();
        const s = i > 0 ? i - 1 : e.length - 1;
        e[s].focus();
      } else t.key === c.ESCAPE && (t.preventDefault(), this.close());
    }), this.listen(this._menu, "toggle", (t) => {
      const e = t.newState === "open";
      this.setAttributeSafe(this._menu, "data-state", e ? "open" : "closed"), e ? this.dispatch("open") : this.dispatch("close");
    }), this.listen(document, "pointerdown", (t) => {
      this.isOpen && (this._menu.contains(t.target) || this.close());
    }));
  }
  openAt(t, e) {
    if (!this._menu) return;
    if (this._menu.style.position = "fixed", this._menu.style.margin = "0", this._menu.style.inset = "unset", this._menu.style.zIndex = "9999", typeof this._menu.showPopover == "function")
      try {
        this._menu.showPopover();
      } catch {
        this._menu.setAttribute("data-state", "open"), this._menu.style.display = "block";
      }
    else
      this._menu.setAttribute("data-state", "open"), this._menu.style.display = "block";
    this.setAttributeSafe(this._menu, "data-state", "open");
    const i = this._menu.offsetWidth || 180, s = this._menu.offsetHeight || 150, a = window.innerWidth, r = window.innerHeight;
    let o = t, n = e;
    o + i > a && (o = Math.max(10, t - i)), n + s > r && (n = Math.max(10, e - s)), this._menu.style.left = `${o}px`, this._menu.style.top = `${n}px`;
    const l = this._getItems().filter((d) => !d.hasAttribute("disabled"));
    l.length > 0 && setTimeout(() => l[0].focus(), 10), this.dispatch("open", { x: o, y: n });
  }
  close() {
    if (this._menu) {
      if (typeof this._menu.hidePopover == "function")
        try {
          this._menu.hidePopover();
        } catch {
          this._menu.removeAttribute("data-state"), this._menu.style.display = "none";
        }
      else
        this._menu.removeAttribute("data-state"), this._menu.style.display = "none";
      this.setAttributeSafe(this._menu, "data-state", "closed"), this.dispatch("close");
    }
  }
}
class St extends A {
  static get observedAttributes() {
    return ["delay", "disabled"];
  }
  get delay() {
    const t = parseInt(this.getAttribute("delay"), 10);
    return isNaN(t) ? 150 : t;
  }
  get disabled() {
    return this.hasAttribute("disabled");
  }
  init() {
    this._initialized || (this.setAttributeSafe("data-ui", "navigation-menu"), this._nav = this.querySelector('[data-part="menubar"], [data-part="list"], nav') || this, this.setAttributeSafe(this._nav, "role", "menubar"), this._activeItem = null, this._hoverTimeout = null, this._setupStructure(), this._bindEvents());
  }
  _getItems() {
    return Array.from(this.querySelectorAll('[data-part="item"]'));
  }
  _getTriggers() {
    return Array.from(this.querySelectorAll('[data-part="trigger"]'));
  }
  _setupStructure() {
    this._getItems(), this._getTriggers().forEach((e, i) => {
      var a;
      e.setAttribute("role", "menuitem"), e.setAttribute("tabindex", i === 0 ? "0" : "-1"), e.setAttribute("aria-haspopup", "true"), e.setAttribute("aria-expanded", "false");
      const s = (a = e.closest('[data-part="item"]')) == null ? void 0 : a.querySelector('[data-part="content"]');
      s && (s.setAttribute("role", "menu"), s.removeAttribute("popover"), s.setAttribute("data-state", "closed"));
    });
  }
  _bindEvents() {
    this._getItems().forEach((e) => {
      const i = e.querySelector('[data-part="trigger"]'), s = e.querySelector('[data-part="content"]');
      !i || !s || (this.listen(i, "click", (a) => {
        if (this.disabled) return;
        a.preventDefault(), i.getAttribute("aria-expanded") === "true" ? this.closeItem(e) : this.openItem(e);
      }), this.listen(e, "mouseenter", () => {
        this.disabled || (clearTimeout(this._hoverTimeout), this._hoverTimeout = setTimeout(() => {
          this.openItem(e);
        }, this.delay));
      }), this.listen(e, "mouseleave", () => {
        this.disabled || (clearTimeout(this._hoverTimeout), this._hoverTimeout = setTimeout(() => {
          this.closeItem(e);
        }, this.delay + 50));
      }));
    }), this.listen(this, "keydown", (e) => {
      if (this.disabled) return;
      const i = this._getTriggers(), s = i.indexOf(document.activeElement);
      if (s !== -1) {
        if (e.key === c.ARROW_RIGHT) {
          e.preventDefault();
          const a = S(s, i.length, 1, !0);
          i[a].focus();
        } else if (e.key === c.ARROW_LEFT) {
          e.preventDefault();
          const a = S(s, i.length, -1, !0);
          i[a].focus();
        } else if (e.key === c.ARROW_DOWN) {
          e.preventDefault();
          const a = i[s].closest('[data-part="item"]');
          this.openItem(a);
          const r = a.querySelector('[data-part="content"] a, [data-part="content"] button');
          r == null || r.focus();
        }
      } else if (e.key === c.ESCAPE && this._activeItem) {
        e.preventDefault();
        const a = this._activeItem.querySelector('[data-part="trigger"]');
        this.closeItem(this._activeItem), a == null || a.focus();
      }
    }), this.listen(document, "pointerdown", (e) => {
      this.contains(e.target) || this.closeAll();
    });
  }
  openItem(t) {
    if (!t) return;
    this.closeAll();
    const e = t.querySelector('[data-part="trigger"]'), i = t.querySelector('[data-part="content"]');
    !e || !i || (e.setAttribute("aria-expanded", "true"), i.setAttribute("data-state", "open"), this._activeItem = t, this.dispatch("open", { item: t }));
  }
  closeItem(t) {
    if (!t) return;
    const e = t.querySelector('[data-part="trigger"]'), i = t.querySelector('[data-part="content"]');
    !e || !i || (e.setAttribute("aria-expanded", "false"), i.setAttribute("data-state", "closed"), this._activeItem === t && (this._activeItem = null), this.dispatch("close", { item: t }));
  }
  closeAll() {
    this._getItems().forEach((t) => this.closeItem(t));
  }
}
class wt extends A {
  static get observedAttributes() {
    return ["selection-mode", "disabled"];
  }
  get selectionMode() {
    return this.getAttribute("selection-mode") || "single";
  }
  get disabled() {
    return this.hasAttribute("disabled");
  }
  init() {
    this.setAttributeSafe("data-ui", "tree-view");
    const t = this.querySelector('[data-part="tree"], ul, ol') || this;
    this.setAttributeSafe(t, "role", "tree"), this._setupStructure(), this._bindEvents();
  }
  _getItems() {
    return Array.from(this.querySelectorAll('[data-part="item"], [role="treeitem"]'));
  }
  _getVisibleItems() {
    return this._getItems().filter((t) => {
      var i, s;
      let e = (i = t.parentElement) == null ? void 0 : i.closest('[data-part="item"], [role="treeitem"]');
      for (; e; ) {
        if (e.getAttribute("aria-expanded") === "false")
          return !1;
        e = (s = e.parentElement) == null ? void 0 : s.closest('[data-part="item"], [role="treeitem"]');
      }
      return !0;
    });
  }
  _setupStructure() {
    this._getItems().forEach((e, i) => {
      e.setAttribute("role", "treeitem"), e.setAttribute("tabindex", i === 0 ? "0" : "-1");
      const s = e.querySelector(':scope > [data-part="group"], :scope > ul, :scope > ol');
      s && (s.setAttribute("role", "group"), e.hasAttribute("aria-expanded") || e.setAttribute("aria-expanded", "false"), e.setAttribute("data-state", e.getAttribute("aria-expanded") === "true" ? "expanded" : "collapsed"));
    });
  }
  _bindEvents() {
    this.listen(this, "click", (t) => {
      if (this.disabled) return;
      const e = t.target.closest('[data-part="item"], [role="treeitem"]');
      if (!e) return;
      const i = t.target.closest('[data-part="toggle"]'), s = e.querySelector(':scope > [data-part="group"], :scope > ul, :scope > ol');
      i || s && t.target === e ? this.toggleItem(e) : this.selectItem(e);
    }), this.listen(this, "keydown", (t) => {
      var a, r;
      if (this.disabled) return;
      const e = this._getVisibleItems(), i = (a = document.activeElement) == null ? void 0 : a.closest('[data-part="item"], [role="treeitem"]');
      if (!i) return;
      const s = e.indexOf(i);
      switch (t.key) {
        case c.ARROW_DOWN: {
          t.preventDefault(), s < e.length - 1 && this._focusItem(e[s + 1]);
          break;
        }
        case c.ARROW_UP: {
          t.preventDefault(), s > 0 && this._focusItem(e[s - 1]);
          break;
        }
        case c.ARROW_RIGHT: {
          if (t.preventDefault(), i.querySelector(':scope > [data-part="group"], :scope > ul, :scope > ol'))
            if (i.getAttribute("aria-expanded") === "false")
              this.expandItem(i);
            else {
              const n = i.querySelector(':scope > [data-part="group"] > [data-part="item"], :scope > ul > [role="treeitem"]');
              n && this._focusItem(n);
            }
          break;
        }
        case c.ARROW_LEFT: {
          if (t.preventDefault(), i.querySelector(':scope > [data-part="group"], :scope > ul, :scope > ol') && i.getAttribute("aria-expanded") === "true")
            this.collapseItem(i);
          else {
            const n = (r = i.parentElement) == null ? void 0 : r.closest('[data-part="item"], [role="treeitem"]');
            n && this._focusItem(n);
          }
          break;
        }
        case c.HOME: {
          t.preventDefault(), e.length > 0 && this._focusItem(e[0]);
          break;
        }
        case c.END: {
          t.preventDefault(), e.length > 0 && this._focusItem(e[e.length - 1]);
          break;
        }
        case c.ENTER:
        case c.SPACE: {
          t.preventDefault(), i.querySelector(':scope > [data-part="group"], :scope > ul, :scope > ol') ? this.toggleItem(i) : this.selectItem(i);
          break;
        }
      }
    });
  }
  _focusItem(t) {
    this._getItems().forEach((e) => e.setAttribute("tabindex", "-1")), t.setAttribute("tabindex", "0"), t.focus();
  }
  toggleItem(t) {
    t.getAttribute("aria-expanded") === "true" ? this.collapseItem(t) : this.expandItem(t);
  }
  expandItem(t) {
    t.setAttribute("aria-expanded", "true"), t.setAttribute("data-state", "expanded");
    const e = t.querySelector(':scope > [data-part="group"], :scope > ul, :scope > ol');
    e && (e.style.display = "block"), this.dispatch("toggle", { item: t, expanded: !0 });
  }
  collapseItem(t) {
    t.setAttribute("aria-expanded", "false"), t.setAttribute("data-state", "collapsed");
    const e = t.querySelector(':scope > [data-part="group"], :scope > ul, :scope > ol');
    e && (e.style.display = "none"), this.dispatch("toggle", { item: t, expanded: !1 });
  }
  selectItem(t) {
    const e = t.getAttribute("aria-selected") === "true";
    this.selectionMode === "single" ? (this._getItems().forEach((s) => {
      s.removeAttribute("aria-selected"), s.removeAttribute("data-selected");
    }), t.setAttribute("aria-selected", "true"), t.setAttribute("data-selected", "true")) : (t.setAttribute("aria-selected", e ? "false" : "true"), t.setAttribute("data-selected", e ? "false" : "true"));
    const i = t.getAttribute("data-value") || t.textContent.trim();
    this.dispatch("select", { item: t, value: i, selected: !e });
  }
}
class xt extends A {
  static get observedAttributes() {
    return ["max-rows", "loading", "disabled", "placeholder", "persist", "sync"];
  }
  get maxRows() {
    const t = parseInt(this.getAttribute("max-rows"), 10);
    return isNaN(t) ? 6 : t;
  }
  get loading() {
    return this.hasAttribute("loading") && this.getAttribute("loading") !== "false";
  }
  set loading(t) {
    t ? this.setAttributeSafe("loading", "") : this.removeAttributeSafe("loading"), this._syncState();
  }
  get disabled() {
    return this.hasAttribute("disabled");
  }
  set disabled(t) {
    t ? this.setAttributeSafe("disabled", "") : this.removeAttributeSafe("disabled"), this._syncState();
  }
  get value() {
    var t;
    return ((t = this._textarea) == null ? void 0 : t.value) || "";
  }
  set value(t) {
    this._textarea && (this._textarea.value = t, this._autoResize());
  }
  getAiState() {
    return {
      value: this.value,
      loading: this.loading,
      disabled: this.disabled,
      maxRows: this.maxRows
    };
  }
  init() {
    if (this.setAttributeSafe("data-ui", "ai-prompt-box"), this._textarea = this.querySelector('textarea, [data-part="input"]'), this._textarea || (this._textarea = document.createElement("textarea"), this._textarea.setAttribute("data-part", "input"), this._textarea.placeholder = this.getAttribute("placeholder") || "Ask AI anything... (Shift+Enter for newline)", this.prepend(this._textarea)), this._textarea.rows = 1, this._textarea.style.resize = "none", this._textarea.style.overflowY = "hidden", this._syncState(), this._bindEvents(), this._autoResize(), this.hasAttribute("persist") || this.hasAttribute("sync")) {
      const t = q(this, {
        keys: ["draft"],
        getState: () => ({
          draft: this.value
        }),
        setState: (e) => {
          e.draft !== void 0 && e.draft !== this.value && (this.value = e.draft, this._autoResize(), this._syncState());
        }
      });
      this._cleanups.push(t);
    }
  }
  attributeChangedCallback(t, e, i) {
    e === i || !this._initialized || (t === "loading" || t === "disabled") && this._syncState();
  }
  _syncState() {
    const t = this.loading, e = this.disabled;
    this._textarea && (this._textarea.disabled = e);
    const i = this.querySelector('[data-part="submit-btn"]'), s = this.querySelector('[data-part="stop-btn"]');
    i && (i.style.display = t ? "none" : "inline-flex", i.disabled = e || !this.value.trim()), s && (s.style.display = t ? "inline-flex" : "none", s.disabled = e);
  }
  _autoResize() {
    if (!this._textarea) return;
    this._textarea.style.height = "auto";
    const t = window.getComputedStyle ? window.getComputedStyle(this._textarea) : null, e = t && parseFloat(t.lineHeight) || 20, i = e * this.maxRows;
    this._textarea.scrollHeight > i ? (this._textarea.style.height = `${i}px`, this._textarea.style.overflowY = "auto") : (this._textarea.style.height = `${Math.max(this._textarea.scrollHeight, e)}px`, this._textarea.style.overflowY = "hidden");
  }
  _bindEvents() {
    if (!this._textarea) return;
    this.listen(this._textarea, "input", () => {
      var i;
      this._autoResize(), this._syncState(), (i = this._persistState) == null || i.call(this), this.dispatch("input", { value: this.value });
    }), this.listen(this._textarea, "keydown", (i) => {
      i.key === "Enter" && !i.shiftKey && (i.preventDefault(), this.submit());
    });
    const t = this.querySelector('[data-part="submit-btn"]');
    t && this.listen(t, "click", (i) => {
      i.preventDefault(), this.submit();
    });
    const e = this.querySelector('[data-part="stop-btn"]');
    e && this.listen(e, "click", (i) => {
      i.preventDefault(), this.stop();
    });
  }
  submit() {
    var e;
    if (this.disabled || this.loading) return;
    const t = this.value.trim();
    t && (this.dispatch("submit", { prompt: t }), this.value = "", this._syncState(), (e = this._persistState) == null || e.call(this));
  }
  stop() {
    this.dispatch("stop"), this.loading = !1;
  }
  clear() {
    this.value = "", this._syncState();
  }
}
class Dt extends A {
  static get observedAttributes() {
    return ["value", "name", "format", "disabled"];
  }
  get value() {
    return this.getAttribute("value") || "#3b82f6";
  }
  set value(t) {
    this.setAttributeSafe("value", t), this._syncState();
  }
  get name() {
    return this.getAttribute("name") || "";
  }
  get disabled() {
    return this.hasAttribute("disabled");
  }
  set disabled(t) {
    t ? this.setAttributeSafe("disabled", "") : this.removeAttributeSafe("disabled"), this._syncState();
  }
  get isOpen() {
    const t = this.querySelector('[data-part="popover"]');
    return (t == null ? void 0 : t.getAttribute("data-state")) === "open";
  }
  init() {
    this.setAttributeSafe("data-ui", "color-picker"), this._setupStructure(), this._syncState(), this._bindEvents();
  }
  attributeChangedCallback(t, e, i) {
    e === i || !this._initialized || (t === "value" ? this._syncState() : t === "disabled" && this._syncState());
  }
  _setupStructure() {
    if (this.name && !this.querySelector('input[type="hidden"]')) {
      const e = document.createElement("input");
      e.type = "hidden", e.name = this.name, e.value = this.value, this.appendChild(e), this._hiddenInput = e;
    } else
      this._hiddenInput = this.querySelector('input[type="hidden"]');
    const t = this.querySelector('[data-part="popover"]');
    t && (t.removeAttribute("popover"), t.setAttribute("data-state", "closed"));
  }
  _syncState() {
    const t = this.value, e = this.querySelector('[data-part="swatch"]'), i = this.querySelector('[data-part="hex-input"], [data-part="input"]');
    this.querySelector('[data-part="popover"]'), e && (e.style.backgroundColor = t, e.setAttribute("aria-label", `Selected color: ${t}`)), i && i !== document.activeElement && (i.value = t), this._hiddenInput && (this._hiddenInput.value = t), this.disabled ? (e == null || e.setAttribute("disabled", ""), i == null || i.setAttribute("disabled", "")) : (e == null || e.removeAttribute("disabled"), i == null || i.removeAttribute("disabled"));
  }
  _bindEvents() {
    const t = this.querySelector('[data-part="swatch"]'), e = this.querySelector('[data-part="popover"]'), i = this.querySelector('[data-part="hex-input"], [data-part="input"]'), s = this.querySelector('[data-part="eyedropper-btn"]'), a = this.querySelector('[data-part="hue-slider"]');
    t && this.listen(t, "click", (r) => {
      this.disabled || (r.preventDefault(), this.toggle());
    }), i && (this.listen(i, "input", () => {
      let r = i.value.trim();
      !r.startsWith("#") && r.length === 6 && (r = `#${r}`), (/^#[0-9A-Fa-f]{6}$/.test(r) || /^#[0-9A-Fa-f]{3}$/.test(r)) && this.setValue(r);
    }), this.listen(i, "change", () => {
      this.dispatch("change", { value: this.value });
    })), s && (typeof window < "u" && "EyeDropper" in window ? this.listen(s, "click", async (r) => {
      r.preventDefault();
      try {
        const n = await new window.EyeDropper().open();
        n != null && n.sRGBHex && (this.setValue(n.sRGBHex), this.dispatch("change", { value: n.sRGBHex }));
      } catch {
      }
    }) : s.style.display = "none"), a && this.listen(a, "input", () => {
      const o = `hsl(${a.value}, 80%, 50%)`;
      this.setValue(o);
    }), this.listen(document, "pointerdown", (r) => {
      this.isOpen && !this.contains(r.target) && !(e != null && e.contains(r.target)) && this.close();
    });
  }
  setValue(t) {
    this.value !== t && (this.setAttributeSafe("value", t), this._syncState(), this.dispatch("input", { value: t }));
  }
  toggle() {
    this.isOpen ? this.close() : this.open();
  }
  open() {
    const t = this.querySelector('[data-part="popover"]');
    !t || this.disabled || (t.setAttribute("data-state", "open"), this.dispatch("open"));
  }
  close() {
    const t = this.querySelector('[data-part="popover"]');
    t && (t.setAttribute("data-state", "closed"), this.dispatch("close"));
  }
}
const Et = {
  "ui-tabs": Q,
  "ui-combobox": J,
  "ui-dialog": X,
  "ui-select": z,
  "ui-accordion": Z,
  "ui-popover": et,
  "ui-tooltip": it,
  "ui-command": st,
  "ui-sheet": at,
  "ui-slider": B,
  "ui-dropdown": rt,
  "ui-toaster": ot,
  "ui-data-table": ht,
  "ui-calendar": H,
  "ui-date-picker": W,
  "ui-data-grid": $,
  "ui-date-range-picker": P,
  "ui-tags-input": N,
  "ui-segmented-control": _t,
  "ui-otp-input": bt,
  "ui-stepper": mt,
  "ui-resizable": vt,
  "ui-file-upload": yt,
  "ui-context-menu": At,
  "ui-navigation-menu": St,
  "ui-tree-view": wt,
  "ui-ai-prompt-box": xt,
  "ui-color-picker": Dt
};
function kt(h = ["nnui", "ui"]) {
  if (typeof window > "u" || !window.customElements) return;
  const t = Array.isArray(h) ? h : [h], e = /* @__PURE__ */ new Set();
  t.forEach((i) => {
    Object.entries(Et).forEach(([s, a]) => {
      const r = `${i}-${s.replace(/^ui-/, "")}`;
      if (!customElements.get(r)) {
        const o = e.has(a) ? class extends a {
        } : a;
        e.add(a), customElements.define(r, o);
      }
    });
  });
}
typeof window < "u" && window.customElements && kt(["nnui", "ui"]);
export {
  A as BaseLightElement,
  c as Keys,
  Z as UiAccordion,
  xt as UiAiPromptBox,
  H as UiCalendar,
  Dt as UiColorPicker,
  J as UiCombobox,
  st as UiCommand,
  At as UiContextMenu,
  $ as UiDataGrid,
  ht as UiDataTable,
  W as UiDatePicker,
  P as UiDateRangePicker,
  X as UiDialog,
  rt as UiDropdown,
  yt as UiFileUpload,
  St as UiNavigationMenu,
  bt as UiOtpInput,
  et as UiPopover,
  vt as UiResizable,
  _t as UiSegmentedControl,
  z as UiSelect,
  at as UiSheet,
  B as UiSlider,
  mt as UiStepper,
  Q as UiTabs,
  N as UiTagsInput,
  ot as UiToaster,
  it as UiTooltip,
  wt as UiTreeView,
  R as applyPositionFallback,
  G as applyRovingTabindex,
  tt as attachAnchorFallback,
  q as attachPersistence,
  Et as elements,
  C as generateUniqueId,
  S as getNextIndex,
  Ot as isAnchorPositioningSupported,
  kt as register,
  E as toast
};
