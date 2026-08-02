const mongoose = require("mongoose");
const config = require("./../config/env");

// Connect once at startup (called from app.js). Models import `mongoose` from
// here so there is a single mongoose instance across the app.
async function connectMongo() {
    await mongoose.connect(config.mongoUri);
    console.log("MongoDB connected");
}

module.exports = { mongoose, connectMongo };
