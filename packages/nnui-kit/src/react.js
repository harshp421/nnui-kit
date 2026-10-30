/**
 * NNUI-KIT React 18 & React 19 Wrapper
 * 
 * Provides first-class React components wrapping NNUI Light-DOM Custom Elements.
 * Features:
 * - Direct ref forwarding with access to full component DOM APIs (e.g. ref.current.setColumns)
 * - Automatic custom event bridge (onSelectionChange, onChange, onSort, onOpen, onClose)
 * - Zero Shadow DOM, V-DOM safe, 100% accessible
 * - SSR safe: no-ops on server, registers seamlessly during client hydration
 */

import React, { forwardRef, useEffect, useRef, useImperativeHandle } from 'react';
import { register, toast } from './index.js';

// Auto-register elements in client environment during hydration
if (typeof window !== 'undefined' && typeof window.customElements !== 'undefined') {
  register(['nnui', 'ui']);
}

/**
 * Generic factory to create React wrapper components for any custom element
 */
export function createReactComponent(tagName, displayName, eventMap = {}) {
  const Component = forwardRef(function (props, forwardedRef) {
    const internalRef = useRef(null);
    useImperativeHandle(forwardedRef, () => internalRef.current);

    const { children, className, style, ...restProps } = props;

    const domProps = {};
    const eventHandlers = {};

    Object.entries(restProps).forEach(([key, val]) => {
      if (key.startsWith('on') && typeof val === 'function') {
        const standardEvent = eventMap[key] || key.slice(2).toLowerCase();
        eventHandlers[standardEvent] = val;
      } else {
        domProps[key] = val;
      }
    });

    useEffect(() => {
      const node = internalRef.current;
      if (!node) return;

      const cleanups = Object.entries(eventHandlers).map(([eventName, handler]) => {
        const listener = (event) => handler(event);
        node.addEventListener(eventName, listener);
        return () => node.removeEventListener(eventName, listener);
      });

      return () => {
        cleanups.forEach((fn) => fn());
      };
    });

    return React.createElement(
      tagName,
      {
        ref: internalRef,
        class: className,
        className,
        style,
        ...domProps,
      },
      children
    );
  });

  Component.displayName = displayName;
  return Component;
}

/**
 * Generic factory to create declarative subcomponent parts (e.g. Tabs.List, Dialog.Trigger)
 */
export function createPart(partName, defaultTag = 'div', displayName = '') {
  const PartComponent = forwardRef(function (props, ref) {
    const { as: Tag = defaultTag, className, children, ...restProps } = props;
    return React.createElement(
      Tag,
      {
        ref,
        'data-part': partName,
        className,
        ...restProps,
      },
      children
    );
  });
  PartComponent.displayName = displayName || `Part(${partName})`;
  return PartComponent;
}

// React Wrapped Components
export const Tabs = createReactComponent('ui-tabs', 'Tabs', { onChange: 'change' });
Tabs.Root = Tabs;
Tabs.List = createPart('tablist', 'div', 'Tabs.List');
Tabs.Tab = createPart('tab', 'button', 'Tabs.Tab');
Tabs.Trigger = Tabs.Tab;
Tabs.Panel = createPart('tabpanel', 'div', 'Tabs.Panel');
Tabs.Content = Tabs.Panel;

export const Combobox = createReactComponent('ui-combobox', 'Combobox', { onChange: 'change' });
Combobox.Root = Combobox;
Combobox.Input = createPart('input', 'input', 'Combobox.Input');
Combobox.List = createPart('listbox', 'ul', 'Combobox.List');
Combobox.Item = createPart('option', 'li', 'Combobox.Item');
Combobox.Option = Combobox.Item;

export const Dialog = createReactComponent('ui-dialog', 'Dialog', { onOpen: 'open', onClose: 'close' });
Dialog.Root = Dialog;
Dialog.Trigger = createPart('trigger', 'button', 'Dialog.Trigger');
Dialog.Content = forwardRef(function DialogContent({ as: Tag = 'dialog', className, children, ...props }, ref) {
  return React.createElement(Tag, { ref, 'data-ui': 'dialog', className, ...props }, children);
});
Dialog.Content.displayName = 'Dialog.Content';
Dialog.Close = createPart('dialog-close', 'button', 'Dialog.Close');
Dialog.Title = createPart('title', 'h2', 'Dialog.Title');
Dialog.Description = createPart('description', 'p', 'Dialog.Description');

export const Select = createReactComponent('ui-select', 'Select', { onChange: 'change', onInput: 'input' });
Select.Root = Select;
Select.Trigger = createPart('trigger', 'button', 'Select.Trigger');
Select.Value = createPart('value', 'span', 'Select.Value');
Select.List = createPart('listbox', 'ul', 'Select.List');
Select.Content = Select.List;
Select.Item = createPart('option', 'li', 'Select.Item');
Select.Option = Select.Item;

export const Accordion = createReactComponent('ui-accordion', 'Accordion', { onChange: 'change' });
Accordion.Root = Accordion;
Accordion.Item = createPart('item', 'div', 'Accordion.Item');
Accordion.Trigger = createPart('trigger', 'button', 'Accordion.Trigger');
Accordion.Header = Accordion.Trigger;
Accordion.Content = createPart('content', 'div', 'Accordion.Content');
Accordion.Panel = Accordion.Content;

export const Popover = createReactComponent('ui-popover', 'Popover', { onToggle: 'toggle' });
Popover.Root = Popover;
Popover.Trigger = createPart('trigger', 'button', 'Popover.Trigger');
Popover.Content = createPart('popover', 'div', 'Popover.Content');
Popover.Close = createPart('close', 'button', 'Popover.Close');

export const Tooltip = createReactComponent('ui-tooltip', 'Tooltip');
Tooltip.Root = Tooltip;
Tooltip.Trigger = createPart('trigger', 'span', 'Tooltip.Trigger');
Tooltip.Content = createPart('content', 'div', 'Tooltip.Content');

export const Command = createReactComponent('ui-command', 'Command', { onChange: 'change', onSelect: 'select', onOpen: 'open', onClose: 'close' });
Command.Root = Command;
Command.Input = createPart('input', 'input', 'Command.Input');
Command.List = createPart('list', 'ul', 'Command.List');
Command.Group = createPart('group', 'div', 'Command.Group');
Command.Item = createPart('item', 'li', 'Command.Item');

export const Sheet = createReactComponent('ui-sheet', 'Sheet', { onOpen: 'open', onClose: 'close' });
Sheet.Root = Sheet;
Sheet.Trigger = createPart('trigger', 'button', 'Sheet.Trigger');
Sheet.Content = createPart('content', 'div', 'Sheet.Content');
Sheet.Close = createPart('close', 'button', 'Sheet.Close');

export const Slider = createReactComponent('ui-slider', 'Slider', { onChange: 'change', onInput: 'input' });
Slider.Root = Slider;
Slider.Track = createPart('track', 'div', 'Slider.Track');
Slider.Range = createPart('range', 'div', 'Slider.Range');
Slider.Thumb = createPart('thumb', 'div', 'Slider.Thumb');
Slider.Value = createPart('value', 'span', 'Slider.Value');

export const Dropdown = createReactComponent('ui-dropdown', 'Dropdown', { onSelect: 'select', onOpen: 'open', onClose: 'close' });
Dropdown.Root = Dropdown;
Dropdown.Trigger = createPart('trigger', 'button', 'Dropdown.Trigger');
Dropdown.Menu = createPart('menu', 'ul', 'Dropdown.Menu');
Dropdown.Content = Dropdown.Menu;
Dropdown.Item = createPart('item', 'li', 'Dropdown.Item');

export const Toaster = createReactComponent('ui-toaster', 'Toaster');
export const DataTable = createReactComponent('ui-data-table', 'DataTable');
export const Calendar = createReactComponent('ui-calendar', 'Calendar', { onChange: 'change' });
export const DatePicker = createReactComponent('ui-date-picker', 'DatePicker', { onChange: 'change' });
DatePicker.Root = DatePicker;
DatePicker.Trigger = createPart('trigger', 'button', 'DatePicker.Trigger');

export const DataGrid = createReactComponent('ui-data-grid', 'DataGrid', {
  onSelectionChange: 'selection-change',
  onSort: 'sort',
  onStreamUpdate: 'stream-update',
});
DataGrid.Root = DataGrid;
DataGrid.Viewport = createPart('viewport', 'div', 'DataGrid.Viewport');
DataGrid.Runway = createPart('runway', 'div', 'DataGrid.Runway');
DataGrid.Table = createPart('grid-table', 'table', 'DataGrid.Table');
DataGrid.VirtualBody = createPart('virtual-tbody', 'tbody', 'DataGrid.VirtualBody');

export const DateRangePicker = createReactComponent('ui-date-range-picker', 'DateRangePicker', { onChange: 'change' });
DateRangePicker.Root = DateRangePicker;
DateRangePicker.Trigger = createPart('trigger', 'button', 'DateRangePicker.Trigger');

export const TagsInput = createReactComponent('ui-tags-input', 'TagsInput', { onChange: 'change' });
TagsInput.Root = TagsInput;
TagsInput.Input = createPart('input', 'input', 'TagsInput.Input');
TagsInput.Tag = createPart('tag', 'span', 'TagsInput.Tag');

export const SegmentedControl = createReactComponent('ui-segmented-control', 'SegmentedControl', { onChange: 'change' });
SegmentedControl.Root = SegmentedControl;
SegmentedControl.Segment = createPart('segment', 'button', 'SegmentedControl.Segment');
SegmentedControl.Item = SegmentedControl.Segment;
SegmentedControl.Indicator = createPart('indicator', 'div', 'SegmentedControl.Indicator');

export const OtpInput = createReactComponent('ui-otp-input', 'OtpInput', { onChange: 'change', onInput: 'input' });
OtpInput.Root = OtpInput;
OtpInput.Slot = createPart('slot', 'input', 'OtpInput.Slot');

export const Stepper = createReactComponent('ui-stepper', 'Stepper', { onChange: 'change' });
Stepper.Root = Stepper;
Stepper.Step = createPart('step', 'button', 'Stepper.Step');
Stepper.Content = createPart('step-content', 'div', 'Stepper.Content');
Stepper.Panel = Stepper.Content;

export const Resizable = createReactComponent('ui-resizable', 'Resizable', { onResize: 'resize' });
Resizable.Root = Resizable;
Resizable.Panel = createPart('panel', 'div', 'Resizable.Panel');
Resizable.Handle = createPart('handle', 'div', 'Resizable.Handle');

export const FileUpload = createReactComponent('ui-file-upload', 'FileUpload', { onChange: 'change' });
FileUpload.Root = FileUpload;
FileUpload.Dropzone = createPart('dropzone', 'div', 'FileUpload.Dropzone');

export const ContextMenu = createReactComponent('ui-context-menu', 'ContextMenu', { onSelect: 'select', onOpen: 'open', onClose: 'close' });
ContextMenu.Root = ContextMenu;
ContextMenu.Trigger = createPart('trigger', 'div', 'ContextMenu.Trigger');
ContextMenu.Menu = createPart('menu', 'ul', 'ContextMenu.Menu');
ContextMenu.Item = createPart('item', 'li', 'ContextMenu.Item');

export const NavigationMenu = createReactComponent('ui-navigation-menu', 'NavigationMenu', { onOpen: 'open', onClose: 'close' });
NavigationMenu.Root = NavigationMenu;
NavigationMenu.Item = createPart('item', 'div', 'NavigationMenu.Item');
NavigationMenu.Trigger = createPart('trigger', 'button', 'NavigationMenu.Trigger');
NavigationMenu.Content = createPart('content', 'div', 'NavigationMenu.Content');

export const TreeView = createReactComponent('ui-tree-view', 'TreeView', { onSelect: 'select', onToggle: 'toggle' });
TreeView.Root = TreeView;
TreeView.Item = createPart('item', 'li', 'TreeView.Item');

export const AiPromptBox = createReactComponent('ui-ai-prompt-box', 'AiPromptBox', { onSubmit: 'submit', onStop: 'stop', onInput: 'input' });
export const ColorPicker = createReactComponent('ui-color-picker', 'ColorPicker', { onChange: 'change', onInput: 'input', onOpen: 'open', onClose: 'close' });
ColorPicker.Root = ColorPicker;
ColorPicker.Swatch = createPart('swatch', 'button', 'ColorPicker.Swatch');
ColorPicker.Input = createPart('input', 'input', 'ColorPicker.Input');

export const Sparkline = createReactComponent('ui-sparkline', 'Sparkline', { onHoverPoint: 'hoverpoint' });

export const Dock = createReactComponent('ui-dock', 'Dock', { onSelect: 'select' });
Dock.Root = Dock;
Dock.Item = createPart('item', 'button', 'Dock.Item');

export const Timeline = createReactComponent('ui-timeline', 'Timeline', { onStepClick: 'stepclick' });
Timeline.Root = Timeline;
Timeline.Item = createPart('item', 'div', 'Timeline.Item');
Timeline.Marker = createPart('marker', 'span', 'Timeline.Marker');
Timeline.Connector = createPart('connector', 'span', 'Timeline.Connector');
Timeline.Content = createPart('content', 'div', 'Timeline.Content');
Timeline.Title = createPart('title', 'h5', 'Timeline.Title');
Timeline.Description = createPart('description', 'p', 'Timeline.Description');
Timeline.Time = createPart('time', 'span', 'Timeline.Time');

export const AiReasoning = createReactComponent('ui-ai-reasoning', 'AiReasoning', {
  onToggle: 'toggle',
  onCopy: 'copy',
  onStatusChange: 'statuschange',
});
AiReasoning.Root = AiReasoning;
AiReasoning.Header = createPart('header', 'div', 'AiReasoning.Header');
AiReasoning.Beacon = createPart('beacon', 'span', 'AiReasoning.Beacon');
AiReasoning.Summary = createPart('summary', 'span', 'AiReasoning.Summary');
AiReasoning.Actions = createPart('actions', 'div', 'AiReasoning.Actions');
AiReasoning.Copy = createPart('copy', 'button', 'AiReasoning.Copy');
AiReasoning.Toggle = createPart('toggle', 'button', 'AiReasoning.Toggle');
AiReasoning.Stream = createPart('stream', 'div', 'AiReasoning.Stream');

export const AiToolCall = createReactComponent('ui-ai-tool-call', 'AiToolCall', {
  onToggle: 'toggle',
  onRetry: 'retry',
  onCopy: 'copy',
});
AiToolCall.Root = AiToolCall;
AiToolCall.Header = createPart('header', 'div', 'AiToolCall.Header');
AiToolCall.Info = createPart('info', 'div', 'AiToolCall.Info');
AiToolCall.Name = createPart('name', 'span', 'AiToolCall.Name');
AiToolCall.StatusBadge = createPart('status-badge', 'span', 'AiToolCall.StatusBadge');
AiToolCall.Latency = createPart('latency', 'span', 'AiToolCall.Latency');
AiToolCall.Actions = createPart('actions', 'div', 'AiToolCall.Actions');
AiToolCall.Retry = createPart('retry', 'button', 'AiToolCall.Retry');
AiToolCall.Copy = createPart('copy', 'button', 'AiToolCall.Copy');
AiToolCall.Inspector = createPart('inspector', 'div', 'AiToolCall.Inspector');
AiToolCall.Args = createPart('args', 'div', 'AiToolCall.Args');
AiToolCall.Output = createPart('output', 'div', 'AiToolCall.Output');

export const AiApproval = createReactComponent('ui-ai-approval', 'AiApproval', {
  onApprove: 'approve',
  onReject: 'reject',
});
AiApproval.Root = AiApproval;
AiApproval.Header = createPart('header', 'div', 'AiApproval.Header');
AiApproval.Title = createPart('title', 'h5', 'AiApproval.Title');
AiApproval.SeverityBadge = createPart('severity-badge', 'span', 'AiApproval.SeverityBadge');
AiApproval.Payload = createPart('payload', 'div', 'AiApproval.Payload');
AiApproval.Actions = createPart('actions', 'div', 'AiApproval.Actions');
AiApproval.Approve = createPart('approve', 'button', 'AiApproval.Approve');
AiApproval.Reject = createPart('reject', 'button', 'AiApproval.Reject');
AiApproval.AuditBadge = createPart('audit-badge', 'div', 'AiApproval.AuditBadge');

/**
 * Platform-Native Input Component
 * Automatically wraps with input-group when icons or kbd badges are provided.
 */
export const Input = forwardRef(function Input(props, ref) {
  const {
    className = '',
    size = 'md',
    icon,
    rightIcon,
    kbd,
    error,
    clearable,
    onClear,
    type = 'text',
    disabled,
    ...rest
  } = props;

  const hasLeft = Boolean(icon);
  const hasRight = Boolean(rightIcon || kbd || clearable);
  const isInvalid = Boolean(error);

  const inputEl = React.createElement('input', {
    ref,
    type,
    disabled,
    'data-ui': 'input',
    'data-size': size !== 'md' ? size : undefined,
    'aria-invalid': isInvalid ? 'true' : undefined,
    className: `ui-input ${size !== 'md' ? `ui-input-${size}` : ''} ${isInvalid ? 'is-invalid' : ''} ${className}`.trim(),
    ...rest,
  });

  if (!hasLeft && !hasRight) {
    return inputEl;
  }

  const children = [];

  if (hasLeft) {
    children.push(
      React.createElement(
        'span',
        {
          key: 'icon-left',
          'data-part': 'input-icon-left',
          className: 'ui-input-icon-left',
          'aria-hidden': 'true',
        },
        icon
      )
    );
  }

  children.push(React.cloneElement(inputEl, { key: 'input' }));

  if (hasRight) {
    const rightChildren = [];
    if (kbd) {
      rightChildren.push(
        React.createElement(
          'kbd',
          {
            key: 'kbd',
            'data-part': 'input-kbd',
            className: 'ui-kbd',
          },
          kbd
        )
      );
    }
    if (clearable) {
      rightChildren.push(
        React.createElement(
          'button',
          {
            key: 'clear',
            type: 'button',
            tabIndex: -1,
            'data-part': 'input-clear',
            className: 'ui-input-clear',
            onClick: onClear,
            'aria-label': 'Clear input',
          },
          '✕'
        )
      );
    }
    if (rightIcon) {
      rightChildren.push(React.cloneElement(rightIcon, { key: 'custom-right' }));
    }

    children.push(
      React.createElement(
        'span',
        {
          key: 'icon-right',
          'data-part': 'input-icon-right',
          className: 'ui-input-icon-right',
        },
        rightChildren
      )
    );
  }

  return React.createElement(
    'div',
    {
      'data-part': 'input-group',
      'data-ui': 'input-group',
      className: 'ui-input-group',
    },
    children
  );
});

Input.displayName = 'Input';

/**
 * Flexible Input Group container for composable inputs & addons
 */
export const InputGroup = forwardRef(function InputGroup({ className = '', children, ...rest }, ref) {
  return React.createElement(
    'div',
    {
      ref,
      'data-part': 'input-group',
      'data-ui': 'input-group',
      className: `ui-input-group ${className}`.trim(),
      ...rest,
    },
    children
  );
});

InputGroup.displayName = 'InputGroup';

/**
 * Keyboard Shortcut Badge (<kbd>)
 */
export const Kbd = forwardRef(function Kbd({ className = '', children, ...rest }, ref) {
  return React.createElement(
    'kbd',
    {
      ref,
      'data-part': 'input-kbd',
      className: `ui-kbd ${className}`.trim(),
      ...rest,
    },
    children
  );
});

Kbd.displayName = 'Kbd';

/**
 * =========================================================================
 * Tier 0: Platform-Native Semantic Primitives (React Wrappers)
 * =========================================================================
 */

export const Button = forwardRef(function Button({ as: Tag = 'button', variant = 'primary', size = 'md', fullWidth, className = '', children, ...props }, ref) {
  const isNativeButton = Tag === 'button';
  return React.createElement(
    Tag,
    {
      ref,
      type: isNativeButton ? (props.type || 'button') : undefined,
      'data-ui': 'button',
      'data-variant': variant,
      'data-size': size !== 'md' ? size : undefined,
      'data-full-width': fullWidth ? '' : undefined,
      className: `ui-button ${variant ? `ui-button--${variant}` : ''} ${className}`.trim(),
      ...props,
    },
    children
  );
});
Button.displayName = 'Button';

export const Badge = forwardRef(function Badge({ as: Tag = 'span', variant = 'default', size = 'md', className = '', children, ...props }, ref) {
  return React.createElement(
    Tag,
    {
      ref,
      'data-ui': 'badge',
      'data-variant': variant,
      'data-size': size !== 'md' ? size : undefined,
      className: `ui-badge ${className}`.trim(),
      ...props,
    },
    children
  );
});
Badge.displayName = 'Badge';

export const Card = forwardRef(function Card({ as: Tag = 'div', className = '', children, ...props }, ref) {
  return React.createElement(
    Tag,
    {
      ref,
      'data-ui': 'card',
      className: `ui-card ${className}`.trim(),
      ...props,
    },
    children
  );
});
Card.displayName = 'Card';
Card.Root = Card;
Card.Header = createPart('card-header', 'div', 'Card.Header');
Card.Title = createPart('card-title', 'h3', 'Card.Title');
Card.Description = createPart('card-description', 'p', 'Card.Description');
Card.Content = createPart('card-content', 'div', 'Card.Content');
Card.Body = Card.Content;
Card.Footer = createPart('card-footer', 'div', 'Card.Footer');

export const Alert = forwardRef(function Alert({ as: Tag = 'div', variant = 'info', className = '', children, ...props }, ref) {
  return React.createElement(
    Tag,
    {
      ref,
      role: 'alert',
      'data-ui': 'alert',
      'data-variant': variant,
      className: `ui-alert ${className}`.trim(),
      ...props,
    },
    children
  );
});
Alert.displayName = 'Alert';
Alert.Root = Alert;
Alert.Title = createPart('alert-title', 'h5', 'Alert.Title');
Alert.Description = createPart('alert-description', 'div', 'Alert.Description');

export const Avatar = forwardRef(function Avatar({ as: Tag = 'div', size = 'md', src, alt = '', fallback, className = '', children, ...props }, ref) {
  return React.createElement(
    Tag,
    {
      ref,
      'data-ui': 'avatar',
      'data-size': size !== 'md' ? size : undefined,
      className: `ui-avatar ${className}`.trim(),
      ...props,
    },
    src ? React.createElement('img', { key: 'avatar-img', src, alt, 'data-part': 'image' }) : null,
    fallback ? React.createElement('span', { key: 'avatar-fallback', 'data-part': 'fallback' }, fallback) : null,
    children
  );
});
Avatar.displayName = 'Avatar';
Avatar.Root = Avatar;
Avatar.Image = createPart('image', 'img', 'Avatar.Image');
Avatar.Fallback = createPart('fallback', 'span', 'Avatar.Fallback');

export const Checkbox = forwardRef(function Checkbox({ label, description, className = '', error, ...props }, ref) {
  return React.createElement(
    'label',
    {
      'data-ui': 'checkbox',
      className: `ui-checkbox ${error ? 'is-invalid' : ''} ${className}`.trim(),
    },
    React.createElement('input', {
      ref,
      type: 'checkbox',
      'aria-invalid': error ? 'true' : undefined,
      ...props,
    }),
    label ? React.createElement('span', { key: 'chk-lbl', 'data-part': 'label' }, label) : null,
    description ? React.createElement('span', { key: 'chk-desc', 'data-part': 'description' }, description) : null
  );
});
Checkbox.displayName = 'Checkbox';

export const Switch = forwardRef(function Switch({ label, className = '', ...props }, ref) {
  return React.createElement(
    'label',
    {
      'data-ui': 'switch',
      className: `ui-switch ${className}`.trim(),
    },
    React.createElement('input', {
      ref,
      type: 'checkbox',
      role: 'switch',
      ...props,
    }),
    React.createElement('span', { key: 'sw-thumb', 'data-part': 'thumb' }),
    label ? React.createElement('span', { key: 'sw-lbl', 'data-part': 'label' }, label) : null
  );
});
Switch.displayName = 'Switch';

export const Progress = forwardRef(function Progress({ value = 0, max = 100, className = '', ...props }, ref) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  return React.createElement(
    'div',
    {
      ref,
      role: 'progressbar',
      'aria-valuenow': value,
      'aria-valuemin': 0,
      'aria-valuemax': max,
      'data-ui': 'progress',
      className: `ui-progress ${className}`.trim(),
      ...props,
    },
    React.createElement('div', {
      'data-part': 'indicator',
      style: { width: `${percentage}%` },
    })
  );
});
Progress.displayName = 'Progress';

export const Separator = forwardRef(function Separator({ orientation = 'horizontal', label, className = '', ...props }, ref) {
  if (label) {
    return React.createElement(
      'div',
      {
        ref,
        role: 'separator',
        'data-ui': 'separator',
        'data-orientation': orientation,
        className: `ui-separator ${className}`.trim(),
        ...props,
      },
      React.createElement('span', { 'data-part': 'label' }, label)
    );
  }
  return React.createElement('hr', {
    ref,
    'data-ui': 'separator',
    'data-orientation': orientation,
    className: `ui-separator ${className}`.trim(),
    ...props,
  });
});
Separator.displayName = 'Separator';

export const Skeleton = forwardRef(function Skeleton({ className = '', width, height, circle, style, ...props }, ref) {
  return React.createElement(
    'div',
    {
      ref,
      'data-ui': 'skeleton',
      className: `ui-skeleton ${circle ? 'ui-skeleton--circle' : ''} ${className}`.trim(),
      style: {
        width,
        height,
        borderRadius: circle ? '50%' : undefined,
        ...style,
      },
      ...props,
    }
  );
});
Skeleton.displayName = 'Skeleton';

export const Spinner = forwardRef(function Spinner({ size = 'md', className = '', ...props }, ref) {
  return React.createElement(
    'div',
    {
      ref,
      role: 'status',
      'aria-label': 'Loading',
      'data-ui': 'spinner',
      'data-size': size !== 'md' ? size : undefined,
      className: `ui-spinner ${className}`.trim(),
      ...props,
    }
  );
});
Spinner.displayName = 'Spinner';

export const Empty = forwardRef(function Empty({ className = '', children, ...props }, ref) {
  return React.createElement(
    'div',
    {
      ref,
      'data-ui': 'empty',
      className: `ui-empty ${className}`.trim(),
      ...props,
    },
    children
  );
});
Empty.displayName = 'Empty';
Empty.Root = Empty;
Empty.Icon = createPart('empty-icon', 'div', 'Empty.Icon');
Empty.Title = createPart('empty-title', 'h4', 'Empty.Title');
Empty.Description = createPart('empty-description', 'p', 'Empty.Description');
Empty.Action = createPart('empty-action', 'div', 'Empty.Action');

export const Stack = forwardRef(function Stack({ direction = 'column', gap = 'md', align, justify, className = '', children, ...props }, ref) {
  return React.createElement(
    'div',
    {
      ref,
      'data-ui': 'stack',
      'data-direction': direction,
      'data-gap': gap,
      'data-align': align,
      'data-justify': justify,
      className: `ui-stack ${className}`.trim(),
      ...props,
    },
    children
  );
});
Stack.displayName = 'Stack';

export const Grid = forwardRef(function Grid({ cols = 1, gap = 'md', className = '', children, ...props }, ref) {
  return React.createElement(
    'div',
    {
      ref,
      'data-ui': 'grid',
      'data-cols': cols,
      'data-gap': gap,
      className: `ui-grid ${className}`.trim(),
      ...props,
    },
    children
  );
});
Grid.displayName = 'Grid';

export const Container = forwardRef(function Container({ size = 'lg', className = '', children, ...props }, ref) {
  return React.createElement(
    'div',
    {
      ref,
      'data-ui': 'container',
      'data-size': size,
      className: `ui-container ${className}`.trim(),
      ...props,
    },
    children
  );
});
Container.displayName = 'Container';

export const Table = forwardRef(function Table({ className = '', children, ...props }, ref) {
  return React.createElement(
    'table',
    {
      ref,
      'data-ui': 'table',
      className: `ui-table ${className}`.trim(),
      ...props,
    },
    children
  );
});
Table.displayName = 'Table';
Table.Root = Table;
Table.Header = createPart('table-header', 'thead', 'Table.Header');
Table.Body = createPart('table-body', 'tbody', 'Table.Body');
Table.Row = createPart('table-row', 'tr', 'Table.Row');
Table.Head = createPart('table-head', 'th', 'Table.Head');
Table.Cell = createPart('table-cell', 'td', 'Table.Cell');

export { toast, register };


