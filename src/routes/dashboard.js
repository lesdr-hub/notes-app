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
// GET /dashboard
router.get("/", dashboardController.getDashboard);

module.exports = router;