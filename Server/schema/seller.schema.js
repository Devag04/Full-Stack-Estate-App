const { ObjectId } = require('bson');
const mongoose=require('mongoose');

const sellerSchema=new mongoose.Schema({
    name: String,
    email: String,
    phone: Number,
    password: String,
    company: String,
    property:[mongoose.Schema.Types.ObjectId]
})

module.exports={
    "sellerSchema":sellerSchema
}