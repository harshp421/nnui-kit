/**
 * Sub-1KB Anchor Positioning Engine & Universal Fallback
 * 
 * Provides rock-solid, cross-browser floating element positioning.
 * Works seamlessly with Native Popover API, top-layer elements, and Light-DOM containers.
 * 
 * Performance Enhancements (Track 2):
 * - IntersectionObserver: Automatically detects when anchor scrolls offscreen to pause calculations.
 * - RequestAnimationFrame Throttling: Prevents layout thrashing during fast scroll/resize cycles.
 * - ResizeObserver: Detects dynamic changes to anchor/target dimensions.
 * - Edge Collision Auto-Flip: Intelligently flips bottom <-> top and right <-> left when overflowing viewport.
 */

export const isAnchorPositioningSupported = (() => {
  if (typeof window === 'undefined' || typeof CSS === 'undefined' || !CSS.supports) {
    return false;
  }
  return (
    (CSS.supports('anchor-name', '--test') && (CSS.supports('position-area', 'bottom span-right') || CSS.supports('inset-area', 'bottom span-right')))
  );
})();

/**
 * Positions a target element relative to an anchor element with viewport-boundary awareness.
 * @param {HTMLElement} anchor 
 * @param {HTMLElement} target 
 * @param {string|object} placement 'bottom' | 'bottom-start' | 'bottom-end' | 'top' | 'left' | 'right' or { placement, offset }
 * @param {number} offset Gap in px (default 6)
 */
export function applyPositionFallback(anchor, target, placement = 'bottom', offset = 6) {
  if (!anchor || !target) return;

  if (typeof placement === 'object' && placement !== null) {
    offset = placement.offset ?? offset;
    placement = placement.placement || 'bottom';
  }

  // Normalize placement strings like 'bottom-start', 'bottom-end', etc.
  let align = 'start';
  let side = 'bottom';
  if (typeof placement === 'string') {
    if (placement.includes('-')) {
      const parts = placement.split('-');
      side = parts[0];
      align = parts[1] || 'start';
    } else {
      side = placement;
      align = 'start';
    }
  }

  const anchorRect = anchor.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const viewportW = window.innerWidth || (document.documentElement ? document.documentElement.clientWidth : 1200);
  const viewportH = window.innerHeight || (document.documentElement ? document.documentElement.clientHeight : 800);

  // If anchor has zero dimensions (unrendered or detached), attempt parent or skip
  if (anchorRect.width === 0 && anchorRect.height === 0 && anchorRect.top === 0 && anchorRect.left === 0) {
    if (anchor.parentElement && anchor.parentElement.getBoundingClientRect().width > 0) {
      return applyPositionFallback(anchor.parentElement, target, placement, offset);
    }
    return;
  }

  // Options support (such as matchAnchorWidth or explicit width)
  const matchAnchorWidth = (typeof placement === 'object' && placement !== null && placement.matchAnchorWidth) || false;

  // Determine intrinsic target width without forcing it inline unless requested
  let width = target.offsetWidth || targetRect.width;
  if (!width || width <= 0) {
    const firstChild = target.firstElementChild;
    if (firstChild) {
      width = firstChild.offsetWidth || firstChild.getBoundingClientRect().width;
      if (!width || width <= 0) {
        const inlineW = parseFloat(firstChild.style.width || target.style.width);
        if (inlineW > 0) width = inlineW;
      }
    }
  }
  if (width >= viewportW - 20) {
    const firstChild = target.firstElementChild;
    const childW = firstChild ? (firstChild.offsetWidth || firstChild.getBoundingClientRect().width) : 0;
    width = (childW > 0 && childW < viewportW - 20) ? childW : (viewportW - 32);
  }
  if (!width || width <= 0) width = 280;

  if (matchAnchorWidth && anchorRect.width > 0) {
    width = anchorRect.width;
  }

  let height = target.offsetHeight || targetRect.height;
  if (!height || height <= 0) {
    const firstChild = target.firstElementChild;
    if (firstChild) {
      height = firstChild.offsetHeight || firstChild.getBoundingClientRect().height;
      if (!height || height <= 0) {
        const inlineH = parseFloat(firstChild.style.height || target.style.height);
        if (inlineH > 0) height = inlineH;
      }
    }
  }
  if (!height || height <= 0) height = 320;

  let top = 0;
  let left = 0;

  if (side === 'bottom') {
    top = anchorRect.bottom + offset;
    left = align === 'end' ? (anchorRect.right - width) : anchorRect.left;

    // Flip to top ONLY if overflowing bottom AND space above is greater AND it actually fits above
    const spaceBelow = viewportH - (anchorRect.bottom + offset);
    const spaceAbove = anchorRect.top - offset;
    if (top + height > viewportH && spaceAbove > spaceBelow && spaceAbove >= height) {
      top = anchorRect.top - height - offset;
    }
  } else if (side === 'top') {
    top = anchorRect.top - height - offset;
    left = align === 'end' ? (anchorRect.right - width) : anchorRect.left;

    // Flip to bottom if overflowing top and space below exists
    if (top < 0 && anchorRect.bottom + height + offset <= viewportH) {
      top = anchorRect.bottom + offset;
    }
  } else if (side === 'right') {
    top = anchorRect.top;
    left = anchorRect.right + offset;

    if (left + width > viewportW && anchorRect.left - width - offset > 0) {
      left = anchorRect.left - width - offset;
    }
  } else if (side === 'left') {
    top = anchorRect.top;
    left = anchorRect.left - width - offset;

    if (left < 0 && anchorRect.right + width + offset <= viewportW) {
      left = anchorRect.right + offset;
    }
  }

  // Prevent horizontal viewport clipping
  if (left + width > viewportW - 8) {
    left = Math.max(8, viewportW - width - 8);
  }
  if (left < 8) left = 8;

  // Prevent vertical viewport clipping
  if (top + height > viewportH - 8) {
    top = Math.max(8, viewportH - height - 8);
  }
  if (top < 8) top = 8;

  const topPx = `${Math.round(top)}px`;
  const leftPx = `${Math.round(left)}px`;

  // Apply fixed positioning relative to viewport
  if (typeof target.style.setProperty === 'function') {
    target.style.setProperty('position', 'fixed', 'important');
    target.style.setProperty('top', topPx, 'important');
    target.style.setProperty('left', leftPx, 'important');
    target.style.setProperty('right', 'auto', 'important');
    target.style.setProperty('bottom', 'auto', 'important');
    target.style.setProperty('margin', '0', 'important');
    if (matchAnchorWidth) {
      target.style.setProperty('width', `${Math.round(anchorRect.width)}px`, 'important');
    }
    target.style.setProperty('max-width', 'calc(100vw - 16px)', 'important');
  }

  // Also assign direct properties as fallback for mock DOM environments
  target.style.position = 'fixed';
  target.style.top = topPx;
  target.style.left = leftPx;
  target.style.right = 'auto';
  target.style.bottom = 'auto';
  target.style.margin = '0';
  if (matchAnchorWidth) {
    target.style.width = `${Math.round(anchorRect.width)}px`;
  }
  target.style.maxWidth = 'calc(100vw - 16px)';
}

/**
 * Attaches passive scroll and resize listeners, IntersectionObserver, and ResizeObserver
 * to maintain high-performance position fallback with 60fps RAF throttling.
 * 
 * @param {HTMLElement} anchor
 * @param {HTMLElement} target
 * @param {object} options { placement?: string, offset?: number, autoHideOnDisconnect?: boolean }
 * @returns {Function} cleanup
 */
export function attachAnchorFallback(anchor, target, options = {}) {
  let isAnchorVisible = true;
  let rafId = null;

  const scheduleUpdate = () => {
    if (!isAnchorVisible) return;
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      rafId = null;
      applyPositionFallback(anchor, target, options.placement || 'bottom', options.offset || 6);
    });
  };

  // Immediate initial calculation
  applyPositionFallback(anchor, target, options.placement || 'bottom', options.offset || 6);

  // 1. IntersectionObserver: Pause calculations and optionally hide target when anchor leaves viewport
  let intersectionObserver = null;
  if (typeof IntersectionObserver !== 'undefined' && anchor instanceof HTMLElement) {
    intersectionObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === anchor) {
          isAnchorVisible = entry.isIntersecting;
          if (!isAnchorVisible) {
            if (options.autoHideOnDisconnect !== false && target.style) {
              target.style.visibility = 'hidden';
            }
          } else {
            if (target.style && target.style.visibility === 'hidden') {
              target.style.visibility = '';
            }
            scheduleUpdate();
          }
        }
      }
    }, { threshold: [0, 0.1, 1.0] });

    try {
      intersectionObserver.observe(anchor);
    } catch {
      // Ignore if disconnected or unsupported node
    }
  }

  // 2. ResizeObserver: Recalculate on anchor or target size changes
  let resizeObserver = null;
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => {
      scheduleUpdate();
    });
    try {
      if (anchor instanceof HTMLElement) resizeObserver.observe(anchor);
      if (target instanceof HTMLElement) resizeObserver.observe(target);
    } catch {
      // Ignore if disconnected
    }
  }

  // 3. Passive event listeners with capture for scroll & resize
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', scheduleUpdate, { passive: true, capture: true });
    window.addEventListener('resize', scheduleUpdate, { passive: true });
  }

  return () => {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    if (intersectionObserver) {
      intersectionObserver.disconnect();
      intersectionObserver = null;
    }
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', scheduleUpdate, { capture: true });
      window.removeEventListener('resize', scheduleUpdate);
    }
    if (target && target.style && target.style.visibility === 'hidden') {
      target.style.visibility = '';
    }
  };
}
