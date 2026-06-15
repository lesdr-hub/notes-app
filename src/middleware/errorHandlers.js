
// =============================
// MIDDLEWARE
// =============================

// 404 Not Found
exports.notFound = (req, res) => {
    res.status(404).render("error", { message: "Not found." });
}

// Global
exports.global = (error, req, res, next) => {
    console.error(error.stack);
    res.status(500).render(
        "error", 
        { message: error.message || "Internal server error." }
    );
}