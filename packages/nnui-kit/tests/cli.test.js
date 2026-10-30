import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const testProjectDir = path.join(rootDir, 'tests/temp_test_project');

console.log('Testing NNUI CLI & Component Registry...');

// Clean up any previous test project
if (fs.existsSync(testProjectDir)) {
  fs.rmSync(testProjectDir, { recursive: true, force: true });
}
fs.mkdirSync(testProjectDir, { recursive: true });

try {
  // Test 1: nnui list
  const listOutput = execSync(`node "${path.join(rootDir, 'bin/nnui.js')}" list`, {
    cwd: testProjectDir,
    encoding: 'utf-8'
  });
  assert(listOutput.includes('Tier 0: Pure Semantic Primitives'), 'CLI list must show Tier 0');
  assert(listOutput.includes('Tier 2: Micro-Enhancers'), 'CLI list must show Tier 2');
  assert(listOutput.includes('dropdown'), 'CLI list must include dropdown');
  assert(listOutput.includes('toast'), 'CLI list must include toast');
  console.log('  ✓ CLI list command passed');

  // Test 2: nnui init
  const initOutput = execSync(`node "${path.join(rootDir, 'bin/nnui.js')}" init`, {
    cwd: testProjectDir,
    encoding: 'utf-8'
  });
  assert(fs.existsSync(path.join(testProjectDir, 'nnui.json')), 'nnui.json must be created');
  assert(fs.existsSync(path.join(testProjectDir, 'components/ui/utils/base-element.js')), 'base-element.js must be created');
  assert(fs.existsSync(path.join(testProjectDir, 'components/ui/tokens.css')), 'tokens.css must be created');
  assert(fs.existsSync(path.join(testProjectDir, 'components/ui/base.css')), 'base.css must be created');
  assert(fs.existsSync(path.join(testProjectDir, 'tokens.json')), 'tokens.json must be created');
  console.log('  ✓ CLI init command passed');

  // Test 3: nnui add dropdown toast
  const addOutput = execSync(`node "${path.join(rootDir, 'bin/nnui.js')}" add dropdown toast`, {
    cwd: testProjectDir,
    encoding: 'utf-8'
  });
  const dropdownFile = path.join(testProjectDir, 'components/ui/dropdown/ui-dropdown.js');
  const toastFile = path.join(testProjectDir, 'components/ui/toast/ui-toast.js');

  assert(fs.existsSync(dropdownFile), 'dropdown component file must be installed');
  assert(fs.existsSync(toastFile), 'toast component file must be installed');

  const dropdownContent = fs.readFileSync(dropdownFile, 'utf-8');
  assert(dropdownContent.includes('class UiDropdown extends BaseLightElement'), 'ui-dropdown.js content verified');
  assert(dropdownContent.includes("'../utils/base-element.js'"), 'ui-dropdown.js import rewritten');
  console.log('  ✓ CLI add dropdown toast passed');

  // Test 4: nnui add data-table calendar date-picker
  const addDataTableOutput = execSync(`node "${path.join(rootDir, 'bin/nnui.js')}" add data-table calendar date-picker`, {
    cwd: testProjectDir,
    encoding: 'utf-8'
  });
  const dataTableFile = path.join(testProjectDir, 'components/ui/data-table/ui-data-table.js');
  const calendarFile = path.join(testProjectDir, 'components/ui/calendar/ui-calendar.js');
  const datePickerFile = path.join(testProjectDir, 'components/ui/date-picker/ui-date-picker.js');

  assert(fs.existsSync(dataTableFile), 'data-table component file must be installed');
  assert(fs.existsSync(calendarFile), 'calendar component file must be installed');
  assert(fs.existsSync(datePickerFile), 'date-picker component file must be installed');

  const dataTableContent = fs.readFileSync(dataTableFile, 'utf-8');
  assert(dataTableContent.includes('class UiDataTable extends BaseLightElement'), 'ui-data-table.js content verified');
  const calendarContent = fs.readFileSync(calendarFile, 'utf-8');
  assert(calendarContent.includes('class UiCalendar extends BaseLightElement'), 'ui-calendar.js content verified');
  const datePickerContent = fs.readFileSync(datePickerFile, 'utf-8');
  assert(datePickerContent.includes('class UiDatePicker extends BaseLightElement'), 'ui-date-picker.js content verified');
  console.log('  ✓ CLI add data-table calendar date-picker passed');

  // Test 5: nnui add dialog tabs --react
  const addReactOutput = execSync(`node "${path.join(rootDir, 'bin/nnui.js')}" add dialog tabs --react`, {
    cwd: testProjectDir,
    encoding: 'utf-8'
  });
  const reactDialogFile = path.join(testProjectDir, 'components/ui/dialog.jsx');
  const reactTabsFile = path.join(testProjectDir, 'components/ui/tabs.jsx');
  assert(fs.existsSync(reactDialogFile), 'React dialog.jsx file must be installed');
  assert(fs.existsSync(reactTabsFile), 'React tabs.jsx file must be installed');
  const reactDialogContent = fs.readFileSync(reactDialogFile, 'utf-8');
  assert(reactDialogContent.includes("import { Dialog } from 'nnuikit/react';"), 'React dialog imports from nnuikit/react');
  assert(reactDialogContent.includes("export const DialogTrigger = Dialog.Trigger;"), 'React dialog exports compound parts');
  assert(reactDialogContent.includes("export function DialogModal"), 'React dialog exports composite modal');
  console.log('  ✓ CLI add --react (dialog, tabs) passed');

  // Test 6: nnui add dialog tabs --html
  const addHtmlOutput = execSync(`node "${path.join(rootDir, 'bin/nnui.js')}" add dialog tabs --html`, {
    cwd: testProjectDir,
    encoding: 'utf-8'
  });
  const htmlDialogFile = path.join(testProjectDir, 'components/ui/dialog/dialog.html');
  const htmlDialogJs = path.join(testProjectDir, 'components/ui/dialog/ui-dialog.js');
  assert(fs.existsSync(htmlDialogFile), 'HTML dialog.html snippet must be generated');
  assert(fs.existsSync(htmlDialogJs), 'HTML ui-dialog.js micro-enhancer must be installed');
  const htmlDialogContent = fs.readFileSync(htmlDialogFile, 'utf-8');
  assert(htmlDialogContent.includes('<ui-dialog'), 'HTML snippet contains <ui-dialog>');
  assert(htmlDialogContent.includes('data-part="dialog"'), 'HTML snippet contains data-part');
  console.log('  ✓ CLI add --html (dialog, tabs) passed');

  // Test 7: nnui add dialog tabs --rails
  const addRailsOutput = execSync(`node "${path.join(rootDir, 'bin/nnui.js')}" add dialog tabs --rails`, {
    cwd: testProjectDir,
    encoding: 'utf-8'
  });
  const railsErbFile = path.join(testProjectDir, 'app/views/components/_dialog.html.erb');
  const railsJsFile = path.join(testProjectDir, 'app/javascript/components/ui-dialog.js');
  assert(fs.existsSync(railsErbFile), 'Rails ERB partial _dialog.html.erb must be generated');
  assert(fs.existsSync(railsJsFile), 'Rails JS micro-enhancer ui-dialog.js must be generated');
  const railsErbContent = fs.readFileSync(railsErbFile, 'utf-8');
  assert(railsErbContent.includes('<ui-dialog id="<%= local_assigns[:id] %>"'), 'Rails ERB partial contains ui-dialog with local_assigns');
  assert(railsErbContent.includes('yield if block_given?'), 'Rails ERB partial contains block yield');
  // Test 8: nnui init in a React project with src/ directory
  const reactProjectDir = path.join(rootDir, 'tests/temp_react_test_project');
  if (fs.existsSync(reactProjectDir)) {
    fs.rmSync(reactProjectDir, { recursive: true, force: true });
  }
  fs.mkdirSync(path.join(reactProjectDir, 'src'), { recursive: true });
  fs.writeFileSync(
    path.join(reactProjectDir, 'package.json'),
    JSON.stringify({
      name: 'test-react-app',
      dependencies: { react: '^19.0.0', 'react-dom': '^19.0.0' }
    }, null, 2)
  );

  const reactInitOutput = execSync(`node "${path.join(rootDir, 'bin/nnui.js')}" init`, {
    cwd: reactProjectDir,
    encoding: 'utf-8'
  });

  assert(fs.existsSync(path.join(reactProjectDir, 'src/components/ui/tokens.css')), 'tokens.css must be in src/components/ui in React project');
  assert(fs.existsSync(path.join(reactProjectDir, 'src/components/ui/components.css')), 'components.css must be in src/components/ui in React project');
  assert(fs.existsSync(path.join(reactProjectDir, 'src/components/ui/utils/base-element.js')), 'base-element.js must be in src/components/ui/utils in React project');
  assert(!fs.existsSync(path.join(reactProjectDir, 'components/ui')), 'Should NOT create components/ outside src/');

  const reactConfig = JSON.parse(fs.readFileSync(path.join(reactProjectDir, 'nnui.json'), 'utf-8'));
  assert.strictEqual(reactConfig.componentsDir, 'src/components/ui', 'componentsDir in nnui.json must be src/components/ui');
  assert.strictEqual(reactConfig.framework, 'react', 'framework in nnui.json must be react');

  // Test adding component in React project without needing --react flag
  execSync(`node "${path.join(rootDir, 'bin/nnui.js')}" add dialog`, {
    cwd: reactProjectDir,
    encoding: 'utf-8'
  });
  assert(fs.existsSync(path.join(reactProjectDir, 'src/components/ui/dialog.jsx')), 'dialog.jsx must be added inside src/components/ui/');

  fs.rmSync(reactProjectDir, { recursive: true, force: true });
  console.log('  ✓ CLI init & add in React (src/) project passed');

  console.log('🎉 ALL CLI & REGISTRY TESTS PASSED!\n');
} finally {
  // Clean up test sandbox
  if (fs.existsSync(testProjectDir)) {
    fs.rmSync(testProjectDir, { recursive: true, force: true });
  }
}
