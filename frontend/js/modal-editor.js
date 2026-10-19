/**
 * Student Notes Manager - Note Editor Modal Controller (modal-editor.js)
 * Manages note creation and editing modal, color picker, validation, and form submission.
 */

(function () {
  'use strict';

  function openEditorModal(note = null) {
    const noteEditorModal = document.getElementById('noteEditorModal');
    const noteForm = document.getElementById('noteForm');
    const modalTitle = document.getElementById('modalTitle');
    const saveBtnText = document.getElementById('saveBtnText');
    const editNoteId = document.getElementById('editNoteId');
    const noteTitleInput = document.getElementById('noteTitleInput');
    const noteSubjectInput = document.getElementById('noteSubjectInput');
    const noteTagsInput = document.getElementById('noteTagsInput');
    const noteContentInput = document.getElementById('noteContentInput');
    const notePinCheckbox = document.getElementById('notePinCheckbox');
    const noteColorInput = document.getElementById('noteColorInput');
    const colorPickerGroup = document.getElementById('colorPickerGroup');

    if (!noteEditorModal || !noteForm) return;

    noteForm.reset();

    if (note && note.id) {
      // Existing note edit
      if (modalTitle) modalTitle.textContent = 'Edit Note';
      if (saveBtnText) saveBtnText.textContent = 'Update Note';
      if (editNoteId) editNoteId.value = String(note.id);
      if (noteTitleInput) noteTitleInput.value = note.title || '';
      if (noteSubjectInput) noteSubjectInput.value = note.subject || '';
      if (noteTagsInput) {
        noteTagsInput.value = (note.tags && note.tags.length > 0)
          ? (Array.isArray(note.tags) ? note.tags.join(', ') : note.tags)
          : '';
      }
      if (noteContentInput) noteContentInput.value = note.content || '';
      if (notePinCheckbox) notePinCheckbox.checked = !!note.is_pinned;
      if (noteColorInput) noteColorInput.value = note.color || 'default';
    } else {
      // New note creation (either blank or pre-filled from OCR / Voice)
      if (modalTitle) modalTitle.textContent = 'Create New Note';
      if (saveBtnText) saveBtnText.textContent = 'Save Note';
      if (editNoteId) editNoteId.value = '';

      if (note) {
        // Pre-filled from OCR or Voice
        if (noteTitleInput) noteTitleInput.value = note.title || '';
        if (noteSubjectInput) noteSubjectInput.value = note.subject || '';
        if (noteTagsInput) {
          noteTagsInput.value = (note.tags && note.tags.length > 0)
            ? (Array.isArray(note.tags) ? note.tags.join(', ') : note.tags)
            : '';
        }
        if (noteContentInput) noteContentInput.value = note.content || '';
        if (notePinCheckbox) notePinCheckbox.checked = !!note.is_pinned;
        if (noteColorInput) noteColorInput.value = note.color || 'blue';
      } else {
        const currentSub = window.notesStore ? window.notesStore.filters.subject : '';
        if (noteSubjectInput) noteSubjectInput.value = (currentSub && currentSub !== 'all') ? currentSub : '';
        if (noteColorInput) noteColorInput.value = 'default';
        if (notePinCheckbox) notePinCheckbox.checked = false;
      }
    }

    // Update active color dot
    if (colorPickerGroup && noteColorInput) {
      colorPickerGroup.querySelectorAll('.color-dot').forEach(dot => {
        dot.classList.toggle('active', dot.getAttribute('data-color') === noteColorInput.value);
      });
    }

    updateCharCount();
    noteEditorModal.classList.add('active');
    noteEditorModal.setAttribute('aria-hidden', 'false');
    setTimeout(() => {
      if (noteTitleInput) noteTitleInput.focus();
    }, 100);
  }

  function closeEditorModal() {
    const noteEditorModal = document.getElementById('noteEditorModal');
    if (typeof window.stopEditorDictation === 'function') {
      window.stopEditorDictation();
    }
    if (noteEditorModal) {
      noteEditorModal.classList.remove('active');
      noteEditorModal.setAttribute('aria-hidden', 'true');
    }
  }

  function updateCharCount() {
    const noteContentInput = document.getElementById('noteContentInput');
    const editorCharCount = document.getElementById('editorCharCount');
    if (!noteContentInput || !editorCharCount) return;

    const len = noteContentInput.value.length;
    editorCharCount.textContent = `${len} character${len === 1 ? '' : 's'}`;
  }

  document.addEventListener('DOMContentLoaded', () => {
    const noteEditorModal = document.getElementById('noteEditorModal');
    const openCreateModalBtn = document.getElementById('openCreateModalBtn');
    const emptyCreateBtn = document.getElementById('emptyCreateBtn');
    const closeEditorModalBtn = document.getElementById('closeEditorModalBtn');
    const cancelEditorModalBtn = document.getElementById('cancelEditorModalBtn');
    const noteForm = document.getElementById('noteForm');
    const noteTitleInput = document.getElementById('noteTitleInput');
    const noteSubjectInput = document.getElementById('noteSubjectInput');
    const noteTagsInput = document.getElementById('noteTagsInput');
    const noteContentInput = document.getElementById('noteContentInput');
    const notePinCheckbox = document.getElementById('notePinCheckbox');
    const noteColorInput = document.getElementById('noteColorInput');
    const colorPickerGroup = document.getElementById('colorPickerGroup');

    if (noteContentInput) {
      noteContentInput.addEventListener('input', updateCharCount);
    }

    if (colorPickerGroup && noteColorInput) {
      colorPickerGroup.querySelectorAll('.color-dot').forEach(dot => {
        dot.addEventListener('click', () => {
          colorPickerGroup.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
          dot.classList.add('active');
          noteColorInput.value = dot.getAttribute('data-color');
        });
      });
    }

    if (openCreateModalBtn) openCreateModalBtn.addEventListener('click', () => openEditorModal());
    if (emptyCreateBtn) emptyCreateBtn.addEventListener('click', () => openEditorModal());

    if (closeEditorModalBtn) closeEditorModalBtn.addEventListener('click', closeEditorModal);
    if (cancelEditorModalBtn) cancelEditorModalBtn.addEventListener('click', closeEditorModal);

    if (noteEditorModal) {
      noteEditorModal.addEventListener('click', (e) => {
        if (e.target === noteEditorModal) closeEditorModal();
      });
    }

    if (noteForm) {
      noteForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = noteTitleInput ? noteTitleInput.value.trim() : '';
        const content = noteContentInput ? noteContentInput.value.trim() : '';
        const subject = (noteSubjectInput && noteSubjectInput.value.trim()) || 'General';
        const tags = noteTagsInput ? noteTagsInput.value : '';
        const is_pinned = notePinCheckbox ? notePinCheckbox.checked : false;
        const color = (noteColorInput && noteColorInput.value) || 'default';
        const editNoteId = document.getElementById('editNoteId');
        const id = editNoteId && editNoteId.value ? editNoteId.value.trim() : '';

        if (!title) {
          if (typeof window.showToast === 'function') window.showToast('Please provide a note title', 'error');
          if (noteTitleInput) noteTitleInput.focus();
          return;
        }

        if (!content) {
          if (typeof window.showToast === 'function') window.showToast('Note content cannot be empty', 'error');
          if (noteContentInput) noteContentInput.focus();
          return;
        }

        const payload = { title, content, subject, tags, is_pinned, color };

        try {
          const isEdit = Boolean(id && id !== 'undefined' && id !== 'null' && !isNaN(parseInt(id, 10)));
          if (isEdit) {
            await window.notesStore.updateNote(parseInt(id, 10), payload);
            if (typeof window.showToast === 'function') {
              window.showToast('Note updated & saved to database!', 'success');
            }
          } else {
            await window.notesStore.addNote(payload);
            if (typeof window.showToast === 'function') {
              window.showToast('New note created & saved to database!', 'success');
            }
          }
          closeEditorModal();
          if (typeof window.renderStats === 'function') window.renderStats();
          if (typeof window.renderSubjectPills === 'function') window.renderSubjectPills();
          if (typeof window.renderNotes === 'function') window.renderNotes();
        } catch (err) {
          if (typeof window.showToast === 'function') {
            window.showToast(err.message || 'Failed to save note', 'error');
          }
        }
      });
    }
  });

  window.openEditorModal = openEditorModal;
  window.closeEditorModal = closeEditorModal;
  window.updateCharCount = updateCharCount;
})();
