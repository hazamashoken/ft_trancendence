"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";

export async function addFriendUsername(values: { username: string }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: "No session found" };
  }
  const accessToken = session?.accessToken;
  if (!accessToken) {
    return { error: "No registered" };
  }

  const response = await fetch(
    `${process.env.BACKEND_URL}/me/friends/request-username`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.X_API_KEY as string,
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(values),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    return { error: data.message };
  }

  revalidateTag("friends");

  return { data };
}
export async function acceptFriend(values: { userId: number }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: "No session found" };
  }
  const accessToken = session?.accessToken;
  if (!accessToken) {
    return { error: "No registered" };
  }

  const response = await fetch(`${process.env.BACKEND_URL}/me/friends/accept`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.X_API_KEY as string,
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(values),
  });

  const data = await response.json();

  if (!response.ok) {
    return { error: data.message };
  }

  revalidateTag("friends");

  return { data };
}
export async function removeFriend(values: { userId: number }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: "No session found" };
  }
  const accessToken = session?.accessToken;
  if (!accessToken) {
    return { error: "No registered" };
  }

  const response = await fetch(`${process.env.BACKEND_URL}/me/friends/remove`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.X_API_KEY as string,
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(values),
  });

  const data = await response.json();

  if (!response.ok) {
    return { error: data.message };
  }

  revalidateTag("friends");

  return { data };
}
