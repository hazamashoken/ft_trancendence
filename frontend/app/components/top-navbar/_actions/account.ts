"use server";

import ApiClient from "@/app/api/api-client";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";

export async function updateAccount(payload: { displayName: string }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: "No session found" };
  }
  const accessToken = session?.accessToken;
  if (!accessToken) {
    return { error: "No registered" };
  }

  const response = await fetch(`${process.env.BACKEND_URL}/me/account`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.X_API_KEY as string,
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    return { error: data.message };
  }

  return { data };
}
export async function uploadAvatar(payload: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: "No session found" };
  }
  const accessToken = session?.accessToken;
  if (!accessToken) {
    return { error: "No registered" };
  }

  const response = await fetch(`${process.env.BACKEND_URL}/me/account/avatar`, {
    method: "POST",
    headers: {
      "x-api-key": process.env.X_API_KEY as string,
      Authorization: `Bearer ${accessToken}`,
    },
    body: payload,
  });

  console.log(response);

  const data = await response.json();

  if (!response.ok) {
    return { error: data.error };
  }

  return { data };
}
