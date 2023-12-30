import { getServerSession } from "next-auth";
import { ChatBox } from "./trancendence/_components/chat/chat-box";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";
import { getOtp } from "../(auth)/_action/otp";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) redirect("/sign-up");

  return (
    <div className="relative flex justify-between w-full">
      {children}
      <div className="sticky right-0">
        <ChatBox userId={userId.toString()} />
      </div>
    </div>
  );
}
