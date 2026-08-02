const config = require("./env");

// Auth cookie names. Kept here so setting and clearing a cookie can never use
// mismatched names (a previous bug cleared "sellerCookie" while login set
// "sellercookie", so logout silently did nothing).
const COOKIE_NAMES = {
    buyer: "buyerCookie",
    seller: "sellercookie",
};

// Cookies must be cleared with the SAME attributes they were set with, or the
// browser keeps them. This one helper is used for both set and clear so they
// stay in sync. `secure`/`sameSite=none` are required for cross-site cookies in
// production (Vercel front-end -> Render API) but break plain-HTTP localhost, so
// they relax automatically outside production.
function baseCookieOptions() {
    return {
        httpOnly: true,
        secure: config.isProd,
        sameSite: config.isProd ? "none" : "lax",
        path: "/",
    };
}

function setCookieOptions() {
    return { ...baseCookieOptions(), maxAge: config.session.maxAgeMs };
}

module.exports = { COOKIE_NAMES, baseCookieOptions, setCookieOptions };
