/**
 * Student Notes Manager - Authentication & User Profiles (auth.js)
 * Manages user registration, login, 8-16 char password validation,
 * profile popover dropdown, and personal note filtering.
 */

(function () {
  'use strict';

  function updateAuthUI() {
    const openAuthModalBtn = document.getElementById('openAuthModalBtn');
    const userProfileMenu = document.getElementById('userProfileMenu');
    const userDropdownPopover = document.getElementById('userDropdownPopover');
    const headerUsername = document.getElementById('headerUsername');
    const dropdownUsername = document.getElementById('dropdownUsername');
    const userAvatarBadge = document.getElementById('userAvatarBadge');
    const filterMyNotesLabel = document.getElementById('filterMyNotesLabel');

    const user = window.notesStore ? window.notesStore.currentUser : null;
    if (user && user.username) {
      if (openAuthModalBtn) openAuthModalBtn.style.display = 'none';
      if (userProfileMenu) userProfileMenu.style.display = 'inline-block';
      if (headerUsername) headerUsername.textContent = user.username;
      if (dropdownUsername) dropdownUsername.textContent = user.username;
      if (userAvatarBadge) userAvatarBadge.textContent = user.username.charAt(0).toUpperCase();
      if (filterMyNotesLabel && window.notesStore) {
        filterMyNotesLabel.textContent = window.notesStore.userFilter === 'mine' ? 'Show All Notes' : 'Show Only My Notes';
      }
    } else {
      if (openAuthModalBtn) openAuthModalBtn.style.display = 'inline-flex';
      if (userProfileMenu) userProfileMenu.style.display = 'none';
      if (userDropdownPopover) userDropdownPopover.style.display = 'none';
    }
  }

  async function openAuthModal(mode = 'join') {
    const authModal = document.getElementById('authModal');
    const authForm = document.getElementById('authForm');
    const authAlertBox = document.getElementById('authAlertBox');
    const authUsernameInput = document.getElementById('authUsernameInput');

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
      setTimeout(() => {
        if (authUsernameInput) authUsernameInput.focus();
      }, 150);
    }
  }

  function closeAuthModal() {
    const authModal = document.getElementById('authModal');
    if (authModal) {
      authModal.classList.remove('active');
      authModal.setAttribute('aria-hidden', 'true');
    }
  }

  function setAuthMode(mode) {
    const authModeInput = document.getElementById('authModeInput');
    const authTabJoin = document.getElementById('authTabJoin');
    const authTabLogin = document.getElementById('authTabLogin');
    const authModalTitle = document.getElementById('authModalTitle');
    const authModalSubtitle = document.getElementById('authModalSubtitle');
    const authSubmitBtnText = document.getElementById('authSubmitBtnText');
    const authUsernameHint = document.getElementById('authUsernameHint');
    const authPasswordHint = document.getElementById('authPasswordHint');
    const authAlertBox = document.getElementById('authAlertBox');

    if (authModeInput) authModeInput.value = mode;
    if (mode === 'join') {
      if (authTabJoin) authTabJoin.classList.add('active');
      if (authTabLogin) authTabLogin.classList.remove('active');
      if (authModalTitle) authModalTitle.textContent = 'Join StudyVault';
      if (authModalSubtitle) authModalSubtitle.textContent = 'Create your student workspace or sign in';
      if (authSubmitBtnText) authSubmitBtnText.textContent = 'Create Account & Join';
      if (authUsernameHint) authUsernameHint.style.display = 'block';
      if (authPasswordHint) authPasswordHint.textContent = '8–16 characters required';
    } else {
      if (authTabLogin) authTabLogin.classList.add('active');
      if (authTabJoin) authTabJoin.classList.remove('active');
      if (authModalTitle) authModalTitle.textContent = 'Log In to StudyVault';
      if (authModalSubtitle) authModalSubtitle.textContent = 'Welcome back! Sign in to access your notes';
      if (authSubmitBtnText) authSubmitBtnText.textContent = 'Log In';
      if (authUsernameHint) authUsernameHint.style.display = 'none';
      if (authPasswordHint) authPasswordHint.textContent = '8–16 characters required';
    }
    if (authAlertBox) authAlertBox.style.display = 'none';
  }

  async function loadRegisteredUsers() {
    const authUsersPillList = document.getElementById('authUsersPillList');
    const authUsernameInput = document.getElementById('authUsernameInput');
    const authPasswordInput = document.getElementById('authPasswordInput');

    if (!authUsersPillList || !window.notesAPI) return;

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
        const safeUsername = window.escapeHtml ? window.escapeHtml(u.username) : u.username;
        pill.title = `Click to quick-select ${safeUsername}`;
        pill.innerHTML = `<i class="fa-solid fa-user"></i> <span>${safeUsername}</span> <small>(${u.notes_count || 0})</small>`;
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

  document.addEventListener('DOMContentLoaded', () => {
    const openAuthModalBtn = document.getElementById('openAuthModalBtn');
    const closeAuthModalBtn = document.getElementById('closeAuthModalBtn');
    const authModal = document.getElementById('authModal');
    const authTabJoin = document.getElementById('authTabJoin');
    const authTabLogin = document.getElementById('authTabLogin');
    const toggleAuthPwdBtn = document.getElementById('toggleAuthPwdBtn');
    const toggleAuthPwdIcon = document.getElementById('toggleAuthPwdIcon');
    const authPasswordInput = document.getElementById('authPasswordInput');
    const userChipBtn = document.getElementById('userChipBtn');
    const userProfileMenu = document.getElementById('userProfileMenu');
    const userDropdownPopover = document.getElementById('userDropdownPopover');
    const filterMyNotesBtn = document.getElementById('filterMyNotesBtn');
    const switchUserBtn = document.getElementById('switchUserBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const authForm = document.getElementById('authForm');
    const authModeInput = document.getElementById('authModeInput');
    const authUsernameInput = document.getElementById('authUsernameInput');
    const authAlertBox = document.getElementById('authAlertBox');
    const authSubmitBtn = document.getElementById('authSubmitBtn');
    const authSubmitBtnText = document.getElementById('authSubmitBtnText');

    // Toggle show/hide password
    if (toggleAuthPwdBtn && authPasswordInput) {
      toggleAuthPwdBtn.addEventListener('click', () => {
        const isPwd = authPasswordInput.type === 'password';
        authPasswordInput.type = isPwd ? 'text' : 'password';
        if (toggleAuthPwdIcon) {
          toggleAuthPwdIcon.classList.toggle('fa-eye', !isPwd);
          toggleAuthPwdIcon.classList.toggle('fa-eye-slash', isPwd);
        }
      });
    }

    // Auth tabs switch
    if (authTabJoin) authTabJoin.addEventListener('click', () => setAuthMode('join'));
    if (authTabLogin) authTabLogin.addEventListener('click', () => setAuthMode('login'));

    // Open & Close Auth Modal
    if (openAuthModalBtn) openAuthModalBtn.addEventListener('click', () => openAuthModal('join'));
    if (closeAuthModalBtn) closeAuthModalBtn.addEventListener('click', closeAuthModal);

    if (authModal) {
      authModal.addEventListener('click', (e) => {
        if (e.target === authModal) closeAuthModal();
      });
    }

    // User Profile Dropdown Toggle
    if (userChipBtn) {
      userChipBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!userDropdownPopover) return;
        const isVisible = userDropdownPopover.style.display === 'block';
        userDropdownPopover.style.display = isVisible ? 'none' : 'block';
        userChipBtn.setAttribute('aria-expanded', String(!isVisible));
      });
    }

    document.addEventListener('click', (e) => {
      if (userProfileMenu && !userProfileMenu.contains(e.target)) {
        if (userDropdownPopover) userDropdownPopover.style.display = 'none';
        if (userChipBtn) userChipBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Filter My Notes Toggle
    if (filterMyNotesBtn) {
      filterMyNotesBtn.addEventListener('click', async () => {
        if (!window.notesStore) return;
        const nextFilter = window.notesStore.userFilter === 'mine' ? 'all' : 'mine';
        window.notesStore.setUserFilter(nextFilter);
        updateAuthUI();
        if (userDropdownPopover) userDropdownPopover.style.display = 'none';
        if (typeof window.showToast === 'function') {
          window.showToast(nextFilter === 'mine' ? 'Showing only your notes' : 'Showing all notes', 'info');
        }
        await window.notesStore.refreshAll();
        if (typeof window.renderStats === 'function') window.renderStats();
        if (typeof window.renderNotes === 'function') window.renderNotes();
      });
    }

    // Switch User button
    if (switchUserBtn) {
      switchUserBtn.addEventListener('click', () => {
        if (userDropdownPopover) userDropdownPopover.style.display = 'none';
        openAuthModal('login');
      });
    }

    // Logout button
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        if (userDropdownPopover) userDropdownPopover.style.display = 'none';
        if (window.notesAPI) await window.notesAPI.logout();
        if (window.notesStore) {
          window.notesStore.setCurrentUser(null);
          window.notesStore.setUserFilter('all');
        }
        updateAuthUI();
        if (typeof window.showToast === 'function') {
          window.showToast('Signed out of StudyVault', 'info');
        }
        if (window.notesStore) {
          await window.notesStore.refreshAll();
          if (typeof window.renderStats === 'function') window.renderStats();
          if (typeof window.renderNotes === 'function') window.renderNotes();
        }
      });
    }

    // Submit Join / Log In Form
    if (authForm) {
      authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const mode = (authModeInput && authModeInput.value) || 'join';
        const username = authUsernameInput ? authUsernameInput.value.trim() : '';
        const password = authPasswordInput ? authPasswordInput.value.trim() : '';

        if (!username || !password) {
          if (authAlertBox) {
            authAlertBox.textContent = 'Please fill in both username and password';
            authAlertBox.className = 'auth-alert-box alert-error';
            authAlertBox.style.display = 'block';
          }
          return;
        }

        // Enforce 8 to 16 characters password constraint
        if (password.length < 8 || password.length > 16) {
          if (authAlertBox) {
            authAlertBox.textContent = 'Password must be between 8 and 16 characters.';
            authAlertBox.className = 'auth-alert-box alert-error';
            authAlertBox.style.display = 'block';
          }
          return;
        }

        const origText = authSubmitBtnText ? authSubmitBtnText.textContent : '';
        if (authSubmitBtn) authSubmitBtn.disabled = true;
        if (authSubmitBtnText) authSubmitBtnText.textContent = mode === 'join' ? 'Creating account…' : 'Logging in…';

        try {
          let result;
          if (mode === 'join') {
            result = await window.notesAPI.register(username, password);
            if (typeof window.showToast === 'function') {
              window.showToast(`Welcome ${result.username}! Account created & logged in.`, 'success');
            }
          } else {
            result = await window.notesAPI.login(username, password);
            if (typeof window.showToast === 'function') {
              window.showToast(`Welcome back, ${result.username}!`, 'success');
            }
          }

          if (window.notesStore) {
            window.notesStore.setCurrentUser(result);
          }
          updateAuthUI();
          closeAuthModal();

          if (window.notesStore) {
            await window.notesStore.refreshAll();
            if (typeof window.renderStats === 'function') window.renderStats();
            if (typeof window.renderNotes === 'function') window.renderNotes();
          }
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
    }
  });

  window.updateAuthUI = updateAuthUI;
  window.openAuthModal = openAuthModal;
  window.closeAuthModal = closeAuthModal;
})();
