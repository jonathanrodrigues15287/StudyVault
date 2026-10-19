/**
 * Student Notes Manager - Subjects Manager Modal (subjects.js)
 * Manages custom academic subjects, color indicators, subject badges,
 * and datalist autocomplete suggestions.
 */

(function () {
  'use strict';

  function openSubjectsModal() {
    const subjectsManagerModal = document.getElementById('subjectsManagerModal');
    const newSubjectNameInput = document.getElementById('newSubjectNameInput');
    const newSubjectColorInput = document.getElementById('newSubjectColorInput');
    const subjectColorPicker = document.getElementById('subjectColorPicker');

    if (!subjectsManagerModal) return;

    subjectsManagerModal.classList.add('active');
    subjectsManagerModal.setAttribute('aria-hidden', 'false');

    if (newSubjectNameInput) newSubjectNameInput.value = '';
    if (newSubjectColorInput) newSubjectColorInput.value = 'blue';

    if (subjectColorPicker) {
      subjectColorPicker.querySelectorAll('.color-dot').forEach(d => {
        d.classList.toggle('active', d.getAttribute('data-color') === 'blue');
      });
    }

    loadAndRenderSubjects();
    setTimeout(() => {
      if (newSubjectNameInput) newSubjectNameInput.focus();
    }, 100);
  }

  function closeSubjectsModal() {
    const subjectsManagerModal = document.getElementById('subjectsManagerModal');
    if (subjectsManagerModal) {
      subjectsManagerModal.classList.remove('active');
      subjectsManagerModal.setAttribute('aria-hidden', 'true');
    }
  }

  async function loadAndRenderSubjects() {
    try {
      if (!window.notesAPI) return;
      const subjects = await window.notesAPI.getSubjectDetails();
      renderSubjectsList(subjects);
      updateSuggestedDatalist(subjects.map(s => s.name));
    } catch (err) {
      console.error('Failed to load subject details:', err);
      if (typeof window.showToast === 'function') {
        window.showToast('Could not load subjects list', 'error');
      }
    }
  }

  function renderSubjectsList(subjects) {
    const subjectsCountBadge = document.getElementById('subjectsCountBadge');
    const subjectsEmptyState = document.getElementById('subjectsEmptyState');
    const subjectsList = document.getElementById('subjectsList');

    if (subjectsCountBadge) subjectsCountBadge.textContent = subjects ? subjects.length : 0;

    if (!subjectsList) return;

    if (!subjects || subjects.length === 0) {
      subjectsList.innerHTML = '';
      if (subjectsEmptyState) subjectsEmptyState.style.display = 'flex';
      return;
    }

    if (subjectsEmptyState) subjectsEmptyState.style.display = 'none';
    subjectsList.innerHTML = '';

    subjects.forEach(subj => {
      const item = document.createElement('div');
      item.className = 'subject-item';
      const safeName = window.escapeHtml ? window.escapeHtml(subj.name) : subj.name;
      item.innerHTML = `
        <span class="subject-color-indicator ci-${subj.color || 'blue'}"></span>
        <span class="subject-item-name">${safeName}</span>
        <span class="subject-item-count">${subj.note_count} note${subj.note_count !== 1 ? 's' : ''}</span>
        <button class="subject-delete-btn" title="Remove subject" aria-label="Delete subject ${safeName}">
          <i class="fa-solid fa-xmark"></i>
        </button>
      `;

      item.querySelector('.subject-delete-btn').addEventListener('click', async () => {
        if (!confirm(`Remove subject "${subj.name}"? Notes under it will NOT be deleted.`)) return;
        try {
          await window.notesAPI.deleteSubject(subj.name);
          if (typeof window.showToast === 'function') {
            window.showToast(`Subject "${subj.name}" removed`, 'success');
          }
          await loadAndRenderSubjects();
          if (window.notesStore) {
            await window.notesStore.refreshAll();
            if (typeof window.renderStats === 'function') window.renderStats();
            if (typeof window.renderSubjectPills === 'function') window.renderSubjectPills();
          }
        } catch (err) {
          if (typeof window.showToast === 'function') {
            window.showToast(err.message || 'Failed to delete subject', 'error');
          }
        }
      });

      subjectsList.appendChild(item);
    });
  }

  function updateSuggestedDatalist(subjectNames) {
    const suggestedSubjectsDatalist = document.getElementById('suggestedSubjects');
    if (!suggestedSubjectsDatalist || !Array.isArray(subjectNames)) return;

    suggestedSubjectsDatalist.innerHTML = subjectNames
      .map(name => {
        const safeName = window.escapeHtml ? window.escapeHtml(name) : name;
        return `<option value="${safeName}">`;
      })
      .join('');
  }

  document.addEventListener('DOMContentLoaded', () => {
    const openSubjectsModalBtn = document.getElementById('openSubjectsModalBtn');
    const closeSubjectsModalBtn = document.getElementById('closeSubjectsModalBtn');
    const closeSubjectsFooterBtn = document.getElementById('closeSubjectsFooterBtn');
    const subjectsManagerModal = document.getElementById('subjectsManagerModal');
    const subjectColorPicker = document.getElementById('subjectColorPicker');
    const newSubjectColorInput = document.getElementById('newSubjectColorInput');
    const newSubjectNameInput = document.getElementById('newSubjectNameInput');
    const addSubjectBtn = document.getElementById('addSubjectBtn');

    if (subjectColorPicker && newSubjectColorInput) {
      subjectColorPicker.querySelectorAll('.color-dot').forEach(dot => {
        dot.addEventListener('click', () => {
          subjectColorPicker.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
          dot.classList.add('active');
          newSubjectColorInput.value = dot.getAttribute('data-color');
        });
      });
    }

    if (openSubjectsModalBtn) openSubjectsModalBtn.addEventListener('click', openSubjectsModal);
    if (closeSubjectsModalBtn) closeSubjectsModalBtn.addEventListener('click', closeSubjectsModal);
    if (closeSubjectsFooterBtn) closeSubjectsFooterBtn.addEventListener('click', closeSubjectsModal);

    if (subjectsManagerModal) {
      subjectsManagerModal.addEventListener('click', (e) => {
        if (e.target === subjectsManagerModal) closeSubjectsModal();
      });
    }

    if (addSubjectBtn) {
      addSubjectBtn.addEventListener('click', async () => {
        const name = newSubjectNameInput ? newSubjectNameInput.value.trim() : '';
        if (!name) {
          if (typeof window.showToast === 'function') window.showToast('Please enter a subject name', 'error');
          if (newSubjectNameInput) newSubjectNameInput.focus();
          return;
        }

        const color = (newSubjectColorInput && newSubjectColorInput.value) || 'blue';
        addSubjectBtn.disabled = true;
        const origHtml = addSubjectBtn.innerHTML;
        addSubjectBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';

        try {
          await window.notesAPI.createSubject(name, color);
          if (newSubjectNameInput) newSubjectNameInput.value = '';
          if (typeof window.showToast === 'function') {
            window.showToast(`Subject "${name}" added!`, 'success');
          }
          await loadAndRenderSubjects();
          if (window.notesStore) {
            await window.notesStore.refreshAll();
            if (typeof window.renderStats === 'function') window.renderStats();
            if (typeof window.renderSubjectPills === 'function') window.renderSubjectPills();
          }
        } catch (err) {
          if (typeof window.showToast === 'function') {
            window.showToast(err.message || 'Failed to add subject', 'error');
          }
        } finally {
          addSubjectBtn.disabled = false;
          addSubjectBtn.innerHTML = origHtml;
        }
      });
    }

    if (newSubjectNameInput) {
      newSubjectNameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (addSubjectBtn) addSubjectBtn.click();
        }
      });
    }
  });

  window.openSubjectsModal = openSubjectsModal;
  window.closeSubjectsModal = closeSubjectsModal;
  window.loadAndRenderSubjects = loadAndRenderSubjects;
  window.updateSuggestedDatalist = updateSuggestedDatalist;
})();
