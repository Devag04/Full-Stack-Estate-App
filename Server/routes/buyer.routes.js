const express = require("express");
const buyerController = require("../controllers/buyer.controller");
const propertyController = require("../controllers/property.controller");
const messageController = require("../controllers/message.controller");
const { requireBuyer } = require("../middleware/auth");
const { validateBody } = require("../middleware/validate");

const router = express.Router();

const signupRules = {
    name: { required: true, type: "string" },
    email: { required: true, type: "string" },
    password: { required: true, type: "string", min: 6 },
    phone: { type: "number" },
};
const loginRules = {
    email: { required: true, type: "string" },
    password: { required: true, type: "string" },
};

// Public auth endpoints (URL casing kept: the client posts to /buyer/Login).
router.post("/Login", validateBody(loginRules), buyerController.login);
router.post("/signup", validateBody(signupRules), buyerController.signup);
router.post("/logout", buyerController.logout);

// Everything under /dashboard requires a valid buyer session.
const dashboard = express.Router();
dashboard.use(requireBuyer);
dashboard.get("/property/all", propertyController.getAll);
dashboard.post("/property/search", propertyController.search);
dashboard.post("/property/addasfav", propertyController.addToFavourites);
dashboard.get("/message/get", messageController.getForBuyer);
router.use("/dashboard", dashboard);

module.exports = router;
