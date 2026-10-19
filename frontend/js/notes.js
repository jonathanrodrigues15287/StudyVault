/**
 * Student Notes Manager - Notes State & Operations (notes.js)
 * Manages store state with strict per-user note isolation.
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
    this.currentUser = window.notesAPI?.currentUser || null;
    this.filters = {
      search: '',
      subject: 'all',
      tag: '',
      is_pinned: null,
      sort_by: 'newest',
      user_id: this.currentUser?.id || null
    };
    this.viewMode = localStorage.getItem('notes_view_mode') || 'grid';
    this.activeNote = null;
    this.isLoading = false;
  }

  setCurrentUser(user) {
    this.currentUser = user;
    if (this.currentUser?.id) {
      this.filters.user_id = this.currentUser.id;
    } else {
      this.filters.user_id = null;
    }
    if (window.notesAPI) {
      window.notesAPI.saveUserToStorage(user);
    }
  }

  // Load notes strictly belonging to current authenticated user
  async loadNotes() {
    this.isLoading = true;
    try {
      if (!this.currentUser?.id) {
        this.notes = [];
        return this.notes;
      }

      this.filters.user_id = this.currentUser.id;
      const data = await window.notesAPI.getNotes(this.filters);

      // Strict client-side guarantee: only notes matching currentUser.id
      this.notes = (data || []).filter(n => n.user_id === this.currentUser.id);
      return this.notes;
    } catch (error) {
      console.error('Failed to load notes:', error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  // Load stats & subjects strictly for current user
  async loadStats() {
    try {
      const userIdParam = this.currentUser?.id || null;
      if (!userIdParam) {
        this.stats = { total_notes: 0, total_subjects: 0, total_pinned: 0, subjects: [] };
        this.subjects = [];
        return { stats: this.stats, subjects: this.subjects };
      }

      const [statsData, subjectsData] = await Promise.all([
        window.notesAPI.getStats(userIdParam).catch(() => null),
        window.notesAPI.getSubjects(userIdParam).catch(() => [])
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
    if (this.currentUser?.id) {
      noteData.user_id = this.currentUser.id;
      noteData.author = this.currentUser.username;
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

  // Refresh both notes and statistics for current user
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
    this.filters.user_id = this.currentUser?.id || null;
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
