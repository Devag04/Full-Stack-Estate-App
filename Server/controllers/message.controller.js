const pool = require("../db/postgres");
const asyncHandler = require("../utils/asyncHandler");

// GET /get  (buyer only) — every message the current buyer sent or received.
const getForBuyer = asyncHandler(async (req, res) => {
    const entity = req.buyer.toString();

    const data = await pool.query(
        `SELECT *
           FROM messages
          WHERE sender = $1 OR receiver = $1
          ORDER BY message_time ASC`,
        [entity]
    );

    res.json({ rows: data.rows, buyerid: entity });
});

module.exports = { getForBuyer };
