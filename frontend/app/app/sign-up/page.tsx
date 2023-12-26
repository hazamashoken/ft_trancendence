'use client';

import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { MeApi } from "../api/me/meApi";
import apiClient from "../api/api-client";

// export const metadata: Metadata = {
//   title: "Sign Up",
//   description: "Create your account",
// };

export default function Page() {
  const { data: session, status, update } = useSession()
  console.log('signup status', status);
  console.log('signup', session);
  if (status === 'authenticated' && session.user?.id) {
    console.log(session.user);
    redirect("/profile")
  }

  const signup = async () => {
    console.log('signup');
    const meApi = new MeApi();
    const user = await meApi.createAccount();
    console.log('created: ', user);
    update({ user })
  }

  return (
    <div className="container flex-col h-screen">
        <div className="h-full flex-col justify-center items-center">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>fill your profile</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <pre>{JSON.stringify(session?.ftUser ?? {}, null, 1)}</pre>
            <Button className="mt-2" variant="outline" onClick={signup}>Sign up</Button>
          </div>
        </CardContent>
        </div>
    </div>
  );
}
