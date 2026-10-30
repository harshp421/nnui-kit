"use client";
import i, { forwardRef as u, useRef as oe, useImperativeHandle as ie, useEffect as re } from "react";
import { register as le } from "./index.js";
import { toast as Pe } from "./index.js";
typeof window < "u" && typeof window.customElements < "u" && le(["nnui", "ui"]);
function l(s, t, n = {}) {
  const a = u(function(o, r) {
    const c = oe(null);
    ie(r, () => c.current);
    const { children: d, className: m, style: g, ...Y } = o, F = {}, U = {};
    return Object.entries(Y).forEach(([b, k]) => {
      if (b.startsWith("on") && typeof k == "function") {
        const T = n[b] || b.slice(2).toLowerCase();
        U[T] = k;
      } else
        F[b] = k;
    }), re(() => {
      const b = c.current;
      if (!b) return;
      const k = Object.entries(U).map(([T, K]) => {
        const H = (w) => K(w);
        return b.addEventListener(T, H), () => b.removeEventListener(T, H);
      });
      return () => {
        k.forEach((T) => T());
      };
    }), i.createElement(
      s,
      {
        ref: c,
        class: m,
        className: m,
        style: g,
        ...F
      },
      d
    );
  });
  return a.displayName = t, a;
}
function e(s, t = "div", n = "") {
  const a = u(function(o, r) {
    const { as: c = t, className: d, children: m, ...g } = o;
    return i.createElement(
      c,
      {
        ref: r,
        "data-part": s,
        className: d,
        ...g
      },
      m
    );
  });
  return a.displayName = n || `Part(${s})`, a;
}
const y = l("ui-tabs", "Tabs", { onChange: "change" });
y.Root = y;
y.List = e("tablist", "div", "Tabs.List");
y.Tab = e("tab", "button", "Tabs.Tab");
y.Trigger = y.Tab;
y.Panel = e("tabpanel", "div", "Tabs.Panel");
y.Content = y.Panel;
const E = l("ui-combobox", "Combobox", { onChange: "change" });
E.Root = E;
E.Input = e("input", "input", "Combobox.Input");
E.List = e("listbox", "ul", "Combobox.List");
E.Item = e("option", "li", "Combobox.Item");
E.Option = E.Item;
const R = l("ui-dialog", "Dialog", { onOpen: "open", onClose: "close" });
R.Root = R;
R.Trigger = e("trigger", "button", "Dialog.Trigger");
R.Content = u(function({ as: t = "dialog", className: n, children: a, ...o }, r) {
  return i.createElement(t, { ref: r, "data-ui": "dialog", className: n, ...o }, a);
});
R.Content.displayName = "Dialog.Content";
R.Close = e("dialog-close", "button", "Dialog.Close");
R.Title = e("title", "h2", "Dialog.Title");
R.Description = e("description", "p", "Dialog.Description");
const C = l("ui-select", "Select", { onChange: "change", onInput: "input" });
C.Root = C;
C.Trigger = e("trigger", "button", "Select.Trigger");
C.Value = e("value", "span", "Select.Value");
C.List = e("listbox", "ul", "Select.List");
C.Content = C.List;
C.Item = e("option", "li", "Select.Item");
C.Option = C.Item;
const f = l("ui-accordion", "Accordion", { onChange: "change" });
f.Root = f;
f.Item = e("item", "div", "Accordion.Item");
f.Trigger = e("trigger", "button", "Accordion.Trigger");
f.Header = f.Trigger;
f.Content = e("content", "div", "Accordion.Content");
f.Panel = f.Content;
const L = l("ui-popover", "Popover", { onToggle: "toggle" });
L.Root = L;
L.Trigger = e("trigger", "button", "Popover.Trigger");
L.Content = e("popover", "div", "Popover.Content");
L.Close = e("close", "button", "Popover.Close");
const q = l("ui-tooltip", "Tooltip");
q.Root = q;
q.Trigger = e("trigger", "span", "Tooltip.Trigger");
q.Content = e("content", "div", "Tooltip.Content");
const P = l("ui-command", "Command", { onChange: "change", onSelect: "select", onOpen: "open", onClose: "close" });
P.Root = P;
P.Input = e("input", "input", "Command.Input");
P.List = e("list", "ul", "Command.List");
P.Group = e("group", "div", "Command.Group");
P.Item = e("item", "li", "Command.Item");
const O = l("ui-sheet", "Sheet", { onOpen: "open", onClose: "close" });
O.Root = O;
O.Trigger = e("trigger", "button", "Sheet.Trigger");
O.Content = e("content", "div", "Sheet.Content");
O.Close = e("close", "button", "Sheet.Close");
const x = l("ui-slider", "Slider", { onChange: "change", onInput: "input" });
x.Root = x;
x.Track = e("track", "div", "Slider.Track");
x.Range = e("range", "div", "Slider.Range");
x.Thumb = e("thumb", "div", "Slider.Thumb");
x.Value = e("value", "span", "Slider.Value");
const N = l("ui-dropdown", "Dropdown", { onSelect: "select", onOpen: "open", onClose: "close" });
N.Root = N;
N.Trigger = e("trigger", "button", "Dropdown.Trigger");
N.Menu = e("menu", "ul", "Dropdown.Menu");
N.Content = N.Menu;
N.Item = e("item", "li", "Dropdown.Item");
const ke = l("ui-toaster", "Toaster"), Re = l("ui-data-table", "DataTable"), Ie = l("ui-calendar", "Calendar", { onChange: "change" }), Z = l("ui-date-picker", "DatePicker", { onChange: "change" });
Z.Root = Z;
Z.Trigger = e("trigger", "button", "DatePicker.Trigger");
const $ = l("ui-data-grid", "DataGrid", {
  onSelectionChange: "selection-change",
  onSort: "sort",
  onStreamUpdate: "stream-update"
});
$.Root = $;
$.Viewport = e("viewport", "div", "DataGrid.Viewport");
$.Runway = e("runway", "div", "DataGrid.Runway");
$.Table = e("grid-table", "table", "DataGrid.Table");
$.VirtualBody = e("virtual-tbody", "tbody", "DataGrid.VirtualBody");
const _ = l("ui-date-range-picker", "DateRangePicker", { onChange: "change" });
_.Root = _;
_.Trigger = e("trigger", "button", "DateRangePicker.Trigger");
const J = l("ui-tags-input", "TagsInput", { onChange: "change" });
J.Root = J;
J.Input = e("input", "input", "TagsInput.Input");
J.Tag = e("tag", "span", "TagsInput.Tag");
const B = l("ui-segmented-control", "SegmentedControl", { onChange: "change" });
B.Root = B;
B.Segment = e("segment", "button", "SegmentedControl.Segment");
B.Item = B.Segment;
B.Indicator = e("indicator", "div", "SegmentedControl.Indicator");
const ee = l("ui-otp-input", "OtpInput", { onChange: "change", onInput: "input" });
ee.Root = ee;
ee.Slot = e("slot", "input", "OtpInput.Slot");
const M = l("ui-stepper", "Stepper", { onChange: "change" });
M.Root = M;
M.Step = e("step", "button", "Stepper.Step");
M.Content = e("step-content", "div", "Stepper.Content");
M.Panel = M.Content;
const Q = l("ui-resizable", "Resizable", { onResize: "resize" });
Q.Root = Q;
Q.Panel = e("panel", "div", "Resizable.Panel");
Q.Handle = e("handle", "div", "Resizable.Handle");
const te = l("ui-file-upload", "FileUpload", { onChange: "change" });
te.Root = te;
te.Dropzone = e("dropzone", "div", "FileUpload.Dropzone");
const z = l("ui-context-menu", "ContextMenu", { onSelect: "select", onOpen: "open", onClose: "close" });
z.Root = z;
z.Trigger = e("trigger", "div", "ContextMenu.Trigger");
z.Menu = e("menu", "ul", "ContextMenu.Menu");
z.Item = e("item", "li", "ContextMenu.Item");
const G = l("ui-navigation-menu", "NavigationMenu", { onOpen: "open", onClose: "close" });
G.Root = G;
G.Item = e("item", "div", "NavigationMenu.Item");
G.Trigger = e("trigger", "button", "NavigationMenu.Trigger");
G.Content = e("content", "div", "NavigationMenu.Content");
const ne = l("ui-tree-view", "TreeView", { onSelect: "select", onToggle: "toggle" });
ne.Root = ne;
ne.Item = e("item", "li", "TreeView.Item");
const Ee = l("ui-ai-prompt-box", "AiPromptBox", { onSubmit: "submit", onStop: "stop", onInput: "input" }), X = l("ui-color-picker", "ColorPicker", { onChange: "change", onInput: "input", onOpen: "open", onClose: "close" });
X.Root = X;
X.Swatch = e("swatch", "button", "ColorPicker.Swatch");
X.Input = e("input", "input", "ColorPicker.Input");
const Ne = l("ui-sparkline", "Sparkline", { onHoverPoint: "hoverpoint" }), ae = l("ui-dock", "Dock", { onSelect: "select" });
ae.Root = ae;
ae.Item = e("item", "button", "Dock.Item");
const A = l("ui-timeline", "Timeline", { onStepClick: "stepclick" });
A.Root = A;
A.Item = e("item", "div", "Timeline.Item");
A.Marker = e("marker", "span", "Timeline.Marker");
A.Connector = e("connector", "span", "Timeline.Connector");
A.Content = e("content", "div", "Timeline.Content");
A.Title = e("title", "h5", "Timeline.Title");
A.Description = e("description", "p", "Timeline.Description");
A.Time = e("time", "span", "Timeline.Time");
const S = l("ui-ai-reasoning", "AiReasoning", {
  onToggle: "toggle",
  onCopy: "copy",
  onStatusChange: "statuschange"
});
S.Root = S;
S.Header = e("header", "div", "AiReasoning.Header");
S.Beacon = e("beacon", "span", "AiReasoning.Beacon");
S.Summary = e("summary", "span", "AiReasoning.Summary");
S.Actions = e("actions", "div", "AiReasoning.Actions");
S.Copy = e("copy", "button", "AiReasoning.Copy");
S.Toggle = e("toggle", "button", "AiReasoning.Toggle");
S.Stream = e("stream", "div", "AiReasoning.Stream");
const p = l("ui-ai-tool-call", "AiToolCall", {
  onToggle: "toggle",
  onRetry: "retry",
  onCopy: "copy"
});
p.Root = p;
p.Header = e("header", "div", "AiToolCall.Header");
p.Info = e("info", "div", "AiToolCall.Info");
p.Name = e("name", "span", "AiToolCall.Name");
p.StatusBadge = e("status-badge", "span", "AiToolCall.StatusBadge");
p.Latency = e("latency", "span", "AiToolCall.Latency");
p.Actions = e("actions", "div", "AiToolCall.Actions");
p.Retry = e("retry", "button", "AiToolCall.Retry");
p.Copy = e("copy", "button", "AiToolCall.Copy");
p.Inspector = e("inspector", "div", "AiToolCall.Inspector");
p.Args = e("args", "div", "AiToolCall.Args");
p.Output = e("output", "div", "AiToolCall.Output");
const v = l("ui-ai-approval", "AiApproval", {
  onApprove: "approve",
  onReject: "reject"
});
v.Root = v;
v.Header = e("header", "div", "AiApproval.Header");
v.Title = e("title", "h5", "AiApproval.Title");
v.SeverityBadge = e("severity-badge", "span", "AiApproval.SeverityBadge");
v.Payload = e("payload", "div", "AiApproval.Payload");
v.Actions = e("actions", "div", "AiApproval.Actions");
v.Approve = e("approve", "button", "AiApproval.Approve");
v.Reject = e("reject", "button", "AiApproval.Reject");
v.AuditBadge = e("audit-badge", "div", "AiApproval.AuditBadge");
const ce = u(function(t, n) {
  const {
    className: a = "",
    size: o = "md",
    icon: r,
    rightIcon: c,
    kbd: d,
    error: m,
    clearable: g,
    onClear: Y,
    type: F = "text",
    disabled: U,
    ...b
  } = t, k = !!r, T = !!(c || d || g), K = !!m, H = i.createElement("input", {
    ref: n,
    type: F,
    disabled: U,
    "data-ui": "input",
    "data-size": o !== "md" ? o : void 0,
    "aria-invalid": K ? "true" : void 0,
    className: `ui-input ${o !== "md" ? `ui-input-${o}` : ""} ${K ? "is-invalid" : ""} ${a}`.trim(),
    ...b
  });
  if (!k && !T)
    return H;
  const w = [];
  if (k && w.push(
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
  ), w.push(i.cloneElement(H, { key: "input" })), T) {
    const W = [];
    d && W.push(
      i.createElement(
        "kbd",
        {
          key: "kbd",
          "data-part": "input-kbd",
          className: "ui-kbd"
        },
        d
      )
    ), g && W.push(
      i.createElement(
        "button",
        {
          key: "clear",
          type: "button",
          tabIndex: -1,
          "data-part": "input-clear",
          className: "ui-input-clear",
          onClick: Y,
          "aria-label": "Clear input"
        },
        "✕"
      )
    ), c && W.push(i.cloneElement(c, { key: "custom-right" })), w.push(
      i.createElement(
        "span",
        {
          key: "icon-right",
          "data-part": "input-icon-right",
          className: "ui-input-icon-right"
        },
        W
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
    w
  );
});
ce.displayName = "Input";
const se = u(function({ className: t = "", children: n, ...a }, o) {
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
se.displayName = "InputGroup";
const ue = u(function({ className: t = "", children: n, ...a }, o) {
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
ue.displayName = "Kbd";
const de = u(function({ as: t = "button", variant: n = "primary", size: a = "md", fullWidth: o, className: r = "", children: c, ...d }, m) {
  const g = t === "button";
  return i.createElement(
    t,
    {
      ref: m,
      type: g ? d.type || "button" : void 0,
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
de.displayName = "Button";
const pe = u(function({ as: t = "span", variant: n = "default", size: a = "md", className: o = "", children: r, ...c }, d) {
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
pe.displayName = "Badge";
const h = u(function({ as: t = "div", className: n = "", children: a, ...o }, r) {
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
h.displayName = "Card";
h.Root = h;
h.Header = e("card-header", "div", "Card.Header");
h.Title = e("card-title", "h3", "Card.Title");
h.Description = e("card-description", "p", "Card.Description");
h.Content = e("card-content", "div", "Card.Content");
h.Body = h.Content;
h.Footer = e("card-footer", "div", "Card.Footer");
const V = u(function({ as: t = "div", variant: n = "info", className: a = "", children: o, ...r }, c) {
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
V.displayName = "Alert";
V.Root = V;
V.Title = e("alert-title", "h5", "Alert.Title");
V.Description = e("alert-description", "div", "Alert.Description");
const j = u(function({ as: t = "div", size: n = "md", src: a, alt: o = "", fallback: r, className: c = "", children: d, ...m }, g) {
  return i.createElement(
    t,
    {
      ref: g,
      "data-ui": "avatar",
      "data-size": n !== "md" ? n : void 0,
      className: `ui-avatar ${c}`.trim(),
      ...m
    },
    a ? i.createElement("img", { key: "avatar-img", src: a, alt: o, "data-part": "image" }) : null,
    r ? i.createElement("span", { key: "avatar-fallback", "data-part": "fallback" }, r) : null,
    d
  );
});
j.displayName = "Avatar";
j.Root = j;
j.Image = e("image", "img", "Avatar.Image");
j.Fallback = e("fallback", "span", "Avatar.Fallback");
const me = u(function({ label: t, description: n, className: a = "", error: o, ...r }, c) {
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
me.displayName = "Checkbox";
const ge = u(function({ label: t, className: n = "", ...a }, o) {
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
ge.displayName = "Switch";
const be = u(function({ value: t = 0, max: n = 100, className: a = "", ...o }, r) {
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
be.displayName = "Progress";
const Ce = u(function({ orientation: t = "horizontal", label: n, className: a = "", ...o }, r) {
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
Ce.displayName = "Separator";
const ve = u(function({ className: t = "", width: n, height: a, circle: o, style: r, ...c }, d) {
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
ve.displayName = "Skeleton";
const he = u(function({ size: t = "md", className: n = "", ...a }, o) {
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
he.displayName = "Spinner";
const D = u(function({ className: t = "", children: n, ...a }, o) {
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
D.displayName = "Empty";
D.Root = D;
D.Icon = e("empty-icon", "div", "Empty.Icon");
D.Title = e("empty-title", "h4", "Empty.Title");
D.Description = e("empty-description", "p", "Empty.Description");
D.Action = e("empty-action", "div", "Empty.Action");
const Te = u(function({ direction: t = "column", gap: n = "md", align: a, justify: o, className: r = "", children: c, ...d }, m) {
  return i.createElement(
    "div",
    {
      ref: m,
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
Te.displayName = "Stack";
const ye = u(function({ cols: t = 1, gap: n = "md", className: a = "", children: o, ...r }, c) {
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
ye.displayName = "Grid";
const fe = u(function({ size: t = "lg", className: n = "", children: a, ...o }, r) {
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
fe.displayName = "Container";
const I = u(function({ className: t = "", children: n, ...a }, o) {
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
I.displayName = "Table";
I.Root = I;
I.Header = e("table-header", "thead", "Table.Header");
I.Body = e("table-body", "tbody", "Table.Body");
I.Row = e("table-row", "tr", "Table.Row");
I.Head = e("table-head", "th", "Table.Head");
I.Cell = e("table-cell", "td", "Table.Cell");
export {
  f as Accordion,
  v as AiApproval,
  Ee as AiPromptBox,
  S as AiReasoning,
  p as AiToolCall,
  V as Alert,
  j as Avatar,
  pe as Badge,
  de as Button,
  Ie as Calendar,
  h as Card,
  me as Checkbox,
  X as ColorPicker,
  E as Combobox,
  P as Command,
  fe as Container,
  z as ContextMenu,
  $ as DataGrid,
  Re as DataTable,
  Z as DatePicker,
  _ as DateRangePicker,
  R as Dialog,
  ae as Dock,
  N as Dropdown,
  D as Empty,
  te as FileUpload,
  ye as Grid,
  ce as Input,
  se as InputGroup,
  ue as Kbd,
  G as NavigationMenu,
  ee as OtpInput,
  L as Popover,
  be as Progress,
  Q as Resizable,
  B as SegmentedControl,
  C as Select,
  Ce as Separator,
  O as Sheet,
  ve as Skeleton,
  x as Slider,
  Ne as Sparkline,
  he as Spinner,
  Te as Stack,
  M as Stepper,
  ge as Switch,
  I as Table,
  y as Tabs,
  J as TagsInput,
  A as Timeline,
  ke as Toaster,
  q as Tooltip,
  ne as TreeView,
  e as createPart,
  l as createReactComponent,
  le as register,
  Pe as toast
};
