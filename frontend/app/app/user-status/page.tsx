"use client"

import { UserCard } from "@/components/user-card";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

let socket: Socket;

export default function Home() {
  const session = useSession();
    const [users, setUsers] = useState([
        {id: 1, intraLogin: 'abcde'}
    ]);

    useEffect(() => {
        if (!session.data?.user?.id) {
            return;
        }
        const token = session.data.accessToken;
        console.log('token:', token);
        socket = io('http://localhost:3000/session', {
            extraHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
        socket.on('connect', () => {
            console.log('connect');
        });
        socket.on('listOnlineUsers', (...args) => {
            console.log('listOnlineUsers', args);
        })
        return () => {
            socket.disconnect()
        };
    }, [session])

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            {
                users.map(user => (
                    <div key={user.id} className="border-2 border-sky-500">
                        {user.id} - {user.intraLogin}
                    </div>
                ))
            }
        </main>
    )
}
