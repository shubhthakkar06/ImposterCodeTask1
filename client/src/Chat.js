import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./Chat.css";

/* Connect to backend */
const socket = io("http://ShubhThakkars-MacBook-Pro.local:12345", {
  transports: ["websocket", "polling"], 
});




socket.on("connect", () => {
  console.log("Connected to server:", socket.id);
});

export default function Chat({ username, room }) {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.emit("join_room", { username, room });

    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("room_users", (list) => {
      setUsers(list);
    });
  }, []);

  const send = () => {
    if (!msg) return;

    const messageData = {
      username,
      room,
      message: msg,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })
    };

    socket.emit("send_message", messageData);
    setMsg("");
  };

  return (
    
    <div className="chat-container">
      <div className="bg-animated"></div>
      <div className="users-panel">
        <h3>Room: {room}</h3>
        <h4>Active Users</h4>
        <ul>
          {users.map((u, i) => (
            <li key={i}>{u.username}</li>
          ))}
        </ul>
      </div>
    

      <div className="chat-box">
        <div className="messages">
          {messages.map((m, i) => {
            const myMessage = m.username === username;

            return (
              <div
                key={i}
                className={`msg-bubble ${myMessage ? "my-msg" : "other-msg"}`}
              >
                {!myMessage && <strong>{m.username}</strong>}
                <p>{m.message}</p>
                <span className="time">{m.time}</span>
              </div>
            );
          })}
        </div>

        <div className="input-area">
          <input
            placeholder="Type a message..."
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <button onClick={send}>Send</button>
        </div>
      </div>

    </div>
  );
}
