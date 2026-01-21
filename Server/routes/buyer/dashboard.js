const express=require('express');
const router=express.Router();
const {propertyroute}=require('../../routes1/property');
const {requireBuyer}=require('../../middlewares/requirebuyer');

router.use('/property',requireBuyer,propertyroute);


module.exports={
    "buyerDashboard": router
}