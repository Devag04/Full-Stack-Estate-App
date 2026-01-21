const {mongoose}=require('../database/db');
const {sellerSchema}=require('../schema/seller.schema');

const seller=new mongoose.model('sellers',sellerSchema);


module.exports={
    "seller":seller
}