const express=require('express');
const router=express.Router();
const {property}=require('../../models/property.model')


router.get('/',async function(req,res){
    let data=undefined;
    if(req.seller!=undefined){
        data=await property.find({seller: req.seller});
    }
    else{
        data=await property.find({});
    }

    res.send({
        "prop":data,
        "buyerid":req.buyer
    });
})

module.exports={
    "searchall":router
}