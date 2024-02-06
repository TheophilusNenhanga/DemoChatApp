import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { Server } from 'socket.io';
import * as path from "path";
import { legalCharacters, users } from './storage.js';
import { Message, User } from './models.js';

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
        if (message.username){
            // This should always be true. 
            users.forEach((user) => {
                if (user.username === message.username){
                    if (message.message.includes("/wordle")){
                        let score =  message.message.slice(8);
                        console.log(score);
                        if (legalCharacters.includes(score)){
                            user.wordleMessages.push(new Message(message.username, score, message.time));
                        }else{
                            // wordle command failed
                            user.generalMessages.push(new Message(message.username, message.message, message.time));
                        }
                    }else{
                        user.generalMessages.push(new Message(message.username, message.message, message.time));
                    }
                }
            });
        }
        checkHighScores();
        io.emit("chat-message", message);
    });

    socket.on("new-user", (user) => {
        users.push(new User(user.username));
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
      });
});


server.listen(3000, () => {
   console.log("Server running")
});