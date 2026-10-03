/**
 * Accessibility & APG Keyboard Navigation Utilities
 */

export const Keys = {
  ENTER: 'Enter',
  SPACE: ' ',
  SPACEBAR: 'Spacebar',
  ESCAPE: 'Escape',
  ARROW_DOWN: 'ArrowDown',
  ARROW_UP: 'ArrowUp',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
  TAB: 'Tab',
};

let idCounter = 0;
export function generateUniqueId(prefix = 'ui') {
  return `${prefix}-${++idCounter}-${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Implements WAI-ARIA APG roving tabindex pattern across an array of elements.
 * @param {HTMLElement[]} elements 
 * @param {number} activeIndex 
 * @param {boolean} focusActive 
 */
export function applyRovingTabindex(elements, activeIndex, focusActive = false) {
  elements.forEach((el, index) => {
    if (index === activeIndex) {
      el.setAttribute('tabindex', '0');
      if (focusActive) el.focus();
    } else {
      el.setAttribute('tabindex', '-1');
    }
  });
}

/**
 * Calculates next index for keyboard navigation with wrap-around support.
 */
export function getNextIndex(currentIndex, total, direction, loop = true) {
  if (total === 0) return -1;
  let next = currentIndex + direction;
  if (loop) {
    if (next < 0) next = total - 1;
    if (next >= total) next = 0;
  } else {
    next = Math.max(0, Math.min(total - 1, next));
  }
  return next;
}
