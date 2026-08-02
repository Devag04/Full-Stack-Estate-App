const { mongoose } = require("../db/mongo");

const propertySchema = new mongoose.Schema({
    title: String,
    location: String,
    price: Number,
    type: String,
    beds: Number,
    baths: Number,
    size: Number,
    images: [String],
    desc: String,
    seller: mongoose.Schema.Types.ObjectId,
    buyerfav: [{ type: mongoose.Schema.Types.ObjectId, ref: "buyer" }],
});

// Model name "property" preserved so it maps to the same existing collection.
module.exports = mongoose.model("property", propertySchema);
