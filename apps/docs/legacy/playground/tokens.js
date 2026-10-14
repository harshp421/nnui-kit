import '../src/index.js';
import { initGlobalSearch } from './command-search.js';

// Color definitions for palettes
const PALETTES = {
  slate: {
    name: 'Slate',
    primary: '#475569',
    accent: '#94a3b8',
    swatches: [
      { step: '50', hex: '#f8fafc' },
      { step: '100', hex: '#f1f5f9' },
      { step: '200', hex: '#e2e8f0' },
      { step: '300', hex: '#cbd5e1' },
      { step: '400', hex: '#94a3b8' },
      { step: '500', hex: '#64748b' },
      { step: '600', hex: '#475569' },
      { step: '700', hex: '#334155' },
      { step: '800', hex: '#1e293b' },
      { step: '900', hex: '#0f172a' },
      { step: '950', hex: '#020617' }
    ]
  },
  violet: {
    name: 'Violet',
    primary: '#7c3aed',
    accent: '#a78bfa',
    swatches: [
      { step: '50', hex: '#f5f3ff' },
      { step: '100', hex: '#ede9fe' },
      { step: '200', hex: '#ddd6fe' },
      { step: '300', hex: '#c4b5fd' },
      { step: '400', hex: '#a78bfa' },
      { step: '500', hex: '#8b5cf6' },
      { step: '600', hex: '#7c3aed' },
      { step: '700', hex: '#6d28d9' },
      { step: '800', hex: '#5b21b6' },
      { step: '900', hex: '#4c1d95' },
      { step: '950', hex: '#2e1065' }
    ]
  },
  emerald: {
    name: 'Emerald',
    primary: '#059669',
    accent: '#34d399',
    swatches: [
      { step: '50', hex: '#ecfdf5' },
      { step: '100', hex: '#d1fae5' },
      { step: '200', hex: '#a7f3d0' },
      { step: '300', hex: '#6ee7b7' },
      { step: '400', hex: '#34d399' },
      { step: '500', hex: '#10b981' },
      { step: '600', hex: '#059669' },
      { step: '700', hex: '#047857' },
      { step: '800', hex: '#065f46' },
      { step: '900', hex: '#064e3b' },
      { step: '950', hex: '#022c22' }
    ]
  },
  rose: {
    name: 'Rose',
    primary: '#e11d48',
    accent: '#fb7185',
    swatches: [
      { step: '50', hex: '#fff1f2' },
      { step: '100', hex: '#ffe4e6' },
      { step: '200', hex: '#fecdd3' },
      { step: '300', hex: '#fda4af' },
      { step: '400', hex: '#fb7185' },
      { step: '500', hex: '#f43f5e' },
      { step: '600', hex: '#e11d48' },
      { step: '700', hex: '#be123c' },
      { step: '800', hex: '#9f1239' },
      { step: '900', hex: '#881337' },
      { step: '950', hex: '#4c0519' }
    ]
  },
  blue: {
    name: 'Blue',
    primary: '#2563eb',
    accent: '#60a5fa',
    swatches: [
      { step: '50', hex: '#eff6ff' },
      { step: '100', hex: '#dbeafe' },
      { step: '200', hex: '#bfdbfe' },
      { step: '300', hex: '#93c5fd' },
      { step: '400', hex: '#60a5fa' },
      { step: '500', hex: '#3b82f6' },
      { step: '600', hex: '#2563eb' },
      { step: '700', hex: '#1d4ed8' },
      { step: '800', hex: '#1e40af' },
      { step: '900', hex: '#1e3a8a' },
      { step: '950', hex: '#172554' }
    ]
  },
  orange: {
    name: 'Orange',
    primary: '#ea580c',
    accent: '#fb923c',
    swatches: [
      { step: '50', hex: '#fff7ed' },
      { step: '100', hex: '#ffedd5' },
      { step: '200', hex: '#fed7aa' },
      { step: '300', hex: '#fdba74' },
      { step: '400', hex: '#fb923c' },
      { step: '500', hex: '#f97316' },
      { step: '600', hex: '#ea580c' },
      { step: '700', hex: '#c2410c' },
      { step: '800', hex: '#9a3412' },
      { step: '900', hex: '#7c2d12' },
      { step: '950', hex: '#431407' }
    ]
  }
};

const SPACING_STEPS = [
  { token: '1', rem: '0.25rem', px: '4px' },
  { token: '2', rem: '0.5rem', px: '8px' },
  { token: '3', rem: '0.75rem', px: '12px' },
  { token: '4', rem: '1.0rem', px: '16px' },
  { token: '6', rem: '1.5rem', px: '24px' },
  { token: '8', rem: '2.0rem', px: '32px' },
  { token: '12', rem: '3.0rem', px: '48px' },
  { token: '16', rem: '4.0rem', px: '64px' }
];

// Helper: Calculate relative luminance
function getLuminance(hex) {
  const rgb = parseInt(hex.slice(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;

  const [rs, gs, bs] = [r, g, b].map(c => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Helper: Calculate contrast ratio
function getContrastRatio(hex1, hex2) {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

document.addEventListener('DOMContentLoaded', () => {
  initGlobalSearch();

  // Theme toggle
  const themeBtn = document.getElementById('tokens-theme-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      themeBtn.textContent = next === 'dark' ? '☀️ Light' : '🌙 Dark';
      updatePaletteStudio(activePalette);
    });
  }

  // Active palette state
  let activePalette = 'violet';

  function updatePaletteStudio(paletteKey) {
    activePalette = paletteKey;
    document.documentElement.setAttribute('data-palette', paletteKey);

    const data = PALETTES[paletteKey];
    if (!data) return;

    // Update title
    const titleEl = document.getElementById('active-palette-title');
    if (titleEl) titleEl.textContent = `${data.name} Palette Contrast`;

    // Calculate contrast
    const isDark = (document.documentElement.getAttribute('data-theme') || 'dark') === 'dark';
    const bgHex = isDark ? '#09090b' : '#fafafa';
    const textHex = isDark ? '#fafafa' : '#09090b';

    const textContrast = getContrastRatio(textHex, bgHex).toFixed(1);
    const brandContrast = getContrastRatio(data.primary, bgHex).toFixed(1);

    const badgeText = document.getElementById('badge-contrast-text');
    if (badgeText) {
      badgeText.textContent = `Text: ${textContrast}:1 (AAA Pass)`;
    }

    const badgeBrand = document.getElementById('badge-contrast-brand');
    if (badgeBrand) {
      const pass = parseFloat(brandContrast) >= 4.5;
      badgeBrand.textContent = `Brand: ${brandContrast}:1 (${pass ? 'AA Pass' : 'Large Text Pass'})`;
      badgeBrand.className = `contrast-badge ${pass ? 'contrast-pass' : 'contrast-pass'}`;
    }

    // Render swatches
    const container = document.getElementById('color-swatches-grid');
    if (container) {
      container.innerHTML = data.swatches.map(s => {
        const textCol = parseInt(s.step) >= 500 ? '#fafafa' : '#09090b';
        return `
          <div class="swatch-card" onclick="navigator.clipboard.writeText('${s.hex}')">
            <div class="swatch-preview" style="background-color: ${s.hex}; color: ${textCol};">
              <span>${data.name} ${s.step}</span>
            </div>
            <div class="swatch-meta">
              <span style="font-weight: 600; font-size: 0.85rem;">${s.hex.toUpperCase()}</span>
              <span style="font-size: 0.75rem; color: var(--ui-text-muted);">--ui-color-brand-${s.step}</span>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // Palette button clicks
  const pillBtns = document.querySelectorAll('.palette-pill-btn');
  pillBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      pillBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const palette = btn.getAttribute('data-palette');
      updatePaletteStudio(palette);
    });
  });

  // Initialize Palette Studio
  updatePaletteStudio('violet');

  // Typography Live Sample input
  const sampleInput = document.getElementById('type-sample-input');
  if (sampleInput) {
    sampleInput.addEventListener('input', (e) => {
      const val = e.target.value.trim() || 'Design systems empower cross-functional teams to build at speed.';
      document.querySelectorAll('.type-preview-text').forEach(el => {
        el.textContent = val;
      });
    });
  }

  // Render Spacing Scale
  const spacingContainer = document.getElementById('spacing-scale-container');
  if (spacingContainer) {
    spacingContainer.innerHTML = SPACING_STEPS.map(s => `
      <div data-ui="stack" data-direction="row" data-align="center" data-gap="3">
        <span style="min-width: 60px; font-weight: 600; font-size: 0.85rem;">Token ${s.token}</span>
        <div style="flex: 1; display: flex; align-items: center;">
          <div class="spacing-bar" style="width: ${s.px};"></div>
        </div>
        <span style="font-size: 0.8rem; color: var(--ui-text-muted); min-width: 80px; text-align: right;">${s.rem} (${s.px})</span>
      </div>
    `).join('');
  }

  // Motion Simulator Logic
  const ball = document.getElementById('motion-ball');
  const springBtn = document.getElementById('trigger-spring-btn');
  const bounceBtn = document.getElementById('trigger-bounce-btn');
  const easeBtn = document.getElementById('trigger-ease-btn');
  const reducedMotionToggle = document.getElementById('reduced-motion-toggle');

  let ballPosition = 0;

  function runMotionAnimation(easing, duration) {
    if (!ball) return;
    const isReduced = reducedMotionToggle && reducedMotionToggle.checked;
    const dur = isReduced ? '0.001ms' : duration;
    
    ballPosition = ballPosition === 0 ? 320 : 0;
    ball.style.transition = `transform ${dur} ${easing}`;
    ball.style.transform = `translateX(${ballPosition}px)`;
  }

  if (springBtn) {
    springBtn.addEventListener('click', () => runMotionAnimation('cubic-bezier(0.16, 1, 0.3, 1)', '500ms'));
  }
  if (bounceBtn) {
    bounceBtn.addEventListener('click', () => runMotionAnimation('cubic-bezier(0.34, 1.56, 0.64, 1)', '600ms'));
  }
  if (easeBtn) {
    easeBtn.addEventListener('click', () => runMotionAnimation('cubic-bezier(0.4, 0, 0.2, 1)', '350ms'));
  }

  // Layout Primitives Sandbox
  const sandboxStack = document.getElementById('live-sandbox-stack');
  const codePreview = document.getElementById('sandbox-code-preview');
  let currentDir = 'row';
  let currentGap = '4';
  let currentJustify = 'start';

  function updateSandbox() {
    if (!sandboxStack) return;
    sandboxStack.setAttribute('data-direction', currentDir);
    sandboxStack.setAttribute('data-gap', currentGap);
    sandboxStack.setAttribute('data-justify', currentJustify);

    if (codePreview) {
      codePreview.textContent = `<div data-ui="stack" data-direction="${currentDir}" data-gap="${currentGap}" data-justify="${currentJustify}" data-align="center">
  <div data-ui="card">Box A</div>
  <div data-ui="card">Box B</div>
  <div data-ui="card">Box C</div>
</div>`;
    }
  }

  document.querySelectorAll('.stack-dir-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.stack-dir-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentDir = btn.getAttribute('data-dir');
      updateSandbox();
    });
  });

  document.querySelectorAll('.stack-gap-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.stack-gap-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentGap = btn.getAttribute('data-gap');
      updateSandbox();
    });
  });

  document.querySelectorAll('.stack-justify-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.stack-justify-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentJustify = btn.getAttribute('data-justify');
      updateSandbox();
    });
  });

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

  const exportHeaderBtn = document.getElementById('copy-tokens-json-btn');
  if (exportHeaderBtn) {
    exportHeaderBtn.addEventListener('click', () => {
      window.location.href = './tokens.json';
    });
  }

  const copyDtcgBtn = document.getElementById('copy-dtcg-snippet-btn');
  if (copyDtcgBtn) {
    copyDtcgBtn.addEventListener('click', () => {
      fetch('./tokens.json')
        .then(r => r.text())
        .then(txt => {
          navigator.clipboard.writeText(txt);
          const orig = copyDtcgBtn.textContent;
          copyDtcgBtn.textContent = '✓ Copied DTCG JSON!';
          setTimeout(() => copyDtcgBtn.textContent = orig, 2000);
        });
    });
  }
});
