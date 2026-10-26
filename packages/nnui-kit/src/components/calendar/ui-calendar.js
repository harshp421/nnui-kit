import { BaseLightElement } from '../../utils/base-element.js';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function formatDate(year, month, day) {
  const m = String(month).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

function parseDate(str) {
  if (!str) return null;
  const parts = str.split('-');
  if (parts.length !== 3) return null;
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const d = parseInt(parts[2], 10);
  if (isNaN(y) || isNaN(m) || isNaN(d)) return null;
  return { year: y, month: m, day: d };
}

/**
 * <ui-calendar> Micro-Enhancer
 * WAI-ARIA APG Calendar Date Picker Grid Pattern.
 * Invariant: Mutates attributes, never nodes. Form-associated via ElementInternals.
 */
export class UiCalendar extends BaseLightElement {
  static formAssociated = true;

  static get observedAttributes() {
    return ['value', 'name', 'month', 'year', 'min', 'max', 'disabled'];
  }

  constructor() {
    super();
    if (typeof this.attachInternals === 'function') {
      try {
        this._internals = this.attachInternals();
      } catch (e) {
        // Fallback for older environments
      }
    }
  }

  get form() {
    return this._internals ? this._internals.form : null;
  }

  set form(_) {}

  get name() {
    return this.getAttribute('name') || '';
  }

  set name(val) {
    if (val) this.setAttributeSafe(this, 'name', val);
    else this.removeAttributeSafe(this, 'name');
  }

  get value() {
    return this.getAttribute('value') || '';
  }

  set value(val) {
    this.setAttribute('value', val);
  }

  get month() {
    const m = parseInt(this.getAttribute('month'), 10);
    return isNaN(m) || m < 1 || m > 12 ? (this._currentViewDate.getMonth() + 1) : m;
  }

  set month(val) {
    this.setAttribute('month', String(val));
  }

  get year() {
    const y = parseInt(this.getAttribute('year'), 10);
    return isNaN(y) ? this._currentViewDate.getFullYear() : y;
  }

  set year(val) {
    this.setAttribute('year', String(val));
  }

  init() {
    this.setAttributeSafe(this, 'data-ui', 'calendar');

    const parsedVal = parseDate(this.value);
    const today = new Date();
    this._currentViewDate = parsedVal
      ? new Date(parsedVal.year, parsedVal.month - 1, parsedVal.day)
      : today;

    this._focusedDate = parsedVal
      ? new Date(parsedVal.year, parsedVal.month - 1, parsedVal.day)
      : new Date(today.getFullYear(), today.getMonth(), today.getDate());

    if (!this.querySelector('[data-part="calendar-header"]')) {
      this._buildSkeleton();
    }

    this._cacheElements();
    this._attachEvents();
    this._render();
    this._updateFormValue();
  }

  _buildSkeleton() {
    this.innerHTML = `
      <div data-part="calendar-header">
        <button type="button" data-part="prev-month" aria-label="Previous Month" class="ui-button ui-button--ghost ui-button--icon">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div data-part="month-heading" aria-live="polite"></div>
        <button type="button" data-part="next-month" aria-label="Next Month" class="ui-button ui-button--ghost ui-button--icon">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>
      <table data-part="calendar-grid" role="grid" aria-label="Calendar">
        <thead>
          <tr role="row">
            ${DAY_NAMES.map((d) => `<th role="columnheader" aria-label="${d}">${d}</th>`).join('')}
          </tr>
        </thead>
        <tbody data-part="calendar-body"></tbody>
      </table>
      <div data-part="calendar-footer" class="ui-calendar-footer">
        <button type="button" data-part="today-btn" class="ui-calendar-action-btn">Today</button>
        <button type="button" data-part="clear-btn" class="ui-calendar-action-btn">Clear</button>
      </div>
    `;
  }

  _cacheElements() {
    this._prevBtn = this.querySelector('[data-part="prev-month"]');
    this._nextBtn = this.querySelector('[data-part="next-month"]');
    this._heading = this.querySelector('[data-part="month-heading"]');
    this._grid = this.querySelector('[data-part="calendar-grid"]');
    this._tbody = this.querySelector('[data-part="calendar-body"]');
    this._todayBtn = this.querySelector('[data-part="today-btn"]');
    this._clearBtn = this.querySelector('[data-part="clear-btn"]');
  }

  _attachEvents() {
    if (this._prevBtn) {
      this._prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.prevMonth();
      });
    }

    if (this._nextBtn) {
      this._nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.nextMonth();
      });
    }

    if (this._todayBtn) {
      this._todayBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const now = new Date();
        const todayStr = formatDate(now.getFullYear(), now.getMonth() + 1, now.getDate());
        this.selectDate(todayStr);
      });
    }

    if (this._clearBtn) {
      this._clearBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.clear();
      });
    }

    if (this._tbody) {
      this._tbody.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-part="day-btn"]');
        if (!btn || btn.hasAttribute('disabled')) return;
        const dateStr = btn.getAttribute('data-date');
        if (dateStr) {
          this.selectDate(dateStr);
        }
      });
    }

    this.addEventListener('keydown', (e) => this._handleKeydown(e));
  }

  _handleKeydown(e) {
    if (this.hasAttribute('disabled')) return;

    let handled = false;
    const cur = new Date(this._focusedDate);

    switch (e.key) {
      case 'ArrowLeft':
        cur.setDate(cur.getDate() - 1);
        handled = true;
        break;
      case 'ArrowRight':
        cur.setDate(cur.getDate() + 1);
        handled = true;
        break;
      case 'ArrowUp':
        cur.setDate(cur.getDate() - 7);
        handled = true;
        break;
      case 'ArrowDown':
        cur.setDate(cur.getDate() + 7);
        handled = true;
        break;
      case 'PageUp':
        if (e.shiftKey) {
          cur.setFullYear(cur.getFullYear() - 1);
        } else {
          cur.setMonth(cur.getMonth() - 1);
        }
        handled = true;
        break;
      case 'PageDown':
        if (e.shiftKey) {
          cur.setFullYear(cur.getFullYear() + 1);
        } else {
          cur.setMonth(cur.getMonth() + 1);
        }
        handled = true;
        break;
      case 'Home':
        cur.setDate(cur.getDate() - cur.getDay());
        handled = true;
        break;
      case 'End':
        cur.setDate(cur.getDate() + (6 - cur.getDay()));
        handled = true;
        break;
      case 'Enter':
      case ' ': {
        const targetBtn = this.querySelector(`[data-date="${formatDate(cur.getFullYear(), cur.getMonth() + 1, cur.getDate())}"]`);
        if (targetBtn && !targetBtn.hasAttribute('disabled')) {
          e.preventDefault();
          this.selectDate(targetBtn.getAttribute('data-date'));
        }
        return;
      }
    }

    if (handled) {
      e.preventDefault();
      this._focusedDate = cur;

      // Update month view if focus moved outside current month
      const focusMonth = cur.getMonth() + 1;
      const focusYear = cur.getFullYear();
      if (focusMonth !== this.month || focusYear !== this.year) {
        this.month = focusMonth;
        this.year = focusYear;
        this._render();
      }

      const newFocusBtn = this.querySelector(`[data-date="${formatDate(cur.getFullYear(), cur.getMonth() + 1, cur.getDate())}"]`);
      if (newFocusBtn) {
        newFocusBtn.focus();
      }
    }
  }

  _render() {
    const y = this.year;
    const m = this.month; // 1-indexed

    if (this._heading) {
      this._heading.textContent = `${MONTH_NAMES[m - 1]} ${y}`;
    }

    if (!this._tbody) return;

    const firstDayIndex = new Date(y, m - 1, 1).getDay();
    const daysInMonth = new Date(y, m, 0).getDate();
    const daysInPrevMonth = new Date(y, m - 1, 0).getDate();

    const todayStr = formatDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate());
    const valStr = this.value;
    const minStr = this.getAttribute('min') || '';
    const maxStr = this.getAttribute('max') || '';

    let html = '';
    let dayCounter = 1;
    let nextMonthDayCounter = 1;

    for (let row = 0; row < 6; row++) {
      html += '<tr role="row">';
      for (let col = 0; col < 7; col++) {
        let dayNum;
        let cellDateStr;
        let isOutside = false;

        if (row === 0 && col < firstDayIndex) {
          // Prev month overflow
          dayNum = daysInPrevMonth - firstDayIndex + col + 1;
          const prevM = m === 1 ? 12 : m - 1;
          const prevY = m === 1 ? y - 1 : y;
          cellDateStr = formatDate(prevY, prevM, dayNum);
          isOutside = true;
        } else if (dayCounter > daysInMonth) {
          // Next month overflow
          dayNum = nextMonthDayCounter++;
          const nextM = m === 12 ? 1 : m + 1;
          const nextY = m === 12 ? y + 1 : y;
          cellDateStr = formatDate(nextY, nextM, dayNum);
          isOutside = true;
        } else {
          dayNum = dayCounter++;
          cellDateStr = formatDate(y, m, dayNum);
        }

        const isToday = cellDateStr === todayStr;
        const isSelected = cellDateStr === valStr;
        const isFocused = this._focusedDate && cellDateStr === formatDate(this._focusedDate.getFullYear(), this._focusedDate.getMonth() + 1, this._focusedDate.getDate());

        let isDisabled = this.hasAttribute('disabled');
        if (minStr && cellDateStr < minStr) isDisabled = true;
        if (maxStr && cellDateStr > maxStr) isDisabled = true;

        html += `
          <td role="gridcell" 
              aria-selected="${isSelected ? 'true' : 'false'}"
              ${isDisabled ? 'aria-disabled="true"' : ''}>
            <button type="button"
                    data-part="day-btn"
                    data-date="${cellDateStr}"
                    tabindex="${isFocused ? '0' : '-1'}"
                    ${isOutside ? 'data-outside="true"' : ''}
                    ${isToday ? 'data-today="true"' : ''}
                    ${isSelected ? 'data-selected="true"' : ''}
                    ${isDisabled ? 'disabled' : ''}>
              ${dayNum}
            </button>
          </td>
        `;
      }
      html += '</tr>';

      // If we've finished the month and row is done, break early if all 6 rows not required
      if (dayCounter > daysInMonth && row >= 4) {
        break;
      }
    }

    this._tbody.innerHTML = html;
  }

  selectDate(dateStr) {
    this.value = dateStr;
    const parsed = parseDate(dateStr);
    if (parsed) {
      this._focusedDate = new Date(parsed.year, parsed.month - 1, parsed.day);
      if (parsed.month !== this.month || parsed.year !== this.year) {
        this.month = parsed.month;
        this.year = parsed.year;
      }
    }
    this._render();
    this._updateFormValue();

    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      detail: {
        value: dateStr,
        date: parsed ? new Date(parsed.year, parsed.month - 1, parsed.day) : null
      }
    }));
  }

  clear() {
    this.value = '';
    this._render();
    this._updateFormValue();
    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      detail: {
        value: '',
        date: null
      }
    }));
  }

  prevMonth() {
    let m = this.month - 1;
    let y = this.year;
    if (m < 1) {
      m = 12;
      y -= 1;
    }
    this.month = m;
    this.year = y;
    this._render();
    this.dispatchEvent(new CustomEvent('month-change', {
      bubbles: true,
      detail: { year: y, month: m }
    }));
  }

  nextMonth() {
    let m = this.month + 1;
    let y = this.year;
    if (m > 12) {
      m = 1;
      y += 1;
    }
    this.month = m;
    this.year = y;
    this._render();
    this.dispatchEvent(new CustomEvent('month-change', {
      bubbles: true,
      detail: { year: y, month: m }
    }));
  }

  _updateFormValue() {
    if (this._internals && this._internals.setFormValue) {
      this._internals.setFormValue(this.value || null);
    }
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal === newVal) return;
    if (name === 'value') {
      const parsed = parseDate(newVal);
      if (parsed) {
        this._currentViewDate = new Date(parsed.year, parsed.month - 1, parsed.day);
        this._focusedDate = new Date(parsed.year, parsed.month - 1, parsed.day);
        if (parsed.month !== this.month || parsed.year !== this.year) {
          this.month = parsed.month;
          this.year = parsed.year;
        }
      }
      this._render();
      this._updateFormValue();
    } else if (name === 'month' || name === 'year' || name === 'disabled' || name === 'min' || name === 'max') {
      this._render();
    }
  }

  formResetCallback() {
    this.value = this.getAttribute('value') || '';
  }
}
