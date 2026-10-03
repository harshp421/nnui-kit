/**
 * NNUI-KIT
 * Platform-Native, Three-Tier Light-DOM Universal UI Architecture
 */

import './styles/index.css';
import { BaseLightElement } from './utils/base-element.js';
import { UiTabs } from './components/tabs/ui-tabs.js';
import { UiCombobox } from './components/combobox/ui-combobox.js';
import { UiDialog } from './components/dialog/ui-dialog.js';
import { UiSelect } from './components/select/ui-select.js';
import { UiAccordion } from './components/accordion/ui-accordion.js';
import { UiPopover } from './components/popover/ui-popover.js';
import { UiTooltip } from './components/tooltip/ui-tooltip.js';
import { UiCommand } from './components/command/ui-command.js';
import { UiSheet } from './components/sheet/ui-sheet.js';
import { UiSlider } from './components/slider/ui-slider.js';
import { UiDropdown } from './components/dropdown/ui-dropdown.js';
import { UiToaster, toast } from './components/toast/ui-toast.js';
import { UiDataTable } from './components/data-table/ui-data-table.js';
import { UiCalendar } from './components/calendar/ui-calendar.js';
import { UiDatePicker } from './components/date-picker/ui-date-picker.js';

export {
  BaseLightElement,
  UiTabs,
  UiCombobox,
  UiDialog,
  UiSelect,
  UiAccordion,
  UiPopover,
  UiTooltip,
  UiCommand,
  UiSheet,
  UiSlider,
  UiDropdown,
  UiToaster,
  UiDataTable,
  UiCalendar,
  UiDatePicker,
  toast,
};

export * from './utils/a11y.js';
export * from './utils/anchor-fallback.js';

export const elements = {
  'ui-tabs': UiTabs,
  'ui-combobox': UiCombobox,
  'ui-dialog': UiDialog,
  'ui-select': UiSelect,
  'ui-accordion': UiAccordion,
  'ui-popover': UiPopover,
  'ui-tooltip': UiTooltip,
  'ui-command': UiCommand,
  'ui-sheet': UiSheet,
  'ui-slider': UiSlider,
  'ui-dropdown': UiDropdown,
  'ui-toaster': UiToaster,
  'ui-data-table': UiDataTable,
  'ui-calendar': UiCalendar,
  'ui-date-picker': UiDatePicker,
};

/**
 * Registers custom elements. Defines both 'nnui-*' and 'ui-*' prefixes by default.
 */
export function register(prefixes = ['nnui', 'ui']) {
  if (typeof window === 'undefined' || !window.customElements) return;

  const prefixList = Array.isArray(prefixes) ? prefixes : [prefixes];
  const registeredClasses = new Set();

  prefixList.forEach((prefix) => {
    Object.entries(elements).forEach(([baseTag, ComponentClass]) => {
      const tagName = `${prefix}-${baseTag.replace(/^ui-/, '')}`;
      if (!customElements.get(tagName)) {
        // Web Components specification forbids registering the exact same constructor reference twice.
        // If already registered under another prefix, create a dynamic subclass.
        const ElementConstructor = registeredClasses.has(ComponentClass)
          ? class extends ComponentClass {}
          : ComponentClass;

        registeredClasses.add(ComponentClass);
        customElements.define(tagName, ElementConstructor);
      }
    });
  });
}

// Auto-register both <nnui-*> and <ui-*> in browser environments by default
if (typeof window !== 'undefined' && window.customElements) {
  register(['nnui', 'ui']);
}
