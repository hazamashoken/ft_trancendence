import { TopNavBar } from "@/components/top-navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/authOptions";

export async function Protected({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  return (
    <>
      <div className="h-screen">
        {session && <TopNavBar />}
        {children}
      </div>
    </>
  );
}
