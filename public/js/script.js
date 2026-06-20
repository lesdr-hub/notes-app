"use strict";

console.log("Script loaded.");

// =============================
// ELEMENTS
// =============================
const overlay          = document.getElementById("overlay");
const settingsPanel    = document.getElementById("settings-panel");
const activeNotePanel  = document.getElementById("active-note-panel");

const refreshBtn       = document.getElementById("refresh-btn");
const settingsBtn      = document.getElementById("settings-btn");
const closeSettingsBtn = document.getElementById("close-settings-btn");
const settingsOkBtn    = document.getElementById("settings-ok-btn");

const accountPanel     = document.getElementById("account-panel");
const accountBtn       = document.getElementById("account-btn");
const closeAccountBtn  = document.getElementById("close-account-btn");
const accountOkBtn     = document.getElementById("account-ok-btn");
const accountLogoutBtn = document.getElementById("account-logout-btn");
const accountDeleteBtn = document.getElementById("account-delete-btn");

const newNoteTrigger   = document.getElementById("new-note-trigger");
const noteContainer    = document.getElementById("note-container");

const editorTitle      = document.getElementById("editor-title");
const editorContent    = document.getElementById("editor-content");
const editorColor      = document.getElementById("editor-color");
const editorPinBtn     = document.getElementById("editor-pin-btn");
const editorSaveBtn    = document.getElementById("editor-save-btn");
const editorCloseBtn   = document.getElementById("editor-close-btn");

const themeButtons     = document.querySelectorAll("[data-theme-btn]");

// =============================
// STATE
// =============================
let activeNoteId = null;
let isNewNote    = false;


// =============================
// OVERLAY
// =============================
function showOverlay() { overlay.classList.add("is-visible"); }
function hideOverlay() { overlay.classList.remove("is-visible"); }

// =============================
// LOAD NOTES
// =============================
async function loadNotes() {
  // RENDER NOTE LIST
  const res = await fetch("/dashboard/partials/note-list");
  const container = document.getElementById("note-container");
  if (!res.ok) {
    container.textContent = "Error retrieving notes.";
    return console.error("Failed to load notes.");
  }

  const notes = await res.text();
  container.innerHTML = notes;
}

// =============================
// REFRESH
// =============================
refreshBtn.addEventListener("click", () => {
  window.location.reload();
});

// =============================
// SETTINGS
// =============================
function openSettings() {
  settingsPanel.classList.add("is-open");
  showOverlay();
}

function closeSettings() {
  settingsPanel.classList.remove("is-open");
  if (!activeNotePanel.classList.contains("is-open")) hideOverlay();
}

settingsBtn.addEventListener("click", openSettings);
closeSettingsBtn.addEventListener("click", closeSettings);
settingsOkBtn.addEventListener("click", closeSettings);

// =============================
// THEME
// =============================
async function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.themeBtn === theme);
  });
  
  const res = await fetch("/api/settings", {
    method: "PATCH",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({ preferences: { theme } })
  });

  if (!res.ok) {
    console.error("Failed to save theme preferences.");

    const msg = document.getElementById("settings-error");
    msg.textContent = "Failed to save theme preferences.";
    msg.classList.add("is-visible");
    setTimeout(() => msg.classList.remove("is-visible"), 3000);
  }
}

themeButtons.forEach(btn => {
  btn.addEventListener("click", () => setTheme(btn.dataset.themeBtn));
});

(function syncThemeButtons() {
  const current = document.documentElement.dataset.theme || "dark";
  themeButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.themeBtn === current);
  });
})();

// =============================
// ACCOUNT
// =============================
function openAccount() {
  accountPanel.classList.add("is-open");
  showOverlay();
}
 
function closeAccount() {
  accountPanel.classList.remove("is-open");
  hideOverlay();
}
 
accountBtn.addEventListener("click", openAccount);
closeAccountBtn.addEventListener("click", closeAccount);
accountOkBtn.addEventListener("click", closeAccount);
 
// Logout (submits logout button)
accountLogoutBtn.addEventListener("click", () => {
  document.querySelector(".logout-form").submit();
});
 
// Delete account
accountDeleteBtn.addEventListener("click", async () => {
  const confirmed = window.confirm(
    "Delete your account? This permanently deletes your notes and cannot be undone."
  );
  if (!confirmed) return;
 
  const res = await fetch("/api/users", { 
    method: "DELETE" 
  });
 
  if (!res.ok) {
    console.error("Failed to delete account.");
    
    const msg = document.getElementById("account-error");
    msg.textContent = message;
    msg.classList.add("is-visible");
    setTimeout(() => msg.classList.remove("is-visible"), 3000);
    return;
  }
 
  // Server already destroyed the session — just send them to login
  window.location.href = "/auth/login";
});

// =============================
// NOTE EDITOR
// =============================
const COLOR_CLASSES = ["default", "red", "orange", "yellow", "green", "blue", "purple"];

function applyEditorColor(color) {
  COLOR_CLASSES.forEach(c => activeNotePanel.classList.remove(c));
  activeNotePanel.classList.add(color || "default");
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
function openNoteEditor({ id = null, title = "", content = "", color = "default", pinned = false, isNew = false } = {}) {
  activeNoteId = id;
  isNewNote    = isNew;

  editorTitle.value   = title;
  editorContent.value = content;
  editorColor.value   = color;

  editorPinBtn.classList.toggle("is-pinned", pinned);
  editorPinBtn.title = pinned ? "Unpin note" : "Pin note";

  applyEditorColor(color);

  activeNotePanel.classList.add("is-open");
  showOverlay();
  editorContent.focus();
}

function closeNoteEditor() {
  activeNotePanel.classList.remove("is-open");
  if (!settingsPanel.classList.contains("is-open")) hideOverlay();
  activeNoteId = null;
  isNewNote    = false;
}

// Open a blank editor when the new-note bar is clicked
newNoteTrigger.addEventListener("click", () => {
  openNoteEditor({ isNew: true });
});

// Open editor populated with a note's data when a card is clicked
noteContainer.addEventListener("click", async e => {
  // Check if action button is clicked
  const actionBtn = e.target.closest(".card-action-btn");
  const card = e.target.closest(".note-card");
  if (!card) return;

  if (actionBtn) {
    e.stopPropagation();
    const action = actionBtn.dataset.action;
    const noteId = card.dataset.id;

    if (action === "delete") {
      const res = await fetch(`/api/notes/${noteId}`, { 
        method: "DELETE" 
      });
      loadNotes();
      return;
    }

    if (action === "pin") {
      const currentlyPinned = card.dataset.pinned === "true";
      const res = await fetch(`/api/notes/${noteId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ pinned: !currentlyPinned })
      });
      loadNotes();
      return;
    }

    if (action === "color") {
      // Replace with dedicated drop down later 
      openNoteEditor({
        id:      card.dataset.id,
        title:   card.dataset.title,
        content: card.dataset.content,
        color:   card.dataset.color,
        pinned:  card.dataset.pinned === "true",
        isNew:   false,
      });
      return;
    }

    return; // Ensures editor does not open in the event nothing is triggered
  }
  
  openNoteEditor({
    id:      card.dataset.id,
    title:   card.dataset.title,
    content: card.dataset.content,
    color:   card.dataset.color,
    pinned:  card.dataset.pinned === "true",
    isNew:   false,
  });
});

// Close button
editorCloseBtn.addEventListener("click", closeNoteEditor);

// Pin toggle
editorPinBtn.addEventListener("click", () => {
  const nowPinned = editorPinBtn.classList.toggle("is-pinned");
  editorPinBtn.title = nowPinned ? "Unpin note" : "Pin note";
});

// Live color preview
editorColor.addEventListener("change", () => {
  applyEditorColor(editorColor.value);
});

// Save
editorSaveBtn.addEventListener("click", async () => {
  const payload = {
    title:   editorTitle.value.trim(),
    content: editorContent.value.trim(),
    color:   editorColor.value,
    pinned:  editorPinBtn.classList.contains("is-pinned"),
  };

  if (isNewNote) {
    console.log("Fetching note...");
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(payload),
    });
    loadNotes();
    console.log("[noted] Create note:", payload);
  } else {
    const res = await fetch(`/api/notes/${activeNoteId}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(payload),
    });
    loadNotes();
    console.log("[noted] Update note:", activeNoteId, payload);
  }

  closeNoteEditor();
});

// =============================
// OVERLAY 
// =============================
overlay.addEventListener("click", () => {
  closeSettings();
  closeNoteEditor();
  closeAccount();
});