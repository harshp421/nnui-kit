/**
 * In-Browser Component HUD Inspector & AI Introspection Overlay
 * Hold Option/Alt + Click on ANY component (or press Ctrl+Shift+U) to inspect live!
 */

let isInitialized = false;
let currentInspectedElement = null;

export function openInspectorFor(element) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (!isInitialized) {
    initHudInspector();
  }

  if (typeof element === 'string') {
    element = document.querySelector(element);
  }

  if (!element) {
    element = document.querySelector('ui-data-grid, ui-date-range-picker, ui-stepper, ui-ai-prompt-box, [data-ui]') || document.querySelector('.preview-stage > *') || document.body;
  }

  currentInspectedElement = element;
  const tagName = element.tagName ? element.tagName.toLowerCase() : 'element';

  const modalRoot = document.getElementById('nnui-hud-modal-root');
  const title = document.getElementById('nnui-hud-tag-title');
  const jsonPre = document.getElementById('nnui-hud-json');

  if (title) title.textContent = `<${tagName}>`;

  let inspectionData = null;
  try {
    if (typeof element.inspectAI === 'function') {
      inspectionData = element.inspectAI();
    } else {
      const liveAttrs = {};
      if (element.attributes) {
        for (const attr of element.attributes) {
          liveAttrs[attr.name] = attr.value;
        }
      }
      inspectionData = {
        protocol: 'nnui.ai.v1',
        tag: tagName,
        isLightDom: true,
        schema: {
          attributes: liveAttrs,
          hasPersistence: element.hasAttribute ? element.hasAttribute('persist') : false,
          isCrossTabSynced: element.hasAttribute ? element.hasAttribute('sync') : false
        },
        frameworkSnippets: {
          html: `<${tagName}${Object.entries(liveAttrs).map(([k, v]) => ` ${k}="${v}"`).join('')}></${tagName}>`,
          react19: `<${tagName}${Object.entries(liveAttrs).map(([k, v]) => ` ${k}="${v}"`).join('')} />`,
          vue: `<${tagName}${Object.entries(liveAttrs).map(([k, v]) => ` ${k}="${v}"`).join('')} />`
        }
      };
    }
  } catch (err) {
    inspectionData = { error: String(err), tag: tagName };
  }

  if (jsonPre) {
    // If thenable, extract payload
    const payload = (inspectionData && typeof inspectionData.then === 'function')
      ? { ...inspectionData }
      : inspectionData;
    // Clean internal then/catch for JSON presentation
    const clean = { ...payload };
    delete clean.then;
    delete clean.catch;
    jsonPre.textContent = JSON.stringify(clean, null, 2);
  }

  if (modalRoot) {
    modalRoot.style.display = 'flex';
  }
}

// Ensure global accessibility for inline buttons and console
if (typeof window !== 'undefined') {
  window.nnuiInspect = openInspectorFor;
  window.openInspectorFor = openInspectorFor;
}

export function initHudInspector() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (document.getElementById('nnui-hud-inspector-root')) {
    isInitialized = true;
    return;
  }

  isInitialized = true;

  // 1. Inject Styles for Alt Inspection Hover Mode
  const styleEl = document.createElement('style');
  styleEl.id = 'nnui-hud-styles';
  styleEl.textContent = `
    .nnui-alt-active [data-ui],
    .nnui-alt-active [class*="ui-"],
    .nnui-alt-active ui-data-grid,
    .nnui-alt-active ui-date-range-picker,
    .nnui-alt-active ui-stepper,
    .nnui-alt-active ui-ai-prompt-box,
    .nnui-alt-active .preview-stage > * {
      outline: 2px dashed #818cf8 !important;
      outline-offset: 2px !important;
      cursor: crosshair !important;
    }
  `;
  document.head.appendChild(styleEl);

  // 2. Create Floating HUD Trigger Button
  const hudContainer = document.createElement('div');
  hudContainer.id = 'nnui-hud-inspector-root';
  hudContainer.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 99998;
    font-family: var(--ui-font-sans, system-ui, sans-serif);
    font-size: 13px;
  `;

  hudContainer.innerHTML = `
    <button id="nnui-hud-trigger-btn" type="button" title="Inspect UI Components (Alt+Click on any component or click here)" style="
      background: rgba(24, 24, 27, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 9999px;
      color: #fafafa;
      padding: 6px 14px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 7px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(12px);
      transition: all 0.2s ease;
    ">
      <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #6366f1; box-shadow: 0 0 8px #6366f1;"></span>
      <span>HUD Inspector</span>
      <kbd style="font-family: inherit; font-size: 10px; background: rgba(255,255,255,0.12); padding: 1px 5px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.1);">Alt+Click</kbd>
    </button>
  `;
  document.body.appendChild(hudContainer);

  // 3. Create Fullscreen Centered Modal Overlay
  const modalRoot = document.createElement('div');
  modalRoot.id = 'nnui-hud-modal-root';
  modalRoot.style.cssText = `
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    z-index: 100000;
    display: none;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    padding: 16px;
    box-sizing: border-box;
  `;

  modalRoot.innerHTML = `
    <div id="nnui-hud-card" style="
      width: 620px;
      max-width: 100%;
      max-height: 88vh;
      overflow-y: auto;
      background: #18181b;
      border: 1px solid #27272a;
      border-radius: 14px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.1);
      color: #fafafa;
      padding: 22px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      box-sizing: border-box;
      font-family: var(--ui-font-sans, system-ui, sans-serif);
    ">
      <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #27272a; padding-bottom: 14px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="background: linear-gradient(135deg, #6366f1, #38bdf8); color: white; padding: 2px 7px; border-radius: 5px; font-size: 11px; font-weight: 700; letter-spacing: 0.05em;">AI HUD</span>
          <h3 id="nnui-hud-tag-title" style="margin: 0; font-size: 16px; font-weight: 700; font-family: monospace; color: #fafafa;">&lt;ui-component&gt;</h3>
        </div>
        <button id="nnui-hud-close-btn" type="button" style="background: transparent; border: none; color: #a1a1aa; font-size: 20px; cursor: pointer; padding: 2px 6px; line-height: 1;">✕</button>
      </div>

      <div style="display: flex; flex-direction: column; gap: 14px;">
        <!-- Live Protocol & State -->
        <div style="background: #09090b; border: 1px solid #27272a; border-radius: 8px; padding: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 11px; text-transform: uppercase; color: #a1a1aa; font-weight: 700; letter-spacing: 0.05em;">Live AI Introspection Snapshot</span>
            <span style="font-size: 11px; color: #10b981; font-family: monospace;">● Protocol nnui.ai.v1</span>
          </div>
          <pre id="nnui-hud-json" style="margin: 0; font-family: var(--ui-font-mono, monospace); font-size: 11.5px; color: #38bdf8; overflow-x: auto; white-space: pre-wrap; line-height: 1.5; max-height: 280px;"></pre>
        </div>

        <!-- Persistence & Sync Attributes Notification -->
        <div style="display: flex; gap: 10px; align-items: center; background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.25); border-radius: 8px; padding: 10px 14px;">
          <span style="font-size: 18px;">⚡</span>
          <div style="font-size: 12px; line-height: 1.45; color: #e4e4e7;">
            <strong>Declarative Persistence &amp; Sync:</strong> Add <code style="color: #a5b4fc; background: rgba(0,0,0,0.4); padding: 2px 5px; border-radius: 4px;">persist="url"</code> for query string sync or <code style="color: #a5b4fc; background: rgba(0,0,0,0.4); padding: 2px 5px; border-radius: 4px;">sync="cross-tab"</code> for instantaneous multi-tab BroadcastChannel sync.
          </div>
        </div>

        <!-- Action Copy Buttons -->
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button id="nnui-hud-copy-react" type="button" style="flex: 1; min-width: 120px; background: #27272a; border: 1px solid #3f3f46; color: #fafafa; border-radius: 6px; padding: 8px 12px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s ease;">📋 Copy React 19</button>
          <button id="nnui-hud-copy-vue" type="button" style="flex: 1; min-width: 120px; background: #27272a; border: 1px solid #3f3f46; color: #fafafa; border-radius: 6px; padding: 8px 12px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s ease;">📋 Copy Vue 3</button>
          <button id="nnui-hud-copy-ai" type="button" style="flex: 1; min-width: 140px; background: #4f46e5; border: 1px solid #6366f1; color: #ffffff; border-radius: 6px; padding: 8px 12px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s ease;">🤖 Copy for LLM/AI</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modalRoot);

  function closeInspector() {
    modalRoot.style.display = 'none';
  }

  // Close handlers
  document.getElementById('nnui-hud-close-btn')?.addEventListener('click', closeInspector);
  modalRoot.addEventListener('click', (e) => {
    if (e.target === modalRoot) {
      closeInspector();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalRoot.style.display === 'flex') {
      closeInspector();
    }
    // Ctrl+Shift+U or Cmd+Shift+U
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'U' || e.key === 'u')) {
      e.preventDefault();
      openInspectorFor();
    }
    // Alt hover highlight mode
    if (e.key === 'Alt') {
      document.body.classList.add('nnui-alt-active');
    }
  });

  window.addEventListener('keyup', (e) => {
    if (e.key === 'Alt') {
      document.body.classList.remove('nnui-alt-active');
    }
  });

  // 4. Alt/Option + Click on ANY Component
  document.addEventListener('click', (e) => {
    if (e.altKey) {
      let el = e.target;
      let targetComponent = null;

      while (el && el !== document.body && el !== document.documentElement) {
        if (
          typeof el.inspectAI === 'function' ||
          el.tagName.includes('-') ||
          el.hasAttribute('data-ui') ||
          el.classList.contains('preview-card')
        ) {
          targetComponent = el;
          break;
        }
        el = el.parentElement;
      }

      if (!targetComponent) {
        const preview = e.target.closest('.preview-stage');
        if (preview) {
          targetComponent = preview.querySelector('[data-ui], [class*="ui-"]') || preview.firstElementChild;
        }
      }

      if (targetComponent) {
        e.preventDefault();
        e.stopPropagation();
        openInspectorFor(targetComponent);
      }
    }
  }, true);

  // 5. Trigger Button Click
  const triggerBtn = document.getElementById('nnui-hud-trigger-btn');
  triggerBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    openInspectorFor();
  });

  // 6. Copy button handlers
  document.getElementById('nnui-hud-copy-react')?.addEventListener('click', () => {
    if (currentInspectedElement) {
      const data = typeof currentInspectedElement.inspectAI === 'function' ? currentInspectedElement.inspectAI() : null;
      const snippet = data?.frameworkSnippets?.react19 || `<${currentInspectedElement.tagName.toLowerCase()} />`;
      navigator.clipboard.writeText(snippet);
      showCopiedFeedback(document.getElementById('nnui-hud-copy-react'), '✓ React Copied!');
    }
  });

  document.getElementById('nnui-hud-copy-vue')?.addEventListener('click', () => {
    if (currentInspectedElement) {
      const data = typeof currentInspectedElement.inspectAI === 'function' ? currentInspectedElement.inspectAI() : null;
      const snippet = data?.frameworkSnippets?.vue || `<${currentInspectedElement.tagName.toLowerCase()} />`;
      navigator.clipboard.writeText(snippet);
      showCopiedFeedback(document.getElementById('nnui-hud-copy-vue'), '✓ Vue Copied!');
    }
  });

  document.getElementById('nnui-hud-copy-ai')?.addEventListener('click', () => {
    if (currentInspectedElement) {
      const data = typeof currentInspectedElement.inspectAI === 'function' ? currentInspectedElement.inspectAI() : null;
      const aiPrompt = `Use NNUI-KIT <${currentInspectedElement.tagName.toLowerCase()}>:\n\`\`\`html\n${data?.frameworkSnippets?.html || `<${currentInspectedElement.tagName.toLowerCase()}></${currentInspectedElement.tagName.toLowerCase()}>`}\n\`\`\`\nSchema attributes: ${JSON.stringify(data?.schema?.observedAttributes || [])}`;
      navigator.clipboard.writeText(aiPrompt);
      showCopiedFeedback(document.getElementById('nnui-hud-copy-ai'), '✓ AI Prompt Copied!');
    }
  });

  function showCopiedFeedback(btn, text) {
    if (!btn) return;
    const orig = btn.textContent;
    btn.textContent = text;
    setTimeout(() => { btn.textContent = orig; }, 2000);
  }
}

// Auto-run when module is loaded in browser
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initHudInspector());
  } else {
    initHudInspector();
  }
}
