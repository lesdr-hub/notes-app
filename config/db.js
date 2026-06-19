// =============================
// IMPORTS
// =============================

const mongoose = require("mongoose"); 

// =============================
// CONNECT FUNCTION
// =============================

const connectDb = async () => {
    try {
        console.log("Attempting DB connection...");
        console.log("URI exists:", !!process.env.MONGODB_URI);
        const conn = await mongoose.connect(process.env.MONGODB_URI); 
        console.log(`Database connected @ ${conn.connection.host}`);
    } catch (error) {
        console.log(`MongoDB connection error: ${error.message}`)
        process.exit(1); 
    }
}

module.exports = connectDb;