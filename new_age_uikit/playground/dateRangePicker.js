import '../src/index.js';
import { initGlobalSearch } from './command-search.js';

function initDateRangePickerPage() {
  initGlobalSearch();

  // Theme Toggler
  const themeBtn = document.getElementById('components-theme-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      themeBtn.textContent = next === 'dark' ? '☀️ Light' : '🌙 Dark';
    });
  }

  const picker = document.getElementById('demo-range-picker');
  const displayText = document.getElementById('range-display-text');

  if (picker && displayText) {
    // If hydrated from persistence, update display text immediately
    if (picker.startDate && picker.endDate && typeof picker._formatDate === 'function') {
      displayText.textContent = `${picker._formatDate(picker.startDate)} → ${picker._formatDate(picker.endDate)}`;
    }

    picker.addEventListener('change', (e) => {
      const { start, end } = e.detail || {};
      if (start && end) {
        displayText.textContent = `${start} → ${end}`;
      } else {
        displayText.textContent = 'None';
      }
    });
  }

  // Copy buttons
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const pre = btn.closest('.code-container')?.querySelector('code') || btn.closest('.preview-card')?.querySelector('.code-stage code');
      if (pre) {
        navigator.clipboard.writeText(pre.textContent);
        const orig = btn.textContent;
        btn.textContent = '✓ Copied!';
        setTimeout(() => btn.textContent = orig, 2000);
      }
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDateRangePickerPage);
} else {
  initDateRangePickerPage();
}
