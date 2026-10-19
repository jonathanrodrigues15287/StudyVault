/**
 * Student Notes Manager - Theme Manager (theme.js)
 * Manages dark/light mode toggle and persistence in localStorage.
 */

(function () {
  'use strict';

  function initTheme() {
    const savedTheme = localStorage.getItem('notes_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('notes_theme', newTheme);
    if (typeof window.showToast === 'function') {
      window.showToast(`Switched to ${newTheme} mode`, 'info');
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', toggleTheme);
    }
  });

  window.initTheme = initTheme;
  window.toggleTheme = toggleTheme;
})();
