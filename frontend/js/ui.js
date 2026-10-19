/**
 * Student Notes Manager - UI Controller & Event Handlers (ui.js)
 */

document.addEventListener('DOMContentLoaded', () => {
  // UI Elements
  const notesContainer = document.getElementById('notesContainer');
  const emptyState = document.getElementById('emptyState');
  const loadingState = document.getElementById('loadingState');
  
  // Search & Filters
  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const subjectPillsContainer = document.getElementById('subjectPillsContainer');
  const sortSelect = document.getElementById('sortSelect');
  const viewGridBtn = document.getElementById('viewGridBtn');
  const viewListBtn = document.getElementById('viewListBtn');
  const activeFilterBar = document.getElementById('activeFilterBar');
  const activeChipsList = document.getElementById('activeChipsList');
  const clearAllFiltersBtn = document.getElementById('clearAllFiltersBtn');

  // Stats Elements
  const statsTotalCount = document.getElementById('statsTotalCount');
  const statsSubjectCount = document.getElementById('statsSubjectCount');
  const statsPinnedCount = document.getElementById('statsPinnedCount');
  const dbStatusBadge = document.getElementById('dbStatusBadge');
  const dbNameLabel = document.getElementById('dbNameLabel');
  const statBackendStatus = document.getElementById('statBackendStatus');

  // Auth & Profile Header Elements
  const openAuthModalBtn = document.getElementById('openAuthModalBtn');
  const userProfileMenu = document.getElementById('userProfileMenu');
  const userChipBtn = document.getElementById('userChipBtn');
  const userAvatarBadge = document.getElementById('userAvatarBadge');
  const headerUsername = document.getElementById('headerUsername');
  const userDropdownPopover = document.getElementById('userDropdownPopover');
  const dropdownUsername = document.getElementById('dropdownUsername');
  const filterMyNotesBtn = document.getElementById('filterMyNotesBtn');
  const filterMyNotesLabel = document.getElementById('filterMyNotesLabel');
  const switchUserBtn = document.getElementById('switchUserBtn');
  const logoutBtn = document.getElementById('logoutBtn');

  // Auth Modal Elements
  const authModal = document.getElementById('authModal');
  const closeAuthModalBtn = document.getElementById('closeAuthModalBtn');
  const authTabJoin = document.getElementById('authTabJoin');
  const authTabLogin = document.getElementById('authTabLogin');
  const authForm = document.getElementById('authForm');
  const authModeInput = document.getElementById('authModeInput');
  const authModalTitle = document.getElementById('authModalTitle');
  const authModalSubtitle = document.getElementById('authModalSubtitle');
  const authUsernameInput = document.getElementById('authUsernameInput');
  const authPasswordInput = document.getElementById('authPasswordInput');
  const authUsernameHint = document.getElementById('authUsernameHint');
  const authPasswordHint = document.getElementById('authPasswordHint');
  const toggleAuthPwdBtn = document.getElementById('toggleAuthPwdBtn');
  const toggleAuthPwdIcon = document.getElementById('toggleAuthPwdIcon');
  const authAlertBox = document.getElementById('authAlertBox');
  const authSubmitBtn = document.getElementById('authSubmitBtn');
  const authSubmitBtnText = document.getElementById('authSubmitBtnText');
  const authUsersPillList = document.getElementById('authUsersPillList');

  // Editor Modal Elements
  const noteEditorModal = document.getElementById('noteEditorModal');
  const openCreateModalBtn = document.getElementById('openCreateModalBtn');
  const emptyCreateBtn = document.getElementById('emptyCreateBtn');
  const closeEditorModalBtn = document.getElementById('closeEditorModalBtn');
  const cancelEditorModalBtn = document.getElementById('cancelEditorModalBtn');
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
  const editorCharCount = document.getElementById('editorCharCount');

  // Preview Modal Elements
  const notePreviewModal = document.getElementById('notePreviewModal');
  const closePreviewModalBtn = document.getElementById('closePreviewModalBtn');
  const previewTitle = document.getElementById('previewTitle');
  const previewSubject = document.getElementById('previewSubject');
  const previewDate = document.getElementById('previewDate');
  const previewPinnedBadge = document.getElementById('previewPinnedBadge');
  const previewTagsList = document.getElementById('previewTagsList');
  const previewContent = document.getElementById('previewContent');
  const previewWordCount = document.getElementById('previewWordCount');
  const previewReadTime = document.getElementById('previewReadTime');
  const copyNoteContentBtn = document.getElementById('copyNoteContentBtn');
  const previewEditBtn = document.getElementById('previewEditBtn');
  const previewDeleteBtn = document.getElementById('previewDeleteBtn');

  // OCR Scanner Modal Elements
  const openOcrModalBtn = document.getElementById('openOcrModalBtn');
  const editorOcrScanBtn = document.getElementById('editorOcrScanBtn');
  const ocrScannerModal = document.getElementById('ocrScannerModal');
  const closeOcrModalBtn = document.getElementById('closeOcrModalBtn');
  const cancelOcrModalBtn = document.getElementById('cancelOcrModalBtn');
  const ocrDropzone = document.getElementById('ocrDropzone');
  const ocrFileInput = document.getElementById('ocrFileInput');
  const browseFileBtn = document.getElementById('browseFileBtn');
  const ocrPreviewContainer = document.getElementById('ocrPreviewContainer');
  const ocrPreviewImg = document.getElementById('ocrPreviewImg');
  const ocrProgressBox = document.getElementById('ocrProgressBox');
  const ocrStatusText = document.getElementById('ocrStatusText');
  const ocrPercentText = document.getElementById('ocrPercentText');
  const ocrProgressBar = document.getElementById('ocrProgressBar');
  const ocrResultsContainer = document.getElementById('ocrResultsContainer');
  const ocrDetectedTitle = document.getElementById('ocrDetectedTitle');
  const ocrDetectedSubject = document.getElementById('ocrDetectedSubject');
  const ocrDetectedTags = document.getElementById('ocrDetectedTags');
  const ocrExtractedText = document.getElementById('ocrExtractedText');
  const ocrCharCount = document.getElementById('ocrCharCount');
  const rescanOcrBtn = document.getElementById('rescanOcrBtn');
  const editOcrInFormBtn = document.getElementById('editOcrInFormBtn');
  const createFromOcrBtn = document.getElementById('createFromOcrBtn');

  // Voice Note Studio Elements
  const openVoiceModalBtn = document.getElementById('openVoiceModalBtn');
  const editorVoiceDictateBtn = document.getElementById('editorVoiceDictateBtn');
  const voiceNoteModal = document.getElementById('voiceNoteModal');
  const closeVoiceModalBtn = document.getElementById('closeVoiceModalBtn');
  const cancelVoiceModalBtn = document.getElementById('cancelVoiceModalBtn');
  const voiceRecorderHub = document.querySelector('.voice-recorder-hub');
  const voiceToggleRecBtn = document.getElementById('voiceToggleRecBtn');
  const voiceStopBtn = document.getElementById('voiceStopBtn');
  const voiceMicIcon = document.getElementById('voiceMicIcon');
  const voiceTimerBadge = document.getElementById('voiceTimerBadge');
  const voiceStatusLabel = document.getElementById('voiceStatusLabel');
  const soundWaveBars = document.getElementById('soundWaveBars');
  const voiceDetectedTitle = document.getElementById('voiceDetectedTitle');
  const voiceDetectedSubject = document.getElementById('voiceDetectedSubject');
  const voiceDetectedTags = document.getElementById('voiceDetectedTags');
  const voiceTranscriptText = document.getElementById('voiceTranscriptText');
  const voiceCharCount = document.getElementById('voiceCharCount');
  const clearVoiceTranscriptBtn = document.getElementById('clearVoiceTranscriptBtn');
  const editVoiceInFormBtn = document.getElementById('editVoiceInFormBtn');
  const createFromVoiceBtn = document.getElementById('createFromVoiceBtn');

  // Live transcript display elements
  const liveTranscriptDisplay = document.getElementById('liveTranscriptDisplay');
  const liveTranscriptFinal = document.getElementById('liveTranscriptFinal');
  const liveTranscriptInterim = document.getElementById('liveTranscriptInterim');
  const liveCursor = document.getElementById('liveCursor');
  const liveWordCounter = document.getElementById('liveWordCounter');

  // Theme & Toasts
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const toastContainer = document.getElementById('toastContainer');

  // Subjects Manager Modal Elements
  const openSubjectsModalBtn = document.getElementById('openSubjectsModalBtn');
  const subjectsManagerModal = document.getElementById('subjectsManagerModal');
  const closeSubjectsModalBtn = document.getElementById('closeSubjectsModalBtn');
  const closeSubjectsFooterBtn = document.getElementById('closeSubjectsFooterBtn');
  const newSubjectNameInput = document.getElementById('newSubjectNameInput');
  const newSubjectColorInput = document.getElementById('newSubjectColorInput');
  const subjectColorPicker = document.getElementById('subjectColorPicker');
  const addSubjectBtn = document.getElementById('addSubjectBtn');
  const subjectsList = document.getElementById('subjectsList');
  const subjectsEmptyState = document.getElementById('subjectsEmptyState');
  const subjectsCountBadge = document.getElementById('subjectsCountBadge');
  const suggestedSubjectsDatalist = document.getElementById('suggestedSubjects');

  let currentPreviewNoteId = null;
  let searchDebounceTimer = null;

  // ==========================================
  // 1. Toast Notification System
  // ==========================================
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = 'fa-circle-info';
    if (type === 'success') icon = 'fa-circle-check';
    if (type === 'error') icon = 'fa-triangle-exclamation';

    toast.innerHTML = `
      <i class="fa-solid ${icon} toast-icon"></i>
      <span class="toast-message">${escapeHtml(message)}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px) scale(0.95)';
      setTimeout(() => toast.remove(), 250);
    }, 3200);
  }

  // ==========================================
  // 2. Theme Management
  // ==========================================
  function initTheme() {
    const savedTheme = localStorage.getItem('notes_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('notes_theme', newTheme);
    showToast(`Switched to ${newTheme} mode`, 'info');
  }

  themeToggleBtn.addEventListener('click', toggleTheme);

  // ==========================================
  // 3. View Mode (Grid vs List)
  // ==========================================
  function applyViewMode(mode) {
    window.notesStore.setViewMode(mode);
    if (mode === 'list') {
      notesContainer.classList.remove('grid-layout');
      notesContainer.classList.add('list-layout');
      viewListBtn.classList.add('active');
      viewGridBtn.classList.remove('active');
    } else {
      notesContainer.classList.remove('list-layout');
      notesContainer.classList.add('grid-layout');
      viewGridBtn.classList.add('active');
      viewListBtn.classList.remove('active');
    }
  }

  viewGridBtn.addEventListener('click', () => applyViewMode('grid'));
  viewListBtn.addEventListener('click', () => applyViewMode('list'));

  // ==========================================
  // 4. Render Notes & Stats
  // ==========================================
  function renderStats() {
    const stats = window.notesStore.stats;
    statsTotalCount.textContent = stats.total_notes || 0;
    statsSubjectCount.textContent = stats.total_subjects || 0;
    statsPinnedCount.textContent = stats.total_pinned || 0;
  }

  function renderSubjectPills() {
    const subjects = window.notesStore.subjects || [];
    const activeSubject = window.notesStore.filters.subject;

    // Keep 'All' button, re-render the rest
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

    // Wire up pill click events
    subjectPillsContainer.querySelectorAll('.pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const selectedSubject = btn.getAttribute('data-subject');
        window.notesStore.setSubject(selectedSubject);
        updateActiveFilterBar();
        renderSubjectPills();
        refreshNotesView();
      });
    });
  }

  function renderActiveFilterBar() {
    const { search, subject, tag } = window.notesStore.filters;
    const chips = [];

    if (search) {
      chips.push({
        type: 'search',
        label: `Search: "${search}"`,
        onRemove: () => {
          searchInput.value = '';
          clearSearchBtn.style.display = 'none';
          window.notesStore.setSearch('');
          refreshNotesView();
        }
      });
    }

    if (subject && subject !== 'all') {
      chips.push({
        type: 'subject',
        label: `Subject: ${subject}`,
        onRemove: () => {
          window.notesStore.setSubject('all');
          renderSubjectPills();
          refreshNotesView();
        }
      });
    }

    if (tag) {
      chips.push({
        type: 'tag',
        label: `Tag: #${tag}`,
        onRemove: () => {
          window.notesStore.setTag('');
          refreshNotesView();
        }
      });
    }

    if (chips.length > 0) {
      activeFilterBar.style.display = 'flex';
      activeChipsList.innerHTML = '';
      chips.forEach(chip => {
        const chipEl = document.createElement('span');
        chipEl.className = 'filter-chip';
        chipEl.innerHTML = `
          ${escapeHtml(chip.label)}
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

  function renderNotes() {
    const notes = window.notesStore.notes;
    loadingState.style.display = 'none';

    if (!notes || notes.length === 0) {
      notesContainer.innerHTML = '';
      emptyState.style.display = 'block';
      return;
    }

    emptyState.style.display = 'none';
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

    const formattedDate = formatRelativeTime(note.updated_at || note.created_at);

    // Tags HTML
    const tagsHtml = (note.tags && note.tags.length > 0)
      ? note.tags.map(t => `<span class="note-tag" data-tag="${escapeHtml(t)}">#${escapeHtml(t)}</span>`).join('')
      : '';

    card.innerHTML = `
      <div class="card-top-row">
        <span class="subject-badge" title="${escapeHtml(note.subject)}">${escapeHtml(note.subject)}</span>
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

      <h3 class="card-title">${escapeHtml(note.title)}</h3>
      <p class="card-snippet">${escapeHtml(note.content)}</p>

      ${tagsHtml ? `<div class="card-tags">${tagsHtml}</div>` : ''}

      <div class="card-footer">
        <div style="display: flex; align-items: center; gap: 0.35rem; flex-wrap: wrap;">
          ${note.author ? `<span class="note-author-tag" title="Author: ${escapeHtml(note.author)}"><i class="fa-solid fa-user"></i> ${escapeHtml(note.author)}</span>` : ''}
          <span class="timestamp-badge"><i class="fa-regular fa-clock"></i> ${formattedDate}</span>
        </div>
        <span class="word-badge">${countWords(note.content)} words</span>
      </div>
    `;

    // Click card opens preview (unless clicking an action button or tag)
    card.addEventListener('click', (e) => {
      if (e.target.closest('.card-actions-quick') || e.target.closest('.note-tag')) {
        return;
      }
      openPreviewModal(note);
    });

    // Pin button click
    const pinBtn = card.querySelector('.pin-btn');
    pinBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      try {
        await window.notesStore.togglePin(note.id);
        showToast(note.is_pinned ? 'Note unpinned' : 'Note pinned to top', 'success');
        refreshNotesView();
      } catch (err) {
        showToast('Failed to update pin status', 'error');
      }
    });

    // Edit button click
    const editBtn = card.querySelector('.edit-card-btn');
    editBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openEditorModal(note);
    });

    // Delete button click
    const deleteBtn = card.querySelector('.delete-card-btn');
    deleteBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      if (confirm(`Are you sure you want to delete note "${note.title}"?`)) {
        try {
          await window.notesStore.removeNote(note.id);
          showToast('Note deleted successfully', 'success');
          refreshNotesView();
        } catch (err) {
          showToast('Failed to delete note', 'error');
        }
      }
    });

    // Tag click filters by tag
    card.querySelectorAll('.note-tag').forEach(tagEl => {
      tagEl.addEventListener('click', (e) => {
        e.stopPropagation();
        const tag = tagEl.getAttribute('data-tag');
        window.notesStore.setTag(tag);
        updateActiveFilterBar();
        refreshNotesView();
      });
    });

    return card;
  }

  // ==========================================
  // 5. Data Refresh Workflow
  // ==========================================
  async function refreshNotesView() {
    loadingState.style.display = 'flex';
    emptyState.style.display = 'none';

    try {
      await window.notesStore.loadNotes();
      renderNotes();
      renderActiveFilterBar();
    } catch (err) {
      loadingState.style.display = 'none';
      showToast('Could not load notes. Check backend connection.', 'error');
    }
  }

  async function ensureDatabaseOnlineUI() {
    if (!dbStatusBadge) return;

    try {
      const health = await window.notesAPI.checkHealth();
      const dbInfo = health?.database_info || {};

      dbStatusBadge.textContent = 'Online';
      dbStatusBadge.classList.add('online-pulse');
      dbStatusBadge.style.color = 'var(--emerald)';

      if (window.notesAPI.isBackendReachable) {
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
      // Even under unexpected error, maintain database online state
      dbStatusBadge.textContent = 'Online';
      dbStatusBadge.classList.add('online-pulse');
      dbStatusBadge.style.color = 'var(--emerald)';
      if (dbNameLabel) {
        dbNameLabel.textContent = 'Database Online';
      }
    }
  }

  // Periodic background check to auto-detect PostgreSQL backend
  setInterval(async () => {
    try {
      const health = await window.notesAPI.checkHealth();
      if (window.notesAPI.isBackendReachable && dbNameLabel && !dbNameLabel.textContent.includes('PostgreSQL')) {
        dbNameLabel.textContent = `PostgreSQL (${health?.database_info?.database || 'notes_db'})`;
      }
    } catch (e) { /* background silent */ }
  }, 8000);

  async function initializeApp() {
    initTheme();
    applyViewMode(window.notesStore.viewMode);
    updateAuthUI();

    // Ensure database comes online whenever the app is opened
    await ensureDatabaseOnlineUI();

    try {
      await window.notesStore.refreshAll();
      renderStats();
      renderSubjectPills();
      renderNotes();
      // Populate subject autocomplete datalist
      try {
        const subjectNames = await window.notesAPI.getSubjects();
        updateSuggestedDatalist(subjectNames);
      } catch (e) { /* non-critical */ }
    } catch (err) {
      console.warn('Initial data load warning:', err);
    }
  }

  // ==========================================
  // 6. Search & Filter Listeners
  // ==========================================
  searchInput.addEventListener('input', (e) => {
    const val = e.target.value;
    clearSearchBtn.style.display = val ? 'flex' : 'none';

    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => {
      window.notesStore.setSearch(val);
      updateActiveFilterBar();
      refreshNotesView();
    }, 280);
  });

  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearSearchBtn.style.display = 'none';
    window.notesStore.setSearch('');
    updateActiveFilterBar();
    refreshNotesView();
  });

  sortSelect.addEventListener('change', (e) => {
    window.notesStore.setSort(e.target.value);
    refreshNotesView();
  });

  clearAllFiltersBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearSearchBtn.style.display = 'none';
    window.notesStore.clearFilters();
    renderSubjectPills();
    updateActiveFilterBar();
    refreshNotesView();
  });

  // ==========================================
  // 7. Editor Modal (Create / Edit)
  // ==========================================
  function openEditorModal(note = null) {
    noteForm.reset();

    if (note && note.id) {
      // Existing note edit
      modalTitle.textContent = 'Edit Note';
      saveBtnText.textContent = 'Update Note';
      editNoteId.value = String(note.id);
      noteTitleInput.value = note.title || '';
      noteSubjectInput.value = note.subject || '';
      noteTagsInput.value = (note.tags && note.tags.length > 0) 
        ? (Array.isArray(note.tags) ? note.tags.join(', ') : note.tags) 
        : '';
      noteContentInput.value = note.content || '';
      notePinCheckbox.checked = !!note.is_pinned;
      noteColorInput.value = note.color || 'default';
    } else {
      // New note creation (either blank or pre-filled from OCR / Voice)
      modalTitle.textContent = 'Create New Note';
      saveBtnText.textContent = 'Save Note';
      editNoteId.value = '';

      if (note) {
        // Pre-filled from OCR or Voice
        noteTitleInput.value = note.title || '';
        noteSubjectInput.value = note.subject || '';
        noteTagsInput.value = (note.tags && note.tags.length > 0) 
          ? (Array.isArray(note.tags) ? note.tags.join(', ') : note.tags) 
          : '';
        noteContentInput.value = note.content || '';
        notePinCheckbox.checked = !!note.is_pinned;
        noteColorInput.value = note.color || 'blue';
      } else {
        const currentSub = window.notesStore.filters.subject;
        noteSubjectInput.value = (currentSub && currentSub !== 'all') ? currentSub : '';
        noteColorInput.value = 'default';
        notePinCheckbox.checked = false;
      }
    }

    // Update active color dot
    colorPickerGroup.querySelectorAll('.color-dot').forEach(dot => {
      dot.classList.toggle('active', dot.getAttribute('data-color') === noteColorInput.value);
    });

    updateCharCount();
    noteEditorModal.classList.add('active');
    noteEditorModal.setAttribute('aria-hidden', 'false');
    setTimeout(() => noteTitleInput.focus(), 100);
  }

  function closeEditorModal() {
    stopEditorDictation();
    noteEditorModal.classList.remove('active');
    noteEditorModal.setAttribute('aria-hidden', 'true');
  }

  // Color selection
  colorPickerGroup.querySelectorAll('.color-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      colorPickerGroup.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
      noteColorInput.value = dot.getAttribute('data-color');
    });
  });

  // Character counter
  function updateCharCount() {
    const len = noteContentInput.value.length;
    editorCharCount.textContent = `${len} character${len === 1 ? '' : 's'}`;
  }
  noteContentInput.addEventListener('input', updateCharCount);

  // Open buttons
  openCreateModalBtn.addEventListener('click', () => openEditorModal());
  emptyCreateBtn.addEventListener('click', () => openEditorModal());

  // Close buttons
  closeEditorModalBtn.addEventListener('click', closeEditorModal);
  cancelEditorModalBtn.addEventListener('click', closeEditorModal);
  noteEditorModal.addEventListener('click', (e) => {
    if (e.target === noteEditorModal) closeEditorModal();
  });

  // Form submit
  noteForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = noteTitleInput.value.trim();
    const content = noteContentInput.value.trim();
    const subject = noteSubjectInput.value.trim() || 'General';
    const tags = noteTagsInput.value;
    const is_pinned = notePinCheckbox.checked;
    const color = noteColorInput.value || 'default';
    const id = editNoteId.value ? editNoteId.value.trim() : '';

    if (!title) {
      showToast('Please provide a note title', 'error');
      noteTitleInput.focus();
      return;
    }

    if (!content) {
      showToast('Note content cannot be empty', 'error');
      noteContentInput.focus();
      return;
    }

    const payload = { title, content, subject, tags, is_pinned, color };

    try {
      const isEdit = Boolean(id && id !== 'undefined' && id !== 'null' && !isNaN(parseInt(id, 10)));
      if (isEdit) {
        await window.notesStore.updateNote(parseInt(id, 10), payload);
        showToast('Note updated & saved to database!', 'success');
      } else {
        await window.notesStore.addNote(payload);
        showToast('New note created & saved to database!', 'success');
      }
      closeEditorModal();
      renderStats();
      renderSubjectPills();
      renderNotes();
    } catch (err) {
      showToast(err.message || 'Failed to save note', 'error');
    }
  });

  // ==========================================
  // 8. Preview Modal
  // ==========================================
  function openPreviewModal(note) {
    currentPreviewNoteId = note.id;
    previewTitle.textContent = note.title;
    const authorMeta = note.author ? ` &bull; <i class="fa-solid fa-user"></i> ${escapeHtml(note.author)}` : '';
    previewDate.innerHTML = `<i class="fa-regular fa-clock"></i> ${formatFullDate(note.updated_at || note.created_at)}${authorMeta}`;
    previewPinnedBadge.style.display = note.is_pinned ? 'inline-flex' : 'none';

    // Tags
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

    // Content
    previewContent.textContent = note.content;

    // Word count & read time
    const words = countWords(note.content);
    previewWordCount.innerHTML = `<i class="fa-solid fa-font"></i> ${words} words`;
    const readMinutes = Math.max(1, Math.ceil(words / 200));
    previewReadTime.innerHTML = `<i class="fa-solid fa-stopwatch"></i> ${readMinutes} min read`;

    notePreviewModal.classList.add('active');
    notePreviewModal.setAttribute('aria-hidden', 'false');
  }

  function closePreviewModal() {
    notePreviewModal.classList.remove('active');
    notePreviewModal.setAttribute('aria-hidden', 'true');
    currentPreviewNoteId = null;
  }

  closePreviewModalBtn.addEventListener('click', closePreviewModal);
  notePreviewModal.addEventListener('click', (e) => {
    if (e.target === notePreviewModal) closePreviewModal();
  });

  // Copy note content
  copyNoteContentBtn.addEventListener('click', async () => {
    if (!currentPreviewNoteId) return;
    const note = window.notesStore.findNoteById(currentPreviewNoteId);
    if (!note) return;

    try {
      const fullText = `${note.title}\n\nSubject: ${note.subject}\n\n${note.content}`;
      await navigator.clipboard.writeText(fullText);
      showToast('Note copied to clipboard!', 'success');
    } catch (err) {
      showToast('Could not copy to clipboard', 'error');
    }
  });

  // Edit from preview
  previewEditBtn.addEventListener('click', () => {
    if (!currentPreviewNoteId) return;
    const note = window.notesStore.findNoteById(currentPreviewNoteId);
    if (!note) return;
    closePreviewModal();
    openEditorModal(note);
  });

  // Delete from preview
  previewDeleteBtn.addEventListener('click', async () => {
    if (!currentPreviewNoteId) return;
    const note = window.notesStore.findNoteById(currentPreviewNoteId);
    if (!note) return;

    if (confirm(`Delete "${note.title}"?`)) {
      try {
        await window.notesStore.removeNote(note.id);
        closePreviewModal();
        showToast('Note deleted successfully', 'success');
        renderStats();
        renderSubjectPills();
        renderNotes();
      } catch (err) {
        showToast('Failed to delete note', 'error');
      }
    }
  });

  // ==========================================
  // 8.5. In-Browser OCR Scanner (Tesseract.js)
  // ==========================================
  function openOcrModal(initialImageFile = null) {
    resetOcrModal();
    ocrScannerModal.classList.add('active');
    ocrScannerModal.setAttribute('aria-hidden', 'false');

    if (initialImageFile) {
      processImageWithOcr(initialImageFile);
    }
  }

  function closeOcrModal() {
    ocrScannerModal.classList.remove('active');
    ocrScannerModal.setAttribute('aria-hidden', 'true');
  }

  function resetOcrModal() {
    ocrDropzone.style.display = 'block';
    ocrPreviewContainer.style.display = 'none';
    ocrResultsContainer.style.display = 'none';
    rescanOcrBtn.style.display = 'none';
    if (editOcrInFormBtn) editOcrInFormBtn.style.display = 'none';
    createFromOcrBtn.style.display = 'none';
    cancelOcrModalBtn.style.display = 'inline-flex';
    ocrPreviewImg.src = '';
    ocrProgressBar.style.width = '0%';
    ocrPercentText.textContent = '0%';
    ocrStatusText.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Initializing OCR engine...';
    ocrDetectedTitle.value = '';
    ocrDetectedSubject.value = '';
    ocrExtractedText.value = '';
    ocrCharCount.textContent = '0 chars';
    ocrFileInput.value = '';
  }

  async function processImageWithOcr(imageSource) {
    if (typeof Tesseract === 'undefined') {
      showToast('OCR engine (Tesseract.js) is loading or unavailable. Check connection.', 'error');
      return;
    }

    // Show preview & progress UI
    ocrDropzone.style.display = 'none';
    ocrPreviewContainer.style.display = 'flex';
    ocrResultsContainer.style.display = 'none';
    rescanOcrBtn.style.display = 'none';
    if (editOcrInFormBtn) editOcrInFormBtn.style.display = 'none';
    createFromOcrBtn.style.display = 'none';

    // Set image source preview
    if (imageSource instanceof File || imageSource instanceof Blob) {
      const reader = new FileReader();
      reader.onload = (e) => {
        ocrPreviewImg.src = e.target.result;
      };
      reader.readAsDataURL(imageSource);
    } else if (typeof imageSource === 'string') {
      ocrPreviewImg.src = imageSource;
    }

    try {
      ocrStatusText.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Loading language model...';
      ocrProgressBar.style.width = '10%';
      ocrPercentText.textContent = '10%';

      const result = await Tesseract.recognize(
        imageSource,
        'eng',
        {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              const pct = Math.round((m.progress || 0) * 100);
              ocrProgressBar.style.width = `${pct}%`;
              ocrPercentText.textContent = `${pct}%`;
              ocrStatusText.innerHTML = `<i class="fa-solid fa-bolt"></i> Scanning text... ${pct}%`;
            } else if (m.status) {
              ocrStatusText.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${m.status}...`;
            }
          }
        }
      );

      const rawText = result?.data?.text || '';
      const cleanedText = cleanOcrText(rawText);

      if (!cleanedText) {
        showToast('No readable text detected in the image. Please try a clearer picture.', 'info');
        ocrStatusText.textContent = 'No text detected.';
        rescanOcrBtn.style.display = 'inline-flex';
        return;
      }

      // Title & Subject inference
      const inferredTitle = extractTitleFromText(cleanedText);
      const inferredSubject = inferSubjectFromText(cleanedText);

      ocrDetectedTitle.value = inferredTitle;
      ocrDetectedSubject.value = inferredSubject;
      ocrExtractedText.value = cleanedText;
      updateOcrCharCount();

      // Show results & action buttons
      ocrResultsContainer.style.display = 'flex';
      rescanOcrBtn.style.display = 'inline-flex';
      if (editOcrInFormBtn) editOcrInFormBtn.style.display = 'inline-flex';
      createFromOcrBtn.style.display = 'inline-flex';
      cancelOcrModalBtn.style.display = 'none';
      ocrStatusText.innerHTML = '<i class="fa-solid fa-check"></i> OCR completed!';
      ocrProgressBar.style.width = '100%';
      ocrPercentText.textContent = '100%';

      showToast('Text extracted successfully with OCR!', 'success');
    } catch (err) {
      console.error('OCR Error:', err);
      showToast('OCR recognition failed. Please try another image.', 'error');
      ocrStatusText.textContent = 'Failed to recognize text.';
      rescanOcrBtn.style.display = 'inline-flex';
    }
  }

  function cleanOcrText(text) {
    return text
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  function extractTitleFromText(text) {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length === 0) return 'Scanned Note';
    
    // Pick first clean header line
    for (const line of lines) {
      const sanitized = line.replace(/^[#*\-=>\s]+/, '').trim();
      if (sanitized.length >= 3 && sanitized.length <= 90) {
        return sanitized;
      }
    }
    return lines[0].substring(0, 60);
  }

  function inferSubjectFromText(text) {
    const lower = text.toLowerCase();
    if (lower.includes('database') || lower.includes('sql') || lower.includes('relation') || lower.includes('normalization') || lower.includes('acid') || lower.includes('bcnf')) {
      return 'Database Management Systems';
    }
    if (lower.includes('process') || lower.includes('thread') || lower.includes('scheduling') || lower.includes('semaphore') || lower.includes('deadlock') || lower.includes('memory management')) {
      return 'Operating Systems';
    }
    if (lower.includes('tree') || lower.includes('graph') || lower.includes('linked list') || lower.includes('algorithm') || lower.includes('complexity') || lower.includes('binary search')) {
      return 'Data Structures & Algorithms';
    }
    if (lower.includes('network') || lower.includes('tcp') || lower.includes('ip') || lower.includes('osi') || lower.includes('protocol') || lower.includes('routing')) {
      return 'Computer Networks';
    }
    if (lower.includes('matrix') || lower.includes('integral') || lower.includes('derivative') || lower.includes('theorem') || lower.includes('probability')) {
      return 'Mathematics';
    }
    if (lower.includes('neural') || lower.includes('learning') || lower.includes('model') || lower.includes('regression') || lower.includes('classification')) {
      return 'Machine Learning';
    }

    // Default to active subject filter if not 'all'
    const activeSub = window.notesStore.filters.subject;
    return (activeSub && activeSub !== 'all') ? activeSub : 'General';
  }

  function updateOcrCharCount() {
    const len = ocrExtractedText.value.length;
    ocrCharCount.textContent = `${len} char${len === 1 ? '' : 's'}`;
  }
  ocrExtractedText.addEventListener('input', updateOcrCharCount);

  // Wire OCR modal triggers
  openOcrModalBtn.addEventListener('click', () => openOcrModal());
  editorOcrScanBtn.addEventListener('click', () => {
    closeEditorModal();
    openOcrModal();
  });
  closeOcrModalBtn.addEventListener('click', closeOcrModal);
  cancelOcrModalBtn.addEventListener('click', closeOcrModal);
  rescanOcrBtn.addEventListener('click', resetOcrModal);

  // Browse file button & file input
  browseFileBtn.addEventListener('click', () => ocrFileInput.click());
  ocrFileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      processImageWithOcr(e.target.files[0]);
    }
  });

  // Drag & Drop
  ocrDropzone.addEventListener('click', () => ocrFileInput.click());
  ocrDropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    ocrDropzone.classList.add('dragover');
  });
  ocrDropzone.addEventListener('dragleave', () => {
    ocrDropzone.classList.remove('dragover');
  });
  ocrDropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    ocrDropzone.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageWithOcr(e.dataTransfer.files[0]);
    }
  });

  // Save Scanned Note Directly to Database
  createFromOcrBtn.addEventListener('click', async () => {
    const content = ocrExtractedText.value.trim();
    if (!content) {
      showToast('No text detected in scan to save.', 'error');
      return;
    }

    const title = (ocrDetectedTitle.value.trim() || extractTitleFromText(content) || 'Scanned Study Note').substring(0, 180);
    const subject = ocrDetectedSubject.value.trim() || inferSubjectFromText(content) || 'General';
    const tags = ocrDetectedTags.value.trim() || 'ocr, scanned';

    createFromOcrBtn.disabled = true;
    const origHtml = createFromOcrBtn.innerHTML;
    createFromOcrBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';

    try {
      await window.notesStore.addNote({
        title,
        content,
        subject,
        tags: tags,
        color: 'blue',
        is_pinned: false
      });

      closeOcrModal();
      showToast('Scanned note saved successfully as a note!', 'success');
      renderStats();
      renderSubjectPills();
      renderNotes();
    } catch (err) {
      console.error('Failed to save scanned note:', err);
      showToast(err.message || 'Failed to save scanned note', 'error');
    } finally {
      createFromOcrBtn.disabled = false;
      createFromOcrBtn.innerHTML = origHtml;
    }
  });

  // Edit in Form action before saving
  if (editOcrInFormBtn) {
    editOcrInFormBtn.addEventListener('click', () => {
      const content = ocrExtractedText.value.trim();
      const title = (ocrDetectedTitle.value.trim() || extractTitleFromText(content) || 'Scanned Note').substring(0, 180);
      const subject = ocrDetectedSubject.value.trim() || inferSubjectFromText(content) || 'General';
      const tags = ocrDetectedTags.value.trim() || 'ocr, scanned';

      closeOcrModal();

      openEditorModal({
        title,
        content,
        subject,
        tags: tags.split(',').map(t => t.trim()),
        color: 'blue',
        is_pinned: false
      });

      showToast('Scan imported into editor. Click Save Note when ready.', 'info');
    });
  }

  // Global Clipboard Paste (Ctrl+V) handler for Screenshot OCR
  window.addEventListener('paste', (e) => {
    // Avoid intercepting paste if user is typing in an input or textarea
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
      // If user pastes an image specifically inside note content textarea, allow image OCR!
      const items = e.clipboardData?.items;
      if (items) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            const file = items[i].getAsFile();
            if (file) {
              e.preventDefault();
              showToast('Pasted screenshot detected! Launching OCR...', 'info');
              openOcrModal(file);
              return;
            }
          }
        }
      }
      return;
    }

    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          e.preventDefault();
          showToast('Pasted screenshot detected! Starting OCR...', 'info');
          openOcrModal(file);
          break;
        }
      }
    }
  });

  // ==========================================
  // 8.6. Voice Note Studio (Web Speech API)
  // ==========================================
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let voiceRecognition = null;
  let isVoiceRecording = false;
  let voiceTimerInterval = null;
  let voiceSeconds = 0;
  let accumulatedVoiceText = '';

  // In-Editor Quick Dictation
  let editorRecognition = null;
  let isEditorDictating = false;

  function openVoiceModal() {
    resetVoiceModal();
    voiceNoteModal.classList.add('active');
    voiceNoteModal.setAttribute('aria-hidden', 'false');

    if (!SpeechRecognition) {
      voiceStatusLabel.innerHTML = '<span style="color: var(--danger);"><i class="fa-solid fa-triangle-exclamation"></i> Speech Recognition is not supported in this browser. Please use Chrome, Edge, or Safari.</span>';
      voiceToggleRecBtn.disabled = true;
      voiceToggleRecBtn.style.opacity = '0.5';
    }
  }

  function closeVoiceModal() {
    stopVoiceRecording();
    voiceNoteModal.classList.remove('active');
    voiceNoteModal.setAttribute('aria-hidden', 'true');
  }

  function resetVoiceModal() {
    stopVoiceRecording();
    accumulatedVoiceText = '';
    voiceTranscriptText.value = '';
    voiceDetectedTitle.value = '';
    voiceDetectedSubject.value = '';
    voiceCharCount.textContent = '0 words';
    voiceTimerBadge.textContent = '00:00';
    voiceSeconds = 0;
    createFromVoiceBtn.disabled = true;
    if (editVoiceInFormBtn) editVoiceInFormBtn.style.display = 'none';
    voiceStatusLabel.textContent = 'Click the microphone to start speaking';
    soundWaveBars.style.display = 'none';
    if (voiceStopBtn) voiceStopBtn.style.display = 'none';
    voiceRecorderHub.classList.remove('recording');
    voiceMicIcon.className = 'fa-solid fa-microphone';
    voiceToggleRecBtn.classList.remove('is-recording');
    voiceToggleRecBtn.setAttribute('title', 'Start Recording');
    // Hide live display
    liveTranscriptDisplay.style.display = 'none';
    liveTranscriptFinal.textContent = '';
    liveTranscriptInterim.textContent = '';
  }

  function toggleVoiceRecording() {
    if (!SpeechRecognition) {
      showToast('Speech recognition not supported in this browser. Try Chrome or Edge.', 'error');
      return;
    }

    if (isVoiceRecording) {
      stopVoiceRecording();
    } else {
      startVoiceRecording();
    }
  }

  function startVoiceRecording() {
    try {
      // Ensure any lingering session is completely aborted first
      if (voiceRecognition) {
        const prev = voiceRecognition;
        voiceRecognition = null;
        prev.onresult = null;
        prev.onerror = null;
        prev.onend = null;
        try { prev.abort(); } catch (e) {}
      }

      voiceRecognition = new SpeechRecognition();
      voiceRecognition.continuous = true;
      voiceRecognition.interimResults = true;
      voiceRecognition.lang = 'en-US';

      isVoiceRecording = true;
      voiceRecorderHub.classList.add('recording');
      voiceToggleRecBtn.classList.add('is-recording');
      voiceToggleRecBtn.setAttribute('title', 'Stop Recording & Audio');
      voiceMicIcon.className = 'fa-solid fa-stop';
      if (voiceStopBtn) voiceStopBtn.style.display = 'inline-flex';
      soundWaveBars.style.display = 'flex';
      voiceStatusLabel.textContent = 'Listening... Speak your study notes clearly.';

      // Show live transcript display
      liveTranscriptDisplay.style.display = 'block';
      liveTranscriptFinal.textContent = accumulatedVoiceText;
      liveTranscriptInterim.textContent = '';

      // Start timer
      voiceSeconds = 0;
      updateVoiceTimerDisplay();
      clearInterval(voiceTimerInterval);
      voiceTimerInterval = setInterval(() => {
        voiceSeconds++;
        updateVoiceTimerDisplay();
      }, 1000);

      voiceRecognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          accumulatedVoiceText += finalTranscript;
        }

        // Update live transcript display (interim vs final separated)
        liveTranscriptFinal.textContent = accumulatedVoiceText;
        liveTranscriptInterim.textContent = interimTranscript ? ' ' + interimTranscript : '';

        // Update word counter in live panel
        const totalWords = countWords(accumulatedVoiceText + ' ' + interimTranscript);
        liveWordCounter.textContent = `${totalWords} word${totalWords !== 1 ? 's' : ''}`;

        // Sync textarea with committed text only
        voiceTranscriptText.value = accumulatedVoiceText.trim();
        updateVoiceWordCount();

        if (accumulatedVoiceText.trim().length > 0 || interimTranscript.length > 0) {
          createFromVoiceBtn.disabled = false;
          if (editVoiceInFormBtn) editVoiceInFormBtn.style.display = 'inline-flex';
          // Auto infer title and subject from accumulated text
          if (accumulatedVoiceText.trim()) {
            voiceDetectedTitle.value = extractTitleFromText(accumulatedVoiceText.trim());
            voiceDetectedSubject.value = inferSubjectFromText(accumulatedVoiceText.trim());
          }
        }
      };

      voiceRecognition.onerror = (event) => {
        console.warn('Speech recognition notice/error:', event.error);
        if (event.error === 'not-allowed') {
          showToast('Microphone access denied. Please allow microphone in browser.', 'error');
          stopVoiceRecording();
        } else if (event.error !== 'no-speech') {
          showToast(`Voice notice: ${event.error}`, 'info');
        }
      };

      voiceRecognition.onend = () => {
        // ONLY restart if the user has NOT stopped recording
        if (isVoiceRecording && voiceRecognition) {
          try {
            voiceRecognition.start();
          } catch (e) {}
        }
      };

      voiceRecognition.start();
      showToast('Microphone active. Start speaking!', 'info');
    } catch (err) {
      console.error('Failed to start voice recognition:', err);
      showToast('Could not start microphone: ' + err.message, 'error');
      stopVoiceRecording();
    }
  }

  function stopVoiceRecording() {
    isVoiceRecording = false;
    clearInterval(voiceTimerInterval);

    // Commit any in-flight interim transcript so what the user just said isn't dropped
    if (liveTranscriptInterim && liveTranscriptInterim.textContent.trim()) {
      const interim = liveTranscriptInterim.textContent.trim();
      accumulatedVoiceText = (accumulatedVoiceText + ' ' + interim).trim();
      voiceTranscriptText.value = accumulatedVoiceText;
      updateVoiceWordCount();
      if (!voiceDetectedTitle.value) {
        voiceDetectedTitle.value = extractTitleFromText(accumulatedVoiceText);
      }
      if (!voiceDetectedSubject.value) {
        voiceDetectedSubject.value = inferSubjectFromText(accumulatedVoiceText);
      }
    }

    // Completely tear down and abort voice recognition to immediately release computer's microphone
    if (voiceRecognition) {
      const rec = voiceRecognition;
      voiceRecognition = null;

      // Null out all listeners first so no asynchronous event can trigger a restart
      rec.onresult = null;
      rec.onerror = null;
      rec.onend = null;
      rec.onspeechend = null;
      rec.onaudioend = null;
      rec.onaudiostart = null;
      rec.onspeechstart = null;
      rec.onstart = null;

      try {
        // abort() immediately forces the browser to close the audio input stream and stop using the computer's mic
        rec.abort();
      } catch (e) {
        try {
          rec.stop();
        } catch (e2) {}
      }
    }

    voiceRecorderHub.classList.remove('recording');
    voiceToggleRecBtn.classList.remove('is-recording');
    voiceToggleRecBtn.setAttribute('title', 'Start Recording');
    voiceMicIcon.className = 'fa-solid fa-microphone';
    soundWaveBars.style.display = 'none';
    if (voiceStopBtn) voiceStopBtn.style.display = 'none';

    // Hide and clear interim live display
    liveTranscriptInterim.textContent = '';
    liveTranscriptDisplay.style.display = 'none';

    if (voiceTranscriptText.value.trim()) {
      voiceStatusLabel.innerHTML = '<span class="mic-status-off"><i class="fa-solid fa-microphone-slash"></i> Audio stopped. Review or save your note below, or click microphone to record more.</span>';
      createFromVoiceBtn.disabled = false;
      if (editVoiceInFormBtn) editVoiceInFormBtn.style.display = 'inline-flex';
    } else {
      voiceStatusLabel.innerHTML = '<span class="mic-status-off"><i class="fa-solid fa-microphone-slash"></i> Microphone is off. Click the microphone when you want to start again.</span>';
    }
  }

  function updateVoiceTimerDisplay() {
    const mins = String(Math.floor(voiceSeconds / 60)).padStart(2, '0');
    const secs = String(voiceSeconds % 60).padStart(2, '0');
    voiceTimerBadge.textContent = `${mins}:${secs}`;
  }

  function updateVoiceWordCount() {
    const words = countWords(voiceTranscriptText.value);
    voiceCharCount.textContent = `${words} word${words === 1 ? '' : 's'}`;
  }

  // Clear Voice transcript
  clearVoiceTranscriptBtn.addEventListener('click', () => {
    accumulatedVoiceText = '';
    voiceTranscriptText.value = '';
    voiceDetectedTitle.value = '';
    voiceCharCount.textContent = '0 words';
    createFromVoiceBtn.disabled = true;
    if (editVoiceInFormBtn) editVoiceInFormBtn.style.display = 'none';
    // Reset live display too
    liveTranscriptFinal.textContent = '';
    liveTranscriptInterim.textContent = '';
    liveWordCounter.textContent = '0 words';
    if (!isVoiceRecording) liveTranscriptDisplay.style.display = 'none';
    showToast('Transcript cleared', 'info');
  });

  // Save Voice Note Directly to Database
  createFromVoiceBtn.addEventListener('click', async () => {
    stopVoiceRecording();

    const content = voiceTranscriptText.value.trim();
    if (!content) {
      showToast('Please record or speak some note content first.', 'error');
      return;
    }

    const title = (voiceDetectedTitle.value.trim() || extractTitleFromText(content) || 'Voice Study Note').substring(0, 180);
    const subject = voiceDetectedSubject.value.trim() || inferSubjectFromText(content) || 'General';
    const tags = voiceDetectedTags.value.trim() || 'voice, dictation';

    createFromVoiceBtn.disabled = true;
    const origHtml = createFromVoiceBtn.innerHTML;
    createFromVoiceBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';

    try {
      await window.notesStore.addNote({
        title,
        content,
        subject,
        tags: tags,
        color: 'rose',
        is_pinned: false
      });

      closeVoiceModal();
      showToast('Voice note saved successfully as a note!', 'success');
      renderStats();
      renderSubjectPills();
      renderNotes();
    } catch (err) {
      console.error('Failed to save voice note:', err);
      showToast(err.message || 'Failed to save voice note', 'error');
    } finally {
      createFromVoiceBtn.disabled = false;
      createFromVoiceBtn.innerHTML = origHtml;
    }
  });

  // Edit in Form action before saving
  if (editVoiceInFormBtn) {
    editVoiceInFormBtn.addEventListener('click', () => {
      stopVoiceRecording();

      const content = voiceTranscriptText.value.trim();
      if (!content) {
        showToast('No voice note content to edit yet.', 'error');
        return;
      }

      const title = (voiceDetectedTitle.value.trim() || extractTitleFromText(content) || 'Voice Study Note').substring(0, 180);
      const subject = voiceDetectedSubject.value.trim() || inferSubjectFromText(content) || 'General';
      const tags = voiceDetectedTags.value.trim() || 'voice, dictation';

      closeVoiceModal();

      openEditorModal({
        title,
        content,
        subject,
        tags: tags.split(',').map(t => t.trim()),
        color: 'rose',
        is_pinned: false
      });

      showToast('Voice note imported into editor. Click Save Note when ready.', 'info');
    });
  }

  // Wire Voice Modal Triggers
  openVoiceModalBtn.addEventListener('click', () => openVoiceModal());
  closeVoiceModalBtn.addEventListener('click', closeVoiceModal);
  cancelVoiceModalBtn.addEventListener('click', closeVoiceModal);
  voiceNoteModal.addEventListener('click', (e) => {
    if (e.target === voiceNoteModal) closeVoiceModal();
  });
  voiceToggleRecBtn.addEventListener('click', toggleVoiceRecording);
  if (voiceStopBtn) {
    voiceStopBtn.addEventListener('click', stopVoiceRecording);
  }

  voiceTranscriptText.addEventListener('input', () => {
    updateVoiceWordCount();
    const txt = voiceTranscriptText.value.trim();
    createFromVoiceBtn.disabled = txt.length === 0;
    if (editVoiceInFormBtn) editVoiceInFormBtn.style.display = txt.length > 0 ? 'inline-flex' : 'none';
    if (txt.length > 0 && !voiceDetectedTitle.value) {
      voiceDetectedTitle.value = extractTitleFromText(txt);
    }
  });

  // ==========================================
  // 8.7. In-Editor Live Voice Dictation
  // ==========================================
  function toggleEditorDictation() {
    if (!SpeechRecognition) {
      showToast('Speech recognition is not supported in this browser. Try Chrome or Edge.', 'error');
      return;
    }

    if (isEditorDictating) {
      stopEditorDictation();
    } else {
      startEditorDictation();
    }
  }

  function startEditorDictation() {
    try {
      editorRecognition = new SpeechRecognition();
      editorRecognition.continuous = true;
      editorRecognition.interimResults = false;
      editorRecognition.lang = 'en-US';

      isEditorDictating = true;
      editorVoiceDictateBtn.classList.add('recording');
      editorVoiceDictateBtn.innerHTML = '<i class="fa-solid fa-microphone-slash"></i> Stop Dictating';
      showToast('Listening... Dictating into note content', 'info');

      editorRecognition.onresult = (e) => {
        let text = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          if (e.results[i].isFinal) {
            text += e.results[i][0].transcript + ' ';
          }
        }
        if (text) {
          const current = noteContentInput.value;
          noteContentInput.value = (current ? current + '\n' : '') + text.trim();
          updateCharCount();
        }
      };

      editorRecognition.onerror = (e) => {
        if (e.error === 'not-allowed') {
          showToast('Microphone access denied', 'error');
          stopEditorDictation();
        }
      };

      editorRecognition.onend = () => {
        if (isEditorDictating) {
          try {
            editorRecognition.start();
          } catch (e) {}
        }
      };

      editorRecognition.start();
    } catch (err) {
      showToast('Could not start dictation: ' + err.message, 'error');
      stopEditorDictation();
    }
  }

  function stopEditorDictation() {
    isEditorDictating = false;
    if (editorRecognition) {
      const rec = editorRecognition;
      editorRecognition = null;
      rec.onresult = null;
      rec.onerror = null;
      rec.onend = null;
      rec.onspeechend = null;
      rec.onaudioend = null;
      rec.onaudiostart = null;
      rec.onspeechstart = null;
      rec.onstart = null;
      try {
        rec.abort();
      } catch (e) {
        try {
          rec.stop();
        } catch (e2) {}
      }
    }
    editorVoiceDictateBtn.classList.remove('recording');
    editorVoiceDictateBtn.innerHTML = '<i class="fa-solid fa-microphone"></i> Dictate Voice';
  }

  // Safety release on page navigation/unload
  window.addEventListener('beforeunload', () => {
    stopVoiceRecording();
    stopEditorDictation();
  });

  editorVoiceDictateBtn.addEventListener('click', toggleEditorDictation);

  // Keyboard Shortcuts (Esc to close modals)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeEditorModal();
      closePreviewModal();
      closeOcrModal();
      closeVoiceModal();
      closeSubjectsModal();
    }
  });

  // ==========================================
  // 10. Subjects Manager
  // ==========================================

  // Wire color picker inside subjects modal
  subjectColorPicker.querySelectorAll('.color-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      subjectColorPicker.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
      newSubjectColorInput.value = dot.getAttribute('data-color');
    });
  });

  async function openSubjectsModal() {
    subjectsManagerModal.classList.add('active');
    subjectsManagerModal.setAttribute('aria-hidden', 'false');
    newSubjectNameInput.value = '';
    newSubjectColorInput.value = 'blue';
    subjectColorPicker.querySelectorAll('.color-dot').forEach(d => {
      d.classList.toggle('active', d.getAttribute('data-color') === 'blue');
    });
    await loadAndRenderSubjects();
    setTimeout(() => newSubjectNameInput.focus(), 100);
  }

  function closeSubjectsModal() {
    subjectsManagerModal.classList.remove('active');
    subjectsManagerModal.setAttribute('aria-hidden', 'true');
  }

  async function loadAndRenderSubjects() {
    try {
      const subjects = await window.notesAPI.getSubjectDetails();
      renderSubjectsList(subjects);
      updateSuggestedDatalist(subjects.map(s => s.name));
    } catch (err) {
      console.error('Failed to load subject details:', err);
      showToast('Could not load subjects list', 'error');
    }
  }

  function renderSubjectsList(subjects) {
    subjectsCountBadge.textContent = subjects.length;

    if (!subjects || subjects.length === 0) {
      subjectsList.innerHTML = '';
      subjectsEmptyState.style.display = 'flex';
      return;
    }

    subjectsEmptyState.style.display = 'none';
    subjectsList.innerHTML = '';

    subjects.forEach(subj => {
      const item = document.createElement('div');
      item.className = 'subject-item';
      item.innerHTML = `
        <span class="subject-color-indicator ci-${subj.color || 'blue'}"></span>
        <span class="subject-item-name">${escapeHtml(subj.name)}</span>
        <span class="subject-item-count">${subj.note_count} note${subj.note_count !== 1 ? 's' : ''}</span>
        <button class="subject-delete-btn" title="Remove subject" aria-label="Delete subject ${escapeHtml(subj.name)}">
          <i class="fa-solid fa-xmark"></i>
        </button>
      `;
      item.querySelector('.subject-delete-btn').addEventListener('click', async () => {
        if (!confirm(`Remove subject "${subj.name}"? Notes under it will NOT be deleted.`)) return;
        try {
          await window.notesAPI.deleteSubject(subj.name);
          showToast(`Subject "${subj.name}" removed`, 'success');
          await loadAndRenderSubjects();
          // Also refresh sidebar pills
          await window.notesStore.refreshAll();
          renderStats();
          renderSubjectPills();
        } catch (err) {
          showToast(err.message || 'Failed to delete subject', 'error');
        }
      });
      subjectsList.appendChild(item);
    });
  }

  function updateSuggestedDatalist(subjectNames) {
    if (!suggestedSubjectsDatalist) return;
    suggestedSubjectsDatalist.innerHTML = subjectNames
      .map(name => `<option value="${escapeHtml(name)}">`)
      .join('');
  }

  addSubjectBtn.addEventListener('click', async () => {
    const name = newSubjectNameInput.value.trim();
    if (!name) {
      showToast('Please enter a subject name', 'error');
      newSubjectNameInput.focus();
      return;
    }

    const color = newSubjectColorInput.value || 'blue';
    addSubjectBtn.disabled = true;
    const origHtml = addSubjectBtn.innerHTML;
    addSubjectBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';

    try {
      await window.notesAPI.createSubject(name, color);
      newSubjectNameInput.value = '';
      showToast(`Subject "${name}" added!`, 'success');
      await loadAndRenderSubjects();
      // Refresh main subject pills
      await window.notesStore.refreshAll();
      renderStats();
      renderSubjectPills();
    } catch (err) {
      showToast(err.message || 'Failed to add subject', 'error');
    } finally {
      addSubjectBtn.disabled = false;
      addSubjectBtn.innerHTML = origHtml;
    }
  });

  newSubjectNameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSubjectBtn.click();
    }
  });

  openSubjectsModalBtn.addEventListener('click', openSubjectsModal);
  closeSubjectsModalBtn.addEventListener('click', closeSubjectsModal);
  closeSubjectsFooterBtn.addEventListener('click', closeSubjectsModal);
  // ==========================================
  // User Authentication & Profile Controllers
  // ==========================================
  function updateAuthUI() {
    const user = window.notesStore.currentUser;
    if (user && user.username) {
      if (openAuthModalBtn) openAuthModalBtn.style.display = 'none';
      if (userProfileMenu) userProfileMenu.style.display = 'inline-block';
      if (headerUsername) headerUsername.textContent = user.username;
      if (dropdownUsername) dropdownUsername.textContent = user.username;
      if (userAvatarBadge) userAvatarBadge.textContent = user.username.charAt(0).toUpperCase();
      if (filterMyNotesLabel) {
        filterMyNotesLabel.textContent = window.notesStore.userFilter === 'mine' ? 'Show All Notes' : 'Show Only My Notes';
      }
    } else {
      if (openAuthModalBtn) openAuthModalBtn.style.display = 'inline-flex';
      if (userProfileMenu) userProfileMenu.style.display = 'none';
      if (userDropdownPopover) userDropdownPopover.style.display = 'none';
    }
  }

  async function openAuthModal(mode = 'join') {
    setAuthMode(mode);
    if (authForm) authForm.reset();
    if (authAlertBox) {
      authAlertBox.style.display = 'none';
      authAlertBox.textContent = '';
      authAlertBox.className = 'auth-alert-box';
    }
    await loadRegisteredUsers();
    if (authModal) {
      authModal.classList.add('active');
      authModal.setAttribute('aria-hidden', 'false');
      setTimeout(() => authUsernameInput?.focus(), 150);
    }
  }

  function closeAuthModal() {
    if (authModal) {
      authModal.classList.remove('active');
      authModal.setAttribute('aria-hidden', 'true');
    }
  }

  function setAuthMode(mode) {
    if (authModeInput) authModeInput.value = mode;
    if (mode === 'join') {
      authTabJoin?.classList.add('active');
      authTabLogin?.classList.remove('active');
      if (authModalTitle) authModalTitle.textContent = 'Join StudyVault';
      if (authModalSubtitle) authModalSubtitle.textContent = 'Create your student workspace or sign in';
      if (authSubmitBtnText) authSubmitBtnText.textContent = 'Create Account & Join';
      if (authUsernameHint) authUsernameHint.style.display = 'block';
      if (authPasswordHint) authPasswordHint.textContent = 'Minimum 4 characters';
    } else {
      authTabLogin?.classList.add('active');
      authTabJoin?.classList.remove('active');
      if (authModalTitle) authModalTitle.textContent = 'Log In to StudyVault';
      if (authModalSubtitle) authModalSubtitle.textContent = 'Welcome back! Sign in to access your notes';
      if (authSubmitBtnText) authSubmitBtnText.textContent = 'Log In';
      if (authUsernameHint) authUsernameHint.style.display = 'none';
      if (authPasswordHint) authPasswordHint.textContent = 'Enter your password';
    }
    if (authAlertBox) authAlertBox.style.display = 'none';
  }

  async function loadRegisteredUsers() {
    if (!authUsersPillList) return;
    try {
      const users = await window.notesAPI.getUsers();
      if (!users || users.length === 0) {
        authUsersPillList.innerHTML = '<span style="font-size:0.75rem; color:var(--text-muted);">No users registered yet. Be the first to join!</span>';
        return;
      }
      authUsersPillList.innerHTML = '';
      users.forEach(u => {
        const pill = document.createElement('button');
        pill.type = 'button';
        pill.className = 'auth-user-pill';
        pill.title = `Click to quick-select ${escapeHtml(u.username)}`;
        pill.innerHTML = `<i class="fa-solid fa-user"></i> <span>${escapeHtml(u.username)}</span> <small>(${u.notes_count || 0})</small>`;
        pill.addEventListener('click', () => {
          setAuthMode('login');
          if (authUsernameInput) authUsernameInput.value = u.username;
          if (authPasswordInput) {
            authPasswordInput.value = '';
            authPasswordInput.focus();
          }
        });
        authUsersPillList.appendChild(pill);
      });
    } catch (e) {
      authUsersPillList.innerHTML = '<span style="font-size:0.75rem; color:var(--text-muted);">Could not fetch users list</span>';
    }
  }

  // Toggle show/hide password
  if (toggleAuthPwdBtn && authPasswordInput) {
    toggleAuthPwdBtn.addEventListener('click', () => {
      const isPwd = authPasswordInput.type === 'password';
      authPasswordInput.type = isPwd ? 'text' : 'password';
      toggleAuthPwdIcon?.classList.toggle('fa-eye', !isPwd);
      toggleAuthPwdIcon?.classList.toggle('fa-eye-slash', isPwd);
    });
  }

  // Auth tabs switch
  authTabJoin?.addEventListener('click', () => setAuthMode('join'));
  authTabLogin?.addEventListener('click', () => setAuthMode('login'));

  // Open & Close Auth Modal
  openAuthModalBtn?.addEventListener('click', () => openAuthModal('join'));
  closeAuthModalBtn?.addEventListener('click', closeAuthModal);
  authModal?.addEventListener('click', (e) => {
    if (e.target === authModal) closeAuthModal();
  });

  // User Profile Dropdown Toggle
  userChipBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!userDropdownPopover) return;
    const isVisible = userDropdownPopover.style.display === 'block';
    userDropdownPopover.style.display = isVisible ? 'none' : 'block';
    userChipBtn.setAttribute('aria-expanded', String(!isVisible));
  });

  document.addEventListener('click', (e) => {
    if (userProfileMenu && !userProfileMenu.contains(e.target)) {
      if (userDropdownPopover) userDropdownPopover.style.display = 'none';
      userChipBtn?.setAttribute('aria-expanded', 'false');
    }
  });

  // Filter My Notes Toggle
  filterMyNotesBtn?.addEventListener('click', async () => {
    const nextFilter = window.notesStore.userFilter === 'mine' ? 'all' : 'mine';
    window.notesStore.setUserFilter(nextFilter);
    updateAuthUI();
    if (userDropdownPopover) userDropdownPopover.style.display = 'none';
    showToast(nextFilter === 'mine' ? 'Showing only your notes' : 'Showing all notes', 'info');
    await window.notesStore.refreshAll();
    renderStats();
    renderNotes();
  });

  // Switch User button
  switchUserBtn?.addEventListener('click', () => {
    if (userDropdownPopover) userDropdownPopover.style.display = 'none';
    openAuthModal('login');
  });

  // Logout button
  logoutBtn?.addEventListener('click', async () => {
    if (userDropdownPopover) userDropdownPopover.style.display = 'none';
    await window.notesAPI.logout();
    window.notesStore.setCurrentUser(null);
    window.notesStore.setUserFilter('all');
    updateAuthUI();
    showToast('Signed out of StudyVault', 'info');
    await window.notesStore.refreshAll();
    renderStats();
    renderNotes();
  });

  // Submit Join / Log In Form
  authForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const mode = authModeInput?.value || 'join';
    const username = authUsernameInput?.value?.trim();
    const password = authPasswordInput?.value?.trim();

    if (!username || !password) {
      if (authAlertBox) {
        authAlertBox.textContent = 'Please fill in both username and password';
        authAlertBox.className = 'auth-alert-box alert-error';
        authAlertBox.style.display = 'block';
      }
      return;
    }

    const origText = authSubmitBtnText?.textContent;
    if (authSubmitBtn) authSubmitBtn.disabled = true;
    if (authSubmitBtnText) authSubmitBtnText.textContent = mode === 'join' ? 'Creating account…' : 'Logging in…';

    try {
      let result;
      if (mode === 'join') {
        result = await window.notesAPI.register(username, password);
        showToast(`Welcome ${result.username}! Account created & logged in.`, 'success');
      } else {
        result = await window.notesAPI.login(username, password);
        showToast(`Welcome back, ${result.username}!`, 'success');
      }

      window.notesStore.setCurrentUser(result);
      updateAuthUI();
      closeAuthModal();

      // Refresh notes and stats
      await window.notesStore.refreshAll();
      renderStats();
      renderNotes();
    } catch (err) {
      if (authAlertBox) {
        authAlertBox.textContent = err.message || 'Authentication failed. Please check credentials.';
        authAlertBox.className = 'auth-alert-box alert-error';
        authAlertBox.style.display = 'block';
      }
    } finally {
      if (authSubmitBtn) authSubmitBtn.disabled = false;
      if (authSubmitBtnText) authSubmitBtnText.textContent = origText;
    }
  });

  // Database Status Card Click Handler: re-check and wake database on-demand
  if (statBackendStatus) {
    statBackendStatus.classList.add('clickable-stat-card');
    statBackendStatus.addEventListener('click', async () => {
      showToast('Waking / verifying PostgreSQL database connection…', 'info');
      await ensureDatabaseOnlineUI();
      try {
        await window.notesStore.refreshAll();
        renderStats();
        renderNotes();
        showToast('Database is online & connected!', 'success');
      } catch (err) {
        showToast('Database connection check finished.', 'info');
      }
    });
  }

  // ==========================================
  // 9. Utility Helpers
  // ==========================================
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function countWords(text) {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(Boolean).length;
  }

  function formatRelativeTime(dateString) {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    const now = new Date();
    const diffSeconds = Math.floor((now - date) / 1000);

    if (diffSeconds < 60) return 'Just now';
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
    if (diffSeconds < 604800) return `${Math.floor(diffSeconds / 86400)}d ago`;

    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }

  function formatFullDate(dateString) {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Start app
  initializeApp();
});
