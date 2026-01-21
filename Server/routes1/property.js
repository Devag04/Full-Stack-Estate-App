const express=require('express');
const router=express.Router();
const {searchall}=require('../routes/property/all');
const {addProp}=require('../routes/property/add');
const {search}=require('../routes/property/search');
const {addasfav}=require('../routes/property/addasfav');

router.use('/all',searchall);
router.use('/add',addProp);
router.use('/search',search);
router.use('/addasfav',addasfav);

module.exports={
    "propertyroute":router 
}