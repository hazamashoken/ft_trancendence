import { SignInCard } from "@/components/sign-in";
import { UserCard } from "@/components/user-card";
import { getMyServerSession } from "@/lib/hooks/use-my-session";

export default async function Home() {
  const { session } = await getMyServerSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {!!session ? <UserCard session={session} /> : <SignInCard />}
    </main>
  );
}
