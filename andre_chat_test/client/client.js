"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// const { Socket } = require("socket.io");
// var socket_io_client_1 = require("socket.io-client");
// var socket = (0, socket_io_client_1.io)();
var socket = io();
socket.on("chat", function (e) {
    console.log(e.user + ' ' + e.message);
    var chatOutput = document.getElementById('chat-output');
    if (chatOutput != null)
        chatOutput.value += e.message;
});
function sendMessage(s) {
    var payload = 
    {
        message: "",
        timeSent: "",
        user: {userName: "", userId: ""},
    };
    payload.message = s;
    payload.timeSent = Date.now().toString();
    payload.user.userName = 'guest';
    payload.user.userId = socket.id;
    socket.emit("chat", payload);
}
function onClickSend(e) {
    var chatInput = document.getElementById('chat-input');
    if (chatInput != null)
        sendMessage(chatInput.value);
}
var sendButton = document.getElementById('chat-send');
sendButton.addEventListener('click', onClickSend);
