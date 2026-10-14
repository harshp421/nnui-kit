import * as React from 'react';
import {
  UiTabsElement,
  UiComboboxElement,
  UiDialogElement,
  UiSelectElement,
  UiAccordionElement,
  UiPopoverElement,
  UiTooltipElement,
  UiCommandElement,
  UiSheetElement,
  UiSliderElement,
  UiDropdownElement,
  UiToasterElement,
  UiDataTableElement,
  UiCalendarElement,
  UiDatePickerElement,
  UiDataGridElement,
  UiDateRangePickerElement,
  UiTagsInputElement,
  UiSegmentedControlElement,
  UiOtpInputElement,
  UiStepperElement,
  UiResizableElement,
  UiFileUploadElement,
  UiContextMenuElement,
  UiNavigationMenuElement,
  UiTreeViewElement,
  UiAiPromptBoxElement,
  UiColorPickerElement,
  toast,
  register,
} from './index';

export type HTMLNNUIProps<T> = React.HTMLAttributes<T> & {
  ref?: React.Ref<T>;
  children?: React.ReactNode;
  [key: string]: any;
};

export declare function createReactComponent<T = HTMLElement>(
  tagName: string,
  displayName: string,
  eventMap?: Record<string, string>
): React.ForwardRefExoticComponent<HTMLNNUIProps<T>>;

export declare const Tabs: React.ForwardRefExoticComponent<HTMLNNUIProps<UiTabsElement>>;
export declare const Combobox: React.ForwardRefExoticComponent<HTMLNNUIProps<UiComboboxElement>>;
export declare const Dialog: React.ForwardRefExoticComponent<HTMLNNUIProps<UiDialogElement>>;
export declare const Select: React.ForwardRefExoticComponent<HTMLNNUIProps<UiSelectElement>>;
export declare const Accordion: React.ForwardRefExoticComponent<HTMLNNUIProps<UiAccordionElement>>;
export declare const Popover: React.ForwardRefExoticComponent<HTMLNNUIProps<UiPopoverElement>>;
export declare const Tooltip: React.ForwardRefExoticComponent<HTMLNNUIProps<UiTooltipElement>>;
export declare const Command: React.ForwardRefExoticComponent<HTMLNNUIProps<UiCommandElement>>;
export declare const Sheet: React.ForwardRefExoticComponent<HTMLNNUIProps<UiSheetElement>>;
export declare const Slider: React.ForwardRefExoticComponent<HTMLNNUIProps<UiSliderElement>>;
export declare const Dropdown: React.ForwardRefExoticComponent<HTMLNNUIProps<UiDropdownElement>>;
export declare const Toaster: React.ForwardRefExoticComponent<HTMLNNUIProps<UiToasterElement>>;
export declare const DataTable: React.ForwardRefExoticComponent<HTMLNNUIProps<UiDataTableElement>>;
export declare const Calendar: React.ForwardRefExoticComponent<HTMLNNUIProps<UiCalendarElement>>;
export declare const DatePicker: React.ForwardRefExoticComponent<HTMLNNUIProps<UiDatePickerElement>>;
export declare const DataGrid: React.ForwardRefExoticComponent<HTMLNNUIProps<UiDataGridElement>>;
export declare const DateRangePicker: React.ForwardRefExoticComponent<HTMLNNUIProps<UiDateRangePickerElement>>;
export declare const TagsInput: React.ForwardRefExoticComponent<HTMLNNUIProps<UiTagsInputElement>>;
export declare const SegmentedControl: React.ForwardRefExoticComponent<HTMLNNUIProps<UiSegmentedControlElement>>;
export declare const OtpInput: React.ForwardRefExoticComponent<HTMLNNUIProps<UiOtpInputElement>>;
export declare const Stepper: React.ForwardRefExoticComponent<HTMLNNUIProps<UiStepperElement>>;
export declare const Resizable: React.ForwardRefExoticComponent<HTMLNNUIProps<UiResizableElement>>;
export declare const FileUpload: React.ForwardRefExoticComponent<HTMLNNUIProps<UiFileUploadElement>>;
export declare const ContextMenu: React.ForwardRefExoticComponent<HTMLNNUIProps<UiContextMenuElement>>;
export declare const NavigationMenu: React.ForwardRefExoticComponent<HTMLNNUIProps<UiNavigationMenuElement>>;
export declare const TreeView: React.ForwardRefExoticComponent<HTMLNNUIProps<UiTreeViewElement>>;
export declare const AiPromptBox: React.ForwardRefExoticComponent<HTMLNNUIProps<UiAiPromptBoxElement>>;
export declare const ColorPicker: React.ForwardRefExoticComponent<HTMLNNUIProps<UiColorPickerElement>>;

export { toast, register };
