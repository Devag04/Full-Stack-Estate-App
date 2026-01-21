const express = require('express');
const app = express();
app.use(express.static('Client/public'));
const { buyerroute } = require('./Server/routes1/buyer')
const { sellerroute } = require('./Server/routes1/seller')
const cookieParser=require('cookie-parser');
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const multer = require("multer");


app.use('/buyer', buyerroute);
app.use('/seller', sellerroute);

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload=multer({storage});
app.use("/uploads",express.static("uploads"));
module.exports={
    "upload":upload
}

app.listen(7800, (err) => {
    console.log("http://localhost:7800");
})