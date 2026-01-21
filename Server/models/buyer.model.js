const {mongoose}=require('../database/db');
const {buyerSchema}=require('../schema/buyer.schema');

const buyer= new mongoose.model('buyer',buyerSchema);

module.exports={
    "buyer":buyer
}
