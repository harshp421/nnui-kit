import { BaseLightElement } from '../../utils/base-element.js';
import { attachAnchorFallback, applyPositionFallback } from '../../utils/anchor-fallback.js';
import { attachPersistence } from '../../utils/persistence.js';

/**
 * <ui-date-range-picker> Micro-Enhancer
 * APG-compliant accessible dual-calendar Date Range Picker.
 * Features:
 * - Start & End date selection with hover range preview
 * - Quick range presets (Today, Last 7 Days, Last 30 Days, This Month)
 * - Top-layer Popover API with CSS Anchor Positioning & automated fallback
 * - WAI-ARIA accessible keyboard navigation
 * - Declarative State Persistence: persist="url|session|local" [sync="cross-tab"]
 */
export class UiDateRangePicker extends BaseLightElement {
  static get observedAttributes() {
    return ['start-date', 'end-date', 'placeholder', 'disabled', 'open', 'persist', 'sync'];
  }

  constructor() {
    super();
    this._startDate = null;
    this._endDate = null;
    this._hoverDate = null;
    this._viewYear = new Date().getFullYear();
    this._viewMonth = new Date().getMonth();
    this._selectingEnd = false;
  }

  get startDate() {
    return this._startDate;
  }

  set startDate(val) {
    this._startDate = val ? new Date(val) : null;
    this._renderTrigger();
    this._renderCalendars();
  }

  get endDate() {
    return this._endDate;
  }

  set endDate(val) {
    this._endDate = val ? new Date(val) : null;
    this._renderTrigger();
    this._renderCalendars();
  }

  get isOpen() {
    if (this._popover && typeof this._popover.matches === 'function') {
      try {
        return this._popover.matches(':popover-open') || this.hasAttribute('open');
      } catch (e) {}
    }
    return this.hasAttribute('open');
  }

  getAiState() {
    return {
      startDate: this._startDate ? this._formatDate(this._startDate) : null,
      endDate: this._endDate ? this._formatDate(this._endDate) : null,
      isOpen: this.isOpen,
      selectingEnd: this._selectingEnd
    };
  }

  init() {
    this.setAttributeSafe(this, 'data-ui', 'date-range-picker');

    if (this.hasAttribute('start-date')) {
      this._startDate = new Date(this.getAttribute('start-date'));
    }
    if (this.hasAttribute('end-date')) {
      this._endDate = new Date(this.getAttribute('end-date'));
    }

    if (this._startDate && !isNaN(this._startDate.getTime())) {
      this._viewYear = this._startDate.getFullYear();
      this._viewMonth = this._startDate.getMonth();
    }

    this._setupDOM();
    this._renderTrigger();
    this._renderCalendars();

    // Setup Declarative Persistence & Cross-Tab Sync
    if (this.hasAttribute('persist') || this.hasAttribute('sync')) {
      const cleanupPersistence = attachPersistence(this, {
        keys: ['start', 'end'],
        getState: () => ({
          start: this._startDate ? this._formatDate(this._startDate) : '',
          end: this._endDate ? this._formatDate(this._endDate) : ''
        }),
        setState: (state) => {
          if (state.start) {
            this._startDate = new Date(state.start);
            this._viewYear = this._startDate.getFullYear();
            this._viewMonth = this._startDate.getMonth();
          } else if (state.start === '') {
            this._startDate = null;
          }
          if (state.end) {
            this._endDate = new Date(state.end);
          } else if (state.end === '') {
            this._endDate = null;
          }
          this._renderTrigger();
          this._renderCalendars();
        }
      });
      this._cleanups.push(cleanupPersistence);
    }
  }

  _setupDOM() {
    // Generate anchor ID
    const uniqueId = `range-anchor-${Math.random().toString(36).substring(2, 9)}`;
    const popoverId = `range-popover-${Math.random().toString(36).substring(2, 9)}`;

    // Trigger container
    let trigger = this.querySelector('[data-part="trigger"]');
    if (!trigger) {
      trigger = document.createElement('button');
      trigger.type = 'button';
      trigger.setAttribute('data-part', 'trigger');
      trigger.className = 'ui-date-range-trigger';
      this.appendChild(trigger);
    }
    this._trigger = trigger;
    this._trigger.style.anchorName = `--${uniqueId}`;
    this._trigger.setAttribute('aria-haspopup', 'dialog');
    this._trigger.setAttribute('aria-expanded', 'false');

    // Popover
    let popover = this.querySelector('[data-part="popover"]');
    if (!popover) {
      popover = document.createElement('div');
      popover.setAttribute('data-part', 'popover');
      popover.setAttribute('popover', 'auto');
      popover.id = popoverId;
      popover.className = 'ui-date-range-popover';
      this.appendChild(popover);
    }
    this._popover = popover;
    this._popover.style.positionAnchor = `--${uniqueId}`;

    // Popover Toggle Event with light-dismiss re-open guard
    this._lastClosedTime = 0;
    this._trigger.addEventListener('click', (e) => {
      e.preventDefault();
      if (Date.now() - this._lastClosedTime < 150) {
        return;
      }
      this.toggle();
    });

    this._popover.addEventListener('toggle', (e) => {
      if (e.newState === 'open') {
        this.setAttributeSafe(this, 'open', '');
        this._trigger?.setAttribute('aria-expanded', 'true');
        this._reposition();
        if (typeof requestAnimationFrame === 'function') {
          requestAnimationFrame(this._reposition);
        }
        setTimeout(this._reposition, 15);
        this.dispatchCustomEvent('open');
      } else {
        this._lastClosedTime = Date.now();
        this.removeAttributeSafe(this, 'open');
        this._trigger?.setAttribute('aria-expanded', 'false');
        this.dispatchCustomEvent('close');
      }
    });

    // Anchor Fallback
    const cleanupAnchor = attachAnchorFallback(this._trigger, this._popover, {
      placement: 'bottom-start',
      offset: 8
    });
    this._cleanups.push(cleanupAnchor);
  }

  _reposition = () => {
    if (!this.isOpen || !this._popover) return;
    const trigger = (this._trigger && this._trigger.isConnected) ? this._trigger : this.querySelector('[data-part="trigger"]');
    if (!trigger) return;
    applyPositionFallback(trigger, this._popover, { placement: 'bottom-start', offset: 8 });
  };

  open() {
    if (this.hasAttribute('disabled')) return;
    if (this._popover && typeof this._popover.showPopover === 'function') {
      try {
        if (!this._popover.matches(':popover-open')) {
          this._popover.showPopover();
        }
      } catch (e) {
        this._popover.setAttribute('open', '');
      }
    } else if (this._popover) {
      this._popover.setAttribute('open', '');
    }
    this.setAttributeSafe(this, 'open', '');
    this._trigger?.setAttribute('aria-expanded', 'true');

    this._reposition();
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(this._reposition);
    }
    setTimeout(this._reposition, 15);

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', this._reposition, { passive: true, capture: true });
      window.addEventListener('resize', this._reposition, { passive: true });
    }

    this.dispatchCustomEvent('open');
  }

  close() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this._reposition, { capture: true });
      window.removeEventListener('resize', this._reposition);
    }

    if (this._popover && typeof this._popover.hidePopover === 'function') {
      try {
        if (this._popover.matches(':popover-open')) {
          this._popover.hidePopover();
        }
      } catch (e) {
        this._popover.removeAttribute('open');
      }
    } else if (this._popover) {
      this._popover.removeAttribute('open');
    }
    this.removeAttributeSafe(this, 'open');
    this._trigger?.setAttribute('aria-expanded', 'false');
    this.dispatchCustomEvent('close');
  }

  toggle() {
    if (this.isOpen) this.close();
    else this.open();
  }

  _formatDate(date) {
    if (!date || isNaN(date.getTime())) return '';
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  _formatDisplayDate(d) {
    if (!d || isNaN(d.getTime())) return '';
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')}, ${d.getFullYear()}`;
  }

  _renderTrigger() {
    if (!this._trigger) return;

    const startStr = this._formatDisplayDate(this._startDate);
    const endStr = this._formatDisplayDate(this._endDate);
    const placeholder = this.getAttribute('placeholder') || 'Select date range...';

    let displayHtml = '';
    if (startStr && endStr) {
      displayHtml = `<span style="font-weight: 500;">${startStr}</span> <span style="color: var(--ui-text-muted); font-size: 0.8rem; margin: 0 0.25rem;">→</span> <span style="font-weight: 500;">${endStr}</span>`;
    } else if (startStr) {
      displayHtml = `<span style="font-weight: 500;">${startStr}</span> <span style="color: var(--ui-text-muted); font-size: 0.8rem; margin: 0 0.25rem;">→</span> <span style="color: var(--ui-text-muted);">Pick end date</span>`;
    } else {
      displayHtml = `<span style="color: var(--ui-text-muted); font-weight: 400;">${placeholder}</span>`;
    }

    this._trigger.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.6rem; flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--ui-text-muted); flex-shrink: 0;">
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
          <line x1="16" x2="16" y1="2" y2="6"/>
          <line x1="8" x2="8" y1="2" y2="6"/>
          <line x1="3" x2="21" y1="10" y2="10"/>
        </svg>
        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${displayHtml}</span>
      </div>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--ui-text-muted); flex-shrink: 0; margin-left: 0.5rem;">
        <path d="m6 9 6 6 6-6"/>
      </svg>
    `;
  }

  _renderCalendars() {
    if (!this._popover) return;

    const month1Date = new Date(this._viewYear, this._viewMonth, 1);
    const month2Date = new Date(this._viewYear, this._viewMonth + 1, 1);

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    let rangeText = 'Select start and end dates';
    let durationBadge = '';
    if (this._startDate && this._endDate) {
      rangeText = `${this._formatDisplayDate(this._startDate)} → ${this._formatDisplayDate(this._endDate)}`;
      const days = Math.round(Math.abs((this._endDate.getTime() - this._startDate.getTime()) / (1000 * 60 * 60 * 24))) + 1;
      durationBadge = `<span class="range-duration-badge">${days} day${days === 1 ? '' : 's'}</span>`;
    } else if (this._startDate) {
      rangeText = `${this._formatDisplayDate(this._startDate)} → Pick end date`;
      durationBadge = `<span class="range-duration-badge" style="display: none;"></span>`;
    } else {
      durationBadge = `<span class="range-duration-badge" style="display: none;"></span>`;
    }

    this._popover.innerHTML = `
      <div class="range-picker-container">
        
        <!-- Header Presets Bar -->
        <div class="range-header-bar">
          <button type="button" class="range-preset-btn" data-preset="today">Today</button>
          <button type="button" class="range-preset-btn" data-preset="7d">Last 7 Days</button>
          <button type="button" class="range-preset-btn" data-preset="30d">Last 30 Days</button>
          <button type="button" class="range-preset-btn" data-preset="month">This Month</button>
        </div>

        <!-- Dual Calendars View (Side-by-side) -->
        <div class="range-calendars-wrapper">
          
          <!-- Month 1 (Left) -->
          <div class="range-calendar-pane">
            <div class="range-month-header">
              <button type="button" class="range-nav-btn range-nav-prev" aria-label="Previous month">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </button>
              <span class="range-month-title">
                ${monthNames[month1Date.getMonth()]} ${month1Date.getFullYear()}
              </span>
              <span style="width: 28px; height: 28px; display: inline-block;"></span>
            </div>
            ${this._generateMonthGridHtml(month1Date)}
          </div>

          <!-- Divider -->
          <div class="range-calendars-divider"></div>

          <!-- Month 2 (Right) -->
          <div class="range-calendar-pane">
            <div class="range-month-header">
              <span style="width: 28px; height: 28px; display: inline-block;"></span>
              <span class="range-month-title">
                ${monthNames[month2Date.getMonth()]} ${month2Date.getFullYear()}
              </span>
              <button type="button" class="range-nav-btn range-nav-next" aria-label="Next month">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </button>
            </div>
            ${this._generateMonthGridHtml(month2Date)}
          </div>

        </div>

        <!-- Footer Actions Bar -->
        <div class="range-footer-bar">
          <div class="range-summary-text">
            <span>${rangeText}</span>
            ${durationBadge}
          </div>
          <div class="range-actions-group">
            <button type="button" class="range-btn-clear">Clear</button>
            <button type="button" class="range-btn-apply">Apply Range</button>
          </div>
        </div>

      </div>
    `;

    this._bindCalendarInteractions();
  }

  _generateMonthGridHtml(monthDate) {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let gridHtml = `
      <table class="range-grid-table">
        <thead>
          <tr>
            <th>Su</th><th>Mo</th><th>Tu</th><th>We</th><th>Th</th><th>Fr</th><th>Sa</th>
          </tr>
        </thead>
        <tbody>
          <tr>
    `;

    // Empty cells before first day
    for (let i = 0; i < firstDayIndex; i++) {
      gridHtml += `<td></td>`;
    }

    let currentDay = 1;
    let col = firstDayIndex;

    const startNorm = this._normalizeDate(this._startDate);
    const endNorm = this._normalizeDate(this._endDate);
    const hoverNorm = this._normalizeDate(this._hoverDate);

    while (currentDay <= daysInMonth) {
      if (col === 7) {
        gridHtml += `</tr><tr>`;
        col = 0;
      }

      const thisDate = new Date(year, month, currentDay);
      const thisNorm = this._normalizeDate(thisDate);
      const isStart = startNorm && thisNorm.getTime() === startNorm.getTime();
      const isEnd = endNorm && thisNorm.getTime() === endNorm.getTime();

      let inRange = false;
      if (startNorm && endNorm) {
        const minT = Math.min(startNorm.getTime(), endNorm.getTime());
        const maxT = Math.max(startNorm.getTime(), endNorm.getTime());
        inRange = thisNorm.getTime() > minT && thisNorm.getTime() < maxT;
      } else if (startNorm && hoverNorm && this._selectingEnd) {
        const minDate = Math.min(startNorm.getTime(), hoverNorm.getTime());
        const maxDate = Math.max(startNorm.getTime(), hoverNorm.getTime());
        inRange = thisNorm.getTime() > minDate && thisNorm.getTime() < maxDate;
      }

      let tdClass = '';
      if (isStart && isEnd) {
        tdClass = 'range-start range-end range-single';
      } else if (isStart) {
        tdClass = 'range-start' + (!endNorm && !hoverNorm ? ' range-single' : '');
      } else if (isEnd) {
        tdClass = 'range-end';
      } else if (inRange) {
        tdClass = 'in-range';
      }
      const tdClassAttr = tdClass ? `class="${tdClass}"` : '';

      let dateAttr = `data-date="${this._formatDate(thisDate)}"`;
      let rangeAttr = '';
      if (isStart) rangeAttr = 'data-range="start"';
      else if (isEnd) rangeAttr = 'data-range="end"';
      else if (inRange) rangeAttr = 'data-range="in-range"';

      gridHtml += `
        <td ${tdClassAttr}>
          <button type="button" class="range-cell-btn" ${dateAttr} ${rangeAttr}>
            ${currentDay}
          </button>
        </td>
      `;

      currentDay++;
      col++;
    }

    // Remaining empty cells
    while (col < 7 && col > 0) {
      gridHtml += `<td></td>`;
      col++;
    }

    gridHtml += `</tr></tbody></table>`;
    return gridHtml;
  }

  _normalizeDate(d) {
    if (!d || isNaN(d.getTime())) return null;
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  _bindCalendarInteractions() {
    if (!this._popover) return;

    // Navigation
    const prevBtn = this._popover.querySelector('.range-nav-prev');
    const nextBtn = this._popover.querySelector('.range-nav-next');

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this._viewMonth--;
        if (this._viewMonth < 0) {
          this._viewMonth = 11;
          this._viewYear--;
        }
        this._renderCalendars();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this._viewMonth++;
        if (this._viewMonth > 11) {
          this._viewMonth = 0;
          this._viewYear++;
        }
        this._renderCalendars();
      });
    }

    // Presets
    this._popover.querySelectorAll('.range-preset-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const preset = btn.getAttribute('data-preset');
        this._applyPreset(preset);
      });
    });

    // Date Cell Clicks & Hover (Non-destructive hover preview to protect click events)
    this._popover.querySelectorAll('.range-cell-btn[data-date]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const dateStr = btn.getAttribute('data-date');
        if (!dateStr) return;
        const [y, m, d] = dateStr.split('-').map(Number);
        this._handleDateClick(new Date(y, m - 1, d));
      });

      btn.addEventListener('mouseenter', () => {
        if (this._selectingEnd) {
          const dateStr = btn.getAttribute('data-date');
          if (!dateStr) return;
          const [y, m, d] = dateStr.split('-').map(Number);
          this._updateHoverRange(new Date(y, m - 1, d));
        }
      });
    });

    // Reset hover when mouse leaves calendar area while selecting end date
    const calendarsWrapper = this._popover.querySelector('.range-calendars-wrapper');
    if (calendarsWrapper) {
      calendarsWrapper.addEventListener('mouseleave', () => {
        if (this._selectingEnd && this._startDate) {
          this._resetHoverToStart();
        }
      });
    }

    // Apply Button
    const applyBtn = this._popover.querySelector('.range-btn-apply');
    if (applyBtn) {
      applyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this._startDate && this._endDate) {
          this.dispatchCustomEvent('change', {
            start: this._formatDate(this._startDate),
            end: this._formatDate(this._endDate),
            range: [this._startDate, this._endDate]
          });
        }
        this.close();
      });
    }

    // Clear Button
    const clearBtn = this._popover.querySelector('.range-btn-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this._startDate = null;
        this._endDate = null;
        this._hoverDate = null;
        this._selectingEnd = false;
        this._renderTrigger();
        this._renderCalendars();
        this._persistState?.();
        this.dispatchCustomEvent('change', { start: null, end: null, range: [] });
      });
    }
  }

  _updateHoverRange(hoverDate) {
    if (!this._popover || !this._selectingEnd || !this._startDate) return;

    this._hoverDate = hoverDate;
    const startNorm = this._normalizeDate(this._startDate);
    const hoverNorm = this._normalizeDate(hoverDate);
    if (!startNorm || !hoverNorm) return;

    const startTime = startNorm.getTime();
    const hoverTime = hoverNorm.getTime();
    const minTime = Math.min(startTime, hoverTime);
    const maxTime = Math.max(startTime, hoverTime);

    // Smoothly update attributes and classes in-place without rebuilding DOM
    const cellBtns = this._popover.querySelectorAll('.range-cell-btn[data-date]');
    cellBtns.forEach(btn => {
      const dateStr = btn.getAttribute('data-date');
      if (!dateStr) return;
      const [y, m, d] = dateStr.split('-').map(Number);
      const cellTime = new Date(y, m - 1, d).getTime();
      const td = btn.closest('td');

      btn.removeAttribute('data-range');
      if (td) td.className = '';

      if (startTime === hoverTime) {
        if (cellTime === startTime) {
          btn.setAttribute('data-range', 'start');
          if (td) td.className = 'range-start range-end range-single';
        }
      } else if (hoverTime > startTime) {
        if (cellTime === startTime) {
          btn.setAttribute('data-range', 'start');
          if (td) td.className = 'range-start';
        } else if (cellTime === hoverTime) {
          btn.setAttribute('data-range', 'end');
          if (td) td.className = 'range-end';
        } else if (cellTime > minTime && cellTime < maxTime) {
          btn.setAttribute('data-range', 'in-range');
          if (td) td.className = 'in-range';
        }
      } else {
        if (cellTime === hoverTime) {
          btn.setAttribute('data-range', 'start');
          if (td) td.className = 'range-start';
        } else if (cellTime === startTime) {
          btn.setAttribute('data-range', 'end');
          if (td) td.className = 'range-end';
        } else if (cellTime > minTime && cellTime < maxTime) {
          btn.setAttribute('data-range', 'in-range');
          if (td) td.className = 'in-range';
        }
      }
    });

    const summarySpan = this._popover.querySelector('.range-summary-text span');
    if (summarySpan) {
      const d1 = new Date(minTime);
      const d2 = new Date(maxTime);
      summarySpan.textContent = `${this._formatDisplayDate(d1)} → ${this._formatDisplayDate(d2)}`;
    }
    const badge = this._popover.querySelector('.range-duration-badge');
    const days = Math.round(Math.abs((maxTime - minTime) / (1000 * 60 * 60 * 24))) + 1;
    if (badge) {
      badge.textContent = `${days} day${days === 1 ? '' : 's'}`;
      badge.style.display = 'inline-flex';
    }
  }

  _resetHoverToStart() {
    if (!this._popover || !this._startDate) return;
    this._hoverDate = null;
    const startNorm = this._normalizeDate(this._startDate);
    const startTime = startNorm ? startNorm.getTime() : null;

    const cellBtns = this._popover.querySelectorAll('.range-cell-btn[data-date]');
    cellBtns.forEach(btn => {
      const dateStr = btn.getAttribute('data-date');
      if (!dateStr) return;
      const [y, m, d] = dateStr.split('-').map(Number);
      const cellTime = new Date(y, m - 1, d).getTime();
      const td = btn.closest('td');

      btn.removeAttribute('data-range');
      if (td) td.className = '';

      if (startTime && cellTime === startTime) {
        btn.setAttribute('data-range', 'start');
        if (td) td.className = 'range-start range-single';
      }
    });

    const summarySpan = this._popover.querySelector('.range-summary-text span');
    if (summarySpan) {
      summarySpan.textContent = `${this._formatDisplayDate(this._startDate)} → Pick end date`;
    }
    const badge = this._popover.querySelector('.range-duration-badge');
    if (badge) {
      badge.style.display = 'none';
    }
  }

  _handleDateClick(clickedDate) {
    if (!this._startDate || (this._startDate && this._endDate)) {
      // First click: select start date
      this._startDate = clickedDate;
      this._endDate = null;
      this._hoverDate = null;
      this._selectingEnd = true;
      this._renderTrigger();
      this._renderCalendars();
    } else if (this._startDate && !this._endDate) {
      // Second click: select end date
      const startNorm = this._normalizeDate(this._startDate);
      const clickedNorm = this._normalizeDate(clickedDate);

      if (clickedNorm.getTime() < startNorm.getTime()) {
        this._endDate = this._startDate;
        this._startDate = clickedDate;
      } else {
        this._endDate = clickedDate;
      }
      this._selectingEnd = false;
      this._hoverDate = null;

      this._renderTrigger();
      this._renderCalendars();
      this.close();

      this._persistState?.();
      this.dispatchCustomEvent('change', {
        start: this._formatDate(this._startDate),
        end: this._formatDate(this._endDate),
        range: [this._startDate, this._endDate]
      });
    }
  }

  _applyPreset(preset) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (preset === 'today') {
      this._startDate = new Date(today);
      this._endDate = new Date(today);
    } else if (preset === '7d') {
      this._endDate = new Date(today);
      this._startDate = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000);
    } else if (preset === '30d') {
      this._endDate = new Date(today);
      this._startDate = new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000);
    } else if (preset === 'month') {
      this._startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      this._endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    }

    this._selectingEnd = false;
    this._viewYear = this._startDate.getFullYear();
    this._viewMonth = this._startDate.getMonth();
    this._renderTrigger();
    this._renderCalendars();
    this.close();

    this._persistState?.();
    this.dispatchCustomEvent('change', {
      start: this._formatDate(this._startDate),
      end: this._formatDate(this._endDate),
      range: [this._startDate, this._endDate]
    });
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal === newVal) return;
    if (name === 'start-date') {
      this._startDate = newVal ? new Date(newVal) : null;
      if (this._startDate && !isNaN(this._startDate.getTime())) {
        this._viewYear = this._startDate.getFullYear();
        this._viewMonth = this._startDate.getMonth();
      }
      this._renderTrigger();
      this._renderCalendars();
    } else if (name === 'end-date') {
      this._endDate = newVal ? new Date(newVal) : null;
      this._renderTrigger();
      this._renderCalendars();
    } else if (name === 'open') {
      if (newVal !== null && !this.isOpen) {
        this.open();
      } else if (newVal === null && this.isOpen) {
        this.close();
      }
    } else if (name === 'disabled') {
      if (this._trigger) {
        if (this.hasAttribute('disabled')) {
          this._trigger.setAttribute('disabled', '');
        } else {
          this._trigger.removeAttribute('disabled');
        }
      }
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this._reposition, { capture: true });
      window.removeEventListener('resize', this._reposition);
    }
  }
}

if (typeof customElements !== 'undefined') {
  if (!customElements.get('ui-date-range-picker')) {
    customElements.define('ui-date-range-picker', UiDateRangePicker);
  }
  if (!customElements.get('nnui-date-range-picker')) {
    customElements.define('nnui-date-range-picker', class extends UiDateRangePicker {});
  }
}
