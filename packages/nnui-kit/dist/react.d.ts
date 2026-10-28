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
  UiChangeEventDetail,
  toast,
  register,
} from './index';

/**
 * Base utility type mapping HTML attributes safely without loose [key: string]: any index signature.
 */
export type NNUIProps<E, P = {}> = Omit<React.HTMLAttributes<E>, keyof P | 'onChange' | 'onInput' | 'onSelect'> &
  P & {
    ref?: React.Ref<E>;
    children?: React.ReactNode;
  };

// Backward-compatible alias
export type HTMLNNUIProps<T> = NNUIProps<T>;

export declare function createReactComponent<T = HTMLElement, P = {}>(
  tagName: string,
  displayName: string,
  eventMap?: Record<string, string>
): React.ForwardRefExoticComponent<NNUIProps<T, P>>;

// --- Component Props Interfaces with Full Autocomplete & JSDoc ---

export interface TabsProps {
  /** Currently active tab identifier value */
  value?: string;
  /** Keyboard navigation direction */
  orientation?: 'horizontal' | 'vertical';
  /** Fired when active tab changes */
  onChange?: (e: CustomEvent<UiChangeEventDetail>) => void;
}

export interface ComboboxProps {
  /** Selected option value */
  value?: string;
  /** Controls open state of the listbox popup */
  open?: boolean;
  /** Fired when option selection changes */
  onChange?: (e: CustomEvent<UiChangeEventDetail>) => void;
}

export interface DialogProps {
  /** Controls modal open visibility */
  open?: boolean;
  /** Fired when modal dialog opens */
  onOpen?: (e: CustomEvent) => void;
  /** Fired when modal dialog closes */
  onClose?: (e: CustomEvent<{ reason: string }>) => void;
}

export interface SelectProps {
  /** Native form submission field name */
  name?: string;
  /** Selected option value */
  value?: string;
  /** Native form validation required flag */
  required?: boolean;
  /** Disables select dropdown interaction */
  disabled?: boolean;
  /** Controls open state of the dropdown listbox */
  open?: boolean;
  /** Fired when select value changes */
  onChange?: (e: CustomEvent<UiChangeEventDetail>) => void;
  /** Fired on user input selection */
  onInput?: (e: CustomEvent<UiChangeEventDetail>) => void;
}

export interface AccordionProps {
  /** Accordion expansion mode */
  type?: 'single' | 'multiple';
  /** Allows closing all items when in single mode */
  collapsible?: boolean;
  /** Fired when accordion section toggles */
  onChange?: (e: CustomEvent<{ value: string; open: boolean }>) => void;
}

export interface PopoverProps {
  /** Controls popover open state */
  open?: boolean;
  /** Fired when popover toggles open/closed */
  onToggle?: (e: CustomEvent<{ open: boolean }>) => void;
}

export interface TooltipProps {
  /** Hover appearance delay in milliseconds (default: 200) */
  delay?: number;
}

export interface CommandProps {
  /** Controls command palette open visibility */
  open?: boolean;
  /** Keyboard shortcut trigger (e.g. "k" or "meta+k") */
  shortcut?: string;
  /** Fired when search input filters */
  onChange?: (e: CustomEvent<{ value: string; label: string; item: HTMLElement }>) => void;
  /** Fired when command item is selected */
  onSelect?: (e: CustomEvent<{ value: string; label: string; item: HTMLElement }>) => void;
  /** Fired when palette opens */
  onOpen?: (e: CustomEvent) => void;
  /** Fired when palette closes */
  onClose?: (e: CustomEvent) => void;
}

export interface SheetProps {
  /** Controls sheet slide-in visibility */
  open?: boolean;
  /** Screen docking edge */
  side?: 'right' | 'left' | 'top' | 'bottom';
  /** Fired when sheet opens */
  onOpen?: (e: CustomEvent) => void;
  /** Fired when sheet closes */
  onClose?: (e: CustomEvent) => void;
}

export interface SliderProps {
  /** Native form submission field name */
  name?: string;
  /** Current numeric value of the slider */
  value?: number;
  /** Minimum slider value (default: 0) */
  min?: number;
  /** Maximum slider value (default: 100) */
  max?: number;
  /** Stepping increment (default: 1) */
  step?: number;
  /** Disables slider interaction */
  disabled?: boolean;
  /** Fired on value change commit */
  onChange?: (e: CustomEvent<{ value: number }>) => void;
  /** Fired continuously during dragging */
  onInput?: (e: CustomEvent<{ value: number }>) => void;
}

export interface DropdownProps {
  /** Controls dropdown menu open state */
  open?: boolean;
  /** Fired when menu item is selected */
  onSelect?: (e: CustomEvent<{ value: string; item: HTMLElement }>) => void;
  /** Fired when dropdown opens */
  onOpen?: (e: CustomEvent) => void;
  /** Fired when dropdown closes */
  onClose?: (e: CustomEvent) => void;
}

export interface ToasterProps {
  /** Screen placement corner */
  position?: 'bottom-right' | 'top-right' | 'bottom-left' | 'top-left' | 'top-center' | 'bottom-center';
}

export interface DataTableProps {
  /** Number of rows per page */
  pageSize?: number;
  'page-size'?: number;
  /** Active 1-indexed page number */
  currentPage?: number;
  'current-page'?: number;
}

export interface CalendarProps {
  /** Selected date formatted as YYYY-MM-DD */
  value?: string;
  /** Earliest selectable date (YYYY-MM-DD) */
  min?: string;
  /** Latest selectable date (YYYY-MM-DD) */
  max?: string;
  /** Disables calendar interaction */
  disabled?: boolean;
  /** Fired when date is selected */
  onChange?: (e: CustomEvent<{ value: string; date: Date }>) => void;
}

export interface DatePickerProps {
  /** Selected date formatted as YYYY-MM-DD */
  value?: string;
  /** Input trigger placeholder */
  placeholder?: string;
  /** Disables date picker interaction */
  disabled?: boolean;
  /** Controls open state of calendar popover */
  open?: boolean;
  /** Fired when date selection changes */
  onChange?: (e: CustomEvent<{ value: string; date: Date }>) => void;
  /** Fired when calendar opens */
  onOpen?: (e: CustomEvent) => void;
  /** Fired when calendar closes */
  onClose?: (e: CustomEvent) => void;
}

export interface DataGridProps {
  /** Pixel height of each virtual row (default: 40) */
  rowHeight?: number;
  'row-height'?: number;
  /** Buffer rows rendered outside visible viewport (default: 5) */
  overscan?: number;
  /** Active column sorting key */
  sortKey?: string;
  'sort-key'?: string;
  /** Active sort direction */
  sortDir?: 'asc' | 'desc';
  'sort-dir'?: 'asc' | 'desc';
  /** Text search filter across virtualized dataset */
  search?: string;
  /** Enables high-throughput append optimizations for streaming */
  streaming?: boolean;
  /** State persistence mode ('url' | 'local' | 'session') */
  persist?: 'url' | 'local' | 'session' | string;
  /** Cross-tab state synchronization ('cross-tab') */
  sync?: 'cross-tab' | string;
  /** Fired when column sorting changes */
  onSort?: (e: CustomEvent<{ key: string; direction: string }>) => void;
  /** Fired when row selection changes */
  onSelectionChange?: (e: CustomEvent<{ selectedIds: string[]; selectedCount: number }>) => void;
  /** Fired when streaming rows are appended */
  onStreamUpdate?: (e: CustomEvent<{ addedCount: number; totalCount: number }>) => void;
}

export interface DateRangePickerProps {
  /** Start date formatted as YYYY-MM-DD */
  startDate?: string;
  'start-date'?: string;
  /** End date formatted as YYYY-MM-DD */
  endDate?: string;
  'end-date'?: string;
  /** Input display placeholder */
  placeholder?: string;
  /** Disables date range picker interaction */
  disabled?: boolean;
  /** Controls calendar popover open state */
  open?: boolean;
  /** State persistence mode */
  persist?: 'url' | 'local' | 'session' | string;
  /** Fired when date range changes */
  onChange?: (e: CustomEvent<{ start: string; end: string; range: [Date, Date] }>) => void;
}

export interface TagsInputProps {
  /** Comma-separated initial tag values */
  tags?: string;
  /** Input placeholder string */
  placeholder?: string;
  /** Maximum number of tags allowed */
  maxTags?: number;
  'max-tags'?: number;
  /** Disables tag input interaction */
  disabled?: boolean;
  /** Fired when tag list updates */
  onChange?: (e: CustomEvent<{ tags: string[] }>) => void;
}

export interface SegmentedControlProps {
  /** Active segment value */
  value?: string;
  /** Form submission field name */
  name?: string;
  /** Disables control interaction */
  disabled?: boolean;
  /** Fired when active segment changes */
  onChange?: (e: CustomEvent<UiChangeEventDetail>) => void;
}

export interface OtpInputProps {
  /** Total number of PIN digit inputs (default: 6) */
  length?: number;
  /** Current entered OTP string */
  value?: string;
  /** Character constraint mode */
  type?: 'number' | 'text' | 'alphanumeric';
  /** Mask characters with bullets like password */
  mask?: boolean;
  /** Disables OTP inputs */
  disabled?: boolean;
  /** Fired on OTP change or completion */
  onChange?: (e: CustomEvent<{ value: string; isComplete: boolean }>) => void;
  /** Fired continuously on keystroke */
  onInput?: (e: CustomEvent<{ value: string; isComplete: boolean }>) => void;
}

export interface StepperProps {
  /** Active step index or identifier */
  value?: string | number;
  /** Stepper layout orientation */
  orientation?: 'horizontal' | 'vertical';
  /** Enforces sequential completion of steps */
  linear?: boolean;
  /** Synchronizes active step across browser tabs */
  sync?: 'cross-tab' | string;
  /** Fired when active step changes */
  onChange?: (e: CustomEvent<{ currentStep: number; stepId: string }>) => void;
}

export interface ResizableProps {
  /** Split divider orientation */
  direction?: 'horizontal' | 'vertical';
  /** Minimum pane percentage (default: 10) */
  minSize?: number;
  'min-size'?: number;
  /** Maximum pane percentage (default: 90) */
  maxSize?: number;
  'max-size'?: number;
  /** Fired when pane size changes */
  onResize?: (e: CustomEvent<{ sizes: number[] }>) => void;
}

export interface FileUploadProps {
  /** Accepted MIME types or extensions (e.g. "image/*,.pdf") */
  accept?: string;
  /** Allows multiple simultaneous file selection */
  multiple?: boolean;
  /** Maximum allowed file size in bytes */
  maxSize?: number;
  'max-size'?: number;
  /** Disables file dropzone */
  disabled?: boolean;
  /** Fired when files are dropped or selected */
  onChange?: (e: CustomEvent<{ files: File[]; rejectedFiles?: any[] }>) => void;
}

export interface ContextMenuProps {
  /** Disables right-click context menu override */
  disabled?: boolean;
  /** Fired when context menu opens */
  onOpen?: (e: CustomEvent<{ x: number; y: number }>) => void;
  /** Fired when context menu closes */
  onClose?: (e: CustomEvent) => void;
  /** Fired when context menu item is selected */
  onSelect?: (e: CustomEvent<{ value: string; item: HTMLElement }>) => void;
}

export interface NavigationMenuProps {
  /** Hover intent opening delay in milliseconds */
  delay?: number;
  /** Disables navigation menu */
  disabled?: boolean;
  /** Fired when sub-menu opens */
  onOpen?: (e: CustomEvent<{ item: HTMLElement }>) => void;
  /** Fired when sub-menu closes */
  onClose?: (e: CustomEvent<{ item: HTMLElement }>) => void;
}

export interface TreeViewProps {
  /** Tree selection mode */
  selectionMode?: 'single' | 'multiple';
  'selection-mode'?: 'single' | 'multiple';
  /** Disables tree interaction */
  disabled?: boolean;
  /** Fired when tree node is selected */
  onSelect?: (e: CustomEvent<{ item: HTMLElement; value: string; selected: boolean }>) => void;
  /** Fired when tree node is expanded or collapsed */
  onToggle?: (e: CustomEvent<{ item: HTMLElement; expanded: boolean }>) => void;
}

export interface AiPromptBoxProps {
  /** Maximum textarea expansion rows (default: 8) */
  maxRows?: number;
  'max-rows'?: number;
  /** Enables generation progress and changes submit to stop */
  loading?: boolean;
  /** Disables textarea prompt input */
  disabled?: boolean;
  /** Textarea placeholder text */
  placeholder?: string;
  /** Persists user prompt draft in storage */
  persist?: 'url' | 'local' | 'session' | string;
  /** Fired when user submits prompt */
  onSubmit?: (e: CustomEvent<{ prompt: string }>) => void;
  /** Fired when user clicks stop button */
  onStop?: (e: CustomEvent) => void;
  /** Fired on prompt textarea keystroke */
  onInput?: (e: CustomEvent<{ value: string }>) => void;
}

export interface ColorPickerProps {
  /** Current color string (e.g. "#6366f1") */
  value?: string;
  /** Native form field name */
  name?: string;
  /** Output color representation */
  format?: 'hex' | 'rgb' | 'hsl' | 'oklch';
  /** Disables color picker */
  disabled?: boolean;
  /** Fired on color change commit */
  onChange?: (e: CustomEvent<{ value: string }>) => void;
  /** Fired continuously during color dragging */
  onInput?: (e: CustomEvent<{ value: string }>) => void;
}

// --- React Wrapped Components with Strict Prop Typing ---

export declare const Tabs: React.ForwardRefExoticComponent<NNUIProps<UiTabsElement, TabsProps>>;
export declare const Combobox: React.ForwardRefExoticComponent<NNUIProps<UiComboboxElement, ComboboxProps>>;
export declare const Dialog: React.ForwardRefExoticComponent<NNUIProps<UiDialogElement, DialogProps>>;
export declare const Select: React.ForwardRefExoticComponent<NNUIProps<UiSelectElement, SelectProps>>;
export declare const Accordion: React.ForwardRefExoticComponent<NNUIProps<UiAccordionElement, AccordionProps>>;
export declare const Popover: React.ForwardRefExoticComponent<NNUIProps<UiPopoverElement, PopoverProps>>;
export declare const Tooltip: React.ForwardRefExoticComponent<NNUIProps<UiTooltipElement, TooltipProps>>;
export declare const Command: React.ForwardRefExoticComponent<NNUIProps<UiCommandElement, CommandProps>>;
export declare const Sheet: React.ForwardRefExoticComponent<NNUIProps<UiSheetElement, SheetProps>>;
export declare const Slider: React.ForwardRefExoticComponent<NNUIProps<UiSliderElement, SliderProps>>;
export declare const Dropdown: React.ForwardRefExoticComponent<NNUIProps<UiDropdownElement, DropdownProps>>;
export declare const Toaster: React.ForwardRefExoticComponent<NNUIProps<UiToasterElement, ToasterProps>>;
export declare const DataTable: React.ForwardRefExoticComponent<NNUIProps<UiDataTableElement, DataTableProps>>;
export declare const Calendar: React.ForwardRefExoticComponent<NNUIProps<UiCalendarElement, CalendarProps>>;
export declare const DatePicker: React.ForwardRefExoticComponent<NNUIProps<UiDatePickerElement, DatePickerProps>>;
export declare const DataGrid: React.ForwardRefExoticComponent<NNUIProps<UiDataGridElement, DataGridProps>>;
export declare const DateRangePicker: React.ForwardRefExoticComponent<NNUIProps<UiDateRangePickerElement, DateRangePickerProps>>;
export declare const TagsInput: React.ForwardRefExoticComponent<NNUIProps<UiTagsInputElement, TagsInputProps>>;
export declare const SegmentedControl: React.ForwardRefExoticComponent<NNUIProps<UiSegmentedControlElement, SegmentedControlProps>>;
export declare const OtpInput: React.ForwardRefExoticComponent<NNUIProps<UiOtpInputElement, OtpInputProps>>;
export declare const Stepper: React.ForwardRefExoticComponent<NNUIProps<UiStepperElement, StepperProps>>;
export declare const Resizable: React.ForwardRefExoticComponent<NNUIProps<UiResizableElement, ResizableProps>>;
export declare const FileUpload: React.ForwardRefExoticComponent<NNUIProps<UiFileUploadElement, FileUploadProps>>;
export declare const ContextMenu: React.ForwardRefExoticComponent<NNUIProps<UiContextMenuElement, ContextMenuProps>>;
export declare const NavigationMenu: React.ForwardRefExoticComponent<NNUIProps<UiNavigationMenuElement, NavigationMenuProps>>;
export declare const TreeView: React.ForwardRefExoticComponent<NNUIProps<UiTreeViewElement, TreeViewProps>>;
export declare const AiPromptBox: React.ForwardRefExoticComponent<NNUIProps<UiAiPromptBoxElement, AiPromptBoxProps>>;
export declare const ColorPicker: React.ForwardRefExoticComponent<NNUIProps<UiColorPickerElement, ColorPickerProps>>;

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  kbd?: string | React.ReactNode;
  error?: boolean | string;
  clearable?: boolean;
  onClear?: () => void;
}

export declare const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>>;
export declare const InputGroup: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>;
export declare const Kbd: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLElement> & React.RefAttributes<HTMLElement>>;

// Tier 0 Semantic Primitives
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  as?: any;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'danger' | 'link' | 'subtle';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'icon';
  fullWidth?: boolean;
}
export declare const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>;

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  as?: any;
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
}
export declare const Badge: React.ForwardRefExoticComponent<BadgeProps & React.RefAttributes<HTMLSpanElement>>;

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: any;
}
export interface CardComponent extends React.ForwardRefExoticComponent<CardProps & React.RefAttributes<HTMLDivElement>> {
  Root: React.ForwardRefExoticComponent<CardProps & React.RefAttributes<HTMLDivElement>>;
  Header: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement>>;
  Title: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLHeadingElement>>;
  Description: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLParagraphElement>>;
  Content: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement>>;
  Body: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement>>;
  Footer: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement>>;
}
export declare const Card: CardComponent;

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: any;
  variant?: 'info' | 'success' | 'warning' | 'destructive' | 'error';
}
export interface AlertComponent extends React.ForwardRefExoticComponent<AlertProps & React.RefAttributes<HTMLDivElement>> {
  Root: React.ForwardRefExoticComponent<AlertProps & React.RefAttributes<HTMLDivElement>>;
  Title: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLHeadingElement>>;
  Description: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement>>;
}
export declare const Alert: AlertComponent;

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: any;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  src?: string;
  alt?: string;
  fallback?: React.ReactNode;
}
export interface AvatarComponent extends React.ForwardRefExoticComponent<AvatarProps & React.RefAttributes<HTMLDivElement>> {
  Root: React.ForwardRefExoticComponent<AvatarProps & React.RefAttributes<HTMLDivElement>>;
  Image: React.ForwardRefExoticComponent<React.ImgHTMLAttributes<HTMLImageElement>>;
  Fallback: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLSpanElement>>;
}
export declare const Avatar: AvatarComponent;

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: boolean;
}
export declare const Checkbox: React.ForwardRefExoticComponent<CheckboxProps & React.RefAttributes<HTMLInputElement>>;

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
}
export declare const Switch: React.ForwardRefExoticComponent<SwitchProps & React.RefAttributes<HTMLInputElement>>;

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
}
export declare const Progress: React.ForwardRefExoticComponent<ProgressProps & React.RefAttributes<HTMLDivElement>>;

export interface SeparatorProps extends React.HTMLAttributes<HTMLElement> {
  orientation?: 'horizontal' | 'vertical';
  label?: string;
}
export declare const Separator: React.ForwardRefExoticComponent<SeparatorProps & React.RefAttributes<HTMLElement>>;

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  circle?: boolean;
}
export declare const Skeleton: React.ForwardRefExoticComponent<SkeletonProps & React.RefAttributes<HTMLDivElement>>;

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg';
}
export declare const Spinner: React.ForwardRefExoticComponent<SpinnerProps & React.RefAttributes<HTMLDivElement>>;

export interface EmptyProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface EmptyComponent extends React.ForwardRefExoticComponent<EmptyProps & React.RefAttributes<HTMLDivElement>> {
  Root: React.ForwardRefExoticComponent<EmptyProps & React.RefAttributes<HTMLDivElement>>;
  Icon: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement>>;
  Title: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLHeadingElement>>;
  Description: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLParagraphElement>>;
  Action: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement>>;
}
export declare const Empty: EmptyComponent;

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'column';
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | string;
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between';
}
export declare const Stack: React.ForwardRefExoticComponent<StackProps & React.RefAttributes<HTMLDivElement>>;

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: number | string;
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | string;
}
export declare const Grid: React.ForwardRefExoticComponent<GridProps & React.RefAttributes<HTMLDivElement>>;

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'fluid';
}
export declare const Container: React.ForwardRefExoticComponent<ContainerProps & React.RefAttributes<HTMLDivElement>>;

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {}
export interface TableComponent extends React.ForwardRefExoticComponent<TableProps & React.RefAttributes<HTMLTableElement>> {
  Root: React.ForwardRefExoticComponent<TableProps & React.RefAttributes<HTMLTableElement>>;
  Header: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLTableSectionElement>>;
  Body: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLTableSectionElement>>;
  Row: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLTableRowElement>>;
  Head: React.ForwardRefExoticComponent<React.ThHTMLAttributes<HTMLTableCellElement>>;
  Cell: React.ForwardRefExoticComponent<React.TdHTMLAttributes<HTMLTableCellElement>>;
}
export declare const Table: TableComponent;

export { toast, register };

