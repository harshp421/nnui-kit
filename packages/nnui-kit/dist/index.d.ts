/**
 * TypeScript Definitions for NewAge UIKit
 * Provides full type support for standard DOM, React JSX, and Vue templates.
 */

export interface UiChangeEventDetail<T = string> {
  value: T;
  previousValue?: T;
  label?: string;
}

export interface UiTabsElement extends HTMLElement {
  value: string;
  orientation: 'horizontal' | 'vertical';
  selectTab(val: string): void;
}

export interface UiComboboxElement extends HTMLElement {
  value: string;
  isOpen: boolean;
  open(): void;
  close(): void;
  selectOption(optionNode: HTMLElement): void;
}

export interface UiDialogElement extends HTMLElement {
  isOpen: boolean;
  showModal(triggerElement?: HTMLElement | null): void;
  close(reason?: string): void;
}

export interface UiSelectElement extends HTMLElement {
  name: string;
  value: string;
  required: boolean;
  disabled: boolean;
  isOpen: boolean;
  open(): void;
  close(): void;
  toggle(): void;
}

export interface UiAccordionElement extends HTMLElement {
  type: 'single' | 'multiple';
  collapsible: boolean;
  toggleItem(itemElement: HTMLElement): void;
}

export interface UiPopoverElement extends HTMLElement {
  show(): void;
  hide(): void;
}

export interface UiTooltipElement extends HTMLElement {
  delay: number;
  show(): void;
  hide(): void;
}

export interface UiCommandElement extends HTMLElement {
  open: boolean;
  shortcut: string;
  filter(query: string): void;
  selectItem(item: HTMLElement): void;
  showModal(triggerElement?: HTMLElement | null): void;
  open(): void;
  close(): void;
  toggle(): void;
}

export interface UiSheetElement extends HTMLElement {
  open: boolean;
  side: 'right' | 'left' | 'top' | 'bottom';
  showModal(triggerElement?: HTMLElement | null): void;
  open(): void;
  close(reason?: string): void;
  toggle(): void;
}

export interface UiSliderElement extends HTMLElement {
  value: number;
  min: number;
  max: number;
  step: number;
  disabled: boolean;
  name: string;
}

export interface UiDropdownElement extends HTMLElement {
  isOpen: boolean;
  open(focusIndex?: number): void;
  close(): void;
  toggle(): void;
}

export interface UiDataTableElement extends HTMLElement {
  pageSize: number;
  currentPage: number;
  readonly totalPages: number;
  nextPage(): void;
  prevPage(): void;
  setPage(n: number): void;
  setSearch(q: string): void;
  getSelectedRowIds(): string[];
  selectAll(): void;
  deselectAll(): void;
  exportCsv(filename?: string): void;
}

export interface UiCalendarElement extends HTMLElement {
  value: string;
  month: number;
  year: number;
  selectDate(dateStr: string): void;
  prevMonth(): void;
  nextMonth(): void;
}

export interface UiDatePickerElement extends HTMLElement {
  value: string;
  readonly isOpen: boolean;
  open(): void;
  close(): void;
  toggle(): void;
}

export interface UiDataGridElement extends HTMLElement {
  rowHeight: number;
  overscan: number;
  readonly totalRows: number;
  readonly filteredCount: number;
  readonly selectedCount: number;
  setColumns(columns: Array<{ key: string; label: string; sortable?: boolean; width?: string; align?: string }>): void;
  setRows(rows: Array<Record<string, any>>): void;
  appendRows(newRows: Array<Record<string, any>>, options?: { autoScroll?: boolean }): void;
  setSearch(query: string): void;
  exportCsv(filename?: string): void;
  startStreaming(intervalMs?: number, generatorFn?: () => Array<Record<string, any>>): void;
  stopStreaming(): void;
}

export interface UiDateRangePickerElement extends HTMLElement {
  startDate: Date | null;
  endDate: Date | null;
  readonly isOpen: boolean;
  open(): void;
  close(): void;
  toggle(): void;
}

export interface UiTagsInputElement extends HTMLElement {
  tags: string[];
  maxTags: number;
  addTag(tagText: string): boolean;
  removeTag(tagText: string): boolean;
  clear(): void;
}

export interface UiSegmentedControlElement extends HTMLElement {
  value: string;
  name: string;
  disabled: boolean;
  select(val: string): void;
}

export interface UiOtpInputElement extends HTMLElement {
  length: number;
  value: string;
  readonly isComplete: boolean;
  disabled: boolean;
  clear(): void;
}

export interface UiStepperElement extends HTMLElement {
  activeStep: number;
  linear: boolean;
  orientation: string;
  goToStep(stepNum: number): void;
  next(): void;
  prev(): void;
}

export interface UiResizableElement extends HTMLElement {
  orientation: string;
  disabled: boolean;
  getSizes(): number[];
}

export interface UiFileUploadElement extends HTMLElement {
  readonly files: File[];
  accept: string;
  multiple: boolean;
  maxSize: number;
  disabled: boolean;
  removeFile(name: string): void;
  clear(): void;
}

export interface UiContextMenuElement extends HTMLElement {
  disabled: boolean;
  readonly isOpen: boolean;
  openAt(clientX: number, clientY: number): void;
  close(): void;
}

export interface UiNavigationMenuElement extends HTMLElement {
  delay: number;
  disabled: boolean;
  openItem(item: HTMLElement): void;
  closeItem(item: HTMLElement): void;
  closeAll(): void;
}

export interface UiTreeViewElement extends HTMLElement {
  selectionMode: 'single' | 'multiple';
  disabled: boolean;
  toggleItem(item: HTMLElement): void;
  expandItem(item: HTMLElement): void;
  collapseItem(item: HTMLElement): void;
  selectItem(item: HTMLElement): void;
}

export interface UiAiPromptBoxElement extends HTMLElement {
  maxRows: number;
  loading: boolean;
  disabled: boolean;
  value: string;
  submit(): void;
  stop(): void;
  clear(): void;
}

export interface UiColorPickerElement extends HTMLElement {
  value: string;
  name: string;
  disabled: boolean;
  readonly isOpen: boolean;
  setValue(color: string): void;
  toggle(): void;
  open(): void;
  close(): void;
}

export interface UiSparklineElement extends HTMLElement {
  data: number[] | string;
  color: string;
  strokeWidth: number;
  fill: 'gradient' | 'solid' | 'none';
  hoverable: boolean;
  smooth: boolean;
}

export interface UiDockElement extends HTMLElement {
  position: 'bottom' | 'top' | 'floating';
  distance: number;
  maxScale: number;
}

export interface UiTimelineElement extends HTMLElement {
  orientation: 'vertical' | 'horizontal';
  activeStep: number;
}

export interface UiAiReasoningElement extends HTMLElement {
  status: 'thinking' | 'done';
  duration: number;
  open: boolean;
  autoCollapse: boolean;
  collapsible: boolean;
}

export interface UiAiToolCallElement extends HTMLElement {
  name: string;
  status: 'pending' | 'running' | 'success' | 'error';
  latency: string;
  open: boolean;
  collapsible: boolean;
}

export interface UiAiApprovalElement extends HTMLElement {
  severity: 'info' | 'warning' | 'critical';
  status: 'pending' | 'approved' | 'rejected';
  actionName: string;
  approve(): void;
  reject(reason?: string): void;
}

export interface ToastOptions {
  description?: string;
  type?: 'default' | 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  action?: {
    label: string;
    onClick: (e: MouseEvent) => void;
  };
  onDismiss?: (id: string) => void;
}

export interface UiToasterElement extends HTMLElement {
  position: 'bottom-right' | 'top-right' | 'bottom-left' | 'top-left' | 'top-center' | 'bottom-center';
  createToast(options: ToastOptions & { title: string }): { id: string; dismiss: () => void; element: HTMLElement };
}

export interface ToastFunction {
  (title: string, options?: ToastOptions): { id: string; dismiss: () => void; element: HTMLElement };
  success(title: string, options?: ToastOptions): { id: string; dismiss: () => void; element: HTMLElement };
  error(title: string, options?: ToastOptions): { id: string; dismiss: () => void; element: HTMLElement };
  warning(title: string, options?: ToastOptions): { id: string; dismiss: () => void; element: HTMLElement };
  info(title: string, options?: ToastOptions): { id: string; dismiss: () => void; element: HTMLElement };
  dismiss(id?: string): void;
}

export const toast: ToastFunction;

// Register for document.createElement and querySelector
declare global {
  interface HTMLElementTagNameMap {
    'nnui-tabs': UiTabsElement;
    'ui-tabs': UiTabsElement;
    'nnui-combobox': UiComboboxElement;
    'ui-combobox': UiComboboxElement;
    'nnui-dialog': UiDialogElement;
    'ui-dialog': UiDialogElement;
    'nnui-select': UiSelectElement;
    'ui-select': UiSelectElement;
    'nnui-accordion': UiAccordionElement;
    'ui-accordion': UiAccordionElement;
    'nnui-popover': UiPopoverElement;
    'ui-popover': UiPopoverElement;
    'nnui-tooltip': UiTooltipElement;
    'ui-tooltip': UiTooltipElement;
    'nnui-command': UiCommandElement;
    'ui-command': UiCommandElement;
    'nnui-sheet': UiSheetElement;
    'ui-sheet': UiSheetElement;
    'nnui-slider': UiSliderElement;
    'ui-slider': UiSliderElement;
    'nnui-dropdown': UiDropdownElement;
    'ui-dropdown': UiDropdownElement;
    'nnui-toaster': UiToasterElement;
    'ui-toaster': UiToasterElement;
    'nnui-data-table': UiDataTableElement;
    'ui-data-table': UiDataTableElement;
    'nnui-calendar': UiCalendarElement;
    'ui-calendar': UiCalendarElement;
    'nnui-date-picker': UiDatePickerElement;
    'ui-date-picker': UiDatePickerElement;
    'nnui-data-grid': UiDataGridElement;
    'ui-data-grid': UiDataGridElement;
    'nnui-date-range-picker': UiDateRangePickerElement;
    'ui-date-range-picker': UiDateRangePickerElement;
    'nnui-tags-input': UiTagsInputElement;
    'ui-tags-input': UiTagsInputElement;
    'nnui-segmented-control': UiSegmentedControlElement;
    'ui-segmented-control': UiSegmentedControlElement;
    'nnui-otp-input': UiOtpInputElement;
    'ui-otp-input': UiOtpInputElement;
    'nnui-stepper': UiStepperElement;
    'ui-stepper': UiStepperElement;
    'nnui-resizable': UiResizableElement;
    'ui-resizable': UiResizableElement;
    'nnui-file-upload': UiFileUploadElement;
    'ui-file-upload': UiFileUploadElement;
    'nnui-context-menu': UiContextMenuElement;
    'ui-context-menu': UiContextMenuElement;
    'nnui-navigation-menu': UiNavigationMenuElement;
    'ui-navigation-menu': UiNavigationMenuElement;
    'nnui-tree-view': UiTreeViewElement;
    'ui-tree-view': UiTreeViewElement;
    'nnui-ai-prompt-box': UiAiPromptBoxElement;
    'ui-ai-prompt-box': UiAiPromptBoxElement;
    'nnui-color-picker': UiColorPickerElement;
    'ui-color-picker': UiColorPickerElement;
    'nnui-sparkline': UiSparklineElement;
    'ui-sparkline': UiSparklineElement;
    'nnui-dock': UiDockElement;
    'ui-dock': UiDockElement;
    'nnui-timeline': UiTimelineElement;
    'ui-timeline': UiTimelineElement;
    'nnui-ai-reasoning': UiAiReasoningElement;
    'ui-ai-reasoning': UiAiReasoningElement;
    'nnui-ai-tool-call': UiAiToolCallElement;
    'ui-ai-tool-call': UiAiToolCallElement;
    'nnui-ai-approval': UiAiApprovalElement;
    'ui-ai-approval': UiAiApprovalElement;
  }

  // React 19 / JSX Support
  namespace JSX {
    interface IntrinsicElements {
      'nnui-tabs': React.DetailedHTMLProps<React.HTMLAttributes<UiTabsElement> & {
        value?: string;
        orientation?: 'horizontal' | 'vertical';
        onChange?: (e: CustomEvent<UiChangeEventDetail>) => void;
      }, UiTabsElement>;
      'ui-tabs': React.DetailedHTMLProps<React.HTMLAttributes<UiTabsElement> & {
        value?: string;
        orientation?: 'horizontal' | 'vertical';
        onChange?: (e: CustomEvent<UiChangeEventDetail>) => void;
      }, UiTabsElement>;

      'nnui-combobox': React.DetailedHTMLProps<React.HTMLAttributes<UiComboboxElement> & {
        value?: string;
        open?: boolean;
        onChange?: (e: CustomEvent<UiChangeEventDetail>) => void;
      }, UiComboboxElement>;
      'ui-combobox': React.DetailedHTMLProps<React.HTMLAttributes<UiComboboxElement> & {
        value?: string;
        open?: boolean;
        onChange?: (e: CustomEvent<UiChangeEventDetail>) => void;
      }, UiComboboxElement>;

      'nnui-dialog': React.DetailedHTMLProps<React.HTMLAttributes<UiDialogElement> & {
        open?: boolean;
        onOpen?: (e: CustomEvent) => void;
        onClose?: (e: CustomEvent<{ reason: string }>) => void;
      }, UiDialogElement>;
      'ui-dialog': React.DetailedHTMLProps<React.HTMLAttributes<UiDialogElement> & {
        open?: boolean;
        onOpen?: (e: CustomEvent) => void;
        onClose?: (e: CustomEvent<{ reason: string }>) => void;
      }, UiDialogElement>;

      'nnui-select': React.DetailedHTMLProps<React.HTMLAttributes<UiSelectElement> & {
        name?: string;
        value?: string;
        required?: boolean;
        disabled?: boolean;
        onChange?: (e: CustomEvent<UiChangeEventDetail>) => void;
      }, UiSelectElement>;
      'ui-select': React.DetailedHTMLProps<React.HTMLAttributes<UiSelectElement> & {
        name?: string;
        value?: string;
        required?: boolean;
        disabled?: boolean;
        onChange?: (e: CustomEvent<UiChangeEventDetail>) => void;
      }, UiSelectElement>;

      'nnui-accordion': React.DetailedHTMLProps<React.HTMLAttributes<UiAccordionElement> & {
        type?: 'single' | 'multiple';
        collapsible?: boolean;
        onChange?: (e: CustomEvent<{ value: string; open: boolean }>) => void;
      }, UiAccordionElement>;
      'ui-accordion': React.DetailedHTMLProps<React.HTMLAttributes<UiAccordionElement> & {
        type?: 'single' | 'multiple';
        collapsible?: boolean;
        onChange?: (e: CustomEvent<{ value: string; open: boolean }>) => void;
      }, UiAccordionElement>;

      'nnui-popover': React.DetailedHTMLProps<React.HTMLAttributes<UiPopoverElement> & {
        onToggle?: (e: CustomEvent<{ open: boolean }>) => void;
      }, UiPopoverElement>;
      'ui-popover': React.DetailedHTMLProps<React.HTMLAttributes<UiPopoverElement> & {
        onToggle?: (e: CustomEvent<{ open: boolean }>) => void;
      }, UiPopoverElement>;

      'nnui-tooltip': React.DetailedHTMLProps<React.HTMLAttributes<UiTooltipElement> & {
        delay?: number;
      }, UiTooltipElement>;
      'ui-tooltip': React.DetailedHTMLProps<React.HTMLAttributes<UiTooltipElement> & {
        delay?: number;
      }, UiTooltipElement>;

      'nnui-command': React.DetailedHTMLProps<React.HTMLAttributes<UiCommandElement> & {
        open?: boolean;
        shortcut?: string;
        onChange?: (e: CustomEvent<{ value: string; label: string; item: HTMLElement }>) => void;
        onSelect?: (e: CustomEvent<{ value: string; label: string; item: HTMLElement }>) => void;
      }, UiCommandElement>;
      'ui-command': React.DetailedHTMLProps<React.HTMLAttributes<UiCommandElement> & {
        open?: boolean;
        shortcut?: string;
        onChange?: (e: CustomEvent<{ value: string; label: string; item: HTMLElement }>) => void;
        onSelect?: (e: CustomEvent<{ value: string; label: string; item: HTMLElement }>) => void;
      }, UiCommandElement>;

      'nnui-sheet': React.DetailedHTMLProps<React.HTMLAttributes<UiSheetElement> & {
        open?: boolean;
        side?: 'right' | 'left' | 'top' | 'bottom';
        onOpen?: (e: CustomEvent) => void;
        onClose?: (e: CustomEvent) => void;
      }, UiSheetElement>;
      'ui-sheet': React.DetailedHTMLProps<React.HTMLAttributes<UiSheetElement> & {
        open?: boolean;
        side?: 'right' | 'left' | 'top' | 'bottom';
        onOpen?: (e: CustomEvent) => void;
        onClose?: (e: CustomEvent) => void;
      }, UiSheetElement>;

      'nnui-slider': React.DetailedHTMLProps<React.HTMLAttributes<UiSliderElement> & {
        value?: number;
        min?: number;
        max?: number;
        step?: number;
        disabled?: boolean;
        name?: string;
        onChange?: (e: CustomEvent<{ value: number }>) => void;
        onInput?: (e: CustomEvent<{ value: number }>) => void;
      }, UiSliderElement>;
      'ui-slider': React.DetailedHTMLProps<React.HTMLAttributes<UiSliderElement> & {
        value?: number;
        min?: number;
        max?: number;
        step?: number;
        disabled?: boolean;
        name?: string;
        onChange?: (e: CustomEvent<{ value: number }>) => void;
        onInput?: (e: CustomEvent<{ value: number }>) => void;
      }, UiSliderElement>;

      'nnui-dropdown': React.DetailedHTMLProps<React.HTMLAttributes<UiDropdownElement> & {
        open?: boolean;
        onOpen?: (e: CustomEvent) => void;
        onClose?: (e: CustomEvent) => void;
        onSelect?: (e: CustomEvent<{ value: string; label: string; item: HTMLElement }>) => void;
      }, UiDropdownElement>;
      'ui-dropdown': React.DetailedHTMLProps<React.HTMLAttributes<UiDropdownElement> & {
        open?: boolean;
        onOpen?: (e: CustomEvent) => void;
        onClose?: (e: CustomEvent) => void;
        onSelect?: (e: CustomEvent<{ value: string; label: string; item: HTMLElement }>) => void;
      }, UiDropdownElement>;

      'nnui-toaster': React.DetailedHTMLProps<React.HTMLAttributes<UiToasterElement> & {
        position?: 'bottom-right' | 'top-right' | 'bottom-left' | 'top-left' | 'top-center' | 'bottom-center';
      }, UiToasterElement>;
      'ui-toaster': React.DetailedHTMLProps<React.HTMLAttributes<UiToasterElement> & {
        position?: 'bottom-right' | 'top-right' | 'bottom-left' | 'top-left' | 'top-center' | 'bottom-center';
      }, UiToasterElement>;

      'nnui-data-table': React.DetailedHTMLProps<React.HTMLAttributes<UiDataTableElement> & {
        'page-size'?: number;
        page?: number;
        'sort-key'?: string;
        'sort-dir'?: 'asc' | 'desc';
        search?: string;
        onSort?: (e: CustomEvent<{ key: string; direction: string }>) => void;
        onFilter?: (e: CustomEvent<{ query: string; matchCount: number }>) => void;
        onPageChange?: (e: CustomEvent<{ page: number; totalPages: number }>) => void;
        onSelectionChange?: (e: CustomEvent<{ selectedIds: string[]; selectedCount: number }>) => void;
      }, UiDataTableElement>;
      'ui-data-table': React.DetailedHTMLProps<React.HTMLAttributes<UiDataTableElement> & {
        'page-size'?: number;
        page?: number;
        'sort-key'?: string;
        'sort-dir'?: 'asc' | 'desc';
        search?: string;
        onSort?: (e: CustomEvent<{ key: string; direction: string }>) => void;
        onFilter?: (e: CustomEvent<{ query: string; matchCount: number }>) => void;
        onPageChange?: (e: CustomEvent<{ page: number; totalPages: number }>) => void;
        onSelectionChange?: (e: CustomEvent<{ selectedIds: string[]; selectedCount: number }>) => void;
      }, UiDataTableElement>;

      'nnui-calendar': React.DetailedHTMLProps<React.HTMLAttributes<UiCalendarElement> & {
        value?: string;
        month?: number;
        year?: number;
        min?: string;
        max?: string;
        disabled?: boolean;
        onChange?: (e: CustomEvent<{ value: string; date: Date }>) => void;
        onMonthChange?: (e: CustomEvent<{ year: number; month: number }>) => void;
      }, UiCalendarElement>;
      'ui-calendar': React.DetailedHTMLProps<React.HTMLAttributes<UiCalendarElement> & {
        value?: string;
        month?: number;
        year?: number;
        min?: string;
        max?: string;
        disabled?: boolean;
        onChange?: (e: CustomEvent<{ value: string; date: Date }>) => void;
        onMonthChange?: (e: CustomEvent<{ year: number; month: number }>) => void;
      }, UiCalendarElement>;

      'nnui-date-picker': React.DetailedHTMLProps<React.HTMLAttributes<UiDatePickerElement> & {
        value?: string;
        placeholder?: string;
        disabled?: boolean;
        open?: boolean;
        onChange?: (e: CustomEvent<{ value: string; date: Date }>) => void;
        onOpen?: (e: CustomEvent) => void;
        onClose?: (e: CustomEvent) => void;
      }, UiDatePickerElement>;
      'ui-date-picker': React.DetailedHTMLProps<React.HTMLAttributes<UiDatePickerElement> & {
        value?: string;
        placeholder?: string;
        disabled?: boolean;
        open?: boolean;
        onChange?: (e: CustomEvent<{ value: string; date: Date }>) => void;
        onOpen?: (e: CustomEvent) => void;
        onClose?: (e: CustomEvent) => void;
      }, UiDatePickerElement>;

      'nnui-data-grid': React.DetailedHTMLProps<React.HTMLAttributes<UiDataGridElement> & {
        'row-height'?: number;
        overscan?: number;
        'sort-key'?: string;
        'sort-dir'?: 'asc' | 'desc';
        search?: string;
        streaming?: boolean;
        onSort?: (e: CustomEvent<{ key: string; direction: string }>) => void;
        onSelectionChange?: (e: CustomEvent<{ selectedIds: string[]; selectedCount: number }>) => void;
        onStreamUpdate?: (e: CustomEvent<{ addedCount: number; totalCount: number }>) => void;
      }, UiDataGridElement>;
      'ui-data-grid': React.DetailedHTMLProps<React.HTMLAttributes<UiDataGridElement> & {
        'row-height'?: number;
        overscan?: number;
        'sort-key'?: string;
        'sort-dir'?: 'asc' | 'desc';
        search?: string;
        streaming?: boolean;
        onSort?: (e: CustomEvent<{ key: string; direction: string }>) => void;
        onSelectionChange?: (e: CustomEvent<{ selectedIds: string[]; selectedCount: number }>) => void;
        onStreamUpdate?: (e: CustomEvent<{ addedCount: number; totalCount: number }>) => void;
      }, UiDataGridElement>;

      'nnui-date-range-picker': React.DetailedHTMLProps<React.HTMLAttributes<UiDateRangePickerElement> & {
        'start-date'?: string;
        'end-date'?: string;
        placeholder?: string;
        disabled?: boolean;
        open?: boolean;
        onChange?: (e: CustomEvent<{ start: string; end: string; range: [Date, Date] }>) => void;
      }, UiDateRangePickerElement>;
      'ui-date-range-picker': React.DetailedHTMLProps<React.HTMLAttributes<UiDateRangePickerElement> & {
        'start-date'?: string;
        'end-date'?: string;
        placeholder?: string;
        disabled?: boolean;
        open?: boolean;
        onChange?: (e: CustomEvent<{ start: string; end: string; range: [Date, Date] }>) => void;
      }, UiDateRangePickerElement>;

      'nnui-tags-input': React.DetailedHTMLProps<React.HTMLAttributes<UiTagsInputElement> & {
        tags?: string;
        placeholder?: string;
        'max-tags'?: number;
        disabled?: boolean;
        onChange?: (e: CustomEvent<{ tags: string[]; added?: string; removed?: string }>) => void;
      }, UiTagsInputElement>;
      'ui-tags-input': React.DetailedHTMLProps<React.HTMLAttributes<UiTagsInputElement> & {
        tags?: string;
        placeholder?: string;
        'max-tags'?: number;
        disabled?: boolean;
        onChange?: (e: CustomEvent<{ tags: string[]; added?: string; removed?: string }>) => void;
      }, UiTagsInputElement>;

      'nnui-segmented-control': React.DetailedHTMLProps<React.HTMLAttributes<UiSegmentedControlElement> & {
        value?: string;
        name?: string;
        disabled?: boolean;
        onChange?: (e: CustomEvent<{ value: string; previousValue?: string }>) => void;
      }, UiSegmentedControlElement>;
      'ui-segmented-control': React.DetailedHTMLProps<React.HTMLAttributes<UiSegmentedControlElement> & {
        value?: string;
        name?: string;
        disabled?: boolean;
        onChange?: (e: CustomEvent<{ value: string; previousValue?: string }>) => void;
      }, UiSegmentedControlElement>;

      'nnui-otp-input': React.DetailedHTMLProps<React.HTMLAttributes<UiOtpInputElement> & {
        length?: number;
        value?: string;
        disabled?: boolean;
        type?: string;
        mask?: boolean;
        onChange?: (e: CustomEvent<{ value: string; isComplete: boolean }>) => void;
        onInput?: (e: CustomEvent<{ value: string; isComplete: boolean }>) => void;
      }, UiOtpInputElement>;
      'ui-otp-input': React.DetailedHTMLProps<React.HTMLAttributes<UiOtpInputElement> & {
        length?: number;
        value?: string;
        disabled?: boolean;
        type?: string;
        mask?: boolean;
        onChange?: (e: CustomEvent<{ value: string; isComplete: boolean }>) => void;
        onInput?: (e: CustomEvent<{ value: string; isComplete: boolean }>) => void;
      }, UiOtpInputElement>;

      'nnui-stepper': React.DetailedHTMLProps<React.HTMLAttributes<UiStepperElement> & {
        'active-step'?: number | string;
        linear?: boolean;
        orientation?: 'horizontal' | 'vertical';
        onChange?: (e: CustomEvent<{ step: number; previousStep: number }>) => void;
      }, UiStepperElement>;
      'ui-stepper': React.DetailedHTMLProps<React.HTMLAttributes<UiStepperElement> & {
        'active-step'?: number | string;
        linear?: boolean;
        orientation?: 'horizontal' | 'vertical';
        onChange?: (e: CustomEvent<{ step: number; previousStep: number }>) => void;
      }, UiStepperElement>;

      'nnui-resizable': React.DetailedHTMLProps<React.HTMLAttributes<UiResizableElement> & {
        orientation?: 'horizontal' | 'vertical';
        disabled?: boolean;
        onResize?: (e: CustomEvent<{ sizes: number[] }>) => void;
      }, UiResizableElement>;
      'ui-resizable': React.DetailedHTMLProps<React.HTMLAttributes<UiResizableElement> & {
        orientation?: 'horizontal' | 'vertical';
        disabled?: boolean;
        onResize?: (e: CustomEvent<{ sizes: number[] }>) => void;
      }, UiResizableElement>;

      'nnui-file-upload': React.DetailedHTMLProps<React.HTMLAttributes<UiFileUploadElement> & {
        accept?: string;
        multiple?: boolean;
        'max-size'?: number;
        disabled?: boolean;
        onChange?: (e: CustomEvent<{ files: File[]; rejectedFiles?: any[] }>) => void;
      }, UiFileUploadElement>;
      'ui-file-upload': React.DetailedHTMLProps<React.HTMLAttributes<UiFileUploadElement> & {
        accept?: string;
        multiple?: boolean;
        'max-size'?: number;
        disabled?: boolean;
        onChange?: (e: CustomEvent<{ files: File[]; rejectedFiles?: any[] }>) => void;
      }, UiFileUploadElement>;

      'nnui-context-menu': React.DetailedHTMLProps<React.HTMLAttributes<UiContextMenuElement> & {
        disabled?: boolean;
        onOpen?: (e: CustomEvent<{ x: number; y: number }>) => void;
        onClose?: (e: CustomEvent) => void;
        onSelect?: (e: CustomEvent<{ value: string; item: HTMLElement }>) => void;
      }, UiContextMenuElement>;
      'ui-context-menu': React.DetailedHTMLProps<React.HTMLAttributes<UiContextMenuElement> & {
        disabled?: boolean;
        onOpen?: (e: CustomEvent<{ x: number; y: number }>) => void;
        onClose?: (e: CustomEvent) => void;
        onSelect?: (e: CustomEvent<{ value: string; item: HTMLElement }>) => void;
      }, UiContextMenuElement>;

      'nnui-navigation-menu': React.DetailedHTMLProps<React.HTMLAttributes<UiNavigationMenuElement> & {
        delay?: number;
        disabled?: boolean;
        onOpen?: (e: CustomEvent<{ item: HTMLElement }>) => void;
        onClose?: (e: CustomEvent<{ item: HTMLElement }>) => void;
      }, UiNavigationMenuElement>;
      'ui-navigation-menu': React.DetailedHTMLProps<React.HTMLAttributes<UiNavigationMenuElement> & {
        delay?: number;
        disabled?: boolean;
        onOpen?: (e: CustomEvent<{ item: HTMLElement }>) => void;
        onClose?: (e: CustomEvent<{ item: HTMLElement }>) => void;
      }, UiNavigationMenuElement>;

      'nnui-tree-view': React.DetailedHTMLProps<React.HTMLAttributes<UiTreeViewElement> & {
        'selection-mode'?: 'single' | 'multiple';
        disabled?: boolean;
        onSelect?: (e: CustomEvent<{ item: HTMLElement; value: string; selected: boolean }>) => void;
        onToggle?: (e: CustomEvent<{ item: HTMLElement; expanded: boolean }>) => void;
      }, UiTreeViewElement>;
      'ui-tree-view': React.DetailedHTMLProps<React.HTMLAttributes<UiTreeViewElement> & {
        'selection-mode'?: 'single' | 'multiple';
        disabled?: boolean;
        onSelect?: (e: CustomEvent<{ item: HTMLElement; value: string; selected: boolean }>) => void;
        onToggle?: (e: CustomEvent<{ item: HTMLElement; expanded: boolean }>) => void;
      }, UiTreeViewElement>;

      'nnui-ai-prompt-box': React.DetailedHTMLProps<React.HTMLAttributes<UiAiPromptBoxElement> & {
        'max-rows'?: number;
        loading?: boolean;
        disabled?: boolean;
        placeholder?: string;
        onSubmit?: (e: CustomEvent<{ prompt: string }>) => void;
        onStop?: (e: CustomEvent) => void;
        onInput?: (e: CustomEvent<{ value: string }>) => void;
      }, UiAiPromptBoxElement>;
      'ui-ai-prompt-box': React.DetailedHTMLProps<React.HTMLAttributes<UiAiPromptBoxElement> & {
        'max-rows'?: number;
        loading?: boolean;
        disabled?: boolean;
        placeholder?: string;
        onSubmit?: (e: CustomEvent<{ prompt: string }>) => void;
        onStop?: (e: CustomEvent) => void;
        onInput?: (e: CustomEvent<{ value: string }>) => void;
      }, UiAiPromptBoxElement>;

      'nnui-color-picker': React.DetailedHTMLProps<React.HTMLAttributes<UiColorPickerElement> & {
        value?: string;
        name?: string;
        format?: 'hex' | 'rgb' | 'hsl' | 'oklch';
        disabled?: boolean;
        onChange?: (e: CustomEvent<{ value: string }>) => void;
        onInput?: (e: CustomEvent<{ value: string }>) => void;
      }, UiColorPickerElement>;
      'ui-color-picker': React.DetailedHTMLProps<React.HTMLAttributes<UiColorPickerElement> & {
        value?: string;
        name?: string;
        format?: 'hex' | 'rgb' | 'hsl' | 'oklch';
        disabled?: boolean;
        onChange?: (e: CustomEvent<{ value: string }>) => void;
        onInput?: (e: CustomEvent<{ value: string }>) => void;
      }, UiColorPickerElement>;

      'nnui-ai-reasoning': React.DetailedHTMLProps<React.HTMLAttributes<UiAiReasoningElement> & {
        status?: 'thinking' | 'done';
        duration?: number | string;
        open?: boolean;
        'auto-collapse'?: boolean;
        collapsible?: boolean;
        onToggle?: (e: CustomEvent<{ open: boolean; duration: number }>) => void;
        onCopy?: (e: CustomEvent<{ text: string }>) => void;
      }, UiAiReasoningElement>;
      'ui-ai-reasoning': React.DetailedHTMLProps<React.HTMLAttributes<UiAiReasoningElement> & {
        status?: 'thinking' | 'done';
        duration?: number | string;
        open?: boolean;
        'auto-collapse'?: boolean;
        collapsible?: boolean;
        onToggle?: (e: CustomEvent<{ open: boolean; duration: number }>) => void;
        onCopy?: (e: CustomEvent<{ text: string }>) => void;
      }, UiAiReasoningElement>;

      'nnui-ai-tool-call': React.DetailedHTMLProps<React.HTMLAttributes<UiAiToolCallElement> & {
        name?: string;
        status?: 'pending' | 'running' | 'success' | 'error';
        latency?: string;
        open?: boolean;
        collapsible?: boolean;
        onRetry?: (e: CustomEvent<{ name: string; args: string }>) => void;
        onToggle?: (e: CustomEvent<{ open: boolean; name: string; status: string }>) => void;
      }, UiAiToolCallElement>;
      'ui-ai-tool-call': React.DetailedHTMLProps<React.HTMLAttributes<UiAiToolCallElement> & {
        name?: string;
        status?: 'pending' | 'running' | 'success' | 'error';
        latency?: string;
        open?: boolean;
        collapsible?: boolean;
        onRetry?: (e: CustomEvent<{ name: string; args: string }>) => void;
        onToggle?: (e: CustomEvent<{ open: boolean; name: string; status: string }>) => void;
      }, UiAiToolCallElement>;

      'nnui-ai-approval': React.DetailedHTMLProps<React.HTMLAttributes<UiAiApprovalElement> & {
        severity?: 'info' | 'warning' | 'critical';
        status?: 'pending' | 'approved' | 'rejected';
        'action-name'?: string;
        onApprove?: (e: CustomEvent<{ action: string; severity: string; timestamp: string }>) => void;
        onReject?: (e: CustomEvent<{ action: string; severity: string; reason: string; timestamp: string }>) => void;
      }, UiAiApprovalElement>;
      'ui-ai-approval': React.DetailedHTMLProps<React.HTMLAttributes<UiAiApprovalElement> & {
        severity?: 'info' | 'warning' | 'critical';
        status?: 'pending' | 'approved' | 'rejected';
        'action-name'?: string;
        onApprove?: (e: CustomEvent<{ action: string; severity: string; timestamp: string }>) => void;
        onReject?: (e: CustomEvent<{ action: string; severity: string; reason: string; timestamp: string }>) => void;
      }, UiAiApprovalElement>;
    }
  }
}

// React 18 & 19 JSX Module Augmentation
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements extends globalThis.JSX.IntrinsicElements {}
  }
}

declare module 'nnui-kit/react' {
  import * as React from 'react';

  export interface PartProps extends React.HTMLAttributes<HTMLElement> {
    as?: any;
    className?: string;
    children?: React.ReactNode;
    [key: string]: any;
  }

  export const createPart: (partName: string, defaultTag?: string, displayName?: string) => React.ForwardRefExoticComponent<PartProps>;
  export const createReactComponent: (tagName: string, displayName: string, eventMap?: Record<string, string>) => React.ForwardRefExoticComponent<any>;

  export interface TabsComponent extends React.ForwardRefExoticComponent<any> {
    Root: TabsComponent;
    List: React.ForwardRefExoticComponent<PartProps>;
    Tab: React.ForwardRefExoticComponent<PartProps>;
    Trigger: React.ForwardRefExoticComponent<PartProps>;
    Panel: React.ForwardRefExoticComponent<PartProps>;
    Content: React.ForwardRefExoticComponent<PartProps>;
  }
  export const Tabs: TabsComponent;

  export interface DialogComponent extends React.ForwardRefExoticComponent<any> {
    Root: DialogComponent;
    Trigger: React.ForwardRefExoticComponent<PartProps>;
    Content: React.ForwardRefExoticComponent<PartProps>;
    Close: React.ForwardRefExoticComponent<PartProps>;
    Title: React.ForwardRefExoticComponent<PartProps>;
    Description: React.ForwardRefExoticComponent<PartProps>;
  }
  export const Dialog: DialogComponent;

  export interface SelectComponent extends React.ForwardRefExoticComponent<any> {
    Root: SelectComponent;
    Trigger: React.ForwardRefExoticComponent<PartProps>;
    Value: React.ForwardRefExoticComponent<PartProps>;
    List: React.ForwardRefExoticComponent<PartProps>;
    Content: React.ForwardRefExoticComponent<PartProps>;
    Item: React.ForwardRefExoticComponent<PartProps>;
    Option: React.ForwardRefExoticComponent<PartProps>;
  }
  export const Select: SelectComponent;

  export interface AccordionComponent extends React.ForwardRefExoticComponent<any> {
    Root: AccordionComponent;
    Item: React.ForwardRefExoticComponent<PartProps>;
    Trigger: React.ForwardRefExoticComponent<PartProps>;
    Header: React.ForwardRefExoticComponent<PartProps>;
    Content: React.ForwardRefExoticComponent<PartProps>;
    Panel: React.ForwardRefExoticComponent<PartProps>;
  }
  export const Accordion: AccordionComponent;

  export interface SliderComponent extends React.ForwardRefExoticComponent<any> {
    Root: SliderComponent;
    Track: React.ForwardRefExoticComponent<PartProps>;
    Range: React.ForwardRefExoticComponent<PartProps>;
    Thumb: React.ForwardRefExoticComponent<PartProps>;
    Value: React.ForwardRefExoticComponent<PartProps>;
  }
  export const Slider: SliderComponent;

  export interface PopoverComponent extends React.ForwardRefExoticComponent<any> {
    Root: PopoverComponent;
    Trigger: React.ForwardRefExoticComponent<PartProps>;
    Content: React.ForwardRefExoticComponent<PartProps>;
    Close: React.ForwardRefExoticComponent<PartProps>;
  }
  export const Popover: PopoverComponent;

  export interface SheetComponent extends React.ForwardRefExoticComponent<any> {
    Root: SheetComponent;
    Trigger: React.ForwardRefExoticComponent<PartProps>;
    Content: React.ForwardRefExoticComponent<PartProps>;
    Close: React.ForwardRefExoticComponent<PartProps>;
  }
  export const Sheet: SheetComponent;

  export interface DropdownComponent extends React.ForwardRefExoticComponent<any> {
    Root: DropdownComponent;
    Trigger: React.ForwardRefExoticComponent<PartProps>;
    Menu: React.ForwardRefExoticComponent<PartProps>;
    Content: React.ForwardRefExoticComponent<PartProps>;
    Item: React.ForwardRefExoticComponent<PartProps>;
  }
  export const Dropdown: DropdownComponent;

  export interface CommandComponent extends React.ForwardRefExoticComponent<any> {
    Root: CommandComponent;
    Input: React.ForwardRefExoticComponent<PartProps>;
    List: React.ForwardRefExoticComponent<PartProps>;
    Group: React.ForwardRefExoticComponent<PartProps>;
    Item: React.ForwardRefExoticComponent<PartProps>;
  }
  export const Command: CommandComponent;

  export interface StepperComponent extends React.ForwardRefExoticComponent<any> {
    Root: StepperComponent;
    Step: React.ForwardRefExoticComponent<PartProps>;
    Content: React.ForwardRefExoticComponent<PartProps>;
    Panel: React.ForwardRefExoticComponent<PartProps>;
  }
  export const Stepper: StepperComponent;

  export interface SegmentedControlComponent extends React.ForwardRefExoticComponent<any> {
    Root: SegmentedControlComponent;
    Segment: React.ForwardRefExoticComponent<PartProps>;
    Item: React.ForwardRefExoticComponent<PartProps>;
    Indicator: React.ForwardRefExoticComponent<PartProps>;
  }
  export const SegmentedControl: SegmentedControlComponent;

  export interface ComboboxComponent extends React.ForwardRefExoticComponent<any> {
    Root: ComboboxComponent;
    Input: React.ForwardRefExoticComponent<PartProps>;
    List: React.ForwardRefExoticComponent<PartProps>;
    Item: React.ForwardRefExoticComponent<PartProps>;
    Option: React.ForwardRefExoticComponent<PartProps>;
  }
  export const Combobox: ComboboxComponent;

  export interface DataGridComponent extends React.ForwardRefExoticComponent<any> {
    Root: DataGridComponent;
    Viewport: React.ForwardRefExoticComponent<PartProps>;
    Runway: React.ForwardRefExoticComponent<PartProps>;
    Table: React.ForwardRefExoticComponent<PartProps>;
    VirtualBody: React.ForwardRefExoticComponent<PartProps>;
  }
  export const DataGrid: DataGridComponent;

  export const Tooltip: React.ForwardRefExoticComponent<any> & { Root: any; Trigger: any; Content: any };
  export const Toaster: React.ForwardRefExoticComponent<any>;
  export const DataTable: React.ForwardRefExoticComponent<any>;
  export const Calendar: React.ForwardRefExoticComponent<any>;
  export const DatePicker: React.ForwardRefExoticComponent<any> & { Root: any; Trigger: any };
  export const DateRangePicker: React.ForwardRefExoticComponent<any> & { Root: any; Trigger: any };
  export const TagsInput: React.ForwardRefExoticComponent<any> & { Root: any; Input: any; Tag: any };
  export const OtpInput: React.ForwardRefExoticComponent<any> & { Root: any; Slot: any };
  export const Resizable: React.ForwardRefExoticComponent<any> & { Root: any; Panel: any; Handle: any };
  export const FileUpload: React.ForwardRefExoticComponent<any> & { Root: any; Dropzone: any };
  export const ContextMenu: React.ForwardRefExoticComponent<any> & { Root: any; Trigger: any; Menu: any; Item: any };
  export const NavigationMenu: React.ForwardRefExoticComponent<any> & { Root: any; Item: any; Trigger: any; Content: any };
  export const TreeView: React.ForwardRefExoticComponent<any> & { Root: any; Item: any };
  export const AiPromptBox: React.ForwardRefExoticComponent<any>;
  export const ColorPicker: React.ForwardRefExoticComponent<any> & { Root: any; Swatch: any; Input: any };
  export const Sparkline: React.ForwardRefExoticComponent<any>;
  export const Dock: React.ForwardRefExoticComponent<any> & { Root: any; Item: any };
  export const Timeline: React.ForwardRefExoticComponent<any> & { Root: any; Item: any; Marker: any; Connector: any; Content: any; Title: any; Description: any; Time: any };
  export const AiReasoning: React.ForwardRefExoticComponent<any> & { Root: any; Header: any; Beacon: any; Summary: any; Actions: any; Copy: any; Toggle: any; Stream: any };
  export const AiToolCall: React.ForwardRefExoticComponent<any> & { Root: any; Header: any; Info: any; Name: any; StatusBadge: any; Latency: any; Actions: any; Retry: any; Copy: any; Inspector: any; Args: any; Output: any };
  export const AiApproval: React.ForwardRefExoticComponent<any> & { Root: any; Header: any; Title: any; SeverityBadge: any; Payload: any; Actions: any; Approve: any; Reject: any; AuditBadge: any };
  export const Input: React.ForwardRefExoticComponent<any>;
  export const toast: any;
}

declare module 'nnuikit/react' {
  export * from 'nnui-kit/react';
}

