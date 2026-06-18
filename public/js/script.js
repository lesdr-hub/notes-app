'use strict';

// =============================
// ELEMENTS
// =============================
const overlay        = document.getElementById('overlay');
const settingsPanel  = document.getElementById('settings-panel');
const activeNotePanel = document.getElementById('active-note-panel');

const settingsBtn    = document.getElementById('settings-btn');
const closeSettingsBtn = document.getElementById('close-settings-btn');
const settingsOkBtn  = document.getElementById('settings-ok-btn');

const newNoteTrigger = document.getElementById('new-note-trigger');
const noteCards      = document.querySelectorAll('.note-card');

const editorTitle    = document.getElementById('editor-title');
const editorContent  = document.getElementById('editor-content');
const editorColor    = document.getElementById('editor-color');
const editorPinBtn   = document.getElementById('editor-pin-btn');
const editorSaveBtn  = document.getElementById('editor-save-btn');
const editorCloseBtn = document.getElementById('editor-close-btn');

const themeButtons   = document.querySelectorAll('[data-theme-btn]');


// =============================
// STATE
// =============================
let activeNoteId = null;
let isNewNote    = false;


// =============================
// OVERLAY
// =============================
function showOverlay() { overlay.classList.add('is-visible'); }
function hideOverlay() { overlay.classList.remove('is-visible'); }


// =============================
// SETTINGS
// =============================
function openSettings() {
  settingsPanel.classList.add('is-open');
  showOverlay();
}

function closeSettings() {
  settingsPanel.classList.remove('is-open');
  if (!activeNotePanel.classList.contains('is-open')) hideOverlay();
}

settingsBtn.addEventListener('click', openSettings);
closeSettingsBtn.addEventListener('click', closeSettings);
settingsOkBtn.addEventListener('click', closeSettings);


// =============================
// THEME
// =============================
function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.themeBtn === theme);
  });
  // TODO: persist via PATCH /api/settings  { preferences: { theme } }
}

themeButtons.forEach(btn => {
  btn.addEventListener('click', () => setTheme(btn.dataset.themeBtn));
});

// Mark the current theme button as active on load
(function syncThemeButtons() {
  const current = document.documentElement.dataset.theme || 'dark';
  themeButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.themeBtn === current);
  });
})();


// =============================
// NOTE EDITOR
// =============================
const COLOR_CLASSES = ['default', 'red', 'orange', 'yellow', 'green', 'blue', 'purple'];

function applyEditorColor(color) {
  COLOR_CLASSES.forEach(c => activeNotePanel.classList.remove(c));
  activeNotePanel.classList.add(color || 'default');
}

/**
 * @param {object} opts
 * @param {string|null} opts.id       - note._id (null for new notes)
 * @param {string}      opts.title
 * @param {string}      opts.content
 * @param {string}      opts.color
 * @param {boolean}     opts.pinned
 * @param {boolean}     opts.isNew
 */
function openNoteEditor({ id = null, title = '', content = '', color = 'default', pinned = false, isNew = false } = {}) {
  activeNoteId = id;
  isNewNote    = isNew;

  editorTitle.value   = title;
  editorContent.value = content;
  editorColor.value   = color;

  editorPinBtn.classList.toggle('is-pinned', pinned);
  editorPinBtn.title = pinned ? 'Unpin note' : 'Pin note';

  applyEditorColor(color);

  activeNotePanel.classList.add('is-open');
  showOverlay();
  editorContent.focus();
}

function closeNoteEditor() {
  activeNotePanel.classList.remove('is-open');
  if (!settingsPanel.classList.contains('is-open')) hideOverlay();
  activeNoteId = null;
  isNewNote    = false;
}

// Open a blank editor when the new-note bar is clicked
newNoteTrigger.addEventListener('click', () => {
  openNoteEditor({ isNew: true });
});

// Open editor populated with a note's data when a card is clicked
noteCards.forEach(card => {
  card.addEventListener('click', e => {
    if (e.target.closest('.card-actions')) return;   // handled separately
    openNoteEditor({
      id:      card.dataset.id,
      title:   card.dataset.title,
      content: card.dataset.content,
      color:   card.dataset.color,
      pinned:  card.dataset.pinned === 'true',
      isNew:   false,
    });
  });
});

// Close button
editorCloseBtn.addEventListener('click', closeNoteEditor);

// Pin toggle
editorPinBtn.addEventListener('click', () => {
  const nowPinned = editorPinBtn.classList.toggle('is-pinned');
  editorPinBtn.title = nowPinned ? 'Unpin note' : 'Pin note';
});

// Live color preview
editorColor.addEventListener('change', () => {
  applyEditorColor(editorColor.value);
});

// Save
editorSaveBtn.addEventListener('click', () => {
  const payload = {
    title:   editorTitle.value.trim(),
    content: editorContent.value.trim(),
    color:   editorColor.value,
    pinned:  editorPinBtn.classList.contains('is-pinned'),
  };

  if (isNewNote) {
    // TODO: POST /api/notes  →  body: payload  →  reload or inject card
    console.log('[noted] Create note:', payload);
  } else {
    // TODO: PATCH /api/notes/:id  →  body: payload  →  update card in DOM
    console.log('[noted] Update note:', activeNoteId, payload);
  }

  closeNoteEditor();
});


// =============================
// CARD ACTION BUTTONS  (pin / color / delete)
// =============================
document.querySelectorAll('.card-action-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();   // prevent card click opening editor

    const action = btn.dataset.action;
    const card   = btn.closest('.note-card');
    const noteId = card.dataset.id;

    if (action === 'delete') {
      // TODO: DELETE /api/notes/:id  →  remove card from DOM
      console.log('[noted] Delete note:', noteId);
    }

    if (action === 'pin') {
      const currentlyPinned = card.dataset.pinned === 'true';
      // TODO: PATCH /api/notes/:id  →  body: { pinned: !currentlyPinned }  →  reload sections
      console.log('[noted] Toggle pin:', noteId, 'pinned →', !currentlyPinned);
    }

    if (action === 'color') {
      // TODO: open an inline color popover anchored to this card
      console.log('[noted] Change color:', noteId);
    }
  });
});


// =============================
// OVERLAY  — click to close all panels
// =============================
overlay.addEventListener('click', () => {
  closeSettings();
  closeNoteEditor();
});
