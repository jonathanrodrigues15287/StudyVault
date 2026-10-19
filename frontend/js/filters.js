/**
 * Student Notes Manager - Search & Filters Controller (filters.js)
 * Manages search debounce, sorting, and active filter chips bar.
 */

(function () {
  'use strict';

  let searchDebounceTimer = null;

  function renderActiveFilterBar() {
    const activeFilterBar = document.getElementById('activeFilterBar');
    const activeChipsList = document.getElementById('activeChipsList');
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearchBtn');

    if (!activeFilterBar || !activeChipsList || !window.notesStore) return;

    const { search, subject, tag } = window.notesStore.filters;
    const chips = [];

    if (search) {
      chips.push({
        type: 'search',
        label: `Search: "${search}"`,
        onRemove: () => {
          if (searchInput) searchInput.value = '';
          if (clearSearchBtn) clearSearchBtn.style.display = 'none';
          window.notesStore.setSearch('');
          if (typeof window.refreshNotesView === 'function') window.refreshNotesView();
        }
      });
    }

    if (subject && subject !== 'all') {
      chips.push({
        type: 'subject',
        label: `Subject: ${subject}`,
        onRemove: () => {
          window.notesStore.setSubject('all');
          if (typeof window.renderSubjectPills === 'function') window.renderSubjectPills();
          if (typeof window.refreshNotesView === 'function') window.refreshNotesView();
        }
      });
    }

    if (tag) {
      chips.push({
        type: 'tag',
        label: `Tag: #${tag}`,
        onRemove: () => {
          window.notesStore.setTag('');
          if (typeof window.refreshNotesView === 'function') window.refreshNotesView();
        }
      });
    }

    if (chips.length > 0) {
      activeFilterBar.style.display = 'flex';
      activeChipsList.innerHTML = '';
      chips.forEach(chip => {
        const chipEl = document.createElement('span');
        chipEl.className = 'filter-chip';
        const safeLabel = window.escapeHtml ? window.escapeHtml(chip.label) : chip.label;
        chipEl.innerHTML = `
          ${safeLabel}
          <button aria-label="Remove filter"><i class="fa-solid fa-xmark"></i></button>
        `;
        chipEl.querySelector('button').addEventListener('click', chip.onRemove);
        activeChipsList.appendChild(chipEl);
      });
    } else {
      activeFilterBar.style.display = 'none';
    }
  }

  function updateActiveFilterBar() {
    renderActiveFilterBar();
  }

  document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    const sortSelect = document.getElementById('sortSelect');
    const clearAllFiltersBtn = document.getElementById('clearAllFiltersBtn');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const val = e.target.value;
        if (clearSearchBtn) clearSearchBtn.style.display = val ? 'flex' : 'none';

        clearTimeout(searchDebounceTimer);
        searchDebounceTimer = setTimeout(() => {
          if (window.notesStore) {
            window.notesStore.setSearch(val);
            updateActiveFilterBar();
            if (typeof window.refreshNotesView === 'function') window.refreshNotesView();
          }
        }, 280);
      });
    }

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        clearSearchBtn.style.display = 'none';
        if (window.notesStore) {
          window.notesStore.setSearch('');
          updateActiveFilterBar();
          if (typeof window.refreshNotesView === 'function') window.refreshNotesView();
        }
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        if (window.notesStore) {
          window.notesStore.setSort(e.target.value);
          if (typeof window.refreshNotesView === 'function') window.refreshNotesView();
        }
      });
    }

    if (clearAllFiltersBtn) {
      clearAllFiltersBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        if (clearSearchBtn) clearSearchBtn.style.display = 'none';
        if (window.notesStore) {
          window.notesStore.clearFilters();
          if (typeof window.renderSubjectPills === 'function') window.renderSubjectPills();
          updateActiveFilterBar();
          if (typeof window.refreshNotesView === 'function') window.refreshNotesView();
        }
      });
    }
  });

  window.renderActiveFilterBar = renderActiveFilterBar;
  window.updateActiveFilterBar = updateActiveFilterBar;
})();
