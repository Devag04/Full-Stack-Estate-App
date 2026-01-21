const { jwt_secret } = require('../routes/buyer/signin');
const JWT = require('jsonwebtoken');
const { buyer } = require('../models/buyer.model');
const mongoose = require('mongoose');

const requireBuyer = async function (req, res, next) {
    let token = undefined;
    try {
        token = req.cookies.buyerCookie;
    } catch (err) {
        return res.send({
            auth: false
        })
    }

    console.log(token);

    let data = undefined;
    try {
        data = await JWT.verify(token, jwt_secret);
    } catch (err) {
        return res.send({
            auth: false
        })
    }
    const id = data.id;
    const newid = new mongoose.Types.ObjectId(id);
    console.log(newid);
    req.buyer = newid;
    console.log(req.buyer);
    next();
}

module.exports = {
    "requireBuyer": requireBuyer
}