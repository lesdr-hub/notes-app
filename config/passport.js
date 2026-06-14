// =============================
// IMPORTS
// =============================

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../src/models/User.js");

// =============================
// PASSPORT STRATEGIES
// =============================

// LOCAL STRATEGY
passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            const user = await User.findOne({ username });
            if (!user) {
                return done(
                    null, 
                    false, 
                    { message: "No account found with that email." }
                );
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return done(
                    null, 
                    false, 
                    { message: "Incorrect password. "}
                );
            }
            return done(null, user); 
        } catch (error) {
            return done(error);
        }
    }
))

// =============================
// SERIALIZATION
// =============================

// SERIALIZE USER
passport.serializeUser((user, done) => {
    try {
        done(null, user.id); 
    } catch (error) {
        done(error);
    }
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id).select("-password");
        done(null, user);
    } catch (error) {
        done(error);
    }
})