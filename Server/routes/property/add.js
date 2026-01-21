const express=require('express');
const router=express.Router();
const {property}=require('../../models/property.model');
router.use(express.json());
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });
const {jwt_secret}=require('../seller/signin')

router.post('/', upload.array("images",5),async function(req,res){    //we have to specify max images

    const {title,location,price,type,beds,baths,size,desc,seller}=req.body;
    console.log(seller);

    const imagePaths = req.files.map(file => "/uploads/" + file.filename);

    const newProp=new property({
        title: title,
        location: location,
        price: price,
        type: type,
        beds: beds,
        baths: baths,
        size: size,
        images: imagePaths,
        desc:desc,
        seller:req.seller
    })    

    try{
        await newProp.save();
    }catch(err){
        return res.send({
            err:err.message
        })
    }

    let data=undefined;
    try{
        data= await property.find({seller:req.seller});
    }catch(err){
        console.log(err.message);
    }
    
    res.send({
        ok:true,
        "prop": data
    })
})

module.exports={
    "addProp": router
}