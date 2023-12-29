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
    const users = [
        {id: '1', intraLogin: 'abced' },
        {id: '2', intraLogin: 'xyz' },
        {id: '3', intraLogin: 'yuio '},
    ];
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
