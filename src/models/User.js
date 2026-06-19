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
        minlength: 8
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

userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }
    this.password = await bcrypt.hash(this.password, 12);
})

const User = mongoose.model("User", userSchema);
module.exports = User;