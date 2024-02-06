import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { Server } from 'socket.io';
import * as path from "path";

const app = express();
const server = createServer(app);
const io = new Server(server);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, "./public")));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});


io.on("connection", (socket) => {
    console.log("User Connected");

    socket.on("chat-message", (message) => {
        io.emit("chat-message", message);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
      });
});


server.listen(3000, () => {
   console.log("Server running")
});