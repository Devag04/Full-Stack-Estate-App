const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { property } = require('../../models/property.model');
const { buyer } = require('../../models/buyer.model');

router.post('/', async function (req, res) {
    const { buttonid, stat } = req.body;
    const buyerid = req.buyer;
    const newid = new mongoose.Types.ObjectId(buttonid);
    const propdetail = await property.findOne({ _id: newid });
    const buyerdetail = await buyer.findOne({ _id: buyerid });
    if (stat != 1) {                           //means it is currently not a fav property
        buyerdetail.favourite = buyerdetail.favourite || [];
        buyerdetail.favourite.push(newid);
        console.log(buyerdetail.favourite);
        await buyerdetail.save();
        const buyerdetail1 = await buyer
            .findById(buyerid)
            .populate("favourite");
        console.log(buyerdetail1.favourite[0].beds);
        propdetail.buyerfav = propdetail.buyerfav || [];
        propdetail.buyerfav.push(buyerid);
        await propdetail.save();
    }
    else{
        let arr=[];
        for(let item of buyerdetail.favourite){
            if(!item.equals(newid)){
                arr.push(item);
            }
        }
        buyerdetail.favourite=arr;
        await buyerdetail.save();
        arr=[]
        for(let item of propdetail.buyerfav){
            if(!item.equals(buyerid)){
                arr.push(item);
            }
        }
        propdetail.buyerfav=arr;
        await propdetail.save();
    }
    res.send({
        ok: true
    });
})


module.exports = {
    "addasfav": router
}