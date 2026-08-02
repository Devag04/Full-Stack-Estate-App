// Tiny dependency-free request-body validator. A "rules" object maps each field
// to a spec: { required, type, min, max }. On failure it responds with
// { err: <message> } (HTTP 200, so the client's existing `.then` handlers show
// it inline — 401 is reserved for the auth guard's redirect); on success it
// calls next(). Replaces trusting req.body directly in signup/login.
function validateBody(rules) {
    return function (req, res, next) {
        const body = req.body || {};

        for (const [field, spec] of Object.entries(rules)) {
            const value = body[field];
            const present = value !== undefined && value !== null && value !== "";

            if (!present) {
                if (spec.required) {
                    return res.json({ err: `${field} is required` });
                }
                continue; // optional and absent -> skip further checks
            }

            if (spec.type === "number") {
                if (Number.isNaN(Number(value))) {
                    return res.json({ err: `${field} must be a number` });
                }
            } else if (spec.type === "string") {
                const str = String(value);
                if (spec.min && str.length < spec.min) {
                    return res.json({
                        err: `${field} must be at least ${spec.min} characters`,
                    });
                }
                if (spec.max && str.length > spec.max) {
                    return res.json({
                        err: `${field} must be at most ${spec.max} characters`,
                    });
                }
            }
        }

        next();
    };
}

module.exports = { validateBody };
