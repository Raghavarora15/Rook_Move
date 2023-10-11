const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(__dirname + '/public'));

io.on('connection', socket => {
    console.log('Player connected');

    // Handle game logic and Socket.io events here
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});

io.on('connection', socket => {
    console.log('Player connected');

    socket.on('move', data => {
        // Handle player moves
        // Broadcast the move to other player(s)
        socket.broadcast.emit('opponentMove', data);
    });

    socket.on('win', winner => {
        // Handle game win
        // Broadcast the winner to all players
        io.emit('gameOver', winner);
    });

    socket.on('disconnect', () => {
        console.log('Player disconnected');
        // Handle player disconnection if needed
    });
});
