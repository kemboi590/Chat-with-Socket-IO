import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

const app = express();
app.use(cors());

const server = http.createServer(app); // create http server
// create socket.io server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.send("Hello from socketIO");
});

// listen to any event
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`); // log user connected

  //join room
  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  //send message
  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
    // console.log(data)
  });

  //leave room
  socket.on("leave_room", (data) => {
    socket.leave(data);
    console.log(`User with ID: ${socket.id} left room: ${data}`);
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
}); // listen to port 3000
