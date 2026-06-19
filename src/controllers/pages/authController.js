// ============================= 
// controllers/pages/authController.js
// ============================= 
// Handles authentication route endpoints
// PAGES - use redirects + render + flash for errors

// ============================= 
// IMPORTS
// ============================= 

const User = require("../../models/User.js");
const passport = require("passport");

// ============================= 
// CONTROLLERS
// ============================= 

// GET /auth/register 
exports.getRegister = (req, res) => {
    res.render("pages/register", {
        title: "Register - notes",
        error: req.flash("error")[0],
        success: req.flash("success")[0]
    });
}

// POST /auth/register
exports.postRegister = async (req, res) => {
    try {
        const { username, password, confirmPassword } = req.body;

        if (!username || !password) {
            req.flash("error", "Email and password required.");
            return res.redirect("/auth/register");
        }
        if (password.length < 8) {
            req.flash("error", "Password must be at least 8 characters.");
            return res.redirect("/auth/register");
        }
        if (password !== confirmPassword) {
            req.flash("error", "Passwords do not match.");
            return res.redirect("/auth/register");    
        }
        const user = await User.create({ username, password });

        req.logIn(user, (error) => {
            if (error) return res.redirect("/auth/login");
            res.redirect("/dashboard");
        });

    } catch (error) {
        if (error.code === 11000) {
            req.flash("error", "Email already exists.");
        } else {
            req.flash("error", `${error.message}.`);
        }
        return res.redirect("/auth/register");
    }
}

// GET /auth/login
exports.getLogin = (req, res) => {
    res.render("pages/login", {
        title: "Log In - notes",
        error: req.flash("error")[0],
        success: req.flash("success")[0]
    });
}

// POST /auth/login
exports.postLogin = async (req, res, next) => {
    try {

        await passport.authenticate("local", (error, user, info) => {
            if (!user) {
                req.flash("error", info);
                return res.redirect("/auth/login");
            }

            req.logIn(user, (error) => {
                if (error) return res.redirect("/auth/login");
                const returnTo = req.session.returnTo || "/dashboard";
                delete req.session.returnTo;
                res.redirect(returnTo);
            });
        })(req, res, next);
    } catch (error) {
        console.log("error");
        next(error);
    }
}

// POST /auth/logout
exports.logout = (req, res, next) => {
  req.logout((error) => {
    if (error) return next(error);
    req.session.destroy((error) => {
        if (error) return next(error);
        console.log("Logging out...");
        res.redirect("/auth/login");
    });
  });
};