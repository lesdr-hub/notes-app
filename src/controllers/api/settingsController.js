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
exports.patchSettings = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).select("-password");
        
        if (req.body.preferences) {
            for (const setting of Object.keys(req.body.preferences)) {
                user.preferences[setting] = req.body.preferences[setting];
            };
        };
        await user.save();

        res.status(200).json({ user, message: "Settings updated successfully." });
    } catch (error) {
        next(error);
    };
};