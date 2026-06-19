// =============================
// IMPORTS
// =============================

const path           = require("path");
const express        = require("express");
const session        = require("express-session");
const flash          = require("connect-flash");
const locals         = require("./src/middleware/locals.js");
const { MongoStore } = require("connect-mongo");
const passport       = require("passport"); 
const connectDb      = require("./config/db.js");
const methodOverride = require("method-override");

// =============================
// SETUP
// =============================

require("dotenv").config();
require("./config/passport.js");
const app = express();
connectDb();

function loc(...directories) {
    return path.join(__dirname, ...directories);
}

// VIEW ENGINE + STATIC
app.set("view engine", "ejs");
app.set("views", loc("views"));
app.use(express.static("public"));

// PARSING REQ
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // I don't think we use this lol but better safe than sorry
app.use(methodOverride("_method"));

// SESSION CONFIG
app.use(session({
    secret:           process.env.SESSION_SECRET 
                      || "super-secret-dev-secret",
    resave:           false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
    }),
    cookie: {
        maxAge:   1000 * 60 * 60 * 24 * 14, // save cookie for 2 weeks in ms
        secure:   process.env.NODE_ENV === "production",
        httpOnly: true, 
        sameSite: "lax"
    },
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(locals); // locals for all views

// =============================
// ROUTES
// =============================
// PATHS
const authRoutes     = require("./src/routes/auth.js");
const dashRoutes     = require("./src/routes/dashboard.js");
const apiRoutes      = require("./src/routes/api.js");
const { ensureAuth } = require("./src/middleware/auth.js");
const errorHandlers  = require("./src/middleware/errorHandlers.js");

// ROUTES
// GET / 
app.get("/", ensureAuth, (req, res) => {
    res.redirect("/dashboard");
});

// app.get("/", (req, res) => {
//     console.log("ROOT HIT")
//     res.send("OK");
// });

app.use("/dashboard", dashRoutes);
app.use("/auth",      authRoutes);
app.use("/api",       apiRoutes);
app.use(errorHandlers.notFound);
app.use(errorHandlers.global);

// =============================
// TESTING
// =============================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`
        =======================================\n
        notes server running on port ${PORT}\n
        =======================================\n`)
});