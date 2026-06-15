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
const ensureAuth         = require("../middleware/auth.js");

// ============================
// ROUTES
// ============================

// Ensure authorized middleware
router.use(ensureAuth); // ensures authorized

// Notes
router.get("/notes", noteController.getNotes);
router.get("/notes/:id", noteController.getNote);
router.post("/notes", noteController.createNote);
router.patch("/notes/:id", noteController.updateNote);
router.delete("/notes/:id", noteController.deleteNote);

// User + settings
router.patch("/api/users", userController.patchAccountDetails);
router.delete("/api/users", userController.deleteAccount);
router.patch("/api/settings", settingsController.patchSettings);

module.exports = router;
