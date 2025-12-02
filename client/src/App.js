import React, { useState } from "react";
import Chat from "./Chat";
import "./App.css";

export default function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);

  return joined ? (
    <Chat username={username} room={room} />
  ) : (
    <>
      {/* VIDEO BACKGROUND */}
      <video autoPlay loop muted playsInline className="bg-video">
        <source src="/bg.mp4" type="video/mp4" />
      </video>

      <div className="join-container">
        <div className="join-box">
          <h2>Join Chat Room</h2>

          <input
            placeholder="Enter Username"
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            placeholder="Enter Room ID"
            onChange={(e) => setRoom(e.target.value)}
          />

          <button onClick={() => username && room && setJoined(true)}>
            Join
          </button>
        </div>
      </div>
    </>
  );
}
