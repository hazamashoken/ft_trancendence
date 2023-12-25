"use client"

import { UserCard } from "@/components/user-card";
import { useSession } from "next-auth/react";

export default function Home() {
  const session = useSession();
    console.log(session)
    if (session.status === 'loading') {
        return (
            <div>loading</div>
        )
    }
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <UserCard session={session}/>
        </main>
    )
}
