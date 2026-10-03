import '../src/index.js';
import { htmlToReact, htmlToVue, htmlToSvelte, formatHtml } from './framework-snippets.js';
import { initThemeCustomizer } from './theme-customizer.js';
import { initGlobalSearch } from './command-search.js';

const STORAGE_FRAMEWORK_KEY = 'nnui_framework';

function getPreferredFramework() {
  try {
    return localStorage.getItem(STORAGE_FRAMEWORK_KEY) || 'html';
  } catch (e) {
    return 'html';
  }
}

function setPreferredFramework(fw) {
  try {
    localStorage.setItem(STORAGE_FRAMEWORK_KEY, fw);
  } catch (e) {
    // ignore
  }
}

// Setup Preview vs Code tab switching & Multi-framework snippet tabs
function setupPreviewCodeTabs() {
  const cards = document.querySelectorAll('.preview-card');
  const pageTitle = document.querySelector('.component-view-title')?.textContent?.trim() || 'Component';

  let currentFramework = getPreferredFramework();

  function updateCodeForCard(card, fw) {
    const codeEl = card.querySelector('.code-stage pre code') || card.querySelector('.code-stage pre');
    if (!codeEl) return;

    const rawHtml = codeEl.getAttribute('data-raw-html') || codeEl.textContent;
    if (!codeEl.hasAttribute('data-raw-html')) {
      codeEl.setAttribute('data-raw-html', rawHtml);
    }

    let formatted = '';
    switch (fw) {
      case 'react':
        formatted = htmlToReact(rawHtml, pageTitle);
        break;
      case 'vue':
        formatted = htmlToVue(rawHtml, pageTitle);
        break;
      case 'svelte':
        formatted = htmlToSvelte(rawHtml, pageTitle);
        break;
      case 'html':
      default:
        formatted = formatHtml(rawHtml);
        break;
    }

    codeEl.textContent = formatted;

    // Update active state in this card's toolbar
    card.querySelectorAll('.framework-tab-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.framework === fw);
    });
  }

  function setGlobalFramework(fw) {
    currentFramework = fw;
    setPreferredFramework(fw);
    cards.forEach((card) => updateCodeForCard(card, fw));
  }

  cards.forEach((card) => {
    const previewBtn = card.querySelector('[data-view="preview"]');
    const codeBtn = card.querySelector('[data-view="code"]');
    const previewStage = card.querySelector('.preview-stage');
    const codeStage = card.querySelector('.code-stage');

    if (!previewBtn || !codeBtn || !previewStage || !codeStage) return;

    // Toggle Preview vs Code
    previewBtn.addEventListener('click', () => {
      previewBtn.classList.add('active');
      codeBtn.classList.remove('active');
      previewStage.style.display = 'flex';
      codeStage.classList.remove('active');
    });

    codeBtn.addEventListener('click', () => {
      codeBtn.classList.add('active');
      previewBtn.classList.remove('active');
      previewStage.style.display = 'none';
      codeStage.classList.add('active');
    });

    // Cache initial raw HTML
    const codeEl = codeStage.querySelector('pre code') || codeStage.querySelector('pre');
    if (codeEl && !codeEl.hasAttribute('data-raw-html')) {
      codeEl.setAttribute('data-raw-html', codeEl.textContent);
    }

    // Inject Framework Toolbar if not yet present
    if (!codeStage.querySelector('.code-toolbar')) {
      const toolbar = document.createElement('div');
      toolbar.className = 'code-toolbar';
      toolbar.innerHTML = `
        <div class="framework-tab-group" role="tablist" aria-label="Framework Code">
          <button class="framework-tab-btn ${currentFramework === 'html' ? 'active' : ''}" data-framework="html" type="button">
            <span class="framework-icon">&lt;&gt;</span> HTML
          </button>
          <button class="framework-tab-btn ${currentFramework === 'react' ? 'active' : ''}" data-framework="react" type="button">
            <span class="framework-icon">⚛</span> React 19
          </button>
          <button class="framework-tab-btn ${currentFramework === 'vue' ? 'active' : ''}" data-framework="vue" type="button">
            <span class="framework-icon">🟢</span> Vue 3
          </button>
          <button class="framework-tab-btn ${currentFramework === 'svelte' ? 'active' : ''}" data-framework="svelte" type="button">
            <span class="framework-icon">🟠</span> Svelte 5
          </button>
        </div>
        <button class="copy-btn" type="button">Copy Code</button>
      `;

      // Insert toolbar at the top of codeStage before <pre>
      codeStage.insertBefore(toolbar, codeStage.firstChild);

      // Handle framework tab clicks
      toolbar.querySelectorAll('.framework-tab-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          setGlobalFramework(btn.dataset.framework);
        });
      });
    }

    // Initialize initial code formatting
    updateCodeForCard(card, currentFramework);
  });
}

// Setup Copy Buttons
function setupCopyButtons() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.copy-btn');
    if (!btn) return;

    const container = btn.closest('.code-stage') || btn.closest('.code-container') || btn.closest('.preview-card');
    const codeEl = container?.querySelector('pre code') || container?.querySelector('pre');
    if (!codeEl) return;

    navigator.clipboard.writeText(codeEl.textContent.trim()).then(() => {
      const originalHTML = btn.innerHTML;
      btn.innerHTML = '✓ Copied';
      btn.style.color = 'var(--ui-color-success-500)';
      btn.style.borderColor = 'var(--ui-color-success-500)';

      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.color = '';
        btn.style.borderColor = '';
      }, 2000);
    });
  });
}

// Setup Theme Toggle
function setupThemeToggle() {
  const btn = document.getElementById('components-theme-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    btn.textContent = next === 'dark' ? '☀️ Light' : '🌙 Dark';
  });
}

function setupScrollspy() {
  const sections = document.querySelectorAll('section[id], [id].scroll-target, div[id="overview"], div[id="preview"], div[id="features"], div[id="code"], div[id="api"]');
  const navItems = document.querySelectorAll('.docs-sidebar .sidebar-item[href^="#"]');
  const tocItems = document.querySelectorAll('.docs-toc .toc-link');

  function onScroll() {
    let currentId = '';
    const scrollY = window.scrollY;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 140;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    if (currentId) {
      navItems.forEach((item) => {
        const href = item.getAttribute('href') || '';
        item.classList.toggle('active', href === `#${currentId}`);
      });
      tocItems.forEach((item) => {
        const href = item.getAttribute('href') || '';
        item.classList.toggle('active', href === `#${currentId}`);
      });
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
}

window.addEventListener('DOMContentLoaded', () => {
  initThemeCustomizer();
  initGlobalSearch();
  setupPreviewCodeTabs();
  setupCopyButtons();
  setupThemeToggle();
  setupScrollspy();
});
