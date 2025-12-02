const express = require("express");
const app = express();
const http = require("http").createServer(app);

const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  transports: ["websocket", "polling"]
});

const PORT = 12345;

let rooms = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_room", ({ username, room }) => {
    socket.join(room);

    if (!rooms[room]) rooms[room] = [];
    rooms[room].push({ id: socket.id, username });

    io.to(room).emit("room_users", rooms[room]);
  });

  socket.on("send_message", (data) => {
    io.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    for (let r in rooms) {
      rooms[r] = rooms[r].filter(u => u.id !== socket.id);
      io.to(r).emit("room_users", rooms[r]);
    }
  });
});

// IMPORTANT!
http.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on 0.0.0.0:" + PORT);
});
