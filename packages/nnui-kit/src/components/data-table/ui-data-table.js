import { BaseLightElement } from '../../utils/base-element.js';

/**
 * <ui-data-table> Micro-Enhancer
 * High-performance, accessible Light-DOM Data Table.
 * Features:
 * - Column sorting (numeric, date, string) with aria-sort & indicators
 * - Client-side search filtering with pre-cached text search
 * - Slice pagination (Previous, Next, page count)
 * - Row selection with indeterminate "Select All" checkbox
 * - Invariant: Mutates attributes, moves existing nodes without destroying DOM references.
 */
export class UiDataTable extends BaseLightElement {
  static get observedAttributes() {
    return ['page-size', 'page', 'sort-key', 'sort-dir', 'search'];
  }

  get pageSize() {
    const sz = parseInt(this.getAttribute('page-size'), 10);
    return isNaN(sz) || sz <= 0 ? 10 : sz;
  }

  set pageSize(val) {
    this.setAttribute('page-size', String(val));
  }

  get currentPage() {
    const p = parseInt(this.getAttribute('page'), 10);
    return isNaN(p) || p <= 0 ? 1 : p;
  }

  set currentPage(val) {
    this.setAttribute('page', String(val));
  }

  get totalPages() {
    return Math.max(1, Math.ceil(this._filteredRows.length / this.pageSize));
  }

  set totalPages(_) {}

  init() {
    this.setAttributeSafe(this, 'data-ui', 'data-table');

    this._tbody = this.querySelector('tbody[data-part="tbody"], tbody');
    this._thead = this.querySelector('thead');
    this._searchInput = this.querySelector('input[data-part="search"]');
    this._selectAllCheckbox = this.querySelector('input[data-part="select-all"]');
    this._prevBtn = this.querySelector('[data-part="prev-btn"]');
    this._nextBtn = this.querySelector('[data-part="next-btn"]');
    this._pageInfo = this.querySelector('[data-part="pagination-info"], [data-part="page-info"]');
    this._selectionCount = this.querySelector('[data-part="selection-count"]');
    this._bulkActions = this.querySelector('[data-part="bulk-actions"], [data-part="selection-bar"]');
    this._bulkCount = this.querySelector('[data-part="bulk-count"]');
    this._exportBtn = this.querySelector('[data-part="export-csv"], [data-action="export-csv"]');

    if (this._exportBtn) {
      this._exportBtn.addEventListener('click', () => this.exportCsv());
    }

    if (!this._tbody) return;

    // Cache rows and their search text
    this._allRows = Array.from(this._tbody.querySelectorAll('tr'));
    this._allRows.forEach((tr, i) => {
      if (!tr.hasAttribute('data-row-id')) {
        tr.setAttribute('data-row-id', String(i + 1));
      }
      tr._searchCache = tr.textContent.toLowerCase();
    });

    this._filteredRows = [...this._allRows];
    this._selectedIds = new Set();

    this._setupHeaders();
    this._setupSearch();
    this._setupPagination();
    this._setupSelection();

    this._applyFilterAndSort();
    this._renderPage();
  }

  _setupHeaders() {
    if (!this._thead) return;

    this._sortHeaders = Array.from(
      this._thead.querySelectorAll('th[data-sortable="true"], th[data-sort-key]')
    );

    this._sortHeaders.forEach((th) => {
      this.setAttributeSafe(th, 'role', 'columnheader');
      this.setAttributeSafe(th, 'tabindex', '0');
      this.setAttributeSafe(th, 'aria-sort', 'none');

      const colIndex = th.parentNode ? Array.from(th.parentNode.children).indexOf(th) : 0;
      const clickHandler = () => this._handleHeaderClick(th, colIndex);
      th.addEventListener('click', clickHandler);
      th.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          clickHandler();
        }
      });
    });
  }

  _handleHeaderClick(th, colIndex) {
    const key = th.getAttribute('data-sort-key') || String(colIndex);
    const currentSort = th.getAttribute('aria-sort');
    let nextSort = 'ascending';

    if (currentSort === 'ascending') {
      nextSort = 'descending';
    } else if (currentSort === 'descending') {
      nextSort = 'none';
    }

    // Reset all headers
    this._sortHeaders.forEach((h) => {
      h.setAttribute('aria-sort', 'none');
      const icon = h.querySelector('[data-part="sort-icon"], [data-part="sort-indicator"]');
      if (icon) icon.textContent = '⇅';
    });

    if (nextSort !== 'none') {
      th.setAttribute('aria-sort', nextSort);
      const icon = th.querySelector('[data-part="sort-icon"], [data-part="sort-indicator"]');
      if (icon) icon.textContent = nextSort === 'ascending' ? '▲' : '▼';
      this.setAttribute('sort-key', key);
      this.setAttribute('sort-dir', nextSort === 'ascending' ? 'asc' : 'desc');
      this._sortColumn(colIndex, nextSort === 'ascending' ? 'asc' : 'desc');
    } else {
      this.removeAttribute('sort-key');
      this.removeAttribute('sort-dir');
      // Reset to original DOM order
      this._filteredRows.sort((a, b) => {
        return parseInt(a.getAttribute('data-row-id'), 10) - parseInt(b.getAttribute('data-row-id'), 10);
      });
    }

    this._renderPage();
    this.dispatchEvent(new CustomEvent('sort', {
      bubbles: true,
      detail: { key, direction: nextSort }
    }));
  }

  _sortColumn(colIndex, direction) {
    const mult = direction === 'asc' ? 1 : -1;

    this._filteredRows.sort((trA, trB) => {
      const cellA = trA.children[colIndex]?.textContent?.trim() || '';
      const cellB = trB.children[colIndex]?.textContent?.trim() || '';

      // Try numeric parse (strip currency symbols and commas)
      const numA = parseFloat(cellA.replace(/[^0-9.-]+/g, ''));
      const numB = parseFloat(cellB.replace(/[^0-9.-]+/g, ''));

      if (!isNaN(numA) && !isNaN(numB) && cellA.match(/[0-9]/) && cellB.match(/[0-9]/)) {
        return (numA - numB) * mult;
      }

      // Try Date parse
      const dateA = Date.parse(cellA);
      const dateB = Date.parse(cellB);
      if (!isNaN(dateA) && !isNaN(dateB) && cellA.length > 5 && cellB.length > 5) {
        return (dateA - dateB) * mult;
      }

      // String locale compare
      return cellA.localeCompare(cellB, undefined, { numeric: true, sensitivity: 'base' }) * mult;
    });

    // Reorder DOM nodes in tbody efficiently
    const fragment = document.createDocumentFragment();
    this._filteredRows.forEach((row) => fragment.appendChild(row));
    this._tbody.appendChild(fragment);
  }

  _setupSearch() {
    if (!this._searchInput) return;

    this._searchInput.addEventListener('input', () => {
      const query = this._searchInput.value.trim().toLowerCase();
      this.setAttribute('search', query);
      this.currentPage = 1;
      this._applyFilterAndSort();
      this._renderPage();

      this.dispatchEvent(new CustomEvent('filter', {
        bubbles: true,
        detail: { query, matchCount: this._filteredRows.length }
      }));
    });
  }

  _applyFilterAndSort() {
    const query = (this.getAttribute('search') || '').toLowerCase();

    if (!query) {
      this._filteredRows = [...this._allRows];
    } else {
      this._filteredRows = this._allRows.filter((tr) => tr._searchCache.includes(query));
    }
  }

  _setupPagination() {
    if (this._prevBtn) {
      this._prevBtn.addEventListener('click', () => {
        if (this.currentPage > 1) {
          this.currentPage = this.currentPage - 1;
          this._renderPage();
        }
      });
    }

    if (this._nextBtn) {
      this._nextBtn.addEventListener('click', () => {
        if (this.currentPage < this.totalPages) {
          this.currentPage = this.currentPage + 1;
          this._renderPage();
        }
      });
    }
  }

  _renderPage() {
    const page = this.currentPage;
    const size = this.pageSize;
    const total = this._filteredRows.length;
    const totalP = this.totalPages;

    const startIdx = (page - 1) * size;
    const endIdx = startIdx + size;

    // Hide all rows not matching filter
    this._allRows.forEach((tr) => {
      tr.setAttribute('hidden', '');
    });

    // Show active slice of filtered rows
    const visibleSlice = this._filteredRows.slice(startIdx, endIdx);
    visibleSlice.forEach((tr) => {
      tr.removeAttribute('hidden');
    });

    // Update pagination controls
    if (this._prevBtn) {
      this._prevBtn.disabled = page <= 1;
    }
    if (this._nextBtn) {
      this._nextBtn.disabled = page >= totalP;
    }

    if (this._pageInfo) {
      const startDisplay = total === 0 ? 0 : startIdx + 1;
      const endDisplay = Math.min(endIdx, total);
      this._pageInfo.textContent = `Showing ${startDisplay} to ${endDisplay} of ${total} row(s)`;
    }

    this._updateSelectAllState();

    this.dispatchEvent(new CustomEvent('page-change', {
      bubbles: true,
      detail: { page, totalPages: totalP, totalRows: total }
    }));
  }

  _setupSelection() {
    // Select all checkbox
    if (this._selectAllCheckbox) {
      this._selectAllCheckbox.addEventListener('change', () => {
        const isChecked = this._selectAllCheckbox.checked;
        const startIdx = (this.currentPage - 1) * this.pageSize;
        const visibleSlice = this._filteredRows.slice(startIdx, startIdx + this.pageSize);

        visibleSlice.forEach((row) => {
          const rowId = row.getAttribute('data-row-id');
          const cb = row.querySelector('input[data-part="row-select"], input[type="checkbox"]');
          if (cb) cb.checked = isChecked;

          if (isChecked) {
            row.setAttribute('data-selected', 'true');
            this._selectedIds.add(rowId);
          } else {
            row.removeAttribute('data-selected');
            this._selectedIds.delete(rowId);
          }
        });

        this._updateSelectionDisplay();
      });
    }

    // Individual row checkboxes delegation
    this._tbody.addEventListener('change', (e) => {
      const cb = e.target.closest('input[data-part="row-select"], input[type="checkbox"]');
      if (!cb) return;

      const row = cb.closest('tr');
      if (!row) return;

      const rowId = row.getAttribute('data-row-id');
      if (cb.checked) {
        row.setAttribute('data-selected', 'true');
        this._selectedIds.add(rowId);
      } else {
        row.removeAttribute('data-selected');
        this._selectedIds.delete(rowId);
      }

      this._updateSelectAllState();
      this._updateSelectionDisplay();
    });
  }

  _updateSelectAllState() {
    if (!this._selectAllCheckbox) return;

    const startIdx = (this.currentPage - 1) * this.pageSize;
    const visibleSlice = this._filteredRows.slice(startIdx, startIdx + this.pageSize);

    if (visibleSlice.length === 0) {
      this._selectAllCheckbox.checked = false;
      this._selectAllCheckbox.indeterminate = false;
      return;
    }

    const selectedVisibleCount = visibleSlice.filter((r) =>
      this._selectedIds.has(r.getAttribute('data-row-id'))
    ).length;

    if (selectedVisibleCount === visibleSlice.length) {
      this._selectAllCheckbox.checked = true;
      this._selectAllCheckbox.indeterminate = false;
    } else if (selectedVisibleCount > 0) {
      this._selectAllCheckbox.checked = false;
      this._selectAllCheckbox.indeterminate = true;
    } else {
      this._selectAllCheckbox.checked = false;
      this._selectAllCheckbox.indeterminate = false;
    }
  }

  _updateSelectionDisplay() {
    const count = this._selectedIds.size;
    const total = this._allRows.length;

    if (this._selectionCount) {
      this._selectionCount.textContent = `${count} of ${total} row(s) selected`;
    }

    if (this._bulkActions) {
      if (count > 0) {
        this._bulkActions.removeAttribute('hidden');
        this._bulkActions.setAttribute('data-visible', 'true');
      } else {
        this._bulkActions.setAttribute('hidden', '');
        this._bulkActions.removeAttribute('data-visible');
      }
    }

    if (this._bulkCount) {
      this._bulkCount.textContent = String(count);
    }

    this.dispatchEvent(new CustomEvent('selection-change', {
      bubbles: true,
      detail: {
        selectedIds: Array.from(this._selectedIds),
        selectedCount: count
      }
    }));
  }

  /**
   * Export table contents (selected rows or all matching filtered rows) to CSV
   * @param {string} filename 
   */
  exportCsv(filename = 'export-table.csv') {
    if (!this._allRows || this._allRows.length === 0) return;

    // Determine data rows: either selected rows, or all filtered rows
    const rowsToExport = this._selectedIds.size > 0
      ? this._allRows.filter((r) => this._selectedIds.has(r.getAttribute('data-row-id')))
      : this._filteredRows;

    if (rowsToExport.length === 0) return;

    // Extract headers (exclude checkbox column if any)
    const ths = this._thead ? Array.from(this._thead.querySelectorAll('th')) : [];
    const colIndices = [];
    const headerLabels = [];

    ths.forEach((th, idx) => {
      // Skip checkbox column
      if (th.querySelector('input[type="checkbox"]')) return;
      colIndices.push(idx);
      headerLabels.push(`"${(th.textContent || '').trim().replace(/"/g, '""')}"`);
    });

    const rowsCsv = rowsToExport.map((tr) => {
      return colIndices.map((idx) => {
        const cell = tr.children[idx];
        const text = cell ? cell.textContent.trim() : '';
        return `"${text.replace(/"/g, '""')}"`;
      }).join(',');
    });

    const csvContent = [headerLabels.join(','), ...rowsCsv].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Public Methods
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage = this.currentPage + 1;
      this._renderPage();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage = this.currentPage - 1;
      this._renderPage();
    }
  }

  setPage(n) {
    if (n >= 1 && n <= this.totalPages) {
      this.currentPage = n;
      this._renderPage();
    }
  }

  setSearch(q) {
    if (this._searchInput) this._searchInput.value = q;
    this.setAttribute('search', q);
    this.currentPage = 1;
    this._applyFilterAndSort();
    this._renderPage();
  }

  getSelectedRowIds() {
    return Array.from(this._selectedIds);
  }

  selectAll() {
    this._allRows.forEach((r) => {
      const id = r.getAttribute('data-row-id');
      const cb = r.querySelector('input[type="checkbox"]');
      if (cb) cb.checked = true;
      r.setAttribute('data-selected', 'true');
      this._selectedIds.add(id);
    });
    this._updateSelectAllState();
    this._updateSelectionDisplay();
  }

  deselectAll() {
    this._allRows.forEach((r) => {
      const cb = r.querySelector('input[type="checkbox"]');
      if (cb) cb.checked = false;
      r.removeAttribute('data-selected');
    });
    this._selectedIds.clear();
    this._updateSelectAllState();
    this._updateSelectionDisplay();
  }
}
