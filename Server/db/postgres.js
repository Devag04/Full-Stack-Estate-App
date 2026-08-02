const { Pool } = require("pg");
const config = require("./../config/env");

// PostgreSQL connection pool, used only for the chat `messages` table.
// Managed Postgres providers (Render/Neon/etc.) require SSL.
const pool = new Pool({
    connectionString: config.databaseUrl,
    ssl: { rejectUnauthorized: false },
});

module.exports = pool;
