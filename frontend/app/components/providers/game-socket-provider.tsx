"use client";
import { GameState } from "@/lib/pong.interface";
import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";
import { io as ClientIO, Socket } from "socket.io-client";
import { newGameState } from "@/lib/pong.gamestate";

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
};
const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useGameSocket = () => {
  return useContext(SocketContext);
};

export const GameSocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.accessToken) return;
    const socketInstance = new (ClientIO as any)(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/game`,
      {
        extraHeaders: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      }
    );

    socketInstance.on("connect", () => {
      console.log("connect");
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [session]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
