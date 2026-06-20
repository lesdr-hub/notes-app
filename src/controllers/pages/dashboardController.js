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

// helper
const getUserNotes = async (userId) => {
    const notes = await Note.find({ userId })
        .sort({ pinned: -1, updatedAt: -1 });

    return {
        pinnedNotes: notes.filter(n => n.pinned),
        unpinnedNotes: notes.filter(n => !n.pinned)
    };
};


// GET /dashboard
exports.getDashboard = async (req, res) => {
    try {
        const { _id, username, preferences } = req.user;
        const { pinnedNotes, unpinnedNotes } = await getUserNotes(_id);

        res.render("pages/dashboard", {
            user: { _id, username, preferences },
            pinnedNotes,
            unpinnedNotes,
            error: req.flash("error")[0],
            success: req.flash("success")[0]
        });
    } catch (error) {
        res.status(500).render("error", { message: "Failed to load dashboard." });
    }
};

// GET /dashboard/notes
exports.renderNotePartials = async (req, res) => {
    try {
        const { pinnedNotes, unpinnedNotes } = await getUserNotes(req.user._id);

        res.render("partials/note-list", {
            pinnedNotes,
            unpinnedNotes,
            error: req.flash("error")[0],
            success: req.flash("success")[0]
        });
    } catch (error) {
        res.status(500).render("error", { message: "Failed to load notes." });
    }
};