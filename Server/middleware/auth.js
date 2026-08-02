const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const config = require("../config/env");
const { COOKIE_NAMES } = require("../config/cookies");

// Factory that builds an auth guard for a given role. On a missing/invalid/
// expired token it responds 401 and STOPS the chain (the originals returned 200
// with `{auth:false}` and, in one branch, still called next()). The verified
// user id is attached to req under `attachAs` as an ObjectId.
function requireAuth({ cookieName, secret, attachAs }) {
    return function (req, res, next) {
        const token = req.cookies ? req.cookies[cookieName] : undefined;
        if (!token) {
            return res.status(401).json({ auth: false, err: "Not authenticated" });
        }

        let payload;
        try {
            payload = jwt.verify(token, secret);
        } catch (err) {
            return res
                .status(401)
                .json({ auth: false, err: "Invalid or expired session" });
        }

        req[attachAs] = new mongoose.Types.ObjectId(payload.id);
        next();
    };
}

const requireBuyer = requireAuth({
    cookieName: COOKIE_NAMES.buyer,
    secret: config.jwt.buyerSecret,
    attachAs: "buyer",
});

const requireSeller = requireAuth({
    cookieName: COOKIE_NAMES.seller,
    secret: config.jwt.sellerSecret,
    attachAs: "seller",
});

module.exports = { requireBuyer, requireSeller };
