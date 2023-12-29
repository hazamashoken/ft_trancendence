import { getServerSession } from "next-auth";
import { ChatBox } from "./trancendence/_components/chat/chat-box";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) redirect("/sign-up");
  return (
    <div className="flex">
      {children}
      <div className="absolute right-0">
        <ChatBox userId={userId.toString()} />
      </div>
    </div>
  );
}
