import { SignInCard } from "@/components/sign-in";
import { UserCard } from "@/components/user-card";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { authOptions } from "./api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";
import { registerMe } from "./(auth)/_action/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/sign-in");
  }

  if (!session?.user?.id) {
    const res = await registerMe();
    redirect("/sign-up");
  }

  redirect("/trancendence");
}
