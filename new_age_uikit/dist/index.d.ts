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
    }
  }
}
