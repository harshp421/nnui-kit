'use client';

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

// React Wrapped Components
export const Tabs = createReactComponent('ui-tabs', 'Tabs', { onChange: 'change' });
export const Combobox = createReactComponent('ui-combobox', 'Combobox', { onChange: 'change' });
export const Dialog = createReactComponent('ui-dialog', 'Dialog', { onOpen: 'open', onClose: 'close' });
export const Select = createReactComponent('ui-select', 'Select', { onChange: 'change', onInput: 'input' });
export const Accordion = createReactComponent('ui-accordion', 'Accordion', { onChange: 'change' });
export const Popover = createReactComponent('ui-popover', 'Popover', { onToggle: 'toggle' });
export const Tooltip = createReactComponent('ui-tooltip', 'Tooltip');
export const Command = createReactComponent('ui-command', 'Command', { onChange: 'change', onSelect: 'select', onOpen: 'open', onClose: 'close' });
export const Sheet = createReactComponent('ui-sheet', 'Sheet', { onOpen: 'open', onClose: 'close' });
export const Slider = createReactComponent('ui-slider', 'Slider', { onChange: 'change', onInput: 'input' });
export const Dropdown = createReactComponent('ui-dropdown', 'Dropdown', { onSelect: 'select', onOpen: 'open', onClose: 'close' });
export const Toaster = createReactComponent('ui-toaster', 'Toaster');
export const DataTable = createReactComponent('ui-data-table', 'DataTable');
export const Calendar = createReactComponent('ui-calendar', 'Calendar', { onChange: 'change' });
export const DatePicker = createReactComponent('ui-date-picker', 'DatePicker', { onChange: 'change' });
export const DataGrid = createReactComponent('ui-data-grid', 'DataGrid', {
  onSelectionChange: 'selection-change',
  onSort: 'sort',
  onStreamUpdate: 'stream-update',
});
export const DateRangePicker = createReactComponent('ui-date-range-picker', 'DateRangePicker', { onChange: 'change' });
export const TagsInput = createReactComponent('ui-tags-input', 'TagsInput', { onChange: 'change' });
export const SegmentedControl = createReactComponent('ui-segmented-control', 'SegmentedControl', { onChange: 'change' });
export const OtpInput = createReactComponent('ui-otp-input', 'OtpInput', { onChange: 'change', onInput: 'input' });
export const Stepper = createReactComponent('ui-stepper', 'Stepper', { onChange: 'change' });
export const Resizable = createReactComponent('ui-resizable', 'Resizable', { onResize: 'resize' });
export const FileUpload = createReactComponent('ui-file-upload', 'FileUpload', { onChange: 'change' });
export const ContextMenu = createReactComponent('ui-context-menu', 'ContextMenu', { onSelect: 'select', onOpen: 'open', onClose: 'close' });
export const NavigationMenu = createReactComponent('ui-navigation-menu', 'NavigationMenu', { onOpen: 'open', onClose: 'close' });
export const TreeView = createReactComponent('ui-tree-view', 'TreeView', { onSelect: 'select', onToggle: 'toggle' });
export const AiPromptBox = createReactComponent('ui-ai-prompt-box', 'AiPromptBox', { onSubmit: 'submit', onStop: 'stop', onInput: 'input' });
export const ColorPicker = createReactComponent('ui-color-picker', 'ColorPicker', { onChange: 'change', onInput: 'input', onOpen: 'open', onClose: 'close' });

export { toast, register };
