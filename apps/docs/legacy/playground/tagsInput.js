import '../src/index.js';
import { initGlobalSearch } from './command-search.js';

document.addEventListener('DOMContentLoaded', () => {
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

  const tagsInput = document.getElementById('demo-tags-input');
  const display = document.getElementById('tags-array-display');

  if (tagsInput && display) {
    tagsInput.addEventListener('change', (e) => {
      display.textContent = JSON.stringify(e.detail.tags);
    });
  }

  // Copy buttons
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const pre = btn.closest('.code-container').querySelector('code');
      if (pre) {
        navigator.clipboard.writeText(pre.textContent);
        const orig = btn.textContent;
        btn.textContent = '✓ Copied!';
        setTimeout(() => btn.textContent = orig, 2000);
      }
    });
  });
});
