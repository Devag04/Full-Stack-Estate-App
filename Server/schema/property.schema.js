const { ObjectId } = require('bson');
const mongoose=require('mongoose');

const propertySchema=new mongoose.Schema({
    title:String,
    location: String,
    price:Number,
    type: String,
    beds: Number,
    baths: Number,
    size: Number,
    images: [String],
    desc: String,
    seller: ObjectId,
    buyerfav:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "buyer"
     }]
});

module.exports={
    "propertySchema":propertySchema
}