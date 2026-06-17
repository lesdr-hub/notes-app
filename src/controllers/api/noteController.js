// ============================= 
// controllers/note.js
// ============================= 
// Handles note route endpoints
// API - return with .json(), errors passed to error handler 

// ============================= 
// IMPORTS
// ============================= 
const Note = require("../../models/Note.js");

// ============================= 
// CONTROLLERS
// ============================= 

// GET /api/notes
exports.getAllNotes = async (req, res, next) => {
    try {        
        const userId = req.user._id;
        
        const notes = await Note.find({ userId })
            .sort({ pinned: -1, updatedAt: -1 });
        
        const pinnedNotes = notes.filter(n => n.pinned);
        const unpinnedNotes = notes.filter(n => !n.pinned);

        res.status(200).json({ pinnedNotes, unpinnedNotes, message: "Notes retrieved successfully." });
    } catch(error) {
        next(error);
    };
};

// GET /api/notes/:id
exports.getNoteById = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const note = await Note.findOne({ _id: req.params.id, userId });

        if (!note) {
            return res.status(404).json({ message: "Note not found."});
        }

        res.status(200).json({ note, message: "Note retrieved successfully" });
    } catch(error) {
        next(error); 
    };
};

// POST /api/notes
exports.postNote = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const note = new Note({
            userId, 
            title: req.body.title,
            content: req.body.content,
            color: req.body.color,
            pinned: req.body.pinned
        });
        if (note.isEmpty()) {
            return res.status(200).json({ message: "Deleting empty note." });
        }
        await note.save();
        
        res.json({ note, message: "Successfully created note."});
    } catch(error) {
        next(error); 
    };
};

// PATCH /api/notes/:id
exports.patchNoteById = async (req, res, next) => {
    try {
        const updatedNote = await Note.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!updatedNote) {
            return res.status(404).json({ message: "Note not found." });
        };
        if (updatedNote.isEmpty()) {
            return res.status(200).json({ message: "Deleting empty note." });
        };

        return res.status(200).json({ updatedNote, message: "Note updated successfully." });
    } catch(error) {
        next(error);
    };
};

// DELETE /api/notes/:id
exports.deleteNoteById = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const deletedNote = await Note.findOneAndDelete({ _id: req.params.id, userId });

        if (!deletedNote) {
            return res.status(404).json({ message: "Note not found." });
        };

        res.json({ message: "Note deleted successfully." });
    } catch(error) {
        next(error);
    };
};