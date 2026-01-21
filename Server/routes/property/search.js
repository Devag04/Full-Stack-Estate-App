const express=require('express');
const {property}=require('../../models/property.model');
const mongoose=require('mongoose');
const router=express.Router();
router.use(express.json());

router.post('/',async function(req,res){
    const {location,type,minprice,maxprice,beds,baths,id}=req.body;

    const query={};
    let count=0;
    if(id!="" && id!=undefined){
        const newid=new mongoose.Types.ObjectId(id);
        query._id=newid;
        count++;
    }
    if(location!="" && location!=undefined){
        query.location=location;
        count++;
    }
    if(type!="" && type!=undefined){
        query.type=type
        count++;
    }
    if(beds!="" && beds!=undefined){
        query.beds=Number(beds)
        count++;
    }
    if(baths!="" && baths!=undefined){
        query.baths=Number(baths)
        count++;
    }
    if(minprice!="" && minprice!=undefined){
        query.price = query.price || {};
        query.price.$gte = Number(minprice);
        count++;
    }
    if(maxprice!="" && maxprice!=undefined){
        query.price = query.price || {};
        query.price.$lte = Number(maxprice);
        count++;
    }
    if(count===0){
        return res.send({
            count:count
        })
    }
    const prop=await property.find(query);
    res.send({
        prop:prop,
        "buyerid":req.buyer
    })
});


module.exports={
    "search":router
}