"use client"

import { SignInCard }from "@/components/sign-in";
import { UserCard } from "@/components/user-card";
import { useSession } from "next-auth/react";

export default function Home() {
  const session = useSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {session.status === "authenticated" ?
      <UserCard session={session}/>
      :
      <SignInCard />
      }
    </main>
  )
}
