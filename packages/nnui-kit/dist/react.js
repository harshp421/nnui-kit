"use client";
import T, { forwardRef as w, useRef as D, useImperativeHandle as P, useEffect as x } from "react";
import { register as O } from "./index.js";
import { toast as ae } from "./index.js";
typeof window < "u" && typeof window.customElements < "u" && O(["nnui", "ui"]);
function e(l, u, g = {}) {
  const c = w(function(d, h) {
    const a = D(null);
    P(h, () => a.current);
    const { children: C, className: i, style: m, ...f } = d, s = {}, r = {};
    return Object.entries(f).forEach(([n, t]) => {
      if (n.startsWith("on") && typeof t == "function") {
        const o = g[n] || n.slice(2).toLowerCase();
        r[o] = t;
      } else
        s[n] = t;
    }), x(() => {
      const n = a.current;
      if (!n) return;
      const t = Object.entries(r).map(([o, b]) => {
        const p = (S) => b(S);
        return n.addEventListener(o, p), () => n.removeEventListener(o, p);
      });
      return () => {
        t.forEach((o) => o());
      };
    }), T.createElement(
      l,
      {
        ref: a,
        class: i,
        className: i,
        style: m,
        ...s
      },
      C
    );
  });
  return c.displayName = u, c;
}
const R = e("ui-tabs", "Tabs", { onChange: "change" }), E = e("ui-combobox", "Combobox", { onChange: "change" }), k = e("ui-dialog", "Dialog", { onOpen: "open", onClose: "close" }), z = e("ui-select", "Select", { onChange: "change", onInput: "input" }), A = e("ui-accordion", "Accordion", { onChange: "change" }), M = e("ui-popover", "Popover", { onToggle: "toggle" }), L = e("ui-tooltip", "Tooltip"), N = e("ui-command", "Command", { onChange: "change", onSelect: "select", onOpen: "open", onClose: "close" }), U = e("ui-sheet", "Sheet", { onOpen: "open", onClose: "close" }), j = e("ui-slider", "Slider", { onChange: "change", onInput: "input" }), y = e("ui-dropdown", "Dropdown", { onSelect: "select", onOpen: "open", onClose: "close" }), B = e("ui-toaster", "Toaster"), F = e("ui-data-table", "DataTable"), G = e("ui-calendar", "Calendar", { onChange: "change" }), H = e("ui-date-picker", "DatePicker", { onChange: "change" }), V = e("ui-data-grid", "DataGrid", {
  onSelectionChange: "selection-change",
  onSort: "sort",
  onStreamUpdate: "stream-update"
}), W = e("ui-date-range-picker", "DateRangePicker", { onChange: "change" }), q = e("ui-tags-input", "TagsInput", { onChange: "change" }), J = e("ui-segmented-control", "SegmentedControl", { onChange: "change" }), K = e("ui-otp-input", "OtpInput", { onChange: "change", onInput: "input" }), Q = e("ui-stepper", "Stepper", { onChange: "change" }), X = e("ui-resizable", "Resizable", { onResize: "resize" }), Y = e("ui-file-upload", "FileUpload", { onChange: "change" }), Z = e("ui-context-menu", "ContextMenu", { onSelect: "select", onOpen: "open", onClose: "close" }), _ = e("ui-navigation-menu", "NavigationMenu", { onOpen: "open", onClose: "close" }), $ = e("ui-tree-view", "TreeView", { onSelect: "select", onToggle: "toggle" }), ee = e("ui-ai-prompt-box", "AiPromptBox", { onSubmit: "submit", onStop: "stop", onInput: "input" }), ne = e("ui-color-picker", "ColorPicker", { onChange: "change", onInput: "input", onOpen: "open", onClose: "close" });
export {
  A as Accordion,
  ee as AiPromptBox,
  G as Calendar,
  ne as ColorPicker,
  E as Combobox,
  N as Command,
  Z as ContextMenu,
  V as DataGrid,
  F as DataTable,
  H as DatePicker,
  W as DateRangePicker,
  k as Dialog,
  y as Dropdown,
  Y as FileUpload,
  _ as NavigationMenu,
  K as OtpInput,
  M as Popover,
  X as Resizable,
  J as SegmentedControl,
  z as Select,
  U as Sheet,
  j as Slider,
  Q as Stepper,
  R as Tabs,
  q as TagsInput,
  B as Toaster,
  L as Tooltip,
  $ as TreeView,
  e as createReactComponent,
  O as register,
  ae as toast
};
