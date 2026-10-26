import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('Testing Intellisense, Typings, and VS Code Custom Data Suite...');

// 1. Verify vscode.html-data.json in root & dist
const rootHtmlDataPath = path.join(rootDir, 'vscode.html-data.json');
const distHtmlDataPath = path.join(rootDir, 'dist/vscode.html-data.json');

assert(fs.existsSync(rootHtmlDataPath), 'packages/nnui-kit/vscode.html-data.json must exist');
assert(fs.existsSync(distHtmlDataPath), 'packages/nnui-kit/dist/vscode.html-data.json must exist');

const htmlData = JSON.parse(fs.readFileSync(rootHtmlDataPath, 'utf-8'));
assert.strictEqual(htmlData.version, 1.1, 'VS Code HTML custom data version must be 1.1');
assert(Array.isArray(htmlData.tags), 'Custom data must define tags array');
assert(htmlData.tags.length >= 56, `Must define at least 56 custom element tags (found ${htmlData.tags.length})`);

// Verify tag prefixes
const hasUiTabs = htmlData.tags.some(t => t.name === 'ui-tabs');
const hasNnuiTabs = htmlData.tags.some(t => t.name === 'nnui-tabs');
assert(hasUiTabs && hasNnuiTabs, 'Must contain both ui-tabs and nnui-tabs tags');

// Verify global attributes
assert(Array.isArray(htmlData.globalAttributes), 'Must define globalAttributes');
const dataPartAttr = htmlData.globalAttributes.find(a => a.name === 'data-part');
assert(dataPartAttr, 'Must define data-part in globalAttributes');
assert(dataPartAttr.values.some(v => v.name === 'tablist'), 'data-part must include tablist');
assert(dataPartAttr.values.some(v => v.name === 'tab'), 'data-part must include tab');
assert(dataPartAttr.values.some(v => v.name === 'tabpanel'), 'data-part must include tabpanel');
assert(dataPartAttr.values.some(v => v.name === 'trigger'), 'data-part must include trigger');

console.log('  ✓ VS Code HTML custom data schema and 56 tag definitions verified');

// 2. Verify React TypeScript Definitions
const reactDtsPath = path.join(rootDir, 'dist/react.d.ts');
assert(fs.existsSync(reactDtsPath), 'dist/react.d.ts must exist');

const reactDts = fs.readFileSync(reactDtsPath, 'utf-8');

// Ensure [key: string]: any does NOT pollute NNUIProps
assert(!reactDts.includes('[key: string]: any;'), 'dist/react.d.ts must NOT contain loose [key: string]: any;');

// Ensure dedicated prop interfaces exist
const requiredInterfaces = [
  'TabsProps',
  'ComboboxProps',
  'DialogProps',
  'SelectProps',
  'AccordionProps',
  'PopoverProps',
  'TooltipProps',
  'CommandProps',
  'SheetProps',
  'SliderProps',
  'DropdownProps',
  'ToasterProps',
  'DataTableProps',
  'CalendarProps',
  'DatePickerProps',
  'DataGridProps',
  'DateRangePickerProps',
  'TagsInputProps',
  'SegmentedControlProps',
  'OtpInputProps',
  'StepperProps',
  'ResizableProps',
  'FileUploadProps',
  'ContextMenuProps',
  'NavigationMenuProps',
  'TreeViewProps',
  'AiPromptBoxProps',
  'ColorPickerProps'
];

for (const iface of requiredInterfaces) {
  assert(reactDts.includes(`export interface ${iface}`), `dist/react.d.ts must export interface ${iface}`);
}

console.log(`  ✓ All ${requiredInterfaces.length} strict React component prop interfaces verified without [key: string]: any`);

// 3. Verify index.d.ts React module augmentation
const indexDtsPath = path.join(rootDir, 'dist/index.d.ts');
const indexDts = fs.readFileSync(indexDtsPath, 'utf-8');
assert(indexDts.includes("declare module 'react'"), "dist/index.d.ts must include declare module 'react'");

console.log('  ✓ Modern React 18/19 JSX module augmentation verified');

console.log('🎉 ALL INTELLISENSE AND CUSTOM DATA INTEGRITY TESTS PASSED SUCCESSFULLY!\n');
