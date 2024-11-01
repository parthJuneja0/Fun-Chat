socket = io();

const section = document.querySelector('section');
const form = document.getElementById('search');
const messageInp = document.getElementById('messageInp');
const announceAudio = new Audio('./public/assets/announce.mp3')
const sendAudio = new Audio('./public/assets/sent.mp3')
const recieveAudio = new Audio('./public/assets/recieve.mp3')

const name = prompt("Enter your name");
document.title = `${name} - Fun Chat`;
socket.emit('new-user-joined', name);

window.addEventListener('DOMContentLoaded', () => {
    announceAudio.load();
    sendAudio.load();
    recieveAudio.load();
});

function chat(message, position) {
    let messageDiv = document.createElement('div');
    messageDiv.innerHTML = message;
    messageDiv.classList.add('msg', position);
    section.append(messageDiv);

    if (position == 'left') {
        recieveAudio.play().catch((err) => console.log("Audio play error:", err));
    } else if (position == 'right') {
        sendAudio.play().catch((err) => console.log("Audio play error:", err));
    } else {
        announceAudio.play().catch((err) => console.log("Audio play error:", err));
    }
};

socket.on('user-joined', (message) => {
    chat(message, 'center');
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    message = messageInp.value;
    if (message) {
        chat(`You: ${message}`, 'right');
    }
    socket.emit('sent', message);
    messageInp.value = "";
});

socket.on('recieve', (data) => {
    if (data) {
        chat(`${data.name}: ${data.message}`, 'left');
    }
});

socket.on('left', (name) => {
    chat(`${name} left the chat`, 'center');
});