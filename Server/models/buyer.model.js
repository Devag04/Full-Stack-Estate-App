const { mongoose } = require("../db/mongo");

const buyerSchema = new mongoose.Schema({
    name: String,
    email: { type: String, index: true },
    phone: Number,
    password: String,
    favourite: [{ type: mongoose.Schema.Types.ObjectId, ref: "property" }],
});

// Model name "buyer" -> collection "buyers" (unchanged from the original).
module.exports = mongoose.model("buyer", buyerSchema);
