// ============================
// IMPORTS
// ============================

const express = require("express");
const router = express.Router();

// ============================
// CONTROLLERS/MIDDLEWARE
// ============================

const dashboardController = require("../controllers/pages/dashboardController.js");
const { ensureAuth }      = require("../middleware/auth.js");

// ============================
// ROUTES
// ============================

router.use(ensureAuth);

router.get("/", dashboardController.getDashboard);
router.get("/partials/note-list", dashboardController.renderNotePartials);

module.exports = router;