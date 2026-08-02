const mongoose = require("mongoose");
const property = require("../models/property.model");
const buyer = require("../models/buyer.model");
const asyncHandler = require("../utils/asyncHandler");

// GET /all
// Sellers see only their own listings; buyers see every listing.
const getAll = asyncHandler(async (req, res) => {
    const filter = req.seller ? { seller: req.seller } : {};
    const prop = await property.find(filter);
    res.json({ prop, buyerid: req.buyer });
});

// POST /add  (seller only)
const add = asyncHandler(async (req, res) => {
    const { title, location, price, type, beds, baths, size, desc } = req.body;
    const images = (req.files || []).map((file) => file.path);

    await property.create({
        title,
        location,
        price,
        type,
        beds,
        baths,
        size,
        images,
        desc,
        seller: req.seller,
    });

    const prop = await property.find({ seller: req.seller });
    res.status(201).json({ ok: true, prop });
});

// POST /search
// Builds a filter only from the fields actually provided.
const search = asyncHandler(async (req, res) => {
    const { location, type, minprice, maxprice, beds, baths, id } = req.body;

    const query = {};
    if (id) query._id = new mongoose.Types.ObjectId(id);
    if (location) query.location = location;
    if (type) query.type = type;
    if (beds) query.beds = Number(beds);
    if (baths) query.baths = Number(baths);
    if (minprice) query.price = { ...query.price, $gte: Number(minprice) };
    if (maxprice) query.price = { ...query.price, $lte: Number(maxprice) };

    if (Object.keys(query).length === 0) {
        return res.json({ count: 0 });
    }

    const prop = await property.find(query).populate("buyerfav");
    res.json({ prop, buyerid: req.buyer });
});

// POST /addasfav  (buyer only) — toggles the buyer<->property favourite link.
const addToFavourites = asyncHandler(async (req, res) => {
    const { buttonid, stat } = req.body;
    const propId = new mongoose.Types.ObjectId(buttonid);
    const buyerId = req.buyer;

    const propDoc = await property.findById(propId);
    const buyerDoc = await buyer.findById(buyerId);
    if (!propDoc || !buyerDoc) {
        return res.status(404).json({ err: "Property or buyer not found" });
    }

    if (String(stat) !== "1") {
        // Not currently a favourite -> add the link on both sides.
        buyerDoc.favourite = buyerDoc.favourite || [];
        propDoc.buyerfav = propDoc.buyerfav || [];
        if (!buyerDoc.favourite.some((fav) => fav.equals(propId))) {
            buyerDoc.favourite.push(propId);
        }
        if (!propDoc.buyerfav.some((fav) => fav.equals(buyerId))) {
            propDoc.buyerfav.push(buyerId);
        }
    } else {
        // Currently a favourite -> remove the link on both sides.
        buyerDoc.favourite = (buyerDoc.favourite || []).filter(
            (fav) => !fav.equals(propId)
        );
        propDoc.buyerfav = (propDoc.buyerfav || []).filter(
            (fav) => !fav.equals(buyerId)
        );
    }

    await Promise.all([buyerDoc.save(), propDoc.save()]);
    res.json({ ok: true });
});

// DELETE /delete  (seller only) — only lets a seller delete their own listing.
const remove = asyncHandler(async (req, res) => {
    const { id } = req.body;
    const result = await property.deleteOne({
        _id: new mongoose.Types.ObjectId(id),
        seller: req.seller,
    });

    if (result.deletedCount === 0) {
        return res.status(404).json({ err: "Property not found" });
    }
    res.json({ ok: true });
});

module.exports = { getAll, add, search, addToFavourites, remove };
