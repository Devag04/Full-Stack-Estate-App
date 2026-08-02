// Centralized, validated environment configuration.
// Every other module reads config from here instead of touching process.env
// directly, so a missing variable fails fast at startup with a clear message.
require("dotenv").config();

function required(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}

const isProd = process.env.NODE_ENV === "production";

// Single source of truth for session length: the JWT lifetime and the cookie
// maxAge are always derived from the same number, so they can never drift apart.
const sessionMaxAgeMs =
    Number(process.env.SESSION_MAX_AGE_MS) || 7 * 24 * 60 * 60 * 1000; // 7 days

const config = {
    isProd,
    port: Number(process.env.PORT) || 7900,

    mongoUri: required("MONGO_URI"),
    databaseUrl: required("DATABASE_URL"),

    jwt: {
        buyerSecret: required("JWT_SECRET_BUYER"),
        sellerSecret: required("JWT_SECRET_SELLER"),
        expiresInSeconds: Math.floor(sessionMaxAgeMs / 1000),
    },

    session: {
        maxAgeMs: sessionMaxAgeMs,
    },

    cloudinary: {
        cloudName: required("CLOUDINARY_CLOUD_NAME"),
        apiKey: required("CLOUDINARY_API_KEY"),
        apiSecret: required("CLOUDINARY_API_SECRET"),
    },

    // Comma-separated list of allowed browser origins. Defaults cover the two
    // production hosts plus common local static-server ports for development.
    corsOrigins: (
        process.env.CORS_ORIGINS ||
        [
            "https://full-stack-estate-app.vercel.app",
            "https://full-stack-estate-app-1.onrender.com",
            "http://localhost:5500",
            "http://127.0.0.1:5500",
            "http://localhost:3000",
        ].join(",")
    )
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean),
};

module.exports = config;
