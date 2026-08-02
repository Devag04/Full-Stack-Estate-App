const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const buyer = require("../models/buyer.model");
const config = require("../config/env");
const {
    COOKIE_NAMES,
    baseCookieOptions,
    setCookieOptions,
} = require("../config/cookies");
const asyncHandler = require("../utils/asyncHandler");

const signup = asyncHandler(async (req, res) => {
    const { name, email, phone, password } = req.body;

    if (await buyer.findOne({ email })) {
        return res.json({ err: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 12);
    await buyer.create({ name, email, phone, password: hashed });

    res.json({ ok: true });
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const data = await buyer.findOne({ email });
    if (!data) {
        return res.json({ err: "Username is invalid" });
    }

    const match = await bcrypt.compare(password, data.password);
    if (!match) {
        return res.json({ err: "Password is invalid" });
    }

    const token = jwt.sign({ id: data._id.toString() }, config.jwt.buyerSecret, {
        expiresIn: config.jwt.expiresInSeconds,
    });

    res.cookie(COOKIE_NAMES.buyer, token, setCookieOptions());
    res.json({ ok: true });
});

const logout = (req, res) => {
    res.clearCookie(COOKIE_NAMES.buyer, baseCookieOptions());
    res.json({ ok: true });
};

module.exports = { signup, login, logout };
