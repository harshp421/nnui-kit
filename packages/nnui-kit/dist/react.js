"use client";
import i, { forwardRef as u, useRef as _, useImperativeHandle as ee, useEffect as te } from "react";
import { register as ne } from "./index.js";
import { toast as Ie } from "./index.js";
typeof window < "u" && typeof window.customElements < "u" && ne(["nnui", "ui"]);
function l(s, t, n = {}) {
  const a = u(function(o, r) {
    const c = _(null);
    ee(r, () => c.current);
    const { children: d, className: p, style: m, ...q } = o, O = {}, H = {};
    return Object.entries(q).forEach(([g, T]) => {
      if (g.startsWith("on") && typeof T == "function") {
        const h = n[g] || g.slice(2).toLowerCase();
        H[h] = T;
      } else
        O[g] = T;
    }), te(() => {
      const g = c.current;
      if (!g) return;
      const T = Object.entries(H).map(([h, V]) => {
        const $ = (N) => V(N);
        return g.addEventListener(h, $), () => g.removeEventListener(h, $);
      });
      return () => {
        T.forEach((h) => h());
      };
    }), i.createElement(
      s,
      {
        ref: c,
        class: p,
        className: p,
        style: m,
        ...O
      },
      d
    );
  });
  return a.displayName = t, a;
}
function e(s, t = "div", n = "") {
  const a = u(function(o, r) {
    const { as: c = t, className: d, children: p, ...m } = o;
    return i.createElement(
      c,
      {
        ref: r,
        "data-part": s,
        className: d,
        ...m
      },
      p
    );
  });
  return a.displayName = n || `Part(${s})`, a;
}
const v = l("ui-tabs", "Tabs", { onChange: "change" });
v.Root = v;
v.List = e("tablist", "div", "Tabs.List");
v.Tab = e("tab", "button", "Tabs.Tab");
v.Trigger = v.Tab;
v.Panel = e("tabpanel", "div", "Tabs.Panel");
v.Content = v.Panel;
const S = l("ui-combobox", "Combobox", { onChange: "change" });
S.Root = S;
S.Input = e("input", "input", "Combobox.Input");
S.List = e("listbox", "ul", "Combobox.List");
S.Item = e("option", "li", "Combobox.Item");
S.Option = S.Item;
const y = l("ui-dialog", "Dialog", { onOpen: "open", onClose: "close" });
y.Root = y;
y.Trigger = e("trigger", "button", "Dialog.Trigger");
y.Content = u(function({ as: t = "dialog", className: n, children: a, ...o }, r) {
  return i.createElement(t, { ref: r, "data-ui": "dialog", className: n, ...o }, a);
});
y.Content.displayName = "Dialog.Content";
y.Close = e("dialog-close", "button", "Dialog.Close");
y.Title = e("title", "h2", "Dialog.Title");
y.Description = e("description", "p", "Dialog.Description");
const b = l("ui-select", "Select", { onChange: "change", onInput: "input" });
b.Root = b;
b.Trigger = e("trigger", "button", "Select.Trigger");
b.Value = e("value", "span", "Select.Value");
b.List = e("listbox", "ul", "Select.List");
b.Content = b.List;
b.Item = e("option", "li", "Select.Item");
b.Option = b.Item;
const f = l("ui-accordion", "Accordion", { onChange: "change" });
f.Root = f;
f.Item = e("item", "div", "Accordion.Item");
f.Trigger = e("trigger", "button", "Accordion.Trigger");
f.Header = f.Trigger;
f.Content = e("content", "div", "Accordion.Content");
f.Panel = f.Content;
const A = l("ui-popover", "Popover", { onToggle: "toggle" });
A.Root = A;
A.Trigger = e("trigger", "button", "Popover.Trigger");
A.Content = e("popover", "div", "Popover.Content");
A.Close = e("close", "button", "Popover.Close");
const U = l("ui-tooltip", "Tooltip");
U.Root = U;
U.Trigger = e("trigger", "span", "Tooltip.Trigger");
U.Content = e("content", "div", "Tooltip.Content");
const R = l("ui-command", "Command", { onChange: "change", onSelect: "select", onOpen: "open", onClose: "close" });
R.Root = R;
R.Input = e("input", "input", "Command.Input");
R.List = e("list", "ul", "Command.List");
R.Group = e("group", "div", "Command.Group");
R.Item = e("item", "li", "Command.Item");
const B = l("ui-sheet", "Sheet", { onOpen: "open", onClose: "close" });
B.Root = B;
B.Trigger = e("trigger", "button", "Sheet.Trigger");
B.Content = e("content", "div", "Sheet.Content");
B.Close = e("close", "button", "Sheet.Close");
const w = l("ui-slider", "Slider", { onChange: "change", onInput: "input" });
w.Root = w;
w.Track = e("track", "div", "Slider.Track");
w.Range = e("range", "div", "Slider.Range");
w.Thumb = e("thumb", "div", "Slider.Thumb");
w.Value = e("value", "span", "Slider.Value");
const E = l("ui-dropdown", "Dropdown", { onSelect: "select", onOpen: "open", onClose: "close" });
E.Root = E;
E.Trigger = e("trigger", "button", "Dropdown.Trigger");
E.Menu = e("menu", "ul", "Dropdown.Menu");
E.Content = E.Menu;
E.Item = e("item", "li", "Dropdown.Item");
const fe = l("ui-toaster", "Toaster"), Te = l("ui-data-table", "DataTable"), ye = l("ui-calendar", "Calendar", { onChange: "change" }), J = l("ui-date-picker", "DatePicker", { onChange: "change" });
J.Root = J;
J.Trigger = e("trigger", "button", "DatePicker.Trigger");
const D = l("ui-data-grid", "DataGrid", {
  onSelectionChange: "selection-change",
  onSort: "sort",
  onStreamUpdate: "stream-update"
});
D.Root = D;
D.Viewport = e("viewport", "div", "DataGrid.Viewport");
D.Runway = e("runway", "div", "DataGrid.Runway");
D.Table = e("grid-table", "table", "DataGrid.Table");
D.VirtualBody = e("virtual-tbody", "tbody", "DataGrid.VirtualBody");
const Q = l("ui-date-range-picker", "DateRangePicker", { onChange: "change" });
Q.Root = Q;
Q.Trigger = e("trigger", "button", "DateRangePicker.Trigger");
const j = l("ui-tags-input", "TagsInput", { onChange: "change" });
j.Root = j;
j.Input = e("input", "input", "TagsInput.Input");
j.Tag = e("tag", "span", "TagsInput.Tag");
const P = l("ui-segmented-control", "SegmentedControl", { onChange: "change" });
P.Root = P;
P.Segment = e("segment", "button", "SegmentedControl.Segment");
P.Item = P.Segment;
P.Indicator = e("indicator", "div", "SegmentedControl.Indicator");
const X = l("ui-otp-input", "OtpInput", { onChange: "change", onInput: "input" });
X.Root = X;
X.Slot = e("slot", "input", "OtpInput.Slot");
const x = l("ui-stepper", "Stepper", { onChange: "change" });
x.Root = x;
x.Step = e("step", "button", "Stepper.Step");
x.Content = e("step-content", "div", "Stepper.Content");
x.Panel = x.Content;
const K = l("ui-resizable", "Resizable", { onResize: "resize" });
K.Root = K;
K.Panel = e("panel", "div", "Resizable.Panel");
K.Handle = e("handle", "div", "Resizable.Handle");
const Y = l("ui-file-upload", "FileUpload", { onChange: "change" });
Y.Root = Y;
Y.Dropzone = e("dropzone", "div", "FileUpload.Dropzone");
const M = l("ui-context-menu", "ContextMenu", { onSelect: "select", onOpen: "open", onClose: "close" });
M.Root = M;
M.Trigger = e("trigger", "div", "ContextMenu.Trigger");
M.Menu = e("menu", "ul", "ContextMenu.Menu");
M.Item = e("item", "li", "ContextMenu.Item");
const z = l("ui-navigation-menu", "NavigationMenu", { onOpen: "open", onClose: "close" });
z.Root = z;
z.Item = e("item", "div", "NavigationMenu.Item");
z.Trigger = e("trigger", "button", "NavigationMenu.Trigger");
z.Content = e("content", "div", "NavigationMenu.Content");
const Z = l("ui-tree-view", "TreeView", { onSelect: "select", onToggle: "toggle" });
Z.Root = Z;
Z.Item = e("item", "li", "TreeView.Item");
const ke = l("ui-ai-prompt-box", "AiPromptBox", { onSubmit: "submit", onStop: "stop", onInput: "input" }), W = l("ui-color-picker", "ColorPicker", { onChange: "change", onInput: "input", onOpen: "open", onClose: "close" });
W.Root = W;
W.Swatch = e("swatch", "button", "ColorPicker.Swatch");
W.Input = e("input", "input", "ColorPicker.Input");
const ae = u(function(t, n) {
  const {
    className: a = "",
    size: o = "md",
    icon: r,
    rightIcon: c,
    kbd: d,
    error: p,
    clearable: m,
    onClear: q,
    type: O = "text",
    disabled: H,
    ...g
  } = t, T = !!r, h = !!(c || d || m), V = !!p, $ = i.createElement("input", {
    ref: n,
    type: O,
    disabled: H,
    "data-ui": "input",
    "data-size": o !== "md" ? o : void 0,
    "aria-invalid": V ? "true" : void 0,
    className: `ui-input ${o !== "md" ? `ui-input-${o}` : ""} ${V ? "is-invalid" : ""} ${a}`.trim(),
    ...g
  });
  if (!T && !h)
    return $;
  const N = [];
  if (T && N.push(
    i.createElement(
      "span",
      {
        key: "icon-left",
        "data-part": "input-icon-left",
        className: "ui-input-icon-left",
        "aria-hidden": "true"
      },
      r
    )
  ), N.push(i.cloneElement($, { key: "input" })), h) {
    const F = [];
    d && F.push(
      i.createElement(
        "kbd",
        {
          key: "kbd",
          "data-part": "input-kbd",
          className: "ui-kbd"
        },
        d
      )
    ), m && F.push(
      i.createElement(
        "button",
        {
          key: "clear",
          type: "button",
          tabIndex: -1,
          "data-part": "input-clear",
          className: "ui-input-clear",
          onClick: q,
          "aria-label": "Clear input"
        },
        "✕"
      )
    ), c && F.push(i.cloneElement(c, { key: "custom-right" })), N.push(
      i.createElement(
        "span",
        {
          key: "icon-right",
          "data-part": "input-icon-right",
          className: "ui-input-icon-right"
        },
        F
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
    N
  );
});
ae.displayName = "Input";
const oe = u(function({ className: t = "", children: n, ...a }, o) {
  return i.createElement(
    "div",
    {
      ref: o,
      "data-part": "input-group",
      "data-ui": "input-group",
      className: `ui-input-group ${t}`.trim(),
      ...a
    },
    n
  );
});
oe.displayName = "InputGroup";
const ie = u(function({ className: t = "", children: n, ...a }, o) {
  return i.createElement(
    "kbd",
    {
      ref: o,
      "data-part": "input-kbd",
      className: `ui-kbd ${t}`.trim(),
      ...a
    },
    n
  );
});
ie.displayName = "Kbd";
const re = u(function({ as: t = "button", variant: n = "primary", size: a = "md", fullWidth: o, className: r = "", children: c, ...d }, p) {
  const m = t === "button";
  return i.createElement(
    t,
    {
      ref: p,
      type: m ? d.type || "button" : void 0,
      "data-ui": "button",
      "data-variant": n,
      "data-size": a !== "md" ? a : void 0,
      "data-full-width": o ? "" : void 0,
      className: `ui-button ${n ? `ui-button--${n}` : ""} ${r}`.trim(),
      ...d
    },
    c
  );
});
re.displayName = "Button";
const le = u(function({ as: t = "span", variant: n = "default", size: a = "md", className: o = "", children: r, ...c }, d) {
  return i.createElement(
    t,
    {
      ref: d,
      "data-ui": "badge",
      "data-variant": n,
      "data-size": a !== "md" ? a : void 0,
      className: `ui-badge ${o}`.trim(),
      ...c
    },
    r
  );
});
le.displayName = "Badge";
const C = u(function({ as: t = "div", className: n = "", children: a, ...o }, r) {
  return i.createElement(
    t,
    {
      ref: r,
      "data-ui": "card",
      className: `ui-card ${n}`.trim(),
      ...o
    },
    a
  );
});
C.displayName = "Card";
C.Root = C;
C.Header = e("card-header", "div", "Card.Header");
C.Title = e("card-title", "h3", "Card.Title");
C.Description = e("card-description", "p", "Card.Description");
C.Content = e("card-content", "div", "Card.Content");
C.Body = C.Content;
C.Footer = e("card-footer", "div", "Card.Footer");
const G = u(function({ as: t = "div", variant: n = "info", className: a = "", children: o, ...r }, c) {
  return i.createElement(
    t,
    {
      ref: c,
      role: "alert",
      "data-ui": "alert",
      "data-variant": n,
      className: `ui-alert ${a}`.trim(),
      ...r
    },
    o
  );
});
G.displayName = "Alert";
G.Root = G;
G.Title = e("alert-title", "h5", "Alert.Title");
G.Description = e("alert-description", "div", "Alert.Description");
const L = u(function({ as: t = "div", size: n = "md", src: a, alt: o = "", fallback: r, className: c = "", children: d, ...p }, m) {
  return i.createElement(
    t,
    {
      ref: m,
      "data-ui": "avatar",
      "data-size": n !== "md" ? n : void 0,
      className: `ui-avatar ${c}`.trim(),
      ...p
    },
    a ? i.createElement("img", { key: "avatar-img", src: a, alt: o, "data-part": "image" }) : null,
    r ? i.createElement("span", { key: "avatar-fallback", "data-part": "fallback" }, r) : null,
    d
  );
});
L.displayName = "Avatar";
L.Root = L;
L.Image = e("image", "img", "Avatar.Image");
L.Fallback = e("fallback", "span", "Avatar.Fallback");
const ce = u(function({ label: t, description: n, className: a = "", error: o, ...r }, c) {
  return i.createElement(
    "label",
    {
      "data-ui": "checkbox",
      className: `ui-checkbox ${o ? "is-invalid" : ""} ${a}`.trim()
    },
    i.createElement("input", {
      ref: c,
      type: "checkbox",
      "aria-invalid": o ? "true" : void 0,
      ...r
    }),
    t ? i.createElement("span", { key: "chk-lbl", "data-part": "label" }, t) : null,
    n ? i.createElement("span", { key: "chk-desc", "data-part": "description" }, n) : null
  );
});
ce.displayName = "Checkbox";
const se = u(function({ label: t, className: n = "", ...a }, o) {
  return i.createElement(
    "label",
    {
      "data-ui": "switch",
      className: `ui-switch ${n}`.trim()
    },
    i.createElement("input", {
      ref: o,
      type: "checkbox",
      role: "switch",
      ...a
    }),
    i.createElement("span", { key: "sw-thumb", "data-part": "thumb" }),
    t ? i.createElement("span", { key: "sw-lbl", "data-part": "label" }, t) : null
  );
});
se.displayName = "Switch";
const ue = u(function({ value: t = 0, max: n = 100, className: a = "", ...o }, r) {
  const c = Math.min(100, Math.max(0, t / n * 100));
  return i.createElement(
    "div",
    {
      ref: r,
      role: "progressbar",
      "aria-valuenow": t,
      "aria-valuemin": 0,
      "aria-valuemax": n,
      "data-ui": "progress",
      className: `ui-progress ${a}`.trim(),
      ...o
    },
    i.createElement("div", {
      "data-part": "indicator",
      style: { width: `${c}%` }
    })
  );
});
ue.displayName = "Progress";
const de = u(function({ orientation: t = "horizontal", label: n, className: a = "", ...o }, r) {
  return n ? i.createElement(
    "div",
    {
      ref: r,
      role: "separator",
      "data-ui": "separator",
      "data-orientation": t,
      className: `ui-separator ${a}`.trim(),
      ...o
    },
    i.createElement("span", { "data-part": "label" }, n)
  ) : i.createElement("hr", {
    ref: r,
    "data-ui": "separator",
    "data-orientation": t,
    className: `ui-separator ${a}`.trim(),
    ...o
  });
});
de.displayName = "Separator";
const pe = u(function({ className: t = "", width: n, height: a, circle: o, style: r, ...c }, d) {
  return i.createElement(
    "div",
    {
      ref: d,
      "data-ui": "skeleton",
      className: `ui-skeleton ${o ? "ui-skeleton--circle" : ""} ${t}`.trim(),
      style: {
        width: n,
        height: a,
        borderRadius: o ? "50%" : void 0,
        ...r
      },
      ...c
    }
  );
});
pe.displayName = "Skeleton";
const me = u(function({ size: t = "md", className: n = "", ...a }, o) {
  return i.createElement(
    "div",
    {
      ref: o,
      role: "status",
      "aria-label": "Loading",
      "data-ui": "spinner",
      "data-size": t !== "md" ? t : void 0,
      className: `ui-spinner ${n}`.trim(),
      ...a
    }
  );
});
me.displayName = "Spinner";
const I = u(function({ className: t = "", children: n, ...a }, o) {
  return i.createElement(
    "div",
    {
      ref: o,
      "data-ui": "empty",
      className: `ui-empty ${t}`.trim(),
      ...a
    },
    n
  );
});
I.displayName = "Empty";
I.Root = I;
I.Icon = e("empty-icon", "div", "Empty.Icon");
I.Title = e("empty-title", "h4", "Empty.Title");
I.Description = e("empty-description", "p", "Empty.Description");
I.Action = e("empty-action", "div", "Empty.Action");
const ge = u(function({ direction: t = "column", gap: n = "md", align: a, justify: o, className: r = "", children: c, ...d }, p) {
  return i.createElement(
    "div",
    {
      ref: p,
      "data-ui": "stack",
      "data-direction": t,
      "data-gap": n,
      "data-align": a,
      "data-justify": o,
      className: `ui-stack ${r}`.trim(),
      ...d
    },
    c
  );
});
ge.displayName = "Stack";
const be = u(function({ cols: t = 1, gap: n = "md", className: a = "", children: o, ...r }, c) {
  return i.createElement(
    "div",
    {
      ref: c,
      "data-ui": "grid",
      "data-cols": t,
      "data-gap": n,
      className: `ui-grid ${a}`.trim(),
      ...r
    },
    o
  );
});
be.displayName = "Grid";
const Ce = u(function({ size: t = "lg", className: n = "", children: a, ...o }, r) {
  return i.createElement(
    "div",
    {
      ref: r,
      "data-ui": "container",
      "data-size": t,
      className: `ui-container ${n}`.trim(),
      ...o
    },
    a
  );
});
Ce.displayName = "Container";
const k = u(function({ className: t = "", children: n, ...a }, o) {
  return i.createElement(
    "table",
    {
      ref: o,
      "data-ui": "table",
      className: `ui-table ${t}`.trim(),
      ...a
    },
    n
  );
});
k.displayName = "Table";
k.Root = k;
k.Header = e("table-header", "thead", "Table.Header");
k.Body = e("table-body", "tbody", "Table.Body");
k.Row = e("table-row", "tr", "Table.Row");
k.Head = e("table-head", "th", "Table.Head");
k.Cell = e("table-cell", "td", "Table.Cell");
export {
  f as Accordion,
  ke as AiPromptBox,
  G as Alert,
  L as Avatar,
  le as Badge,
  re as Button,
  ye as Calendar,
  C as Card,
  ce as Checkbox,
  W as ColorPicker,
  S as Combobox,
  R as Command,
  Ce as Container,
  M as ContextMenu,
  D as DataGrid,
  Te as DataTable,
  J as DatePicker,
  Q as DateRangePicker,
  y as Dialog,
  E as Dropdown,
  I as Empty,
  Y as FileUpload,
  be as Grid,
  ae as Input,
  oe as InputGroup,
  ie as Kbd,
  z as NavigationMenu,
  X as OtpInput,
  A as Popover,
  ue as Progress,
  K as Resizable,
  P as SegmentedControl,
  b as Select,
  de as Separator,
  B as Sheet,
  pe as Skeleton,
  w as Slider,
  me as Spinner,
  ge as Stack,
  x as Stepper,
  se as Switch,
  k as Table,
  v as Tabs,
  j as TagsInput,
  fe as Toaster,
  U as Tooltip,
  Z as TreeView,
  e as createPart,
  l as createReactComponent,
  ne as register,
  Ie as toast
};
