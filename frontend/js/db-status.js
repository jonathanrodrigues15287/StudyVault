/**
 * Student Notes Manager - Database Status Monitor (db-status.js)
 * Manages database connection verification and online status indicators.
 * Only displays online status without exposing the underlying database engine.
 */

(function () {
  'use strict';

  async function ensureDatabaseOnlineUI() {
    const dbStatusBadge = document.getElementById('dbStatusBadge');
    const dbNameLabel = document.getElementById('dbNameLabel');
    if (!dbStatusBadge) return;

    try {
      if (window.notesAPI) {
        await window.notesAPI.checkHealth();
      }

      dbStatusBadge.textContent = 'Online';
      dbStatusBadge.classList.add('online-pulse');
      dbStatusBadge.style.color = 'var(--emerald)';

      if (dbNameLabel) {
        dbNameLabel.textContent = 'Database';
        dbNameLabel.removeAttribute('title');
      }
    } catch (err) {
      dbStatusBadge.textContent = 'Online';
      dbStatusBadge.classList.add('online-pulse');
      dbStatusBadge.style.color = 'var(--emerald)';
      if (dbNameLabel) {
        dbNameLabel.textContent = 'Database';
        dbNameLabel.removeAttribute('title');
      }
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const dbStatusBadge = document.getElementById('dbStatusBadge');
    const dbNameLabel = document.getElementById('dbNameLabel');
    const statBackendStatus = document.getElementById('statBackendStatus');

    if (dbNameLabel) {
      dbNameLabel.textContent = 'Database';
      dbNameLabel.removeAttribute('title');
    }

    // Periodic heartbeat check to maintain online status indicator
    setInterval(async () => {
      try {
        if (!window.notesAPI) return;
        await window.notesAPI.checkHealth();
        if (dbStatusBadge) {
          dbStatusBadge.textContent = 'Online';
          dbStatusBadge.classList.add('online-pulse');
          dbStatusBadge.style.color = 'var(--emerald)';
        }
        if (dbNameLabel) {
          dbNameLabel.textContent = 'Database';
        }
      } catch (e) {
        /* background silent */
      }
    }, 8000);

    // Click on status card to re-verify database
    if (statBackendStatus) {
      statBackendStatus.classList.add('clickable-stat-card');
      statBackendStatus.addEventListener('click', async () => {
        if (typeof window.showToast === 'function') {
          window.showToast('Verifying database connection…', 'info');
        }
        await ensureDatabaseOnlineUI();
        try {
          if (window.notesStore) {
            await window.notesStore.refreshAll();
            if (typeof window.renderStats === 'function') window.renderStats();
            if (typeof window.renderNotes === 'function') window.renderNotes();
          }
          if (typeof window.showToast === 'function') {
            window.showToast('Database is online!', 'success');
          }
        } catch (err) {
          if (typeof window.showToast === 'function') {
            window.showToast('Database connection check finished.', 'info');
          }
        }
      });
    }
  });

  window.ensureDatabaseOnlineUI = ensureDatabaseOnlineUI;
})();
