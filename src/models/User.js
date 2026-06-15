// =============================
// IMPORTS
// =============================

const mongoose = require("mongoose"); 
const bcrypt = require("bcrypt"); 

// =============================
// SCHEMAS
// =============================

const preferencesSchema = new mongoose.Schema({
  theme: {
    type: String,
    default: "dark",
    enum: ["dark", "light"]
  }
}, { _id: false });

const userSchema = new mongoose.Schema(
    {
    username: {
        type: String, 
        required: true,
        lowercase: true,
        trim: true,
        unique: true
    },
    password: { // hashed
        type: String,
        required: true,
        trim: true,
        minLength: 8
    },
    preferences: {
        type: preferencesSchema,
        default: () => ({})
    }
    }, { timestamps: true }
);

// =============================
// PASSWORD HASHING
// =============================

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 12);
    next();
})

const User = mongoose.model("User", userSchema);
module.exports = User;