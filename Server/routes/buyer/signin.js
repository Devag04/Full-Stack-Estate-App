const express=require('express');
const router=express.Router();
const bcrypt=require('bcrypt');
const JWT=require('jsonwebtoken');
const {buyer}=require('../../models/buyer.model');
router.use(express.urlencoded());
router.use(express.json());

const buyer_jwt_token="This is a jwt token for buyer@123@*";
router.post('/',async function(req,res){
    const {email,password}=req.body;
    let data=await buyer.findOne({email:email});
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

    const newToken=JWT.sign({
        id: data._id.toString()
    },buyer_jwt_token,{
        expiresIn:'5m'
    })
    res.cookie("buyerCookie",newToken,{
        maxAge:1000*60*5
    })
    res.send({ok:true});
})




module.exports={
    "buyerLogin": router,
    "jwt_secret":buyer_jwt_token
}