// ============================= 
// controllers/api/userController.js
// ============================= 
// Handles user route endpoints
// API - return with .json(), errors passed to error handler 

// ============================= 
// IMPORTS
// ============================= 

const User = require("../../models/User.js");
const Note = require("../../models/Note.js");

// ============================= 
// CONTROLLERS
// ============================= 

// PATCH /api/users
exports.patchAccountDetails = async (req, res, next) => {
    try {        
        const userId = req.user._id;
        const user = await User.findById(userId).select("-password");
        if (req.body.password && req.body.password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long." });
        }

        if (req.body.username) user.username = req.body.username;
        if (req.body.password) user.password = req.body.password;
        await user.save();

        res.status(200).json({ user, message: "User updated successfully." });
    } catch(error) {
        next(error);
    };
};

// DELETE /api/users
exports.deleteAccount = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const deletedNotes = await Note.deleteMany({ userId });
        const deletedUser = await User.findByIdAndDelete(userId);
        
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found."});
        }

        req.logout((error) => {
            if (error) return next(error);
        });
        req.session.destroy((error) => {
            if (error) return next(error);
        });
        res.status(200).json({ message: "Account deleted successfully." });
    } catch(error) {
        next(error);
    };
};