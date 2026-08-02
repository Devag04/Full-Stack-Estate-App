// Wraps an async route handler so any rejected promise is forwarded to the
// centralized error middleware instead of hanging the request or crashing the
// process. Several original handlers awaited DB calls with no try/catch.
module.exports = function asyncHandler(handler) {
    return function (req, res, next) {
        Promise.resolve(handler(req, res, next)).catch(next);
    };
};
