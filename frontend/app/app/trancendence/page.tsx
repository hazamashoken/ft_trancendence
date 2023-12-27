import GameLoop from "@/components/pong/gameloop";

import Game from "@/components/pong/game";
import { ChatBox } from "./_components/chat-box";

export default async function ChatPage() {
  return (
    <div className="flex justify-between">
      {/* <div className="flex justify-center flex-grow">
        <GameLoop />
        <Game width={"1200"} height={"600"} />
      </div> */}
      {/* <ChatBox userId={"5"} /> */}
      <ChatBox userId={"6"} />
    </div>
  );
}
