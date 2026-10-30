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
import { UiDataGrid } from './components/data-grid/ui-data-grid.js';
import { UiDateRangePicker } from './components/date-range-picker/ui-date-range-picker.js';
import { UiTagsInput } from './components/tags-input/ui-tags-input.js';
import { UiSegmentedControl } from './components/segmented-control/ui-segmented-control.js';
import { UiOtpInput } from './components/otp-input/ui-otp-input.js';
import { UiStepper } from './components/stepper/ui-stepper.js';
import { UiResizable } from './components/resizable/ui-resizable.js';
import { UiFileUpload } from './components/file-upload/ui-file-upload.js';
import { UiContextMenu } from './components/context-menu/ui-context-menu.js';
import { UiNavigationMenu } from './components/navigation-menu/ui-navigation-menu.js';
import { UiTreeView } from './components/tree-view/ui-tree-view.js';
import { UiAiPromptBox } from './components/ai-prompt-box/ui-ai-prompt-box.js';
import { UiColorPicker } from './components/color-picker/ui-color-picker.js';
import { UiSparkline } from './components/sparkline/ui-sparkline.js';
import { UiDock } from './components/dock/ui-dock.js';
import { UiTimeline } from './components/timeline/ui-timeline.js';
import { UiAiReasoning } from './components/ai-reasoning/ui-ai-reasoning.js';
import { UiAiToolCall } from './components/ai-tool-call/ui-ai-tool-call.js';
import { UiAiApproval } from './components/ai-approval/ui-ai-approval.js';

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
  UiDataGrid,
  UiDateRangePicker,
  UiTagsInput,
  UiSegmentedControl,
  UiOtpInput,
  UiStepper,
  UiResizable,
  UiFileUpload,
  UiContextMenu,
  UiNavigationMenu,
  UiTreeView,
  UiAiPromptBox,
  UiColorPicker,
  UiSparkline,
  UiDock,
  UiTimeline,
  UiAiReasoning,
  UiAiToolCall,
  UiAiApproval,
  toast,
};

export * from './utils/a11y.js';
export * from './utils/anchor-fallback.js';
export * from './utils/persistence.js';

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
  'ui-data-grid': UiDataGrid,
  'ui-date-range-picker': UiDateRangePicker,
  'ui-tags-input': UiTagsInput,
  'ui-segmented-control': UiSegmentedControl,
  'ui-otp-input': UiOtpInput,
  'ui-stepper': UiStepper,
  'ui-resizable': UiResizable,
  'ui-file-upload': UiFileUpload,
  'ui-context-menu': UiContextMenu,
  'ui-navigation-menu': UiNavigationMenu,
  'ui-tree-view': UiTreeView,
  'ui-ai-prompt-box': UiAiPromptBox,
  'ui-color-picker': UiColorPicker,
  'ui-sparkline': UiSparkline,
  'ui-dock': UiDock,
  'ui-timeline': UiTimeline,
  'ui-ai-reasoning': UiAiReasoning,
  'ui-ai-tool-call': UiAiToolCall,
  'ui-ai-approval': UiAiApproval,
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
