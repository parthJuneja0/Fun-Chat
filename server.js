const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.Server(app);
const io = socketIO(server);

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'client')));

app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, './client/index.html');
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
        socket.broadcast.emit('user-joined', message);
    });

    socket.on('sent', (message) => {
        socket.broadcast.emit('recieve', { message: message, name: users[socket.id] });
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('left', users[socket.id])
        delete users[socket.id];
    });
});

server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
