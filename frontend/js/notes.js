/**
 * Student Notes Manager - Notes State & Operations (notes.js)
 */

class NotesStore {
  constructor() {
    this.notes = [];
    this.subjects = [];
    this.stats = {
      total_notes: 0,
      total_subjects: 0,
      total_pinned: 0,
      subjects: []
    };
    this.filters = {
      search: '',
      subject: 'all',
      tag: '',
      is_pinned: null,
      sort_by: 'newest',
      user_id: null
    };
    this.currentUser = window.notesAPI?.currentUser || null;
    this.userFilter = 'all'; // 'all' or 'mine'
    this.viewMode = localStorage.getItem('notes_view_mode') || 'grid';
    this.activeNote = null;
    this.isLoading = false;
  }

  setCurrentUser(user) {
    this.currentUser = user;
    if (window.notesAPI) {
      window.notesAPI.saveUserToStorage(user);
    }
  }

  setUserFilter(filterMode) {
    this.userFilter = filterMode;
    if (filterMode === 'mine' && this.currentUser?.id) {
      this.filters.user_id = this.currentUser.id;
    } else {
      this.filters.user_id = null;
    }
  }

  // Load notes from API with active filters
  async loadNotes() {
    this.isLoading = true;
    try {
      // Sync user filter
      if (this.userFilter === 'mine' && this.currentUser?.id) {
        this.filters.user_id = this.currentUser.id;
      } else {
        this.filters.user_id = null;
      }

      const data = await window.notesAPI.getNotes(this.filters);
      this.notes = data || [];
      return this.notes;
    } catch (error) {
      console.error('Failed to load notes:', error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  // Load stats & subjects
  async loadStats() {
    try {
      const userIdParam = this.userFilter === 'mine' && this.currentUser?.id ? this.currentUser.id : null;
      const [statsData, subjectsData] = await Promise.all([
        window.notesAPI.getStats(userIdParam).catch(() => null),
        window.notesAPI.getSubjects().catch(() => [])
      ]);

      if (statsData) {
        this.stats = statsData;
      }
      if (subjectsData) {
        this.subjects = subjectsData;
      }
      return { stats: this.stats, subjects: this.subjects };
    } catch (error) {
      console.error('Failed to load stats/subjects:', error);
    }
  }

  // Create note
  async addNote(noteData) {
    if (!noteData.user_id && this.currentUser?.id) {
      noteData.user_id = this.currentUser.id;
    }
    const created = await window.notesAPI.createNote(noteData);
    await this.refreshAll();
    return created;
  }

  // Update note
  async updateNote(id, noteData) {
    const updated = await window.notesAPI.updateNote(id, noteData);
    await this.refreshAll();
    return updated;
  }

  // Toggle pin
  async togglePin(id) {
    const updated = await window.notesAPI.togglePin(id);
    await this.refreshAll();
    return updated;
  }

  // Delete note
  async removeNote(id) {
    await window.notesAPI.deleteNote(id);
    await this.refreshAll();
  }

  // Refresh both notes and statistics
  async refreshAll() {
    await Promise.all([this.loadNotes(), this.loadStats()]);
  }

  // Filter setters
  setSearch(query) {
    this.filters.search = query;
  }

  setSubject(subject) {
    this.filters.subject = subject;
  }

  setTag(tag) {
    this.filters.tag = tag;
  }

  setSort(sortBy) {
    this.filters.sort_by = sortBy;
  }

  clearFilters() {
    this.filters.search = '';
    this.filters.subject = 'all';
    this.filters.tag = '';
    this.filters.user_id = null;
    this.userFilter = 'all';
  }

  setViewMode(mode) {
    this.viewMode = mode;
    localStorage.setItem('notes_view_mode', mode);
  }

  findNoteById(id) {
    return this.notes.find(n => n.id === parseInt(id, 10));
  }
}

// Global instance
window.notesStore = new NotesStore();
