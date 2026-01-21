const express=require('express');
const router=express.Router();
const {buyerLogin}=require('../routes/buyer/signin');
const {buyerSignup}=require('../routes/buyer/signup');
const {buyerDashboard}=require('../routes/buyer/dashboard')

router.use('/Login',buyerLogin);
router.use('/signup',buyerSignup);
router.use('/dashboard',buyerDashboard);
module.exports={
    "buyerroute":router
}