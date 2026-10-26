import { BaseLightElement } from '../../utils/base-element.js';
import { Keys, getNextIndex, applyRovingTabindex, generateUniqueId } from '../../utils/a11y.js';

/**
 * <ui-tabs> Micro-Enhancer
 * WAI-ARIA APG Compliant Tabs Pattern
 * Invariant: Mutates attributes, never nodes. Light-DOM native.
 */
export class UiTabs extends BaseLightElement {
  static get observedAttributes() {
    return ['value', 'orientation'];
  }

  get value() {
    return this.getAttribute('value') || '';
  }

  set value(val) {
    this.setAttributeSafe(this, 'value', val);
  }

  get orientation() {
    return this.getAttribute('orientation') || 'horizontal';
  }

  set orientation(val) {
    if (val) this.setAttributeSafe(this, 'orientation', val);
    else this.removeAttributeSafe(this, 'orientation');
  }

  init() {
    this.setAttributeSafe(this, 'data-ui', 'tabs');

    // Dev-mode diagnostics: only warn if template content was provided without tab triggers
    if (this.childElementCount > 0 && this._getTabs().length === 0) {
      console.warn(`[NNUI-KIT] <${this.tagName.toLowerCase()}> has no tab triggers. Add buttons with data-part="tab" or role="tab".`);
    }

    this._setupStructure();
    this._syncState();
    this._bindEvents();
  }

  _getTabs() {
    const tablist = this.querySelector('[data-part="tablist"], [role="tablist"]');
    if (tablist && tablist.closest('ui-tabs, nnui-tabs') === this) {
      return Array.from(tablist.querySelectorAll('[data-part="tab"], [role="tab"], button')).filter(
        (el) => el.closest('ui-tabs, nnui-tabs') === this
      );
    }
    return Array.from(this.querySelectorAll('[data-part="tab"], [role="tab"]')).filter(
      (el) => el.closest('ui-tabs, nnui-tabs') === this
    );
  }

  _getPanels() {
    return Array.from(this.querySelectorAll('[data-part="tabpanel"], [role="tabpanel"], div[data-part="tabpanel"]')).filter(
      (el) => el.closest('ui-tabs, nnui-tabs') === this
    );
  }

  _setupStructure() {
    const tabs = this._getTabs();
    const panels = this._getPanels();
    const baseId = this.id || generateUniqueId('tabs');

    tabs.forEach((tab, index) => {
      const tabVal = tab.dataset.value || `tab-${index}`;
      tab.dataset.value = tabVal;

      const triggerId = tab.id || `${baseId}-trigger-${index}`;
      const panelId = panels[index]?.id || `${baseId}-panel-${index}`;

      this.setAttributeSafe(tab, 'id', triggerId);
      this.setAttributeSafe(tab, 'role', 'tab');
      this.setAttributeSafe(tab, 'aria-controls', panelId);

      if (panels[index]) {
        this.setAttributeSafe(panels[index], 'id', panelId);
        this.setAttributeSafe(panels[index], 'role', 'tabpanel');
        this.setAttributeSafe(panels[index], 'aria-labelledby', triggerId);
        panels[index].dataset.value = panels[index].dataset.value || tabVal;
      }
    });

    // Default to first tab if no value is set
    if (!this.value && tabs.length > 0) {
      this.value = tabs[0].dataset.value;
    }
  }

  _syncState() {
    const tabs = this._getTabs();
    const panels = this._getPanels();
    const currentVal = this.value;

    let activeIndex = 0;

    tabs.forEach((tab, index) => {
      const isSelected = tab.dataset.value === currentVal;
      if (isSelected) activeIndex = index;

      this.setAttributeSafe(tab, 'aria-selected', isSelected ? 'true' : 'false');
      this.setAttributeSafe(tab, 'data-state', isSelected ? 'active' : 'inactive');
      this.setAttributeSafe(tab, 'tabindex', isSelected ? '0' : '-1');
    });

    panels.forEach((panel, idx) => {
      const panelVal = panel.dataset.value || tabs[idx]?.dataset?.value;
      const isSelected = panelVal === currentVal || (!panelVal && idx === activeIndex);
      this.setAttributeSafe(panel, 'data-state', isSelected ? 'active' : 'inactive');
      if (isSelected) {
        panel.removeAttribute('hidden');
        panel.style.display = '';
      } else {
        this.setAttributeSafe(panel, 'hidden', '');
        panel.style.display = 'none';
      }
    });
  }

  _bindEvents() {
    // Click delegation (scoped to this specific <ui-tabs> instance)
    this.listen(this, 'click', (e) => {
      const tab = e.target.closest('[data-part="tab"], [role="tab"]');
      if (tab && this.contains(tab) && tab.closest('ui-tabs, nnui-tabs') === this) {
        this.selectTab(tab.dataset.value);
      }
    });

    // Keyboard navigation (APG roving tabindex)
    this.listen(this, 'keydown', (e) => {
      const tab = e.target.closest('[data-part="tab"], [role="tab"]');
      if (!tab || tab.closest('ui-tabs, nnui-tabs') !== this) return;

      const tabs = this._getTabs();
      const currentIndex = tabs.indexOf(tab);
      const isVertical = this.orientation === 'vertical';
      let nextIndex = -1;

      switch (e.key) {
        case Keys.ARROW_RIGHT:
          if (!isVertical) {
            e.preventDefault();
            nextIndex = getNextIndex(currentIndex, tabs.length, 1);
          }
          break;
        case Keys.ARROW_LEFT:
          if (!isVertical) {
            e.preventDefault();
            nextIndex = getNextIndex(currentIndex, tabs.length, -1);
          }
          break;
        case Keys.ARROW_DOWN:
          if (isVertical) {
            e.preventDefault();
            nextIndex = getNextIndex(currentIndex, tabs.length, 1);
          }
          break;
        case Keys.ARROW_UP:
          if (isVertical) {
            e.preventDefault();
            nextIndex = getNextIndex(currentIndex, tabs.length, -1);
          }
          break;
        case Keys.HOME:
          e.preventDefault();
          nextIndex = 0;
          break;
        case Keys.END:
          e.preventDefault();
          nextIndex = tabs.length - 1;
          break;
        case Keys.ENTER:
        case Keys.SPACE:
        case Keys.SPACEBAR:
          e.preventDefault();
          this.selectTab(tab.dataset.value);
          return;
      }

      if (nextIndex >= 0 && nextIndex !== currentIndex) {
        const nextTab = tabs[nextIndex];
        applyRovingTabindex(tabs, nextIndex, true);
        this.selectTab(nextTab.dataset.value);
      }
    });
  }

  selectTab(val) {
    if (this.value === val) return;
    const prev = this.value;
    this.value = val;
    this._syncState();

    this.dispatch('change', {
      value: val,
      previousValue: prev,
    });
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal !== newVal && this._initialized) {
      if (name === 'value') {
        this._syncState();
      }
    }
  }
}
