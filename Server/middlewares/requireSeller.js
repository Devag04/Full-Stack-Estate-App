const { jwt_secret } = require('../routes/seller/signin');
const JWT = require('jsonwebtoken');
const { seller } = require('../models/seller.model');
const mongoose = require('mongoose');

const requireSeller = async function (req, res, next) {
    let token = undefined;
    try {
        token = req.cookies.sellercookie;
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
    req.seller = newid;
    console.log(req.seller);
    next();
}

module.exports = {
    "requireSeller": requireSeller
}