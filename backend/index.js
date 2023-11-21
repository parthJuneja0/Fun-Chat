const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.Server(app);
const io = socketIO(server);

const port = process.env.PORT || 2000;
// This means Use process.env.PORT if available, otherwise use a default port (e.g., 2000)
app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, '../frontend/index.html');
    // ../ was not possible without path module 
    res.sendFile(indexPath);
});

const users = {};

io.on('connection', (socket) => {
    console.log("Socket connection success");
    // console.log(socket.id);

    socket.on('new-user-joined', (name) => {
        users[socket.id] = name;
        console.log(users)
        let message = `${name} joined the chat`;
        // console.log(message);
        socket.broadcast.emit('user-joined', message);
    });

    socket.on('sent', (message) => {
        console.log(message)
        socket.broadcast.emit('recieve', { message: message, name: users[socket.id] });
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('left', users[socket.id])
        delete users[socket.id];
    });
});

server.listen(port, () => {
    console.log(`http://localhost:${port}`);
    // console.log(`Server is running on port ${port}`)
});
