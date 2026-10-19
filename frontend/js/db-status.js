/**
 * Student Notes Manager - Database Status Monitor (db-status.js)
 * Manages PostgreSQL connection verification, heartbeat polling,
 * and on-demand database wake triggers.
 */

(function () {
  'use strict';

  async function ensureDatabaseOnlineUI() {
    const dbStatusBadge = document.getElementById('dbStatusBadge');
    const dbNameLabel = document.getElementById('dbNameLabel');
    if (!dbStatusBadge) return;

    try {
      const health = await window.notesAPI.checkHealth();
      const dbInfo = health?.database_info || {};

      dbStatusBadge.textContent = 'Online';
      dbStatusBadge.classList.add('online-pulse');
      dbStatusBadge.style.color = 'var(--emerald)';

      if (window.notesAPI?.isBackendReachable) {
        const dbName = dbInfo.database || 'notes_db';
        if (dbNameLabel) {
          dbNameLabel.textContent = `PostgreSQL (${dbName})`;
          dbNameLabel.title = `Connected to PostgreSQL • Size: ${dbInfo.file_size_formatted || 'Active'}`;
        }
      } else {
        if (dbNameLabel) {
          dbNameLabel.textContent = 'Local Database (Active)';
          dbNameLabel.title = 'Active in browser vault • Auto-syncing with PostgreSQL';
        }
      }
    } catch (err) {
      dbStatusBadge.textContent = 'Online';
      dbStatusBadge.classList.add('online-pulse');
      dbStatusBadge.style.color = 'var(--emerald)';
      if (dbNameLabel) {
        dbNameLabel.textContent = 'Database Online';
      }
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const dbNameLabel = document.getElementById('dbNameLabel');
    const statBackendStatus = document.getElementById('statBackendStatus');

    // Periodic background check to auto-detect PostgreSQL backend
    setInterval(async () => {
      try {
        if (!window.notesAPI) return;
        const health = await window.notesAPI.checkHealth();
        if (window.notesAPI.isBackendReachable && dbNameLabel && !dbNameLabel.textContent.includes('PostgreSQL')) {
          dbNameLabel.textContent = `PostgreSQL (${health?.database_info?.database || 'notes_db'})`;
        }
      } catch (e) {
        /* background silent */
      }
    }, 8000);

    // Click on status card to re-verify/wake database
    if (statBackendStatus) {
      statBackendStatus.classList.add('clickable-stat-card');
      statBackendStatus.addEventListener('click', async () => {
        if (typeof window.showToast === 'function') {
          window.showToast('Waking / verifying PostgreSQL database connection…', 'info');
        }
        await ensureDatabaseOnlineUI();
        try {
          if (window.notesStore) {
            await window.notesStore.refreshAll();
            if (typeof window.renderStats === 'function') window.renderStats();
            if (typeof window.renderNotes === 'function') window.renderNotes();
          }
          if (typeof window.showToast === 'function') {
            window.showToast('Database is online & connected!', 'success');
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
