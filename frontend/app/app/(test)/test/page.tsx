import { CreateChannelBtn } from "./_components/channel";
import { Chat } from "./_components/chat";
import { CreateUserBtn } from "./_components/user";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";

export default async function ChatPage() {
  const session = await getServerSession(authOptions);
  const res = await fetch(`${process.env.BACKEND_URL}/channels/all`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const channelsData = await res.json();
  console.log(session);
  return (
    <>
      <CreateChannelBtn data={channelsData} />
      <CreateUserBtn profile={session?.user?.profile} />
      <Chat />
    </>
  );
}
