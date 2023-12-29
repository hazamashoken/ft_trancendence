import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/authOptions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { MeApi } from "../../api/me/meApi";
import apiClient from "../../api/api-client";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { SignUpCard } from "./_components/sign-up-card";

// export const metadata: Metadata = {
//   title: "Sign Up",
//   description: "Create your account",
// };

export default async function SignUpPage() {
  const session = await getServerSession(authOptions);

  return <SignUpCard />;
}
