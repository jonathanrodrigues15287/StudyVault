/**
 * Student Notes Manager - Notes View & Rendering Controller (notes-view.js)
 * Manages note card components, grid/list view layouts, subject pills,
 * and statistical summary counters.
 */

(function () {
  'use strict';

  function applyViewMode(mode) {
    const notesContainer = document.getElementById('notesContainer');
    const viewGridBtn = document.getElementById('viewGridBtn');
    const viewListBtn = document.getElementById('viewListBtn');

    if (window.notesStore) {
      window.notesStore.setViewMode(mode);
    }

    if (!notesContainer) return;

    if (mode === 'list') {
      notesContainer.classList.remove('grid-layout');
      notesContainer.classList.add('list-layout');
      if (viewListBtn) viewListBtn.classList.add('active');
      if (viewGridBtn) viewGridBtn.classList.remove('active');
    } else {
      notesContainer.classList.remove('list-layout');
      notesContainer.classList.add('grid-layout');
      if (viewGridBtn) viewGridBtn.classList.add('active');
      if (viewListBtn) viewListBtn.classList.remove('active');
    }
  }

  function renderStats() {
    const statsTotalCount = document.getElementById('statsTotalCount');
    const statsSubjectCount = document.getElementById('statsSubjectCount');
    const statsPinnedCount = document.getElementById('statsPinnedCount');

    if (!window.notesStore) return;
    const stats = window.notesStore.stats || {};
    if (statsTotalCount) statsTotalCount.textContent = stats.total_notes || 0;
    if (statsSubjectCount) statsSubjectCount.textContent = stats.total_subjects || 0;
    if (statsPinnedCount) statsPinnedCount.textContent = stats.total_pinned || 0;
  }

  function renderSubjectPills() {
    const subjectPillsContainer = document.getElementById('subjectPillsContainer');
    if (!subjectPillsContainer || !window.notesStore) return;

    const subjects = window.notesStore.subjects || [];
    const activeSubject = window.notesStore.filters.subject || 'all';

    subjectPillsContainer.innerHTML = `
      <button class="pill-btn ${activeSubject === 'all' ? 'active' : ''}" data-subject="all">
        All Notes
      </button>
    `;

    subjects.forEach(subject => {
      const btn = document.createElement('button');
      btn.className = `pill-btn ${activeSubject.toLowerCase() === subject.toLowerCase() ? 'active' : ''}`;
      btn.setAttribute('data-subject', subject);
      btn.textContent = subject;
      subjectPillsContainer.appendChild(btn);
    });

    subjectPillsContainer.querySelectorAll('.pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const selectedSubject = btn.getAttribute('data-subject');
        window.notesStore.setSubject(selectedSubject);
        if (typeof window.updateActiveFilterBar === 'function') window.updateActiveFilterBar();
        renderSubjectPills();
        refreshNotesView();
      });
    });
  }

  function renderNotes() {
    const notesContainer = document.getElementById('notesContainer');
    const emptyState = document.getElementById('emptyState');
    const loadingState = document.getElementById('loadingState');

    if (!notesContainer || !window.notesStore) return;
    const notes = window.notesStore.notes;

    if (loadingState) loadingState.style.display = 'none';

    if (!notes || notes.length === 0) {
      notesContainer.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    notesContainer.innerHTML = '';

    notes.forEach(note => {
      const card = createNoteCardElement(note);
      notesContainer.appendChild(card);
    });
  }

  function createNoteCardElement(note) {
    const card = document.createElement('div');
    const colorClass = note.color ? `theme-${note.color}` : 'theme-default';
    card.className = `note-card ${colorClass} ${note.is_pinned ? 'is-pinned' : ''}`;
    card.setAttribute('data-id', note.id);

    const formattedDate = window.formatRelativeTime ? window.formatRelativeTime(note.updated_at || note.created_at) : 'Recently';
    const wordCount = window.countWords ? window.countWords(note.content) : 0;
    const safeSubject = window.escapeHtml ? window.escapeHtml(note.subject || 'General') : note.subject;
    const safeTitle = window.escapeHtml ? window.escapeHtml(note.title || '') : note.title;
    const safeContent = window.escapeHtml ? window.escapeHtml(note.content || '') : note.content;

    // Tags HTML
    const tagsHtml = (note.tags && note.tags.length > 0)
      ? note.tags.map(t => {
          const safeTag = window.escapeHtml ? window.escapeHtml(t) : t;
          return `<span class="note-tag" data-tag="${safeTag}">#${safeTag}</span>`;
        }).join('')
      : '';

    card.innerHTML = `
      <div class="card-top-row">
        <span class="subject-badge" title="${safeSubject}">${safeSubject}</span>
        <div class="card-actions-quick">
          <button class="card-icon-btn ${note.is_pinned ? 'pinned' : ''} pin-btn" title="${note.is_pinned ? 'Unpin note' : 'Pin note'}" aria-label="Toggle pin">
            <i class="fa-solid fa-thumbtack"></i>
          </button>
          <button class="card-icon-btn edit-card-btn" title="Edit note" aria-label="Edit note">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="card-icon-btn delete delete-card-btn" title="Delete note" aria-label="Delete note">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </div>
      </div>

      <h3 class="card-title">${safeTitle}</h3>
      <p class="card-snippet">${safeContent}</p>

      ${tagsHtml ? `<div class="card-tags">${tagsHtml}</div>` : ''}

      <div class="card-footer">
        <div style="display: flex; align-items: center; gap: 0.35rem; flex-wrap: wrap;">
          ${note.author ? `<span class="note-author-tag" title="Author: ${window.escapeHtml ? window.escapeHtml(note.author) : note.author}"><i class="fa-solid fa-user"></i> ${window.escapeHtml ? window.escapeHtml(note.author) : note.author}</span>` : ''}
          <span class="timestamp-badge"><i class="fa-regular fa-clock"></i> ${formattedDate}</span>
        </div>
        <span class="word-badge">${wordCount} words</span>
      </div>
    `;

    // Click card opens preview
    card.addEventListener('click', (e) => {
      if (e.target.closest('.card-actions-quick') || e.target.closest('.note-tag')) {
        return;
      }
      if (typeof window.openPreviewModal === 'function') {
        window.openPreviewModal(note);
      }
    });

    // Pin button click
    const pinBtn = card.querySelector('.pin-btn');
    if (pinBtn) {
      pinBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        try {
          await window.notesStore.togglePin(note.id);
          if (typeof window.showToast === 'function') {
            window.showToast(note.is_pinned ? 'Note unpinned' : 'Note pinned to top', 'success');
          }
          refreshNotesView();
        } catch (err) {
          if (typeof window.showToast === 'function') {
            window.showToast('Failed to update pin status', 'error');
          }
        }
      });
    }

    // Edit button click
    const editBtn = card.querySelector('.edit-card-btn');
    if (editBtn) {
      editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (typeof window.openEditorModal === 'function') {
          window.openEditorModal(note);
        }
      });
    }

    // Delete button click
    const deleteBtn = card.querySelector('.delete-card-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (confirm(`Are you sure you want to delete note "${note.title}"?`)) {
          try {
            await window.notesStore.removeNote(note.id);
            if (typeof window.showToast === 'function') {
              window.showToast('Note deleted successfully', 'success');
            }
            refreshNotesView();
          } catch (err) {
            if (typeof window.showToast === 'function') {
              window.showToast('Failed to delete note', 'error');
            }
          }
        }
      });
    }

    // Tag click filters by tag
    card.querySelectorAll('.note-tag').forEach(tagEl => {
      tagEl.addEventListener('click', (e) => {
        e.stopPropagation();
        const tag = tagEl.getAttribute('data-tag');
        if (window.notesStore) {
          window.notesStore.setTag(tag);
          if (typeof window.updateActiveFilterBar === 'function') window.updateActiveFilterBar();
          refreshNotesView();
        }
      });
    });

    return card;
  }

  async function refreshNotesView() {
    const notesContainer = document.getElementById('notesContainer');
    const emptyState = document.getElementById('emptyState');
    const loadingState = document.getElementById('loadingState');

    if (loadingState) loadingState.style.display = 'flex';
    if (emptyState) emptyState.style.display = 'none';

    try {
      if (window.notesStore) {
        await window.notesStore.loadNotes();
      }
      renderNotes();
      if (typeof window.renderActiveFilterBar === 'function') {
        window.renderActiveFilterBar();
      }
    } catch (err) {
      if (loadingState) loadingState.style.display = 'none';
      if (typeof window.showToast === 'function') {
        window.showToast('Could not load notes. Check backend connection.', 'error');
      }
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const viewGridBtn = document.getElementById('viewGridBtn');
    const viewListBtn = document.getElementById('viewListBtn');

    if (viewGridBtn) {
      viewGridBtn.addEventListener('click', () => applyViewMode('grid'));
    }
    if (viewListBtn) {
      viewListBtn.addEventListener('click', () => applyViewMode('list'));
    }
  });

  window.applyViewMode = applyViewMode;
  window.renderStats = renderStats;
  window.renderSubjectPills = renderSubjectPills;
  window.renderNotes = renderNotes;
  window.createNoteCardElement = createNoteCardElement;
  window.refreshNotesView = refreshNotesView;
})();
