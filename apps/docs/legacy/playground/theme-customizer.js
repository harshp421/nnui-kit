/**
 * NNUI-KIT Real-time Theme Customizer
 * Provides live color palette, radius picker, dark/light mode toggle,
 * CSS token generator, and localStorage persistence across all pages.
 */

const PALETTES = {
  zinc: {
    name: 'Zinc',
    color: '#71717a',
    light: { brand600: '#18181b', brand500: '#27272a', focus: '#09090b', accent: '#0ea5e9' },
    dark: { brand600: '#fafafa', brand500: '#f4f4f5', focus: '#fafafa', accent: '#38bdf8' }
  },
  violet: {
    name: 'Violet',
    color: '#8b5cf6',
    light: { brand600: '#7c3aed', brand500: '#8b5cf6', focus: '#7c3aed', accent: '#a78bfa' },
    dark: { brand600: '#8b5cf6', brand500: '#a78bfa', focus: '#c4b5fd', accent: '#c4b5fd' }
  },
  indigo: {
    name: 'Indigo',
    color: '#6366f1',
    light: { brand600: '#4f46e5', brand500: '#6366f1', focus: '#4f46e5', accent: '#818cf8' },
    dark: { brand600: '#6366f1', brand500: '#818cf8', focus: '#a5b4fc', accent: '#a5b4fc' }
  },
  blue: {
    name: 'Blue',
    color: '#0ea5e9',
    light: { brand600: '#0284c7', brand500: '#0ea5e9', focus: '#0284c7', accent: '#38bdf8' },
    dark: { brand600: '#0ea5e9', brand500: '#38bdf8', focus: '#7dd3fc', accent: '#7dd3fc' }
  },
  emerald: {
    name: 'Emerald',
    color: '#10b981',
    light: { brand600: '#059669', brand500: '#10b981', focus: '#059669', accent: '#34d399' },
    dark: { brand600: '#10b981', brand500: '#34d399', focus: '#6ee7b7', accent: '#6ee7b7' }
  },
  rose: {
    name: 'Rose',
    color: '#f43f5e',
    light: { brand600: '#e11d48', brand500: '#f43f5e', focus: '#e11d48', accent: '#fb7185' },
    dark: { brand600: '#f43f5e', brand500: '#fb7185', focus: '#fda4af', accent: '#fda4af' }
  },
  amber: {
    name: 'Amber',
    color: '#f59e0b',
    light: { brand600: '#d97706', brand500: '#f59e0b', focus: '#d97706', accent: '#fbbf24' },
    dark: { brand600: '#f59e0b', brand500: '#fbbf24', focus: '#fcd34d', accent: '#fde68a' }
  }
};

const RADII = {
  '0': { label: '0', sm: '0px', md: '0px', lg: '0px', xl: '0px' },
  '0.3': { label: '0.3', sm: '0.2rem', md: '0.35rem', lg: '0.5rem', xl: '0.65rem' },
  '0.5': { label: '0.5', sm: '0.375rem', md: '0.5rem', lg: '0.75rem', xl: '1rem' },
  '0.75': { label: '0.75', sm: '0.5rem', md: '0.75rem', lg: '1rem', xl: '1.25rem' },
  '1.0': { label: '1.0', sm: '0.75rem', md: '1rem', lg: '1.5rem', xl: '2rem' }
};

const STORAGE_KEY = 'nnui_theme_config';

function loadThemeConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // fallback
  }
  return {
    palette: 'zinc',
    radius: '0.5',
    mode: document.documentElement.getAttribute('data-theme') || 'dark'
  };
}

function saveThemeConfig(config) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    // ignore
  }
}

export function applyTheme(config) {
  const root = document.documentElement;
  const isDark = config.mode === 'dark';

  root.setAttribute('data-theme', config.mode);

  const pal = PALETTES[config.palette] || PALETTES.zinc;
  const colorSet = isDark ? pal.dark : pal.light;

  root.style.setProperty('--ui-color-brand-600', colorSet.brand600);
  root.style.setProperty('--ui-color-brand-500', colorSet.brand500);
  root.style.setProperty('--ui-border-focus', colorSet.focus);
  root.style.setProperty('--ui-color-accent-400', colorSet.accent);
  root.style.setProperty('--ui-color-accent-500', colorSet.brand500);

  const rad = RADII[config.radius] || RADII['0.5'];
  root.style.setProperty('--ui-radius-sm', rad.sm);
  root.style.setProperty('--ui-radius-md', rad.md);
  root.style.setProperty('--ui-radius-lg', rad.lg);
  root.style.setProperty('--ui-radius-xl', rad.xl);

  // Update theme toggle buttons if present
  document.querySelectorAll('#components-theme-btn, #docs-theme-toggle').forEach((btn) => {
    btn.textContent = isDark ? '☀️ Light' : '🌙 Dark';
  });
}

export function generateThemeCss(config) {
  const pal = PALETTES[config.palette] || PALETTES.zinc;
  const isDark = config.mode === 'dark';
  const colorSet = isDark ? pal.dark : pal.light;
  const rad = RADII[config.radius] || RADII['0.5'];

  return `/* NNUI-KIT Custom Theme: ${pal.name} (${rad.label} radius) */
:root {
  --ui-radius-sm: ${rad.sm};
  --ui-radius-md: ${rad.md};
  --ui-radius-lg: ${rad.lg};
  --ui-radius-xl: ${rad.xl};
  --ui-color-brand-600: ${colorSet.brand600};
  --ui-color-brand-500: ${colorSet.brand500};
  --ui-border-focus: ${colorSet.focus};
}`;
}

export function initThemeCustomizer() {
  const config = loadThemeConfig();
  applyTheme(config);

  // Check if nav exists
  const navRight = document.querySelector('.docs-nav-right');
  if (!navRight || document.getElementById('nnui-customizer-btn')) return;

  // Insert Customizer Trigger Button
  const customizerBtn = document.createElement('button');
  customizerBtn.id = 'nnui-customizer-btn';
  customizerBtn.className = 'ui-button ui-button--secondary';
  customizerBtn.type = 'button';
  customizerBtn.style.padding = '0.35rem 0.75rem';
  customizerBtn.style.fontSize = '0.8rem';
  customizerBtn.style.display = 'inline-flex';
  customizerBtn.style.alignItems = 'center';
  customizerBtn.style.gap = '0.35rem';
  customizerBtn.innerHTML = `<span>🎨</span> <span>Customize</span>`;

  // Place before theme btn or at start of right nav
  navRight.insertBefore(customizerBtn, navRight.firstChild);

  // Build the Popover/Modal Panel
  const panel = document.createElement('div');
  panel.id = 'nnui-customizer-panel';
  panel.className = 'nnui-customizer-popover';
  panel.hidden = true;

  panel.innerHTML = `
    <div class="customizer-header">
      <div>
        <div style="font-weight: 700; font-size: 0.95rem; color: var(--ui-text-primary);">Theme Customizer</div>
        <div style="font-size: 0.75rem; color: var(--ui-text-secondary);">Customize color palette, radius, and mode</div>
      </div>
      <button class="customizer-close-btn" type="button" aria-label="Close customizer">✕</button>
    </div>

    <div class="customizer-body">
      <!-- Color Palette -->
      <div class="customizer-section">
        <label class="customizer-label">Color Palette</label>
        <div class="customizer-palette-grid">
          ${Object.entries(PALETTES).map(([key, item]) => `
            <button class="palette-swatch-btn ${config.palette === key ? 'active' : ''}" data-palette="${key}" type="button">
              <span class="palette-dot" style="background-color: ${item.color};"></span>
              <span>${item.name}</span>
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Radius Picker -->
      <div class="customizer-section">
        <label class="customizer-label">Corner Radius</label>
        <div class="customizer-radius-group">
          ${Object.entries(RADII).map(([key, item]) => `
            <button class="radius-btn ${config.radius === key ? 'active' : ''}" data-radius="${key}" type="button">
              ${item.label}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Mode Selector -->
      <div class="customizer-section">
        <label class="customizer-label">Appearance Mode</label>
        <div class="customizer-mode-group">
          <button class="mode-btn ${config.mode === 'light' ? 'active' : ''}" data-mode="light" type="button">
            ☀️ Light
          </button>
          <button class="mode-btn ${config.mode === 'dark' ? 'active' : ''}" data-mode="dark" type="button">
            🌙 Dark
          </button>
        </div>
      </div>

      <!-- CSS Output & Actions -->
      <div class="customizer-section">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
          <label class="customizer-label" style="margin: 0;">Theme CSS</label>
          <button class="customizer-copy-css-btn" type="button">Copy CSS</button>
        </div>
        <pre class="customizer-css-pre"><code>${generateThemeCss(config)}</code></pre>
      </div>
    </div>

    <div class="customizer-footer">
      <button class="customizer-reset-btn" type="button">Reset Defaults</button>
      <button class="ui-button customizer-done-btn" type="button" style="padding: 0.35rem 0.85rem; font-size: 0.8rem;">Done</button>
    </div>
  `;

  document.body.appendChild(panel);

  const updateCssBox = () => {
    const codeEl = panel.querySelector('.customizer-css-pre code');
    if (codeEl) codeEl.textContent = generateThemeCss(config);
  };

  // Toggle Panel
  customizerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    panel.hidden = !panel.hidden;
  });

  panel.querySelector('.customizer-close-btn').addEventListener('click', () => {
    panel.hidden = true;
  });

  panel.querySelector('.customizer-done-btn').addEventListener('click', () => {
    panel.hidden = true;
  });

  // Color Palette Selection
  panel.querySelectorAll('.palette-swatch-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      panel.querySelectorAll('.palette-swatch-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      config.palette = btn.dataset.palette;
      saveThemeConfig(config);
      applyTheme(config);
      updateCssBox();
    });
  });

  // Radius Selection
  panel.querySelectorAll('.radius-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      panel.querySelectorAll('.radius-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      config.radius = btn.dataset.radius;
      saveThemeConfig(config);
      applyTheme(config);
      updateCssBox();
    });
  });

  // Mode Selection
  panel.querySelectorAll('.mode-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      panel.querySelectorAll('.mode-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      config.mode = btn.dataset.mode;
      saveThemeConfig(config);
      applyTheme(config);
      updateCssBox();
    });
  });

  // Copy CSS
  panel.querySelector('.customizer-copy-css-btn').addEventListener('click', (e) => {
    const btn = e.target;
    const css = generateThemeCss(config);
    navigator.clipboard.writeText(css).then(() => {
      const orig = btn.textContent;
      btn.textContent = '✓ Copied';
      setTimeout(() => { btn.textContent = orig; }, 1500);
    });
  });

  // Reset Defaults
  panel.querySelector('.customizer-reset-btn').addEventListener('click', () => {
    config.palette = 'zinc';
    config.radius = '0.5';
    config.mode = 'dark';
    saveThemeConfig(config);
    applyTheme(config);
    updateCssBox();

    // Update active classes
    panel.querySelectorAll('.palette-swatch-btn').forEach((b) => {
      b.classList.toggle('active', b.dataset.palette === 'zinc');
    });
    panel.querySelectorAll('.radius-btn').forEach((b) => {
      b.classList.toggle('active', b.dataset.radius === '0.5');
    });
    panel.querySelectorAll('.mode-btn').forEach((b) => {
      b.classList.toggle('active', b.dataset.mode === 'dark');
    });
  });

  // Dismiss on outside click
  document.addEventListener('click', (e) => {
    if (!panel.hidden && !panel.contains(e.target) && e.target !== customizerBtn && !customizerBtn.contains(e.target)) {
      panel.hidden = true;
    }
  });

  // Escape key closes
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panel.hidden) {
      panel.hidden = true;
    }
  });
}
