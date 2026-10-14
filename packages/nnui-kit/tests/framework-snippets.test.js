import assert from 'node:assert';
import { htmlToReact, htmlToVue, htmlToSvelte, formatHtml } from '../playground/framework-snippets.js';

console.log('Testing Framework Code Snippet Generator...');

// Test 1: Button primitive conversion
const buttonHtml = '<button data-ui="button" class="btn">Click me</button>';
const reactBtn = htmlToReact(buttonHtml, 'Button');
assert(reactBtn.includes("import 'nnui-kit'"), 'React snippet must import nnui-kit');
assert(reactBtn.includes('className="btn"'), 'React snippet must convert class to className');
assert(reactBtn.includes('export default function ButtonDemo'), 'React snippet must export component');
console.log('  ✓ Button primitive React 19 conversion passed');

const vueBtn = htmlToVue(buttonHtml, 'Button');
assert(vueBtn.includes('<script setup>'), 'Vue snippet must use <script setup>');
assert(vueBtn.includes("import 'nnui-kit'"), 'Vue snippet must import nnui-kit');
assert(vueBtn.includes('<template>'), 'Vue snippet must contain <template>');
console.log('  ✓ Button primitive Vue 3 conversion passed');

const svelteBtn = htmlToSvelte(buttonHtml, 'Button');
assert(svelteBtn.includes('<script>'), 'Svelte snippet must contain <script>');
assert(svelteBtn.includes("import 'nnui-kit'"), 'Svelte snippet must import nnui-kit');
console.log('  ✓ Button primitive Svelte 5 conversion passed');

// Test 2: Custom Element (Dropdown) conversion
const dropdownHtml = `
<ui-dropdown>
  <button type="button" data-part="trigger" data-ui="button">Options</button>
  <div data-part="menu" role="menu">
    <div data-part="menu-item" data-value="edit">Edit</div>
  </div>
</ui-dropdown>
`;

const reactDropdown = htmlToReact(dropdownHtml, 'Dropdown');
assert(reactDropdown.includes('onSelect='), 'React Dropdown snippet must include onSelect handler');
assert(reactDropdown.includes('useState'), 'React Dropdown snippet must use state');
console.log('  ✓ Dropdown React 19 event binding passed');

const vueDropdown = htmlToVue(dropdownHtml, 'Dropdown');
assert(vueDropdown.includes('@select='), 'Vue Dropdown snippet must include @select handler');
assert(vueDropdown.includes('ref('), 'Vue Dropdown snippet must use ref');
console.log('  ✓ Dropdown Vue 3 event binding passed');

const svelteDropdown = htmlToSvelte(dropdownHtml, 'Dropdown');
assert(svelteDropdown.includes('onselect='), 'Svelte Dropdown snippet must include onselect handler');
assert(svelteDropdown.includes('$state('), 'Svelte Dropdown snippet must use Svelte 5 runes');
console.log('  ✓ Dropdown Svelte 5 runes binding passed');

// Test 3: Toast Notification snippet conversion
const toastHtml = '<ui-toaster position="bottom-right"></ui-toaster><button onclick="toast.success()">Toast</button>';
const reactToast = htmlToReact(toastHtml, 'Toast');
assert(reactToast.includes("import { toast } from 'nnui-kit'"), 'React Toast snippet must import toast');
assert(reactToast.includes('toast.success('), 'React Toast snippet must call toast.success');
console.log('  ✓ Toast React 19 notification demo passed');

console.log('🎉 ALL FRAMEWORK SNIPPET GENERATOR TESTS PASSED!\n');
