const multer = require("multer");

// 404 for any unmatched route.
function notFound(req, res) {
    res.status(404).json({ err: "Not found" });
}

// Centralized error handler. Any error passed to next() (including rejected
// promises via asyncHandler) lands here and gets a consistent JSON shape.
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ err: err.message });
    }

    console.error(err);
    res.status(err.status || 500).json({
        err: err.message || "Internal server error",
    });
}

module.exports = { notFound, errorHandler };
