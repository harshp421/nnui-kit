/**
 * Sub-1KB Anchor Positioning Engine & Universal Fallback
 * 
 * Provides rock-solid, cross-browser floating element positioning.
 * Works seamlessly with Native Popover API, top-layer elements, and Light-DOM containers.
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

  // Determine intrinsic target width without letting unconstrained top-layer popovers stretch to 100vw
  let width = target.offsetWidth || targetRect.width || 280;
  if (width >= viewportW - 20) {
    const firstChild = target.firstElementChild;
    const childW = firstChild ? (firstChild.offsetWidth || firstChild.getBoundingClientRect().width) : 0;
    width = (childW > 0 && childW < viewportW - 20) ? childW : 280;
  }
  if (!width || width <= 0) width = 280;

  let height = target.offsetHeight || targetRect.height || 320;
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
  const widthPx = `${Math.round(width)}px`;

  // Apply fixed positioning relative to viewport
  if (typeof target.style.setProperty === 'function') {
    target.style.setProperty('position', 'fixed', 'important');
    target.style.setProperty('top', topPx, 'important');
    target.style.setProperty('left', leftPx, 'important');
    target.style.setProperty('right', 'auto', 'important');
    target.style.setProperty('bottom', 'auto', 'important');
    target.style.setProperty('margin', '0', 'important');
    target.style.setProperty('width', widthPx, 'important');
    target.style.setProperty('max-width', 'calc(100vw - 16px)', 'important');
  }

  // Also assign direct properties as fallback for mock DOM environments
  target.style.position = 'fixed';
  target.style.top = topPx;
  target.style.left = leftPx;
  target.style.right = 'auto';
  target.style.bottom = 'auto';
  target.style.margin = '0';
  target.style.width = widthPx;
  target.style.maxWidth = 'calc(100vw - 16px)';
}
