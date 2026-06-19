// ============================
// IMPORTS
// ============================

const express = require("express");
const router = express.Router();

// ============================
// CONTROLLERS/MIDDLEWARE
// ============================

const authController = require("../controllers/pages/authController.js");
const { ensureGuest, ensureAuth } = require("../middleware/auth"); // login/register must not be logged in

// ============================
// ROUTES
// ============================

router.get("/login",     ensureGuest, authController.getLogin);
router.get("/register",  ensureGuest, authController.getRegister);
router.post("/login",    ensureGuest, authController.postLogin);
router.post("/register", ensureGuest, authController.postRegister);
router.post("/logout",   ensureAuth,  authController.logout);

module.exports = router;
