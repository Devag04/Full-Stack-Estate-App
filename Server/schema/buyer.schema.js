const mongoose=require('mongoose');

const buyerSchema=new mongoose.Schema({
    name: String,
    email: String,
    phone: Number,
    password: String,
    favourite: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "property"
     }]
})  

module.exports={
    "buyerSchema":buyerSchema
}