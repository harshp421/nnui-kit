"use client";
import i, { forwardRef as y, useRef as J, useImperativeHandle as Q, useEffect as X } from "react";
import { register as Y } from "./index.js";
import { toast as se } from "./index.js";
typeof window < "u" && typeof window.customElements < "u" && Y(["nnui", "ui"]);
function t(d, a, r = {}) {
  const o = y(function(n, m) {
    const s = J(null);
    Q(m, () => s.current);
    const { children: h, className: v, style: S, ...U } = n, L = {}, z = {};
    return Object.entries(U).forEach(([u, C]) => {
      if (u.startsWith("on") && typeof C == "function") {
        const c = r[u] || u.slice(2).toLowerCase();
        z[c] = C;
      } else
        L[u] = C;
    }), X(() => {
      const u = s.current;
      if (!u) return;
      const C = Object.entries(z).map(([c, G]) => {
        const x = (f) => G(f);
        return u.addEventListener(c, x), () => u.removeEventListener(c, x);
      });
      return () => {
        C.forEach((c) => c());
      };
    }), i.createElement(
      d,
      {
        ref: s,
        class: v,
        className: v,
        style: S,
        ...L
      },
      h
    );
  });
  return o.displayName = a, o;
}
function e(d, a = "div", r = "") {
  const o = y(function(n, m) {
    const { as: s = a, className: h, children: v, ...S } = n;
    return i.createElement(
      s,
      {
        ref: m,
        "data-part": d,
        className: h,
        ...S
      },
      v
    );
  });
  return o.displayName = r || `Part(${d})`, o;
}
const p = t("ui-tabs", "Tabs", { onChange: "change" });
p.Root = p;
p.List = e("tablist", "div", "Tabs.List");
p.Tab = e("tab", "button", "Tabs.Tab");
p.Trigger = p.Tab;
p.Panel = e("tabpanel", "div", "Tabs.Panel");
p.Content = p.Panel;
const T = t("ui-combobox", "Combobox", { onChange: "change" });
T.Root = T;
T.Input = e("input", "input", "Combobox.Input");
T.List = e("listbox", "ul", "Combobox.List");
T.Item = e("option", "li", "Combobox.Item");
T.Option = T.Item;
const b = t("ui-dialog", "Dialog", { onOpen: "open", onClose: "close" });
b.Root = b;
b.Trigger = e("trigger", "button", "Dialog.Trigger");
b.Content = y(function({ as: a = "dialog", className: r, children: o, ...n }, m) {
  return i.createElement(a, { ref: m, "data-ui": "dialog", className: r, ...n }, o);
});
b.Content.displayName = "Dialog.Content";
b.Close = e("dialog-close", "button", "Dialog.Close");
b.Title = e("title", "h2", "Dialog.Title");
b.Description = e("description", "p", "Dialog.Description");
const l = t("ui-select", "Select", { onChange: "change", onInput: "input" });
l.Root = l;
l.Trigger = e("trigger", "button", "Select.Trigger");
l.Value = e("value", "span", "Select.Value");
l.List = e("listbox", "ul", "Select.List");
l.Content = l.List;
l.Item = e("option", "li", "Select.Item");
l.Option = l.Item;
const g = t("ui-accordion", "Accordion", { onChange: "change" });
g.Root = g;
g.Item = e("item", "div", "Accordion.Item");
g.Trigger = e("trigger", "button", "Accordion.Trigger");
g.Header = g.Trigger;
g.Content = e("content", "div", "Accordion.Content");
g.Panel = g.Content;
const E = t("ui-popover", "Popover", { onToggle: "toggle" });
E.Root = E;
E.Trigger = e("trigger", "button", "Popover.Trigger");
E.Content = e("popover", "div", "Popover.Content");
E.Close = e("close", "button", "Popover.Close");
const A = t("ui-tooltip", "Tooltip");
A.Root = A;
A.Trigger = e("trigger", "span", "Tooltip.Trigger");
A.Content = e("content", "div", "Tooltip.Content");
const R = t("ui-command", "Command", { onChange: "change", onSelect: "select", onOpen: "open", onClose: "close" });
R.Root = R;
R.Input = e("input", "input", "Command.Input");
R.List = e("list", "ul", "Command.List");
R.Group = e("group", "div", "Command.Group");
R.Item = e("item", "li", "Command.Item");
const N = t("ui-sheet", "Sheet", { onOpen: "open", onClose: "close" });
N.Root = N;
N.Trigger = e("trigger", "button", "Sheet.Trigger");
N.Content = e("content", "div", "Sheet.Content");
N.Close = e("close", "button", "Sheet.Close");
const D = t("ui-slider", "Slider", { onChange: "change", onInput: "input" });
D.Root = D;
D.Track = e("track", "div", "Slider.Track");
D.Range = e("range", "div", "Slider.Range");
D.Thumb = e("thumb", "div", "Slider.Thumb");
D.Value = e("value", "span", "Slider.Value");
const I = t("ui-dropdown", "Dropdown", { onSelect: "select", onOpen: "open", onClose: "close" });
I.Root = I;
I.Trigger = e("trigger", "button", "Dropdown.Trigger");
I.Menu = e("menu", "ul", "Dropdown.Menu");
I.Content = I.Menu;
I.Item = e("item", "li", "Dropdown.Item");
const oe = t("ui-toaster", "Toaster"), ie = t("ui-data-table", "DataTable"), ae = t("ui-calendar", "Calendar", { onChange: "change" }), F = t("ui-date-picker", "DatePicker", { onChange: "change" });
F.Root = F;
F.Trigger = e("trigger", "button", "DatePicker.Trigger");
const P = t("ui-data-grid", "DataGrid", {
  onSelectionChange: "selection-change",
  onSort: "sort",
  onStreamUpdate: "stream-update"
});
P.Root = P;
P.Viewport = e("viewport", "div", "DataGrid.Viewport");
P.Runway = e("runway", "div", "DataGrid.Runway");
P.Table = e("grid-table", "table", "DataGrid.Table");
P.VirtualBody = e("virtual-tbody", "tbody", "DataGrid.VirtualBody");
const K = t("ui-date-range-picker", "DateRangePicker", { onChange: "change" });
K.Root = K;
K.Trigger = e("trigger", "button", "DateRangePicker.Trigger");
const B = t("ui-tags-input", "TagsInput", { onChange: "change" });
B.Root = B;
B.Input = e("input", "input", "TagsInput.Input");
B.Tag = e("tag", "span", "TagsInput.Tag");
const k = t("ui-segmented-control", "SegmentedControl", { onChange: "change" });
k.Root = k;
k.Segment = e("segment", "button", "SegmentedControl.Segment");
k.Item = k.Segment;
k.Indicator = e("indicator", "div", "SegmentedControl.Indicator");
const j = t("ui-otp-input", "OtpInput", { onChange: "change", onInput: "input" });
j.Root = j;
j.Slot = e("slot", "input", "OtpInput.Slot");
const w = t("ui-stepper", "Stepper", { onChange: "change" });
w.Root = w;
w.Step = e("step", "button", "Stepper.Step");
w.Content = e("step-content", "div", "Stepper.Content");
w.Panel = w.Content;
const $ = t("ui-resizable", "Resizable", { onResize: "resize" });
$.Root = $;
$.Panel = e("panel", "div", "Resizable.Panel");
$.Handle = e("handle", "div", "Resizable.Handle");
const W = t("ui-file-upload", "FileUpload", { onChange: "change" });
W.Root = W;
W.Dropzone = e("dropzone", "div", "FileUpload.Dropzone");
const M = t("ui-context-menu", "ContextMenu", { onSelect: "select", onOpen: "open", onClose: "close" });
M.Root = M;
M.Trigger = e("trigger", "div", "ContextMenu.Trigger");
M.Menu = e("menu", "ul", "ContextMenu.Menu");
M.Item = e("item", "li", "ContextMenu.Item");
const O = t("ui-navigation-menu", "NavigationMenu", { onOpen: "open", onClose: "close" });
O.Root = O;
O.Item = e("item", "div", "NavigationMenu.Item");
O.Trigger = e("trigger", "button", "NavigationMenu.Trigger");
O.Content = e("content", "div", "NavigationMenu.Content");
const q = t("ui-tree-view", "TreeView", { onSelect: "select", onToggle: "toggle" });
q.Root = q;
q.Item = e("item", "li", "TreeView.Item");
const re = t("ui-ai-prompt-box", "AiPromptBox", { onSubmit: "submit", onStop: "stop", onInput: "input" }), H = t("ui-color-picker", "ColorPicker", { onChange: "change", onInput: "input", onOpen: "open", onClose: "close" });
H.Root = H;
H.Swatch = e("swatch", "button", "ColorPicker.Swatch");
H.Input = e("input", "input", "ColorPicker.Input");
const Z = y(function(a, r) {
  const {
    className: o = "",
    size: n = "md",
    icon: m,
    rightIcon: s,
    kbd: h,
    error: v,
    clearable: S,
    onClear: U,
    type: L = "text",
    disabled: z,
    ...u
  } = a, C = !!m, c = !!(s || h || S), G = !!v, x = i.createElement("input", {
    ref: r,
    type: L,
    disabled: z,
    "data-ui": "input",
    "data-size": n !== "md" ? n : void 0,
    "aria-invalid": G ? "true" : void 0,
    className: `ui-input ${n !== "md" ? `ui-input-${n}` : ""} ${G ? "is-invalid" : ""} ${o}`.trim(),
    ...u
  });
  if (!C && !c)
    return x;
  const f = [];
  if (C && f.push(
    i.createElement(
      "span",
      {
        key: "icon-left",
        "data-part": "input-icon-left",
        className: "ui-input-icon-left",
        "aria-hidden": "true"
      },
      m
    )
  ), f.push(i.cloneElement(x, { key: "input" })), c) {
    const V = [];
    h && V.push(
      i.createElement(
        "kbd",
        {
          key: "kbd",
          "data-part": "input-kbd",
          className: "ui-kbd"
        },
        h
      )
    ), S && V.push(
      i.createElement(
        "button",
        {
          key: "clear",
          type: "button",
          tabIndex: -1,
          "data-part": "input-clear",
          className: "ui-input-clear",
          onClick: U,
          "aria-label": "Clear input"
        },
        "✕"
      )
    ), s && V.push(i.cloneElement(s, { key: "custom-right" })), f.push(
      i.createElement(
        "span",
        {
          key: "icon-right",
          "data-part": "input-icon-right",
          className: "ui-input-icon-right"
        },
        V
      )
    );
  }
  return i.createElement(
    "div",
    {
      "data-part": "input-group",
      "data-ui": "input-group",
      className: "ui-input-group"
    },
    f
  );
});
Z.displayName = "Input";
const _ = y(function({ className: a = "", children: r, ...o }, n) {
  return i.createElement(
    "div",
    {
      ref: n,
      "data-part": "input-group",
      "data-ui": "input-group",
      className: `ui-input-group ${a}`.trim(),
      ...o
    },
    r
  );
});
_.displayName = "InputGroup";
const ee = y(function({ className: a = "", children: r, ...o }, n) {
  return i.createElement(
    "kbd",
    {
      ref: n,
      "data-part": "input-kbd",
      className: `ui-kbd ${a}`.trim(),
      ...o
    },
    r
  );
});
ee.displayName = "Kbd";
export {
  g as Accordion,
  re as AiPromptBox,
  ae as Calendar,
  H as ColorPicker,
  T as Combobox,
  R as Command,
  M as ContextMenu,
  P as DataGrid,
  ie as DataTable,
  F as DatePicker,
  K as DateRangePicker,
  b as Dialog,
  I as Dropdown,
  W as FileUpload,
  Z as Input,
  _ as InputGroup,
  ee as Kbd,
  O as NavigationMenu,
  j as OtpInput,
  E as Popover,
  $ as Resizable,
  k as SegmentedControl,
  l as Select,
  N as Sheet,
  D as Slider,
  w as Stepper,
  p as Tabs,
  B as TagsInput,
  oe as Toaster,
  A as Tooltip,
  q as TreeView,
  e as createPart,
  t as createReactComponent,
  Y as register,
  se as toast
};
