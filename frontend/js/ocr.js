/**
 * Student Notes Manager - Smart OCR Scanner (ocr.js)
 * Manages Tesseract.js optical character recognition, image dropzone,
 * laser scan animation, and academic subject/title classification.
 */

(function () {
  'use strict';

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
    const activeSub = window.notesStore ? window.notesStore.filters.subject : '';
    return (activeSub && activeSub !== 'all') ? activeSub : 'General';
  }

  function openOcrModal(initialImageFile = null) {
    const ocrScannerModal = document.getElementById('ocrScannerModal');
    if (!ocrScannerModal) return;

    resetOcrModal();
    ocrScannerModal.classList.add('active');
    ocrScannerModal.setAttribute('aria-hidden', 'false');

    if (initialImageFile) {
      processImageWithOcr(initialImageFile);
    }
  }

  function closeOcrModal() {
    const ocrScannerModal = document.getElementById('ocrScannerModal');
    if (ocrScannerModal) {
      ocrScannerModal.classList.remove('active');
      ocrScannerModal.setAttribute('aria-hidden', 'true');
    }
  }

  function resetOcrModal() {
    const ocrDropzone = document.getElementById('ocrDropzone');
    const ocrPreviewContainer = document.getElementById('ocrPreviewContainer');
    const ocrResultsContainer = document.getElementById('ocrResultsContainer');
    const rescanOcrBtn = document.getElementById('rescanOcrBtn');
    const editOcrInFormBtn = document.getElementById('editOcrInFormBtn');
    const createFromOcrBtn = document.getElementById('createFromOcrBtn');
    const cancelOcrModalBtn = document.getElementById('cancelOcrModalBtn');
    const ocrPreviewImg = document.getElementById('ocrPreviewImg');
    const ocrProgressBar = document.getElementById('ocrProgressBar');
    const ocrPercentText = document.getElementById('ocrPercentText');
    const ocrStatusText = document.getElementById('ocrStatusText');
    const ocrDetectedTitle = document.getElementById('ocrDetectedTitle');
    const ocrDetectedSubject = document.getElementById('ocrDetectedSubject');
    const ocrExtractedText = document.getElementById('ocrExtractedText');
    const ocrCharCount = document.getElementById('ocrCharCount');
    const ocrFileInput = document.getElementById('ocrFileInput');

    if (ocrDropzone) ocrDropzone.style.display = 'block';
    if (ocrPreviewContainer) ocrPreviewContainer.style.display = 'none';
    if (ocrResultsContainer) ocrResultsContainer.style.display = 'none';
    if (rescanOcrBtn) rescanOcrBtn.style.display = 'none';
    if (editOcrInFormBtn) editOcrInFormBtn.style.display = 'none';
    if (createFromOcrBtn) createFromOcrBtn.style.display = 'none';
    if (cancelOcrModalBtn) cancelOcrModalBtn.style.display = 'inline-flex';
    if (ocrPreviewImg) ocrPreviewImg.src = '';
    if (ocrProgressBar) ocrProgressBar.style.width = '0%';
    if (ocrPercentText) ocrPercentText.textContent = '0%';
    if (ocrStatusText) ocrStatusText.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Initializing OCR engine...';
    if (ocrDetectedTitle) ocrDetectedTitle.value = '';
    if (ocrDetectedSubject) ocrDetectedSubject.value = '';
    if (ocrExtractedText) ocrExtractedText.value = '';
    if (ocrCharCount) ocrCharCount.textContent = '0 chars';
    if (ocrFileInput) ocrFileInput.value = '';
  }

  async function processImageWithOcr(imageSource) {
    if (typeof Tesseract === 'undefined') {
      if (typeof window.showToast === 'function') {
        window.showToast('OCR engine (Tesseract.js) is loading or unavailable. Check connection.', 'error');
      }
      return;
    }

    const ocrDropzone = document.getElementById('ocrDropzone');
    const ocrPreviewContainer = document.getElementById('ocrPreviewContainer');
    const ocrResultsContainer = document.getElementById('ocrResultsContainer');
    const rescanOcrBtn = document.getElementById('rescanOcrBtn');
    const editOcrInFormBtn = document.getElementById('editOcrInFormBtn');
    const createFromOcrBtn = document.getElementById('createFromOcrBtn');
    const cancelOcrModalBtn = document.getElementById('cancelOcrModalBtn');
    const ocrPreviewImg = document.getElementById('ocrPreviewImg');
    const ocrStatusText = document.getElementById('ocrStatusText');
    const ocrProgressBar = document.getElementById('ocrProgressBar');
    const ocrPercentText = document.getElementById('ocrPercentText');
    const ocrDetectedTitle = document.getElementById('ocrDetectedTitle');
    const ocrDetectedSubject = document.getElementById('ocrDetectedSubject');
    const ocrExtractedText = document.getElementById('ocrExtractedText');
    const ocrCharCount = document.getElementById('ocrCharCount');

    if (ocrDropzone) ocrDropzone.style.display = 'none';
    if (ocrPreviewContainer) ocrPreviewContainer.style.display = 'flex';
    if (ocrResultsContainer) ocrResultsContainer.style.display = 'none';
    if (rescanOcrBtn) rescanOcrBtn.style.display = 'none';
    if (editOcrInFormBtn) editOcrInFormBtn.style.display = 'none';
    if (createFromOcrBtn) createFromOcrBtn.style.display = 'none';

    // Set image source preview
    if (imageSource instanceof File || imageSource instanceof Blob) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (ocrPreviewImg) ocrPreviewImg.src = e.target.result;
      };
      reader.readAsDataURL(imageSource);
    } else if (typeof imageSource === 'string' && ocrPreviewImg) {
      ocrPreviewImg.src = imageSource;
    }

    try {
      if (ocrStatusText) ocrStatusText.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Loading language model...';
      if (ocrProgressBar) ocrProgressBar.style.width = '10%';
      if (ocrPercentText) ocrPercentText.textContent = '10%';

      const result = await Tesseract.recognize(
        imageSource,
        'eng',
        {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              const pct = Math.round((m.progress || 0) * 100);
              if (ocrProgressBar) ocrProgressBar.style.width = `${pct}%`;
              if (ocrPercentText) ocrPercentText.textContent = `${pct}%`;
              if (ocrStatusText) ocrStatusText.innerHTML = `<i class="fa-solid fa-bolt"></i> Scanning text... ${pct}%`;
            } else if (m.status && ocrStatusText) {
              ocrStatusText.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${m.status}...`;
            }
          }
        }
      );

      const rawText = result?.data?.text || '';
      const cleanedText = cleanOcrText(rawText);

      if (!cleanedText) {
        if (typeof window.showToast === 'function') {
          window.showToast('No readable text detected in the image. Please try a clearer picture.', 'info');
        }
        if (ocrStatusText) ocrStatusText.textContent = 'No text detected.';
        if (rescanOcrBtn) rescanOcrBtn.style.display = 'inline-flex';
        return;
      }

      // Title & Subject inference
      const inferredTitle = extractTitleFromText(cleanedText);
      const inferredSubject = inferSubjectFromText(cleanedText);

      if (ocrDetectedTitle) ocrDetectedTitle.value = inferredTitle;
      if (ocrDetectedSubject) ocrDetectedSubject.value = inferredSubject;
      if (ocrExtractedText) ocrExtractedText.value = cleanedText;
      if (ocrCharCount) ocrCharCount.textContent = `${cleanedText.length} chars`;

      // Show results & action buttons
      if (ocrResultsContainer) ocrResultsContainer.style.display = 'flex';
      if (rescanOcrBtn) rescanOcrBtn.style.display = 'inline-flex';
      if (editOcrInFormBtn) editOcrInFormBtn.style.display = 'inline-flex';
      if (createFromOcrBtn) createFromOcrBtn.style.display = 'inline-flex';
      if (cancelOcrModalBtn) cancelOcrModalBtn.style.display = 'none';
      if (ocrStatusText) ocrStatusText.innerHTML = '<i class="fa-solid fa-check"></i> OCR completed!';
      if (ocrProgressBar) ocrProgressBar.style.width = '100%';
      if (ocrPercentText) ocrPercentText.textContent = '100%';

      if (typeof window.showToast === 'function') {
        window.showToast('Text extracted successfully with OCR!', 'success');
      }
    } catch (err) {
      console.error('OCR Error:', err);
      if (typeof window.showToast === 'function') {
        window.showToast('OCR recognition failed. Please try another image.', 'error');
      }
      if (ocrStatusText) ocrStatusText.textContent = 'Failed to recognize text.';
      if (rescanOcrBtn) rescanOcrBtn.style.display = 'inline-flex';
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const openOcrModalBtn = document.getElementById('openOcrModalBtn');
    const editorOcrScanBtn = document.getElementById('editorOcrScanBtn');
    const ocrScannerModal = document.getElementById('ocrScannerModal');
    const closeOcrModalBtn = document.getElementById('closeOcrModalBtn');
    const cancelOcrModalBtn = document.getElementById('cancelOcrModalBtn');
    const rescanOcrBtn = document.getElementById('rescanOcrBtn');
    const browseFileBtn = document.getElementById('browseFileBtn');
    const ocrFileInput = document.getElementById('ocrFileInput');
    const ocrDropzone = document.getElementById('ocrDropzone');
    const ocrExtractedText = document.getElementById('ocrExtractedText');
    const ocrCharCount = document.getElementById('ocrCharCount');
    const createFromOcrBtn = document.getElementById('createFromOcrBtn');
    const editOcrInFormBtn = document.getElementById('editOcrInFormBtn');
    const ocrDetectedTitle = document.getElementById('ocrDetectedTitle');
    const ocrDetectedSubject = document.getElementById('ocrDetectedSubject');
    const ocrDetectedTags = document.getElementById('ocrDetectedTags');

    if (ocrExtractedText && ocrCharCount) {
      ocrExtractedText.addEventListener('input', () => {
        const len = ocrExtractedText.value.length;
        ocrCharCount.textContent = `${len} char${len === 1 ? '' : 's'}`;
      });
    }

    if (openOcrModalBtn) openOcrModalBtn.addEventListener('click', () => openOcrModal());
    if (editorOcrScanBtn) {
      editorOcrScanBtn.addEventListener('click', () => {
        if (typeof window.closeEditorModal === 'function') window.closeEditorModal();
        openOcrModal();
      });
    }

    if (closeOcrModalBtn) closeOcrModalBtn.addEventListener('click', closeOcrModal);
    if (cancelOcrModalBtn) cancelOcrModalBtn.addEventListener('click', closeOcrModal);
    if (rescanOcrBtn) rescanOcrBtn.addEventListener('click', resetOcrModal);

    if (browseFileBtn && ocrFileInput) {
      browseFileBtn.addEventListener('click', () => ocrFileInput.click());
    }

    if (ocrFileInput) {
      ocrFileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          processImageWithOcr(e.target.files[0]);
        }
      });
    }

    if (ocrDropzone) {
      ocrDropzone.addEventListener('click', () => ocrFileInput && ocrFileInput.click());
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
    }

    // Save Scanned Note Directly
    if (createFromOcrBtn) {
      createFromOcrBtn.addEventListener('click', async () => {
        const content = ocrExtractedText ? ocrExtractedText.value.trim() : '';
        if (!content) {
          if (typeof window.showToast === 'function') window.showToast('No text detected in scan to save.', 'error');
          return;
        }

        const title = ((ocrDetectedTitle && ocrDetectedTitle.value.trim()) || extractTitleFromText(content) || 'Scanned Study Note').substring(0, 180);
        const subject = (ocrDetectedSubject && ocrDetectedSubject.value.trim()) || inferSubjectFromText(content) || 'General';
        const tags = (ocrDetectedTags && ocrDetectedTags.value.trim()) || 'ocr, scanned';

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
          if (typeof window.showToast === 'function') {
            window.showToast('Scanned note saved successfully as a note!', 'success');
          }
          if (typeof window.renderStats === 'function') window.renderStats();
          if (typeof window.renderSubjectPills === 'function') window.renderSubjectPills();
          if (typeof window.renderNotes === 'function') window.renderNotes();
        } catch (err) {
          console.error('Failed to save scanned note:', err);
          if (typeof window.showToast === 'function') {
            window.showToast(err.message || 'Failed to save scanned note', 'error');
          }
        } finally {
          createFromOcrBtn.disabled = false;
          createFromOcrBtn.innerHTML = origHtml;
        }
      });
    }

    // Edit in Form action before saving
    if (editOcrInFormBtn) {
      editOcrInFormBtn.addEventListener('click', () => {
        const content = ocrExtractedText ? ocrExtractedText.value.trim() : '';
        const title = ((ocrDetectedTitle && ocrDetectedTitle.value.trim()) || extractTitleFromText(content) || 'Scanned Note').substring(0, 180);
        const subject = (ocrDetectedSubject && ocrDetectedSubject.value.trim()) || inferSubjectFromText(content) || 'General';
        const tags = (ocrDetectedTags && ocrDetectedTags.value.trim()) || 'ocr, scanned';

        closeOcrModal();

        if (typeof window.openEditorModal === 'function') {
          window.openEditorModal({
            title,
            content,
            subject,
            tags: tags.split(',').map(t => t.trim()),
            color: 'blue',
            is_pinned: false
          });
        }

        if (typeof window.showToast === 'function') {
          window.showToast('Scan imported into editor. Click Save Note when ready.', 'info');
        }
      });
    }

    // Global Clipboard Paste (Ctrl+V) handler for Screenshot OCR
    window.addEventListener('paste', (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        const items = e.clipboardData?.items;
        if (items) {
          for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
              const file = items[i].getAsFile();
              if (file) {
                e.preventDefault();
                if (typeof window.showToast === 'function') {
                  window.showToast('Pasted screenshot detected! Launching OCR...', 'info');
                }
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
            if (typeof window.showToast === 'function') {
              window.showToast('Pasted screenshot detected! Starting OCR...', 'info');
            }
            openOcrModal(file);
            break;
          }
        }
      }
    });
  });

  window.openOcrModal = openOcrModal;
  window.closeOcrModal = closeOcrModal;
  window.extractTitleFromText = extractTitleFromText;
  window.inferSubjectFromText = inferSubjectFromText;
})();
