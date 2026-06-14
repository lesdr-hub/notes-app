
// =============================
// MIDDLEWARE
// =============================

exports.ensureAuth = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    req.session.returnTo = req.originalUrl;
    res.redirect("/auth/login");
};

exports.ensureGuest = (req, res, next) => {
    if (!req.isAuthenticated()) return next();
    res.redirect("/dashboard");
};

exports.ensureApiAuth = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ message: "Unauthorized." });
};

module.exports = { ensureAuth, ensureGuest, ensureApiAuth };