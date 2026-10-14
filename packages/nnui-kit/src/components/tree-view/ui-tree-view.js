import { BaseLightElement } from '../../utils/base-element.js';
import { Keys } from '../../utils/a11y.js';

/**
 * <ui-tree-view> Micro-Enhancer
 * Accessible hierarchical treeview & folder explorer in Light-DOM.
 * 
 * Features:
 * - WAI-ARIA APG Treeview pattern (role="tree", role="treeitem", role="group")
 * - 4-directional keyboard navigation (Up, Down, Left, Right, Home, End)
 * - Single or multi-selection support
 * - Dynamic expand/collapse states (aria-expanded="true|false")
 * - Dispatches 'select' and 'toggle' CustomEvents
 */
export class UiTreeView extends BaseLightElement {
  static get observedAttributes() {
    return ['selection-mode', 'disabled'];
  }

  get selectionMode() {
    return this.getAttribute('selection-mode') || 'single';
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }

  init() {
    this.setAttributeSafe('data-ui', 'tree-view');

    const tree = this.querySelector('[data-part="tree"], ul, ol') || this;
    this.setAttributeSafe(tree, 'role', 'tree');

    this._setupStructure();
    this._bindEvents();
  }

  _getItems() {
    return Array.from(this.querySelectorAll('[data-part="item"], [role="treeitem"]'));
  }

  _getVisibleItems() {
    return this._getItems().filter((item) => {
      let parent = item.parentElement?.closest('[data-part="item"], [role="treeitem"]');
      while (parent) {
        if (parent.getAttribute('aria-expanded') === 'false') {
          return false;
        }
        parent = parent.parentElement?.closest('[data-part="item"], [role="treeitem"]');
      }
      return true;
    });
  }

  _setupStructure() {
    const items = this._getItems();

    items.forEach((item, idx) => {
      item.setAttribute('role', 'treeitem');
      item.setAttribute('tabindex', idx === 0 ? '0' : '-1');

      const group = item.querySelector(':scope > [data-part="group"], :scope > ul, :scope > ol');
      if (group) {
        group.setAttribute('role', 'group');
        if (!item.hasAttribute('aria-expanded')) {
          item.setAttribute('aria-expanded', 'false');
        }
        item.setAttribute('data-state', item.getAttribute('aria-expanded') === 'true' ? 'expanded' : 'collapsed');
      }
    });
  }

  _bindEvents() {
    // Click toggle or selection
    this.listen(this, 'click', (e) => {
      if (this.disabled) return;
      const item = e.target.closest('[data-part="item"], [role="treeitem"]');
      if (!item) return;

      const toggle = e.target.closest('[data-part="toggle"]');
      const hasChildren = item.querySelector(':scope > [data-part="group"], :scope > ul, :scope > ol');

      if (toggle || (hasChildren && e.target === item)) {
        this.toggleItem(item);
      } else {
        this.selectItem(item);
      }
    });

    // Keyboard navigation
    this.listen(this, 'keydown', (e) => {
      if (this.disabled) return;
      const visibleItems = this._getVisibleItems();
      const currentItem = document.activeElement?.closest('[data-part="item"], [role="treeitem"]');
      if (!currentItem) return;

      const currentIdx = visibleItems.indexOf(currentItem);

      switch (e.key) {
        case Keys.ARROW_DOWN: {
          e.preventDefault();
          if (currentIdx < visibleItems.length - 1) {
            this._focusItem(visibleItems[currentIdx + 1]);
          }
          break;
        }
        case Keys.ARROW_UP: {
          e.preventDefault();
          if (currentIdx > 0) {
            this._focusItem(visibleItems[currentIdx - 1]);
          }
          break;
        }
        case Keys.ARROW_RIGHT: {
          e.preventDefault();
          const hasChildren = currentItem.querySelector(':scope > [data-part="group"], :scope > ul, :scope > ol');
          if (hasChildren) {
            if (currentItem.getAttribute('aria-expanded') === 'false') {
              this.expandItem(currentItem);
            } else {
              // Move to first child
              const firstChild = currentItem.querySelector(':scope > [data-part="group"] > [data-part="item"], :scope > ul > [role="treeitem"]');
              if (firstChild) this._focusItem(firstChild);
            }
          }
          break;
        }
        case Keys.ARROW_LEFT: {
          e.preventDefault();
          const hasChildren = currentItem.querySelector(':scope > [data-part="group"], :scope > ul, :scope > ol');
          if (hasChildren && currentItem.getAttribute('aria-expanded') === 'true') {
            this.collapseItem(currentItem);
          } else {
            // Move to parent
            const parentItem = currentItem.parentElement?.closest('[data-part="item"], [role="treeitem"]');
            if (parentItem) this._focusItem(parentItem);
          }
          break;
        }
        case Keys.HOME: {
          e.preventDefault();
          if (visibleItems.length > 0) this._focusItem(visibleItems[0]);
          break;
        }
        case Keys.END: {
          e.preventDefault();
          if (visibleItems.length > 0) this._focusItem(visibleItems[visibleItems.length - 1]);
          break;
        }
        case Keys.ENTER:
        case Keys.SPACE: {
          e.preventDefault();
          const hasChildren = currentItem.querySelector(':scope > [data-part="group"], :scope > ul, :scope > ol');
          if (hasChildren) {
            this.toggleItem(currentItem);
          } else {
            this.selectItem(currentItem);
          }
          break;
        }
      }
    });
  }

  _focusItem(item) {
    this._getItems().forEach(it => it.setAttribute('tabindex', '-1'));
    item.setAttribute('tabindex', '0');
    item.focus();
  }

  toggleItem(item) {
    const isExpanded = item.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      this.collapseItem(item);
    } else {
      this.expandItem(item);
    }
  }

  expandItem(item) {
    item.setAttribute('aria-expanded', 'true');
    item.setAttribute('data-state', 'expanded');
    const group = item.querySelector(':scope > [data-part="group"], :scope > ul, :scope > ol');
    if (group) group.style.display = 'block';
    this.dispatch('toggle', { item, expanded: true });
  }

  collapseItem(item) {
    item.setAttribute('aria-expanded', 'false');
    item.setAttribute('data-state', 'collapsed');
    const group = item.querySelector(':scope > [data-part="group"], :scope > ul, :scope > ol');
    if (group) group.style.display = 'none';
    this.dispatch('toggle', { item, expanded: false });
  }

  selectItem(item) {
    const isSelected = item.getAttribute('aria-selected') === 'true';
    if (this.selectionMode === 'single') {
      this._getItems().forEach(it => {
        it.removeAttribute('aria-selected');
        it.removeAttribute('data-selected');
      });
      item.setAttribute('aria-selected', 'true');
      item.setAttribute('data-selected', 'true');
    } else {
      item.setAttribute('aria-selected', isSelected ? 'false' : 'true');
      item.setAttribute('data-selected', isSelected ? 'false' : 'true');
    }

    const value = item.getAttribute('data-value') || item.textContent.trim();
    this.dispatch('select', { item, value, selected: !isSelected });
  }
}
