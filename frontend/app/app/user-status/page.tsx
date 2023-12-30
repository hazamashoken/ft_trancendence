"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { UserSessionInterface } from "../api/user-sessions/interface";

let socket: Socket;

export default function Home() {
  const session = useSession();
  const [onlineUsers, setOnlineUsers] = useState<UserSessionInterface[]>([]);
  const [ingameUsers, setIngameUsers] = useState<UserSessionInterface[]>([]);

  useEffect(() => {
    if (!session.data?.user?.id) {
      return;
    }
    socket = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sessions`, {
      extraHeaders: {
        Authorization: `Bearer ${session.data.accessToken}`,
      },
    });
    socket.on("connect", () => {
      console.log("connect");
    });
    socket.on("listOnlineUsers", (data) => {
      setOnlineUsers(data.users);
    });
    socket.on("listIngameUsers", (data) => {
      setIngameUsers(data.users);
    });

    return () => {
      socket.disconnect();
    };
  }, [session]);

  return (
    <main className="flex flex-col min-h-screen m-4">
      <h1>Online User</h1>
      <div>
        {onlineUsers.map((user) => (
          <div key={user.id} className="border-2 border-sky-500">
            {user.id} - {user.user.intraLogin}
          </div>
        ))}
      </div>
      <div className="m-2"></div>
      <h1>Ingame User</h1>
      <div>
        {ingameUsers.map((user) => (
          <div key={user.id} className="border-2 border-sky-500">
            {user.id} - {user.user.intraLogin}
          </div>
        ))}
      </div>
    </main>
  );
}
