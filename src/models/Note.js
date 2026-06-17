// =============================
// IMPORTS
// =============================

const mongoose = require("mongoose"); 

// =============================
// SCHEMAS
// =============================

const noteSchema = new mongoose.Schema(
    {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    title: {
        type: String,
        default: ""
    },
    content: {
        type: String, 
        default: ""
    },
    pinned: {
        type: Boolean, 
        default: false
    },
    color: {
        type: String,
        required: true, 
        default: "default",
        enum: ["default", "red", "orange", 
            "yellow", "green", "blue", "cyan", "pink", "purple"]
    },
    }, { timestamps: true }
);

// isEmpty method to check if title and content have NOTHING whatsoever
noteSchema.methods.isEmpty = function() {
  return !this.title.trim() && !this.content.trim();
};

const Note = mongoose.model("Note", noteSchema);
module.exports = Note;