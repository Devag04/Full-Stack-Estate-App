const express=require('express');
const router=express.Router();
const bcrypt=require('bcrypt')
const {buyer}=require('../../models/buyer.model');
router.use(express.urlencoded());
router.use(express.json());

router.post('/',async function(req,res){
    const {name,email,phone,password,}=req.body;
    let data=await buyer.findOne({email:email});
    if(data){
        return res.send({
            err:"User already exists"
        })
    }

    const pass=await bcrypt.hash(password,12);
    const newBuyer=new buyer({
        name: name,
        email:email,
        phone: phone,
        password: pass
    }) 
    try{
        await newBuyer.save();
    }catch(error){
        return res.send({
            err: error.message
        })
    }
    res.send({ok:true})
})




module.exports={
    "buyerSignup": router
}