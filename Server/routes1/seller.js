const express=require('express');
const router=express.Router();
const {sellerLogin}=require('../routes/seller/signin');
const {sellerSignup}=require('../routes/seller/signup');
const {sellerDashboard}=require('../routes/seller/dashboard')

router.use('/Login',sellerLogin);
router.use('/signup',sellerSignup);
router.use('/dashboard',sellerDashboard)

module.exports={
    "sellerroute":router
}