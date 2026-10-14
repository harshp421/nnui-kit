import '../src/index.js';
import { htmlToReact, htmlToVue, htmlToSvelte, formatHtml } from './framework-snippets.js';
import { initThemeCustomizer } from './theme-customizer.js';
import { initGlobalSearch } from './command-search.js';
import { initHudInspector } from './hud-inspector.js';

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
  const titleEl = document.querySelector('.component-view-title, .docs-title, h1');
  const pageTitle = titleEl ? (titleEl.childNodes[0]?.textContent?.trim() || titleEl.textContent?.trim() || 'Component') : 'Component';

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

    // Initialize display state
    if (codeBtn.classList.contains('active')) {
      previewStage.style.display = 'none';
      codeStage.style.display = 'block';
      codeStage.classList.add('active');
    } else {
      previewStage.style.display = '';
      codeStage.style.display = 'none';
      codeStage.classList.remove('active');
    }

    // Toggle Preview vs Code
    previewBtn.addEventListener('click', () => {
      previewBtn.classList.add('active');
      codeBtn.classList.remove('active');
      previewStage.style.display = '';
      codeStage.style.display = 'none';
      codeStage.classList.remove('active');
    });

    codeBtn.addEventListener('click', () => {
      codeBtn.classList.add('active');
      previewBtn.classList.remove('active');
      previewStage.style.display = 'none';
      codeStage.style.display = 'block';
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

// Setup Framework Code Cards (#framework-code-tabs / .framework-code-card)
function setupFrameworkCodeCards() {
  document.querySelectorAll('.framework-code-card').forEach((card) => {
    const tabs = card.querySelectorAll('.framework-tab-btn');
    const snippets = {
      react: card.querySelector('#code-snippet-react') || card.querySelector('[data-snippet="react"]'),
      vue: card.querySelector('#code-snippet-vue') || card.querySelector('[data-snippet="vue"]'),
      svelte: card.querySelector('#code-snippet-svelte') || card.querySelector('[data-snippet="svelte"]'),
      html: card.querySelector('#code-snippet-html') || card.querySelector('[data-snippet="html"]')
    };

    tabs.forEach((btn) => {
      btn.addEventListener('click', () => {
        const fw = btn.getAttribute('data-framework');
        tabs.forEach((b) => {
          b.classList.remove('active');
          b.style.border = '1px solid transparent';
          b.style.background = 'transparent';
          b.style.color = 'var(--ui-text-muted)';
        });
        btn.classList.add('active');
        btn.style.border = '1px solid var(--ui-border-default)';
        btn.style.background = 'var(--ui-bg-surface)';
        btn.style.color = 'var(--ui-text-primary)';

        Object.values(snippets).forEach((snip) => {
          if (snip) snip.style.display = 'none';
        });
        if (snippets[fw]) {
          snippets[fw].style.display = 'block';
        }
      });
    });
  });
}

// Setup Copy Buttons
function setupCopyButtons() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.copy-btn');
    if (!btn) return;

    let codeEl = null;
    const fwCard = btn.closest('.framework-code-card');
    if (fwCard) {
      const visibleSnippets = Array.from(fwCard.querySelectorAll('.framework-snippet')).filter(
        (el) => window.getComputedStyle(el).display !== 'none'
      );
      const activeSnippet = visibleSnippets[0] || fwCard.querySelector('.framework-snippet');
      codeEl = activeSnippet?.querySelector('pre code') || activeSnippet?.querySelector('pre') || fwCard.querySelector('pre code');
    } else {
      const container = btn.closest('.code-stage') || btn.closest('.code-container') || btn.closest('.preview-card');
      codeEl = container?.querySelector('pre code') || container?.querySelector('pre');
    }

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

function initAll() {
  initThemeCustomizer();
  initGlobalSearch();
  initHudInspector();
  setupPreviewCodeTabs();
  setupFrameworkCodeCards();
  setupCopyButtons();
  setupThemeToggle();
  setupScrollspy();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}
