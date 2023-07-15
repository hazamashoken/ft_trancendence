// Dependencies
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { cn } from "@/lib/utils";

import { ModeToggle } from "@/components/top-navbar/mode-toggle.component";

// Icons
import FTLogo from "@/public/42_logo.svg";

// Custom
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import { SignInCard } from "@/components/sign-in";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/");
  }
  return (
    <>
      <div className="container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <ModeToggle className="absolute right-4 top-4 md:right-8 md:top-8" />
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            {/* <Image src={SignIn} alt="login-logo" /> */}
          </div>
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Image src={FTLogo} alt="data-gov-logo" />
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">&ldquo;Powered by Coffee.&rdquo;</p>
              <footer className="text-sm">Lexnetix Dev Team</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Welcome Back!
              </h1>
            </div>
            <SignInCard />
            <div className="flex flex-col space-y-2 text-center">
              <Link
                href="https://signin.intra.42.fr/users/password/new"
                className="text-sm text-blue-500 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
