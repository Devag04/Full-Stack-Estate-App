const express=require('express');
const router=express.Router();
const bcrypt=require('bcrypt')
const {seller}=require('../../models/seller.model');
router.use(express.urlencoded());
router.use(express.json());

router.post('/',async function(req,res){
    const {name,email,phone,password,company}=req.body;
    let data=await seller.findOne({email:email});
    if(data){
        return res.send({
            err:"User already exists"
        })
    }

    const pass=await bcrypt.hash(password,12);
    const newSeller=new seller({
        name: name,
        email:email,
        phone: phone,
        password: pass,
        company: company
    }) 
    try{
        await newSeller.save();
    }catch(error){
        return res.send({
            err: error.message
        })
    }
    res.send({ok:true})
})




module.exports={
    "sellerSignup": router
}