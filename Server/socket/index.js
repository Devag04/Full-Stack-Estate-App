const { Server } = require("socket.io");
const pool = require("../db/postgres");
const config = require("../config/env");

// Attaches Socket.IO chat handling to an existing HTTP server.
// Rooms are keyed by the sorted (sender, receiver, property) triple so both
// participants of a conversation deterministically land in the same room.
function attachSocket(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: config.corsOrigins,
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    let counter = 1;
    const roomMapping = new Map();

    function roomKeyFor(sender, receiver, property) {
        return [sender, receiver, property].sort().join("_");
    }

    function getOrCreateRoom(key) {
        if (!roomMapping.has(key)) {
            roomMapping.set(key, counter++);
        }
        return roomMapping.get(key);
    }

    io.on("connection", (socket) => {
        socket.on("register", () => {});

        socket.on("join-room", async (sender, receiver, property) => {
            const result = await pool.query(
                `SELECT * FROM messages
                  WHERE sender = $1 AND receiver = $2 AND property = $3
                  ORDER BY message_time`,
                [sender, receiver, property]
            );

            const room = getOrCreateRoom(roomKeyFor(sender, receiver, property));
            socket.join(room);
            io.to(room).emit("initial-messages", result.rows);
        });

        socket.on("leave-room", (sender, receiver, property) => {
            const room = roomMapping.get(roomKeyFor(sender, receiver, property));
            if (room) socket.leave(room);
        });

        socket.on("message-sent", async (sender, receiver, property, data) => {
            await pool.query(
                `INSERT INTO messages (sender, receiver, property, message)
                 VALUES ($1, $2, $3, $4)`,
                [sender, receiver, property, data]
            );

            const room = getOrCreateRoom(roomKeyFor(sender, receiver, property));
            io.to(room).emit("message-received", sender, data);
        });
    });

    return io;
}

module.exports = { attachSocket };
