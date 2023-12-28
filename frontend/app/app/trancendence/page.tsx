import GameLoop from "@/components/pong/gameloop";

import Game from "@/components/pong/game";
import { ChatBox } from "./_components/chat-box";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";

export default async function ChatPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  return (
    <div className="flex justify-between">
      {/* <div className="flex justify-center flex-grow">
        <GameLoop />
        <Game width={"1200"} height={"600"} />
      </div> */}
      {/* <ChatBox userId={"5"} /> */}
      <ChatBox userId={userId?.toString()} />
    </div>
  );
}
