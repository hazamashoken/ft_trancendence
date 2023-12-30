import { SignInCard } from "@/components/sign-in";
import { UserCard } from "@/components/user-card";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { authOptions } from "./api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";
import { registerMe } from "./(auth)/_action/auth";
import { getOtp } from "./(auth)/_action/otp";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/sign-in");
  }

  if (!session?.user?.id) {
    const res = await registerMe();
    redirect("/sign-up");
  }

  const res = await getOtp();

  if (res.is_otp_enabled) {
    redirect("/otp/verify");
  }

  redirect("/trancendence");
}
