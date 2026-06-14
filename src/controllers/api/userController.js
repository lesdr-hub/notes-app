// ============================= 
// controllers/api/userController.js
// ============================= 
// Handles user route endpoints
// API - return with .json(), errors passed to error handler 

// ============================= 
// IMPORTS
// ============================= 

const User = require("../../models/User.js");

// ============================= 
// CONTROLLERS
// ============================= 

// PATCH /api/users
exports.patchAccountDetails = async (req, res, next) => {
    try {        
        const userId = req.user._id;
        const user = User.findById(userId);

        if (req.body.username) user.username = req.body.username;
        if (req.body.password) user.password = req.body.password;
        user.save();

        res.status(200).json({ user, message: "User updated successfully." });
    } catch(error) {
        next(error);
    };
};

// DELETE /api/users
exports.deleteAccount = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const deletedUser = User.findByIdAndDelete(userId);
    
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found."});
        }

        res.status(200).json({ message: "Account deleted successfully." })
    } catch(error) {
        next(error);
    };
};