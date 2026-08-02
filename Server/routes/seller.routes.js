const express = require("express");
const sellerController = require("../controllers/seller.controller");
const propertyController = require("../controllers/property.controller");
const { requireSeller } = require("../middleware/auth");
const { validateBody } = require("../middleware/validate");
const upload = require("../middleware/upload");

const router = express.Router();

const signupRules = {
    name: { required: true, type: "string" },
    email: { required: true, type: "string" },
    password: { required: true, type: "string", min: 6 },
    phone: { type: "number" },
    company: { type: "string" },
};
const loginRules = {
    email: { required: true, type: "string" },
    password: { required: true, type: "string" },
};

// Public auth endpoints (URL casing kept: the client posts to /seller/Login).
router.post("/Login", validateBody(loginRules), sellerController.login);
router.post("/signup", validateBody(signupRules), sellerController.signup);
router.post("/logout", sellerController.logout);

// Everything under /dashboard requires a valid seller session.
const dashboard = express.Router();
dashboard.use(requireSeller);
dashboard.get("/property/all", propertyController.getAll);
dashboard.post("/property/add", upload.array("images", 5), propertyController.add);
dashboard.post("/property/search", propertyController.search);
dashboard.delete("/property/delete", propertyController.remove);
router.use("/dashboard", dashboard);

module.exports = router;
