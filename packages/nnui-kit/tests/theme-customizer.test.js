import assert from 'node:assert';
import { GlobalWindow } from 'happy-dom';
import { applyTheme, generateThemeCss } from '../playground/theme-customizer.js';

console.log('Testing Theme Customizer Logic...');

const window = new GlobalWindow();
globalThis.window = window;
globalThis.document = window.document;
global.localStorage = {
  _data: {},
  getItem(k) { return this._data[k] || null; },
  setItem(k, v) { this._data[k] = String(v); },
  removeItem(k) { delete this._data[k]; }
};

// Test 1: Apply Violet Theme with 1.0 radius
applyTheme({
  palette: 'violet',
  radius: '1.0',
  mode: 'dark'
});

assert.strictEqual(document.documentElement.getAttribute('data-theme'), 'dark');
assert.strictEqual(document.documentElement.style.getPropertyValue('--ui-color-brand-600'), '#8b5cf6');
assert.strictEqual(document.documentElement.style.getPropertyValue('--ui-radius-md'), '1rem');
console.log('  ✓ Violet Dark 1.0 radius applied correctly to DOM styles');

// Test 2: Apply Emerald Light Theme with 0 radius (Sharp)
applyTheme({
  palette: 'emerald',
  radius: '0',
  mode: 'light'
});

assert.strictEqual(document.documentElement.getAttribute('data-theme'), 'light');
assert.strictEqual(document.documentElement.style.getPropertyValue('--ui-color-brand-600'), '#059669');
assert.strictEqual(document.documentElement.style.getPropertyValue('--ui-radius-md'), '0px');
console.log('  ✓ Emerald Light Sharp radius applied correctly to DOM styles');

// Test 3: Generate CSS output
const css = generateThemeCss({
  palette: 'rose',
  radius: '0.75',
  mode: 'dark'
});

assert(css.includes('--ui-color-brand-600: #f43f5e'), 'CSS must include Rose brand color');
assert(css.includes('--ui-radius-md: 0.75rem'), 'CSS must include 0.75rem radius');
console.log('  ✓ CSS custom property generator passed');

console.log('🎉 ALL THEME CUSTOMIZER TESTS PASSED!\n');
