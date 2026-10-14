/**
 * Declarative State Persistence & Cross-Tab Synchronization Engine
 * Zero-dependency Platform-Native utility for Light-DOM Custom Elements.
 *
 * Supports:
 * - URL Query Parameter Synchronization (Shareable links out-of-the-box)
 * - Session Storage Persistence (Survives page refresh within tab)
 * - Local Storage Persistence (Survives browser restart)
 * - Cross-Tab Synchronization via BroadcastChannel API
 */

export function attachPersistence(element, options = {}) {
  if (typeof window === 'undefined') return () => {};

  const mode = element.getAttribute('persist') || options.defaultMode || null;
  const sync = element.hasAttribute('sync') || options.sync || false;

  if (!mode && !sync) return () => {};

  let id = element.getAttribute('data-persist-id') || 
           element.getAttribute('persist-id') || 
           element.getAttribute('data-persist-key') ||
           options.id;

  if (!id) {
    const rawId = element.id || element.getAttribute('name') || element.tagName.toLowerCase();
    id = rawId.replace(/^demo-/, '').replace(/-data-grid$/, 'grid').replace(/data-grid/, 'grid').replace(/^ui-/, '').replace(/^nnui-/, '');
  }

  const { getState, setState, keys = [] } = options;

  if (typeof getState !== 'function' || typeof setState !== 'function') {
    return () => {};
  }

  let broadcastChannel = null;
  let isApplyingRemote = false;

  // Initialize BroadcastChannel if sync requested
  if (sync && typeof BroadcastChannel !== 'undefined') {
    try {
      broadcastChannel = new BroadcastChannel(`nnui_sync_${id}`);
      broadcastChannel.onmessage = (event) => {
        if (!event.data || event.data.source === id + '_' + tabSessionId) return;
        if (event.data.state) {
          isApplyingRemote = true;
          try {
            setState(event.data.state, { remote: true });
          } finally {
            isApplyingRemote = false;
          }
        }
      };
    } catch (e) {
      console.warn('[Persistence] BroadcastChannel init error:', e);
    }
  }

  const tabSessionId = Math.random().toString(36).substring(2, 9);

  // 1. Initial State Restoration
  const savedState = loadState(mode, id, keys, element);
  if (savedState && Object.keys(savedState).length > 0) {
    isApplyingRemote = true;
    try {
      setState(savedState, { initial: true });
    } finally {
      isApplyingRemote = false;
    }
  }

  // 2. State Change Listener (Hook to call when component state changes)
  const saveCurrentState = () => {
    if (isApplyingRemote) return;
    const currentState = getState();
    if (!currentState) return;

    // Filter keys if specified
    const stateToSave = {};
    if (keys.length > 0) {
      for (const k of keys) {
        if (currentState[k] !== undefined) {
          stateToSave[k] = currentState[k];
        }
      }
    } else {
      Object.assign(stateToSave, currentState);
    }

    // Persist to storage / URL
    if (mode) {
      saveState(mode, id, stateToSave, element);
    }

    // Broadcast cross-tab
    if (broadcastChannel) {
      try {
        broadcastChannel.postMessage({
          source: id + '_' + tabSessionId,
          id,
          state: stateToSave,
          timestamp: Date.now()
        });
      } catch (e) {
        console.warn('[Persistence] Broadcast error:', e);
      }
    }
  };

  // Expose on element for manual trigger on state mutations
  element._persistState = saveCurrentState;

  // 3. Handle Browser Navigation (popstate for mode="url")
  const onPopState = () => {
    if (mode === 'url') {
      const urlState = loadFromUrl(id, keys, element);
      if (urlState && Object.keys(urlState).length > 0) {
        isApplyingRemote = true;
        try {
          setState(urlState, { popstate: true });
        } finally {
          isApplyingRemote = false;
        }
      }
    }
  };

  if (mode === 'url') {
    window.addEventListener('popstate', onPopState);
  }

  // 4. Teardown / Cleanup
  return () => {
    if (element._persistState === saveCurrentState) {
      delete element._persistState;
    }
    if (mode === 'url') {
      window.removeEventListener('popstate', onPopState);
    }
    if (broadcastChannel) {
      try {
        broadcastChannel.close();
      } catch (e) {}
      broadcastChannel = null;
    }
  };
}

// =========================================================================
// Storage Helpers
// =========================================================================

function loadState(mode, id, keys, element) {
  if (mode === 'url') {
    return loadFromUrl(id, keys, element);
  } else if (mode === 'session') {
    return loadFromStorage(window.sessionStorage, id);
  } else if (mode === 'local') {
    return loadFromStorage(window.localStorage, id);
  }
  return null;
}

function saveState(mode, id, state, element) {
  if (mode === 'url') {
    saveToUrl(id, state, element);
  } else if (mode === 'session') {
    saveToStorage(window.sessionStorage, id, state);
  } else if (mode === 'local') {
    saveToStorage(window.localStorage, id, state);
  }
}

function loadFromStorage(storage, id) {
  try {
    const raw = storage.getItem(`nnui_persist_${id}`);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function saveToStorage(storage, id, state) {
  try {
    storage.setItem(`nnui_persist_${id}`, JSON.stringify(state));
  } catch (e) {}
}

function loadFromUrl(id, keys, element) {
  try {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    const rawId = element?.id || '';

    // First check scoped params: id_key=value, rawId_key=value, alias_key=value
    for (const key of keys) {
      const keyVariants = [key];
      if (key === 'sortKey') {
        keyVariants.push('sort', 'sort_key');
      } else if (key === 'sortDir') {
        keyVariants.push('sort_dir', 'dir', 'order');
      } else if (key === 'search') {
        keyVariants.push('q', 'query');
      }

      const candidates = [];
      for (const v of keyVariants) {
        candidates.push(`${id}_${v}`);
        if (rawId && rawId !== id) candidates.push(`${rawId}_${v}`);
        candidates.push(`grid_${v}`);
        candidates.push(`demo-data-grid_${v}`);
        candidates.push(`data-grid_${v}`);
        candidates.push(v);
      }

      for (const candidate of candidates) {
        if (params.has(candidate)) {
          result[key] = parseParamValue(params.get(candidate));
          break;
        }
      }
    }

    // Check JSON bundle: ?id={...}
    if (params.has(id)) {
      try {
        const bundled = JSON.parse(params.get(id));
        return { ...result, ...bundled };
      } catch (e) {}
    } else if (rawId && params.has(rawId)) {
      try {
        const bundled = JSON.parse(params.get(rawId));
        return { ...result, ...bundled };
      } catch (e) {}
    }

    return Object.keys(result).length > 0 ? result : null;
  } catch (e) {
    return null;
  }
}

function saveToUrl(id, state, element) {
  try {
    const url = new URL(window.location.href);
    const params = url.searchParams;
    const rawId = element?.id || '';

    for (const [key, value] of Object.entries(state)) {
      const paramKey = `${id}_${key}`;
      const legacyKey = rawId && rawId !== id ? `${rawId}_${key}` : null;

      if (value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
        params.delete(paramKey);
        if (legacyKey) params.delete(legacyKey);
        params.delete(key);
      } else if (typeof value === 'object') {
        params.set(paramKey, JSON.stringify(value));
        if (legacyKey) params.delete(legacyKey);
      } else {
        params.set(paramKey, String(value));
        if (legacyKey) params.delete(legacyKey);
      }
    }

    const newUrl = url.pathname + (params.toString() ? '?' + params.toString() : '') + url.hash;
    if (newUrl !== window.location.pathname + window.location.search + window.location.hash) {
      window.history.replaceState(null, '', newUrl);
    }
  } catch (e) {}
}

function parseParamValue(raw) {
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  if (!isNaN(raw) && raw.trim() !== '') return Number(raw);
  if (raw.startsWith('{') || raw.startsWith('[')) {
    try {
      return JSON.parse(raw);
    } catch (e) {}
  }
  return raw;
}
