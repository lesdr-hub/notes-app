// ============================= 
// controllers/user.js
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

// PATCH api/settings
exports.patchSettings = (req, res, next) => {
    try {
        const userId = req.user._id;
        const user = User.findById(userId);
        
        if (req.body.preferences) {
            for (const setting of Object.keys(req.body.preferences)) {
                user.preferences[setting] = req.body.preferences[setting];
            };
        };
        user.save();

        res.status(200).json({ user, message: "Settings updated successfully." });
    } catch (error) {
        next(error);
    };
};