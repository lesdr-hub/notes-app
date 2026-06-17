// ============================= 
// controllers/pages/dashboardController.js
// ============================= 
// Handles dashboard rendering
// PAGES - use redirects + render + flash for errors

// ============================= 
// IMPORTS
// ============================= 

const Note = require("../../models/Note.js");

// ============================= 
// CONTROLLERS
// ============================= 

// /GET dashboard
exports.getDashboard = async (req, res) => {
    try {
        const userId = req.user._id;
        const { _id, username } = req.user;
        const notes = await Note.find({ userId })
            .sort({ pinned: -1, updatedAt: -1 });

        const pinnedNotes = notes.filter(n => n.pinned);
        const unpinnedNotes = notes.filter(n => !n.pinned);

        res.render("dashboard", {
            title: "Dashboard - notes",
            user: { _id, username },
            pinnedNotes, 
            unpinnedNotes
        });
    } catch (error) {
        res.status(500).render("error", { message: "Failed to load dashboard." });
    }
}