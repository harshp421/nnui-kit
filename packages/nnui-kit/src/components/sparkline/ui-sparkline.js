import { BaseLightElement } from '../../utils/base-element.js';

/**
 * <ui-sparkline> Micro-Enhancer
 * Lightweight, zero-dependency SVG micro-trendline and area chart in Light-DOM.
 * 
 * Features:
 * - Sub-1KB SVG path generation (straight or smooth bezier curves)
 * - Automatic min/max normalization and aspect ratio preservation
 * - Optional area gradient fill
 * - Interactive hover cursor with animated focal point and floating value tooltip
 * - Auto-trend coloring (positive / negative delta detection)
 * - Dispatches 'hoverpoint' CustomEvent: { index, value, x, y }
 * - V-DOM & SSR safe, 100% accessible via role="img" and aria-label
 */
export class UiSparkline extends BaseLightElement {
  static get observedAttributes() {
    return ['data', 'color', 'stroke-width', 'fill', 'hoverable', 'height', 'width', 'smooth'];
  }

  get data() {
    const raw = this.getAttribute('data') || '';
    if (!raw) return this._dataArray || [];
    try {
      if (raw.startsWith('[')) return JSON.parse(raw);
    } catch {}
    return raw.split(/[\s,]+/).map(v => parseFloat(v)).filter(v => !isNaN(v));
  }

  set data(val) {
    if (Array.isArray(val)) {
      this._dataArray = val;
      this.setAttributeSafe('data', JSON.stringify(val));
    } else if (typeof val === 'string') {
      this.setAttributeSafe('data', val);
    } else {
      this.removeAttributeSafe('data');
    }
    this._render();
  }

  get color() {
    return this.getAttribute('color') || 'auto';
  }

  set color(val) {
    if (val) this.setAttributeSafe('color', val);
    else this.removeAttributeSafe('color');
    this._render();
  }

  get strokeWidth() {
    const w = parseFloat(this.getAttribute('stroke-width'));
    return isNaN(w) || w <= 0 ? 2 : w;
  }

  set strokeWidth(val) {
    if (val !== null && val !== undefined) this.setAttributeSafe('stroke-width', String(val));
    else this.removeAttributeSafe('stroke-width');
    this._render();
  }

  get fill() {
    return this.getAttribute('fill') || 'gradient';
  }

  set fill(val) {
    if (val) this.setAttributeSafe('fill', val);
    else this.removeAttributeSafe('fill');
    this._render();
  }

  get hoverable() {
    return this.hasAttribute('hoverable') && this.getAttribute('hoverable') !== 'false';
  }

  set hoverable(val) {
    if (val) this.setAttributeSafe('hoverable', '');
    else this.removeAttributeSafe('hoverable');
  }

  get smooth() {
    return this.getAttribute('smooth') !== 'false';
  }

  set smooth(val) {
    if (val === false || val === 'false') this.setAttributeSafe('smooth', 'false');
    else this.removeAttributeSafe('smooth');
    this._render();
  }

  getAiState() {
    return {
      pointsCount: this.data.length,
      values: this.data,
      color: this.color,
      fill: this.fill,
      hoverable: this.hoverable,
    };
  }

  init() {
    this.setAttributeSafe('data-ui', 'sparkline');
    this.setAttributeSafe('role', 'img');

    this._uniqueId = 'spark-' + Math.random().toString(36).slice(2, 7);
    this._render();
    this._bindEvents();
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal !== newVal && this._initialized) {
      this._render();
    }
  }

  _bindEvents() {
    this.listen(this, 'mousemove', (e) => this._onMouseMove(e));
    this.listen(this, 'mouseleave', () => this._onMouseLeave());
  }

  _render() {
    const rawData = this.data;
    if (!rawData || rawData.length < 2) {
      this.innerHTML = '';
      return;
    }

    const min = Math.min(...rawData);
    const max = Math.max(...rawData);
    const range = max === min ? 1 : max - min;

    const width = 160;
    const height = 48;
    const padding = 4;
    const usableW = width - padding * 2;
    const usableH = height - padding * 2;

    // Calculate coordinates
    const points = rawData.map((val, idx) => {
      const x = padding + (idx / (rawData.length - 1)) * usableW;
      const y = height - padding - ((val - min) / range) * usableH;
      return { x, y, val, idx };
    });
    this._points = points;

    // Auto trend color determination
    let strokeColor = this.color;
    if (strokeColor === 'auto') {
      const isPositive = rawData[rawData.length - 1] >= rawData[0];
      strokeColor = isPositive ? 'var(--ui-color-success-500, #10b981)' : 'var(--ui-color-danger-500, #ef4444)';
    }

    // Build SVG Path
    let linePath = '';
    if (this.smooth && points.length > 2) {
      linePath = `M ${points[0].x} ${points[0].y}`;
      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i === 0 ? 0 : i - 1];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;

        linePath += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
      }
    } else {
      linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
    }

    const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${height} L ${points[0].x.toFixed(1)} ${height} Z`;

    const gradId = `spark-grad-${this._uniqueId}`;

    const deltaPercent = (((rawData[rawData.length - 1] - rawData[0]) / (Math.abs(rawData[0]) || 1)) * 100).toFixed(1);
    this.setAttributeSafe('aria-label', `Trend sparkline: ${rawData.length} points, ending at ${rawData[rawData.length - 1]} (${deltaPercent}% change)`);

    this.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" data-part="svg" style="width: 100%; height: 100%; display: block; overflow: visible;">
        <defs>
          <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${strokeColor}" stop-opacity="0.32" />
            <stop offset="100%" stop-color="${strokeColor}" stop-opacity="0.0" />
          </linearGradient>
        </defs>
        ${this.fill === 'gradient' ? `<path data-part="area" d="${areaPath}" fill="url(#${gradId})" />` : ''}
        ${this.fill === 'solid' ? `<path data-part="area" d="${areaPath}" fill="${strokeColor}" opacity="0.15" />` : ''}
        <path data-part="line" d="${linePath}" fill="none" stroke="${strokeColor}" stroke-width="${this.strokeWidth}" stroke-linecap="round" stroke-linejoin="round" />
        <circle data-part="cursor-dot" r="4" fill="${strokeColor}" stroke="#ffffff" stroke-width="2" style="display: none; transition: transform var(--ui-transition-spring-snappy, 150ms ease);" />
      </svg>
      <div data-part="tooltip" style="display: none; position: absolute; pointer-events: none; z-index: 10; font-family: var(--ui-font-mono, monospace); font-size: 0.7rem; font-weight: 600; padding: 2px 6px; border-radius: 4px; background: var(--ui-bg-surface-elevated, #18181b); color: var(--ui-text-primary, #ffffff); border: 1px solid var(--ui-border-default, #27272a); box-shadow: var(--ui-shadow-md, 0 4px 6px rgba(0,0,0,0.1)); transform: translate(-50%, -125%); white-space: nowrap;"></div>
    `;

    this._cursorDot = this.querySelector('[data-part="cursor-dot"]');
    this._tooltip = this.querySelector('[data-part="tooltip"]');
  }

  _onMouseMove(e) {
    if (!this.hoverable || !this._points || this._points.length === 0) return;

    const rect = this.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, mouseX / rect.width));
    const targetSvgX = 4 + ratio * (160 - 8);

    // Find nearest point
    let nearest = this._points[0];
    let minDiff = Infinity;
    for (const p of this._points) {
      const diff = Math.abs(p.x - targetSvgX);
      if (diff < minDiff) {
        minDiff = diff;
        nearest = p;
      }
    }

    if (this._cursorDot) {
      this._cursorDot.style.display = 'block';
      this._cursorDot.setAttribute('cx', String(nearest.x));
      this._cursorDot.setAttribute('cy', String(nearest.y));
    }

    if (this._tooltip) {
      this._tooltip.style.display = 'block';
      const actualX = (nearest.x / 160) * rect.width;
      const actualY = (nearest.y / 48) * rect.height;
      this._tooltip.style.left = `${actualX}px`;
      this._tooltip.style.top = `${actualY}px`;
      this._tooltip.textContent = String(nearest.val);
    }

    this.dispatch('hoverpoint', {
      index: nearest.idx,
      value: nearest.val,
      x: nearest.x,
      y: nearest.y,
    });
  }

  _onMouseLeave() {
    if (this._cursorDot) this._cursorDot.style.display = 'none';
    if (this._tooltip) this._tooltip.style.display = 'none';
  }
}
