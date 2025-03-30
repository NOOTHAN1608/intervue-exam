// server/index.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
app.use(cors());
app.use(express.json());
// Socket.io logic
io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('createPoll', (poll) => {
        // Logic to create a new poll
        io.emit('pollCreated', poll);
    });
    socket.on('submitAnswer', (answer) => {
        // Logic to handle submitted answers
        io.emit('answerSubmitted', answer);
    });
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));