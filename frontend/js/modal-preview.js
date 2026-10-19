/**
 * Student Notes Manager - Note Preview Modal Controller (modal-preview.js)
 * Manages full note viewing, reading time metrics, copying to clipboard,
 * and quick edit/delete actions from the preview view.
 */

(function () {
  'use strict';

  let currentPreviewNoteId = null;

  function openPreviewModal(note) {
    const notePreviewModal = document.getElementById('notePreviewModal');
    const previewTitle = document.getElementById('previewTitle');
    const previewSubject = document.getElementById('previewSubject');
    const previewDate = document.getElementById('previewDate');
    const previewPinnedBadge = document.getElementById('previewPinnedBadge');
    const previewTagsList = document.getElementById('previewTagsList');
    const previewContent = document.getElementById('previewContent');
    const previewWordCount = document.getElementById('previewWordCount');
    const previewReadTime = document.getElementById('previewReadTime');

    if (!notePreviewModal) return;

    currentPreviewNoteId = note.id;

    if (previewTitle) previewTitle.textContent = note.title;
    if (previewSubject) previewSubject.textContent = note.subject || 'General';

    const authorMeta = note.author && window.escapeHtml
      ? ` &bull; <i class="fa-solid fa-user"></i> ${window.escapeHtml(note.author)}`
      : '';
    const fullDate = window.formatFullDate
      ? window.formatFullDate(note.updated_at || note.created_at)
      : 'Unknown date';

    if (previewDate) {
      previewDate.innerHTML = `<i class="fa-regular fa-clock"></i> ${fullDate}${authorMeta}`;
    }

    if (previewPinnedBadge) {
      previewPinnedBadge.style.display = note.is_pinned ? 'inline-flex' : 'none';
    }

    // Tags
    if (previewTagsList) {
      previewTagsList.innerHTML = '';
      if (note.tags && note.tags.length > 0) {
        note.tags.forEach(t => {
          const tagSpan = document.createElement('span');
          tagSpan.className = 'note-tag';
          tagSpan.textContent = `#${t}`;
          previewTagsList.appendChild(tagSpan);
        });
        previewTagsList.style.display = 'flex';
      } else {
        previewTagsList.style.display = 'none';
      }
    }

    // Content
    if (previewContent) previewContent.textContent = note.content;

    // Word count & read time
    const words = window.countWords ? window.countWords(note.content) : 0;
    if (previewWordCount) {
      previewWordCount.innerHTML = `<i class="fa-solid fa-font"></i> ${words} words`;
    }
    const readMinutes = Math.max(1, Math.ceil(words / 200));
    if (previewReadTime) {
      previewReadTime.innerHTML = `<i class="fa-solid fa-stopwatch"></i> ${readMinutes} min read`;
    }

    notePreviewModal.classList.add('active');
    notePreviewModal.setAttribute('aria-hidden', 'false');
  }

  function closePreviewModal() {
    const notePreviewModal = document.getElementById('notePreviewModal');
    if (notePreviewModal) {
      notePreviewModal.classList.remove('active');
      notePreviewModal.setAttribute('aria-hidden', 'true');
    }
    currentPreviewNoteId = null;
  }

  document.addEventListener('DOMContentLoaded', () => {
    const notePreviewModal = document.getElementById('notePreviewModal');
    const closePreviewModalBtn = document.getElementById('closePreviewModalBtn');
    const copyNoteContentBtn = document.getElementById('copyNoteContentBtn');
    const previewEditBtn = document.getElementById('previewEditBtn');
    const previewDeleteBtn = document.getElementById('previewDeleteBtn');

    if (closePreviewModalBtn) closePreviewModalBtn.addEventListener('click', closePreviewModal);

    if (notePreviewModal) {
      notePreviewModal.addEventListener('click', (e) => {
        if (e.target === notePreviewModal) closePreviewModal();
      });
    }

    // Copy note content
    if (copyNoteContentBtn) {
      copyNoteContentBtn.addEventListener('click', async () => {
        if (!currentPreviewNoteId || !window.notesStore) return;
        const note = window.notesStore.findNoteById(currentPreviewNoteId);
        if (!note) return;

        try {
          const fullText = `${note.title}\n\nSubject: ${note.subject}\n\n${note.content}`;
          await navigator.clipboard.writeText(fullText);
          if (typeof window.showToast === 'function') {
            window.showToast('Note copied to clipboard!', 'success');
          }
        } catch (err) {
          if (typeof window.showToast === 'function') {
            window.showToast('Could not copy to clipboard', 'error');
          }
        }
      });
    }

    // Edit from preview
    if (previewEditBtn) {
      previewEditBtn.addEventListener('click', () => {
        if (!currentPreviewNoteId || !window.notesStore) return;
        const note = window.notesStore.findNoteById(currentPreviewNoteId);
        if (!note) return;
        closePreviewModal();
        if (typeof window.openEditorModal === 'function') {
          window.openEditorModal(note);
        }
      });
    }

    // Delete from preview
    if (previewDeleteBtn) {
      previewDeleteBtn.addEventListener('click', async () => {
        if (!currentPreviewNoteId || !window.notesStore) return;
        const note = window.notesStore.findNoteById(currentPreviewNoteId);
        if (!note) return;

        if (confirm(`Delete "${note.title}"?`)) {
          try {
            await window.notesStore.removeNote(note.id);
            closePreviewModal();
            if (typeof window.showToast === 'function') {
              window.showToast('Note deleted successfully', 'success');
            }
            if (typeof window.renderStats === 'function') window.renderStats();
            if (typeof window.renderSubjectPills === 'function') window.renderSubjectPills();
            if (typeof window.renderNotes === 'function') window.renderNotes();
          } catch (err) {
            if (typeof window.showToast === 'function') {
              window.showToast('Failed to delete note', 'error');
            }
          }
        }
      });
    }
  });

  window.openPreviewModal = openPreviewModal;
  window.closePreviewModal = closePreviewModal;
})();
