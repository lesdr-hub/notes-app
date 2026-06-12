// =============================
// IMPORTS
// =============================

require("dotenv");
const express = require("express");
const connectDb = require("./config/db.js");

// =============================
// SETUP
// =============================

const app = express();

// =============================
// TESTING
// =============================

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Server working."); 
});

app.listen(PORT, () => {
    console.log(`
        =======================================\n
        notes server running on port ${PORT}\n
        =======================================\n`)
});