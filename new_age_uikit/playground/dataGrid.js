import '../src/index.js';
import { initGlobalSearch } from './command-search.js';

function initDataGridPage() {
  initGlobalSearch();

  // Theme Toggler
  const themeBtn = document.getElementById('components-theme-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      themeBtn.textContent = next === 'dark' ? '☀️ Light' : '🌙 Dark';
    });
  }

  const grid = document.getElementById('demo-data-grid');
  if (!grid) return;

  // Set columns
  grid.setColumns([
    { 
      key: 'id', 
      label: 'ID', 
      width: '80px', 
      sortable: true,
      render: (val) => `<span style="font-family: var(--ui-font-mono, monospace); font-size: 0.8rem; color: var(--ui-text-muted);">#${val}</span>`
    },
    { 
      key: 'timestamp', 
      label: 'Time', 
      width: '110px', 
      sortable: true,
      render: (val) => `<span style="font-family: var(--ui-font-mono, monospace); font-size: 0.8rem; color: var(--ui-text-secondary);">${val}</span>`
    },
    { 
      key: 'symbol', 
      label: 'Asset Pair', 
      width: '130px', 
      sortable: true,
      render: (val) => `<span style="font-weight: 600; color: var(--ui-text-primary); letter-spacing: -0.01em;">${val}</span>`
    },
    { 
      key: 'action', 
      label: 'Order Type', 
      width: '110px', 
      sortable: true,
      render: (val) => {
        const isBuy = val === 'BUY';
        return `<span style="display: inline-flex; align-items: center; justify-content: center; padding: 0.15rem 0.55rem; border-radius: 9999px; font-size: 0.725rem; font-weight: 700; letter-spacing: 0.04em; ${
          isBuy 
            ? 'background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3);' 
            : 'background: rgba(244, 63, 94, 0.15); color: #fb7185; border: 1px solid rgba(244, 63, 94, 0.3);'
        }">${val}</span>`;
      }
    },
    { 
      key: 'price', 
      label: 'Exec Price', 
      width: '120px', 
      sortable: true,
      render: (val) => `<span style="font-family: var(--ui-font-mono, monospace); font-weight: 600; color: var(--ui-text-primary);">${val}</span>`
    },
    { 
      key: 'volume', 
      label: 'Volume', 
      width: '110px', 
      sortable: true,
      render: (val) => `<span style="font-family: var(--ui-font-mono, monospace); color: var(--ui-text-secondary);">${val}</span>`
    },
    { 
      key: 'status', 
      label: 'Status', 
      width: '120px', 
      sortable: true,
      render: (val) => {
        const isExec = val === 'Executed';
        return `<span style="display: inline-flex; align-items: center; gap: 0.4rem; font-size: 0.775rem; font-weight: 500; color: ${isExec ? 'var(--ui-color-success-500, #10b981)' : 'var(--ui-color-warning-500, #f59e0b)'};">
          <span style="width: 6px; height: 6px; border-radius: 50%; background: currentColor; box-shadow: 0 0 6px ${isExec ? 'rgba(16, 185, 129, 0.6)' : 'rgba(245, 158, 11, 0.6)'};"></span>
          ${val}
        </span>`;
      }
    }
  ]);

  // Generate 10,000 initial rows
  const SYMBOLS = ['BTC/USD', 'ETH/USD', 'SOL/USD', 'NVDA', 'AAPL', 'MSFT', 'AMZN', 'TSLA'];
  const ACTIONS = ['BUY', 'SELL'];

  function createRows(count, startId = 1) {
    const list = [];
    for (let i = 0; i < count; i++) {
      const id = startId + i;
      const symbol = SYMBOLS[id % SYMBOLS.length];
      const action = ACTIONS[id % ACTIONS.length];
      const price = (Math.random() * 2500 + 40).toFixed(2);
      const volume = (Math.random() * 8 + 0.1).toFixed(3);
      const isExec = (id % 7) !== 0;

      list.push({
        id,
        timestamp: new Date(Date.now() - (count - i) * 1200).toLocaleTimeString(),
        symbol,
        action,
        price: `$${price}`,
        volume,
        status: isExec ? 'Executed' : 'Pending'
      });
    }
    return list;
  }

  // Populate 10,000 rows
  const initialData = createRows(10000);
  grid.setRows(initialData);

  // Search input
  const searchInput = document.getElementById('grid-search-input');
  if (searchInput) {
    if (grid._searchQuery) {
      searchInput.value = grid._searchQuery;
    }
    searchInput.addEventListener('input', (e) => {
      grid.setSearch(e.target.value);
    });
  }

  // Quick keyboard shortcut '/' to focus search
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchInput && !['input', 'textarea'].includes(document.activeElement?.tagName?.toLowerCase())) {
      e.preventDefault();
      searchInput?.focus();
    }
  });

  // Stream toggle
  const streamBtn = document.getElementById('toggle-stream-btn');
  let isStreaming = false;

  if (streamBtn) {
    streamBtn.addEventListener('click', () => {
      isStreaming = !isStreaming;
      if (isStreaming) {
        streamBtn.innerHTML = `
          <span style="width: 7px; height: 7px; border-radius: 50%; background: #ef4444; display: inline-block;"></span>
          <span>Pause Live Stream</span>
        `;
        streamBtn.className = 'ui-button ui-button--destructive';
        grid.startStreaming(80, () => {
          // Generate 2 new rows every 80ms (~25/sec)
          return createRows(2, grid.totalRows + 1);
        });
      } else {
        streamBtn.innerHTML = `
          <span style="width: 7px; height: 7px; border-radius: 50%; background: var(--ui-color-success-500); display: inline-block;"></span>
          <span>Start Live Stream</span>
        `;
        streamBtn.className = 'ui-button ui-button--secondary';
        grid.stopStreaming();
      }
    });
  }

  // Add 5,000 rows
  const addBatchBtn = document.getElementById('add-batch-btn');
  if (addBatchBtn) {
    addBatchBtn.addEventListener('click', () => {
      const batch = createRows(5000, grid.totalRows + 1);
      grid.appendRows(batch);
    });
  }

  // Export CSV
  const exportBtn = document.getElementById('export-csv-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      grid.exportCsv('market-data-grid.csv');
    });
  }

  // Copy buttons
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const pre = btn.closest('.code-container')?.querySelector('code');
      if (pre) {
        navigator.clipboard.writeText(pre.textContent);
        const orig = btn.textContent;
        btn.textContent = '✓ Copied!';
        setTimeout(() => btn.textContent = orig, 2000);
      }
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDataGridPage);
} else {
  initDataGridPage();
}
