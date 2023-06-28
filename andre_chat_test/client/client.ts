import {
	io,
	Socket
} from "socket.io-client";
import {
	ServerToClientEvents,
	ClientToServerEvents,
	Message
} from '../src/chat.interface';

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();

socket.on("chat", (e) => {
	console.log(e.user + ' ' + e.message);
});

function sendMessage(s: string)
{
	var payload: Message;

	payload.message = s;
	payload.timeSent = Date.now().toString();
	payload.user.userName = 'guest';
	payload.user.userId = socket.id;
	socket.emit("chat", payload);
}

function onClickSend(e: MouseEvent)
{
	var chatInput = <HTMLButtonElement>document.getElementById('chat-input');
	if (chatInput != null)
		sendMessage(chatInput.value);
}

var sendButton = document.getElementById('chat-send');
sendButton.addEventListener('click', onClickSend);
