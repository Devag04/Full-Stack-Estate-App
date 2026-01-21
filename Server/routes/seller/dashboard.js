const express=require('express');
const router=express.Router();
const {propertyroute}=require('../../routes1/property');
const {requireSeller}=require('../../middlewares/requireSeller')

router.use('/property',requireSeller,propertyroute);

module.exports={
    "sellerDashboard":router
}
