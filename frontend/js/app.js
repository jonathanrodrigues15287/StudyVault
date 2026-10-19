/**
 * Student Notes Manager - Main Application Orchestrator (app.js)
 * Bootstraps the application, coordinates modules, and binds global keyboard shortcuts.
 */

(function () {
  'use strict';

  async function initializeApp() {
    if (typeof window.initTheme === 'function') {
      window.initTheme();
    }

    if (window.notesStore && typeof window.applyViewMode === 'function') {
      window.applyViewMode(window.notesStore.viewMode);
    }

    if (typeof window.updateAuthUI === 'function') {
      window.updateAuthUI();
    }

    // Ensure database comes online whenever the app is opened
    if (typeof window.ensureDatabaseOnlineUI === 'function') {
      await window.ensureDatabaseOnlineUI();
    }

    try {
      if (window.notesStore) {
        await window.notesStore.refreshAll();
      }
      if (typeof window.renderStats === 'function') window.renderStats();
      if (typeof window.renderSubjectPills === 'function') window.renderSubjectPills();
      if (typeof window.renderNotes === 'function') window.renderNotes();

      // Populate subject autocomplete datalist
      if (window.notesAPI && typeof window.updateSuggestedDatalist === 'function') {
        try {
          const subjectNames = await window.notesAPI.getSubjects();
          window.updateSuggestedDatalist(subjectNames);
        } catch (e) {
          /* non-critical */
        }
      }
    } catch (err) {
      console.warn('Initial data load warning:', err);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Global Keyboard Shortcuts (Escape to close any active modal)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (typeof window.closeEditorModal === 'function') window.closeEditorModal();
        if (typeof window.closePreviewModal === 'function') window.closePreviewModal();
        if (typeof window.closeOcrModal === 'function') window.closeOcrModal();
        if (typeof window.closeVoiceModal === 'function') window.closeVoiceModal();
        if (typeof window.closeSubjectsModal === 'function') window.closeSubjectsModal();
        if (typeof window.closeAuthModal === 'function') window.closeAuthModal();
      }
    });

    // Start application
    initializeApp();
  });

  window.initializeApp = initializeApp;
})();
