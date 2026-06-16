// ============================
// IMPORTS
// ============================

const express = require("express");
const router = express.Router();

// ============================
// CONTROLLERS/MIDDLEWARE
// ============================

const userController     = require("../controllers/api/userController.js");
const noteController     = require("../controllers/api/noteController.js");
const settingsController = require("../controllers/api/settingsController.js");
const { ensureApiAuth }     = require("../middleware/auth.js");

// ============================
// ROUTES
// ============================

// Ensure authorized middleware
router.use(ensureApiAuth); // ensures authorized

// Notes
router.get("/notes", noteController.getAllNotes);
router.get("/notes/:id", noteController.getNoteById);
router.post("/notes", noteController.postNote);
router.patch("/notes/:id", noteController.patchNoteById);
router.delete("/notes/:id", noteController.deleteNoteById);

// User + settings
router.patch("/api/users", userController.patchAccountDetails);
router.delete("/api/users", userController.deleteAccount);
router.patch("/api/settings", settingsController.patchSettings);

module.exports = router;
