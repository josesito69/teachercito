// Server-side code (Node.js + Socket.io)
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let players = {}; // Store player scores

io.on('connection', (socket) => {
    console.log('A player connected:', socket.id);
    players[socket.id] = { score: 0 };
    
    socket.on('answer', (data) => {
        if (data.correct) {
            players[socket.id].score++;
        }
        io.emit('updateScores', players);
    });
    
    socket.on('disconnect', () => {
        delete players[socket.id];
        io.emit('updateScores', players);
        console.log('A player disconnected:', socket.id);
    });
});

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
