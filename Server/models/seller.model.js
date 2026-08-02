const { mongoose } = require("../db/mongo");

const sellerSchema = new mongoose.Schema({
    name: String,
    email: { type: String, index: true },
    phone: Number,
    password: String,
    company: String,
    property: [mongoose.Schema.Types.ObjectId],
});

// Model name "sellers" preserved so it maps to the same existing collection.
module.exports = mongoose.model("sellers", sellerSchema);
