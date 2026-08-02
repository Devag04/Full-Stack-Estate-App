const path = require("path");
const { createServer } = require("http");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const config = require("./config/env");
const { connectMongo } = require("./db/mongo");
const { attachSocket } = require("./socket");
const buyerRoutes = require("./routes/buyer.routes");
const sellerRoutes = require("./routes/seller.routes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

// Render sits behind a proxy; needed for secure cookies to work correctly.
app.set("trust proxy", 1);

app.use(
    cors({
        origin: config.corsOrigins,
        credentials: true,
    })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the static front-end from the sibling Client directory.
app.use(express.static(path.join(__dirname, "..", "Client")));

app.use("/buyer", buyerRoutes);
app.use("/seller", sellerRoutes);

app.use(notFound);
app.use(errorHandler);

const server = createServer(app);
attachSocket(server);

async function start() {
    await connectMongo();
    server.listen(config.port, "0.0.0.0", () => {
        console.log(`Server running on port ${config.port}`);
    });
}

start().catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
});
