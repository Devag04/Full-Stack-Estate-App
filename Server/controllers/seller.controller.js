const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const seller = require("../models/seller.model");
const config = require("../config/env");
const {
    COOKIE_NAMES,
    baseCookieOptions,
    setCookieOptions,
} = require("../config/cookies");
const asyncHandler = require("../utils/asyncHandler");

const signup = asyncHandler(async (req, res) => {
    const { name, email, phone, password, company } = req.body;

    if (await seller.findOne({ email })) {
        return res.json({ err: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 12);
    await seller.create({ name, email, phone, password: hashed, company });

    res.json({ ok: true });
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const data = await seller.findOne({ email });
    if (!data) {
        return res.json({ err: "Username is invalid" });
    }

    const match = await bcrypt.compare(password, data.password);
    if (!match) {
        return res.json({ err: "Password is invalid" });
    }

    const token = jwt.sign({ id: data._id.toString() }, config.jwt.sellerSecret, {
        expiresIn: config.jwt.expiresInSeconds,
    });

    res.cookie(COOKIE_NAMES.seller, token, setCookieOptions());
    res.json({ ok: true });
});

const logout = (req, res) => {
    res.clearCookie(COOKIE_NAMES.seller, baseCookieOptions());
    res.json({ ok: true });
};

module.exports = { signup, login, logout };
