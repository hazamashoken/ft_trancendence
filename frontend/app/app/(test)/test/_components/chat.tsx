"use client";

import { ChannelCreatedTO, ChatType } from "@/app/api/channels/interfaces";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect } from "react";
// import io from "socket.io-client";

// const socket = io("ws://localhost:3000"); // Replace with your server URL
export const Chat = () => {
  return (
    <div>
      <h1>Real-Time Chat</h1>
    </div>
  );
}

// export const Chat = () => {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [chatId, setChatId] = useState(1);
//   console.log("render");
//   // useEffect(() => {
//   //   // Listen for incoming messages
//   //   socket.on("createMessageResponse", (message) => {
//   //     console.log(message);
//   //     console.log("test");
//   //     // setMessages((prevMessages) => [...prevMessages, message]);
//   //   });
//   // }, []);
//   useEffect(() => {
//     socket.emit("findAllMessagesByChannel", { chatId: chatId });
//     socket.on("findAllMessagesByChannelResponse", (response) => {
//       console.log(response);
//       setMessages(response);
//     });
//   }, [chatId]);

//   useEffect(() => {
//     socket.on("createMessageResponse", (response) => {
//       console.log(response);
//       setMessages((prevMessages) => [...prevMessages, response]);
//       // setMessages((prevMessages) => [...prevMessages, message]);
//     });
//   }, [setMessages]);

//   const sendMessage = () => {
//     const payload = {
//       chatId: chatId,
//       messageDetails: {
//         message: newMessage,
//         userId: 4,
//       },
//     };
//     console.log(payload);
//     socket.emit("createMessage", payload);

//     setNewMessage("");
//     // setNewMessage("");
//   };

//   return (
//     <div>
//       <h1>Real-Time Chat</h1>
//       <Input
//         type="number"
//         value={chatId}
//         onChange={(e) => setChatId(parseInt(e.target.value))}
//       />
//       {/* <div>
//         {messages.map((message, index) => (
//           <div key={index}>{message}</div>
//         ))}
//       </div>
//       <input
//         type="text"
//         value={newMessage}
//         onChange={(e) => setNewMessage(e.target.value)}
//       /> */}
//       <ol>
//         {messages.map((message, index) => {
//           return <li key={index}>{message.message}</li>;
//         })}
//       </ol>
//       <Input
//         type="text"
//         value={newMessage}
//         onChange={(e) => setNewMessage(e.target.value)}
//       />
//       <Button
//         onClick={() => {
//           sendMessage();
//         }}
//       >
//         Send
//       </Button>
//     </div>
//   );
// };
