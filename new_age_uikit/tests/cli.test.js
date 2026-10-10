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

  console.log('🎉 ALL CLI & REGISTRY TESTS PASSED!\n');
} finally {
  // Clean up test sandbox
  if (fs.existsSync(testProjectDir)) {
    fs.rmSync(testProjectDir, { recursive: true, force: true });
  }
}
