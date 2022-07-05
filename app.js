import { talk, conversationRaw } from './answers.js';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
const port = 3000;
const app = express();
const server = http.createServer(app);
const io = new Server(server);

let smartAnswer;
let currentCoversation = conversationRaw;
let iteration;

io.on('connection', (socket) => {
    iteration = 0;
    console.log('Client connected');

    socket.on('client message', (msg) => {
        console.log('message: ' + msg);
        let responseObject = talk(currentCoversation.conversationFlow, msg, iteration);
        smartAnswer = responseObject.outMessageText;
        socket.emit('bot message', smartAnswer);
        iteration =+ 1
        currentCoversation = responseObject.updatedConversation;
        console.log('response: ', smartAnswer);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(port, () => console.log(`Listening on port ${port}`));