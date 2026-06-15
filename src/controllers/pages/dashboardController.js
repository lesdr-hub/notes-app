// ============================= 
// controllers/pages/dashboardController.js
// ============================= 
// Handles dashboard rendering
// PAGES - use redirects + render + flash for errors

// ============================= 
// IMPORTS
// ============================= 

const User = require("../../models/User.js");
const Note = require("../../models/Note.js");

// ============================= 
// CONTROLLERS
// ============================= 

// /GET dashboard
exports.getDashboard = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        const notes = await Note.find({ userId })
            .sort({ pinned: -1, updatedAt: -1 });

        res.render("dashboard", {
            title: "Dashboard - notes",
            user: req.user,
            notes: notes
        });
    } catch (error) {
        res.status(500).render("error", { message: "Failed to load dashboard." });
    }
}