const express=require('express');
const router=express.Router();
const bcrypt=require('bcrypt')
const {seller}=require('../../models/seller.model');
const JWT=require('jsonwebtoken');
const cookieParser=require('cookie-parser');

router.use(express.urlencoded());
router.use(express.json());

const seller_jwt_secret="This should be kept secret@123*";
router.post('/',async function(req,res){
    const {email,password}=req.body;
    let data=await seller.findOne({email:email});
    if(!data){
        return res.send({
            err:"Username is invalid"
        })
    }   

    const pass=data.password;
    const data1= await bcrypt.compare(password,pass);
    if(!data1){
        return res.send({
            err:"Password is invalid"
        })
    }
    const token=JWT.sign({
        id: data._id.toString()
    },seller_jwt_secret,{
        expiresIn: '5m'
    });

    res.cookie("sellercookie",token,{
        maxAge: 1000*60*5
    });
    res.send({ok:true});
})

module.exports={
    "sellerLogin": router,
    "jwt_secret":seller_jwt_secret
}