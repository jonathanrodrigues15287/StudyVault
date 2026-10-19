/**
 * Student Notes Manager - Voice Note Studio (voice.js)
 * Manages SpeechRecognition (Web Speech API), audio wave animations,
 * live interim/final transcript streaming, and in-editor voice dictation.
 */

(function () {
  'use strict';

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
    const voiceNoteModal = document.getElementById('voiceNoteModal');
    const voiceStatusLabel = document.getElementById('voiceStatusLabel');
    const voiceToggleRecBtn = document.getElementById('voiceToggleRecBtn');

    if (!voiceNoteModal) return;

    resetVoiceModal();
    voiceNoteModal.classList.add('active');
    voiceNoteModal.setAttribute('aria-hidden', 'false');

    if (!SpeechRecognition) {
      if (voiceStatusLabel) {
        voiceStatusLabel.innerHTML = '<span style="color: var(--danger);"><i class="fa-solid fa-triangle-exclamation"></i> Speech Recognition is not supported in this browser. Please use Chrome, Edge, or Safari.</span>';
      }
      if (voiceToggleRecBtn) {
        voiceToggleRecBtn.disabled = true;
        voiceToggleRecBtn.style.opacity = '0.5';
      }
    }
  }

  function closeVoiceModal() {
    const voiceNoteModal = document.getElementById('voiceNoteModal');
    stopVoiceRecording();
    if (voiceNoteModal) {
      voiceNoteModal.classList.remove('active');
      voiceNoteModal.setAttribute('aria-hidden', 'true');
    }
  }

  function resetVoiceModal() {
    stopVoiceRecording();
    accumulatedVoiceText = '';

    const voiceTranscriptText = document.getElementById('voiceTranscriptText');
    const voiceDetectedTitle = document.getElementById('voiceDetectedTitle');
    const voiceDetectedSubject = document.getElementById('voiceDetectedSubject');
    const voiceCharCount = document.getElementById('voiceCharCount');
    const voiceTimerBadge = document.getElementById('voiceTimerBadge');
    const createFromVoiceBtn = document.getElementById('createFromVoiceBtn');
    const editVoiceInFormBtn = document.getElementById('editVoiceInFormBtn');
    const voiceStatusLabel = document.getElementById('voiceStatusLabel');
    const soundWaveBars = document.getElementById('soundWaveBars');
    const voiceStopBtn = document.getElementById('voiceStopBtn');
    const voiceRecorderHub = document.querySelector('.voice-recorder-hub');
    const voiceMicIcon = document.getElementById('voiceMicIcon');
    const voiceToggleRecBtn = document.getElementById('voiceToggleRecBtn');
    const liveTranscriptDisplay = document.getElementById('liveTranscriptDisplay');
    const liveTranscriptFinal = document.getElementById('liveTranscriptFinal');
    const liveTranscriptInterim = document.getElementById('liveTranscriptInterim');

    if (voiceTranscriptText) voiceTranscriptText.value = '';
    if (voiceDetectedTitle) voiceDetectedTitle.value = '';
    if (voiceDetectedSubject) voiceDetectedSubject.value = '';
    if (voiceCharCount) voiceCharCount.textContent = '0 words';
    if (voiceTimerBadge) voiceTimerBadge.textContent = '00:00';
    voiceSeconds = 0;

    if (createFromVoiceBtn) createFromVoiceBtn.disabled = true;
    if (editVoiceInFormBtn) editVoiceInFormBtn.style.display = 'none';
    if (voiceStatusLabel) voiceStatusLabel.textContent = 'Click the microphone to start speaking';
    if (soundWaveBars) soundWaveBars.style.display = 'none';
    if (voiceStopBtn) voiceStopBtn.style.display = 'none';
    if (voiceRecorderHub) voiceRecorderHub.classList.remove('recording');
    if (voiceMicIcon) voiceMicIcon.className = 'fa-solid fa-microphone';
    if (voiceToggleRecBtn) {
      voiceToggleRecBtn.classList.remove('is-recording');
      voiceToggleRecBtn.setAttribute('title', 'Start Recording');
    }
    if (liveTranscriptDisplay) liveTranscriptDisplay.style.display = 'none';
    if (liveTranscriptFinal) liveTranscriptFinal.textContent = '';
    if (liveTranscriptInterim) liveTranscriptInterim.textContent = '';
  }

  function toggleVoiceRecording() {
    if (!SpeechRecognition) {
      if (typeof window.showToast === 'function') {
        window.showToast('Speech recognition not supported in this browser. Try Chrome or Edge.', 'error');
      }
      return;
    }

    if (isVoiceRecording) {
      stopVoiceRecording();
    } else {
      startVoiceRecording();
    }
  }

  function startVoiceRecording() {
    const voiceRecorderHub = document.querySelector('.voice-recorder-hub');
    const voiceToggleRecBtn = document.getElementById('voiceToggleRecBtn');
    const voiceMicIcon = document.getElementById('voiceMicIcon');
    const voiceStopBtn = document.getElementById('voiceStopBtn');
    const soundWaveBars = document.getElementById('soundWaveBars');
    const voiceStatusLabel = document.getElementById('voiceStatusLabel');
    const liveTranscriptDisplay = document.getElementById('liveTranscriptDisplay');
    const liveTranscriptFinal = document.getElementById('liveTranscriptFinal');
    const liveTranscriptInterim = document.getElementById('liveTranscriptInterim');
    const liveWordCounter = document.getElementById('liveWordCounter');
    const voiceTranscriptText = document.getElementById('voiceTranscriptText');
    const createFromVoiceBtn = document.getElementById('createFromVoiceBtn');
    const editVoiceInFormBtn = document.getElementById('editVoiceInFormBtn');
    const voiceDetectedTitle = document.getElementById('voiceDetectedTitle');
    const voiceDetectedSubject = document.getElementById('voiceDetectedSubject');

    try {
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
      if (voiceRecorderHub) voiceRecorderHub.classList.add('recording');
      if (voiceToggleRecBtn) {
        voiceToggleRecBtn.classList.add('is-recording');
        voiceToggleRecBtn.setAttribute('title', 'Stop Recording & Audio');
      }
      if (voiceMicIcon) voiceMicIcon.className = 'fa-solid fa-stop';
      if (voiceStopBtn) voiceStopBtn.style.display = 'inline-flex';
      if (soundWaveBars) soundWaveBars.style.display = 'flex';
      if (voiceStatusLabel) voiceStatusLabel.textContent = 'Listening... Speak your study notes clearly.';

      if (liveTranscriptDisplay) liveTranscriptDisplay.style.display = 'block';
      if (liveTranscriptFinal) liveTranscriptFinal.textContent = accumulatedVoiceText;
      if (liveTranscriptInterim) liveTranscriptInterim.textContent = '';

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

        if (liveTranscriptFinal) liveTranscriptFinal.textContent = accumulatedVoiceText;
        if (liveTranscriptInterim) liveTranscriptInterim.textContent = interimTranscript ? ' ' + interimTranscript : '';

        const totalWords = window.countWords ? window.countWords(accumulatedVoiceText + ' ' + interimTranscript) : 0;
        if (liveWordCounter) liveWordCounter.textContent = `${totalWords} word${totalWords !== 1 ? 's' : ''}`;

        if (voiceTranscriptText) {
          voiceTranscriptText.value = accumulatedVoiceText.trim();
        }
        updateVoiceWordCount();

        if (accumulatedVoiceText.trim().length > 0 || interimTranscript.length > 0) {
          if (createFromVoiceBtn) createFromVoiceBtn.disabled = false;
          if (editVoiceInFormBtn) editVoiceInFormBtn.style.display = 'inline-flex';

          if (accumulatedVoiceText.trim()) {
            if (voiceDetectedTitle && typeof window.extractTitleFromText === 'function') {
              voiceDetectedTitle.value = window.extractTitleFromText(accumulatedVoiceText.trim());
            }
            if (voiceDetectedSubject && typeof window.inferSubjectFromText === 'function') {
              voiceDetectedSubject.value = window.inferSubjectFromText(accumulatedVoiceText.trim());
            }
          }
        }
      };

      voiceRecognition.onerror = (event) => {
        console.warn('Speech recognition notice/error:', event.error);
        if (event.error === 'not-allowed') {
          if (typeof window.showToast === 'function') {
            window.showToast('Microphone access denied. Please allow microphone in browser.', 'error');
          }
          stopVoiceRecording();
        } else if (event.error !== 'no-speech') {
          if (typeof window.showToast === 'function') {
            window.showToast(`Voice notice: ${event.error}`, 'info');
          }
        }
      };

      voiceRecognition.onend = () => {
        if (isVoiceRecording && voiceRecognition) {
          try {
            voiceRecognition.start();
          } catch (e) {}
        }
      };

      voiceRecognition.start();
      if (typeof window.showToast === 'function') {
        window.showToast('Microphone active. Start speaking!', 'info');
      }
    } catch (err) {
      console.error('Failed to start voice recognition:', err);
      if (typeof window.showToast === 'function') {
        window.showToast('Could not start microphone: ' + err.message, 'error');
      }
      stopVoiceRecording();
    }
  }

  function stopVoiceRecording() {
    isVoiceRecording = false;
    clearInterval(voiceTimerInterval);

    const liveTranscriptInterim = document.getElementById('liveTranscriptInterim');
    const liveTranscriptDisplay = document.getElementById('liveTranscriptDisplay');
    const voiceTranscriptText = document.getElementById('voiceTranscriptText');
    const voiceDetectedTitle = document.getElementById('voiceDetectedTitle');
    const voiceDetectedSubject = document.getElementById('voiceDetectedSubject');
    const voiceRecorderHub = document.querySelector('.voice-recorder-hub');
    const voiceToggleRecBtn = document.getElementById('voiceToggleRecBtn');
    const voiceMicIcon = document.getElementById('voiceMicIcon');
    const soundWaveBars = document.getElementById('soundWaveBars');
    const voiceStopBtn = document.getElementById('voiceStopBtn');
    const voiceStatusLabel = document.getElementById('voiceStatusLabel');
    const createFromVoiceBtn = document.getElementById('createFromVoiceBtn');
    const editVoiceInFormBtn = document.getElementById('editVoiceInFormBtn');

    if (liveTranscriptInterim && liveTranscriptInterim.textContent.trim()) {
      const interim = liveTranscriptInterim.textContent.trim();
      accumulatedVoiceText = (accumulatedVoiceText + ' ' + interim).trim();
      if (voiceTranscriptText) voiceTranscriptText.value = accumulatedVoiceText;
      updateVoiceWordCount();
      if (voiceDetectedTitle && !voiceDetectedTitle.value && typeof window.extractTitleFromText === 'function') {
        voiceDetectedTitle.value = window.extractTitleFromText(accumulatedVoiceText);
      }
      if (voiceDetectedSubject && !voiceDetectedSubject.value && typeof window.inferSubjectFromText === 'function') {
        voiceDetectedSubject.value = window.inferSubjectFromText(accumulatedVoiceText);
      }
    }

    if (voiceRecognition) {
      const rec = voiceRecognition;
      voiceRecognition = null;
      rec.onresult = null;
      rec.onerror = null;
      rec.onend = null;
      try {
        rec.abort();
      } catch (e) {
        try { rec.stop(); } catch (e2) {}
      }
    }

    if (voiceRecorderHub) voiceRecorderHub.classList.remove('recording');
    if (voiceToggleRecBtn) {
      voiceToggleRecBtn.classList.remove('is-recording');
      voiceToggleRecBtn.setAttribute('title', 'Start Recording');
    }
    if (voiceMicIcon) voiceMicIcon.className = 'fa-solid fa-microphone';
    if (soundWaveBars) soundWaveBars.style.display = 'none';
    if (voiceStopBtn) voiceStopBtn.style.display = 'none';
    if (liveTranscriptInterim) liveTranscriptInterim.textContent = '';
    if (liveTranscriptDisplay) liveTranscriptDisplay.style.display = 'none';

    if (voiceTranscriptText && voiceTranscriptText.value.trim()) {
      if (voiceStatusLabel) {
        voiceStatusLabel.innerHTML = '<span class="mic-status-off"><i class="fa-solid fa-microphone-slash"></i> Audio stopped. Review or save your note below, or click microphone to record more.</span>';
      }
      if (createFromVoiceBtn) createFromVoiceBtn.disabled = false;
      if (editVoiceInFormBtn) editVoiceInFormBtn.style.display = 'inline-flex';
    } else {
      if (voiceStatusLabel) {
        voiceStatusLabel.innerHTML = '<span class="mic-status-off"><i class="fa-solid fa-microphone-slash"></i> Microphone is off. Click the microphone when you want to start again.</span>';
      }
    }
  }

  function updateVoiceTimerDisplay() {
    const voiceTimerBadge = document.getElementById('voiceTimerBadge');
    if (!voiceTimerBadge) return;
    const mins = String(Math.floor(voiceSeconds / 60)).padStart(2, '0');
    const secs = String(voiceSeconds % 60).padStart(2, '0');
    voiceTimerBadge.textContent = `${mins}:${secs}`;
  }

  function updateVoiceWordCount() {
    const voiceTranscriptText = document.getElementById('voiceTranscriptText');
    const voiceCharCount = document.getElementById('voiceCharCount');
    if (!voiceTranscriptText || !voiceCharCount) return;
    const words = window.countWords ? window.countWords(voiceTranscriptText.value) : 0;
    voiceCharCount.textContent = `${words} word${words === 1 ? '' : 's'}`;
  }

  // ==========================================
  // In-Editor Live Voice Dictation
  // ==========================================
  function toggleEditorDictation() {
    if (!SpeechRecognition) {
      if (typeof window.showToast === 'function') {
        window.showToast('Speech recognition is not supported in this browser. Try Chrome or Edge.', 'error');
      }
      return;
    }

    if (isEditorDictating) {
      stopEditorDictation();
    } else {
      startEditorDictation();
    }
  }

  function startEditorDictation() {
    const editorVoiceDictateBtn = document.getElementById('editorVoiceDictateBtn');
    const noteContentInput = document.getElementById('noteContentInput');

    try {
      editorRecognition = new SpeechRecognition();
      editorRecognition.continuous = true;
      editorRecognition.interimResults = false;
      editorRecognition.lang = 'en-US';

      isEditorDictating = true;
      if (editorVoiceDictateBtn) {
        editorVoiceDictateBtn.classList.add('recording');
        editorVoiceDictateBtn.innerHTML = '<i class="fa-solid fa-microphone-slash"></i> Stop Dictating';
      }
      if (typeof window.showToast === 'function') {
        window.showToast('Listening... Dictating into note content', 'info');
      }

      editorRecognition.onresult = (e) => {
        let text = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          if (e.results[i].isFinal) {
            text += e.results[i][0].transcript + ' ';
          }
        }
        if (text && noteContentInput) {
          const current = noteContentInput.value;
          noteContentInput.value = (current ? current + '\n' : '') + text.trim();
          if (typeof window.updateCharCount === 'function') window.updateCharCount();
        }
      };

      editorRecognition.onerror = (e) => {
        if (e.error === 'not-allowed') {
          if (typeof window.showToast === 'function') window.showToast('Microphone access denied', 'error');
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
      if (typeof window.showToast === 'function') {
        window.showToast('Could not start dictation: ' + err.message, 'error');
      }
      stopEditorDictation();
    }
  }

  function stopEditorDictation() {
    const editorVoiceDictateBtn = document.getElementById('editorVoiceDictateBtn');
    isEditorDictating = false;
    if (editorRecognition) {
      const rec = editorRecognition;
      editorRecognition = null;
      rec.onresult = null;
      rec.onerror = null;
      rec.onend = null;
      try {
        rec.abort();
      } catch (e) {
        try { rec.stop(); } catch (e2) {}
      }
    }
    if (editorVoiceDictateBtn) {
      editorVoiceDictateBtn.classList.remove('recording');
      editorVoiceDictateBtn.innerHTML = '<i class="fa-solid fa-microphone"></i> Dictate Voice';
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const openVoiceModalBtn = document.getElementById('openVoiceModalBtn');
    const closeVoiceModalBtn = document.getElementById('closeVoiceModalBtn');
    const cancelVoiceModalBtn = document.getElementById('cancelVoiceModalBtn');
    const voiceNoteModal = document.getElementById('voiceNoteModal');
    const voiceToggleRecBtn = document.getElementById('voiceToggleRecBtn');
    const voiceStopBtn = document.getElementById('voiceStopBtn');
    const clearVoiceTranscriptBtn = document.getElementById('clearVoiceTranscriptBtn');
    const createFromVoiceBtn = document.getElementById('createFromVoiceBtn');
    const editVoiceInFormBtn = document.getElementById('editVoiceInFormBtn');
    const voiceTranscriptText = document.getElementById('voiceTranscriptText');
    const voiceDetectedTitle = document.getElementById('voiceDetectedTitle');
    const voiceDetectedSubject = document.getElementById('voiceDetectedSubject');
    const voiceDetectedTags = document.getElementById('voiceDetectedTags');
    const editorVoiceDictateBtn = document.getElementById('editorVoiceDictateBtn');

    if (openVoiceModalBtn) openVoiceModalBtn.addEventListener('click', () => openVoiceModal());
    if (closeVoiceModalBtn) closeVoiceModalBtn.addEventListener('click', closeVoiceModal);
    if (cancelVoiceModalBtn) cancelVoiceModalBtn.addEventListener('click', closeVoiceModal);

    if (voiceNoteModal) {
      voiceNoteModal.addEventListener('click', (e) => {
        if (e.target === voiceNoteModal) closeVoiceModal();
      });
    }

    if (voiceToggleRecBtn) voiceToggleRecBtn.addEventListener('click', toggleVoiceRecording);
    if (voiceStopBtn) voiceStopBtn.addEventListener('click', stopVoiceRecording);

    if (clearVoiceTranscriptBtn) {
      clearVoiceTranscriptBtn.addEventListener('click', () => {
        accumulatedVoiceText = '';
        if (voiceTranscriptText) voiceTranscriptText.value = '';
        if (voiceDetectedTitle) voiceDetectedTitle.value = '';
        const voiceCharCount = document.getElementById('voiceCharCount');
        if (voiceCharCount) voiceCharCount.textContent = '0 words';
        if (createFromVoiceBtn) createFromVoiceBtn.disabled = true;
        if (editVoiceInFormBtn) editVoiceInFormBtn.style.display = 'none';

        const liveTranscriptFinal = document.getElementById('liveTranscriptFinal');
        const liveTranscriptInterim = document.getElementById('liveTranscriptInterim');
        const liveWordCounter = document.getElementById('liveWordCounter');
        const liveTranscriptDisplay = document.getElementById('liveTranscriptDisplay');

        if (liveTranscriptFinal) liveTranscriptFinal.textContent = '';
        if (liveTranscriptInterim) liveTranscriptInterim.textContent = '';
        if (liveWordCounter) liveWordCounter.textContent = '0 words';
        if (!isVoiceRecording && liveTranscriptDisplay) liveTranscriptDisplay.style.display = 'none';

        if (typeof window.showToast === 'function') window.showToast('Transcript cleared', 'info');
      });
    }

    if (voiceTranscriptText) {
      voiceTranscriptText.addEventListener('input', () => {
        updateVoiceWordCount();
        const txt = voiceTranscriptText.value.trim();
        if (createFromVoiceBtn) createFromVoiceBtn.disabled = txt.length === 0;
        if (editVoiceInFormBtn) editVoiceInFormBtn.style.display = txt.length > 0 ? 'inline-flex' : 'none';
        if (txt.length > 0 && voiceDetectedTitle && !voiceDetectedTitle.value && typeof window.extractTitleFromText === 'function') {
          voiceDetectedTitle.value = window.extractTitleFromText(txt);
        }
      });
    }

    // Save Voice Note Directly
    if (createFromVoiceBtn) {
      createFromVoiceBtn.addEventListener('click', async () => {
        stopVoiceRecording();

        const content = voiceTranscriptText ? voiceTranscriptText.value.trim() : '';
        if (!content) {
          if (typeof window.showToast === 'function') window.showToast('Please record or speak some note content first.', 'error');
          return;
        }

        const title = ((voiceDetectedTitle && voiceDetectedTitle.value.trim()) || (window.extractTitleFromText && window.extractTitleFromText(content)) || 'Voice Study Note').substring(0, 180);
        const subject = (voiceDetectedSubject && voiceDetectedSubject.value.trim()) || (window.inferSubjectFromText && window.inferSubjectFromText(content)) || 'General';
        const tags = (voiceDetectedTags && voiceDetectedTags.value.trim()) || 'voice, dictation';

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
          if (typeof window.showToast === 'function') {
            window.showToast('Voice note saved successfully as a note!', 'success');
          }
          if (typeof window.renderStats === 'function') window.renderStats();
          if (typeof window.renderSubjectPills === 'function') window.renderSubjectPills();
          if (typeof window.renderNotes === 'function') window.renderNotes();
        } catch (err) {
          console.error('Failed to save voice note:', err);
          if (typeof window.showToast === 'function') {
            window.showToast(err.message || 'Failed to save voice note', 'error');
          }
        } finally {
          createFromVoiceBtn.disabled = false;
          createFromVoiceBtn.innerHTML = origHtml;
        }
      });
    }

    // Edit in Form action before saving
    if (editVoiceInFormBtn) {
      editVoiceInFormBtn.addEventListener('click', () => {
        stopVoiceRecording();

        const content = voiceTranscriptText ? voiceTranscriptText.value.trim() : '';
        if (!content) {
          if (typeof window.showToast === 'function') window.showToast('No voice note content to edit yet.', 'error');
          return;
        }

        const title = ((voiceDetectedTitle && voiceDetectedTitle.value.trim()) || (window.extractTitleFromText && window.extractTitleFromText(content)) || 'Voice Study Note').substring(0, 180);
        const subject = (voiceDetectedSubject && voiceDetectedSubject.value.trim()) || (window.inferSubjectFromText && window.inferSubjectFromText(content)) || 'General';
        const tags = (voiceDetectedTags && voiceDetectedTags.value.trim()) || 'voice, dictation';

        closeVoiceModal();

        if (typeof window.openEditorModal === 'function') {
          window.openEditorModal({
            title,
            content,
            subject,
            tags: tags.split(',').map(t => t.trim()),
            color: 'rose',
            is_pinned: false
          });
        }

        if (typeof window.showToast === 'function') {
          window.showToast('Voice note imported into editor. Click Save Note when ready.', 'info');
        }
      });
    }

    if (editorVoiceDictateBtn) {
      editorVoiceDictateBtn.addEventListener('click', toggleEditorDictation);
    }

    // Safety release on page navigation/unload
    window.addEventListener('beforeunload', () => {
      stopVoiceRecording();
      stopEditorDictation();
    });
  });

  window.openVoiceModal = openVoiceModal;
  window.closeVoiceModal = closeVoiceModal;
  window.toggleVoiceRecording = toggleVoiceRecording;
  window.stopVoiceRecording = stopVoiceRecording;
  window.toggleEditorDictation = toggleEditorDictation;
  window.stopEditorDictation = stopEditorDictation;
})();
