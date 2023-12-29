"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";

export const addFriend = async (userId: string, friendId: string) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: "No session found" };
  }
  const accessToken = session?.accessToken;
  if (!accessToken) {
    return { error: "No registered" };
  }
  const url = `${process.env.BACKEND_URL}/friendships`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.X_API_KEY as string,
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      userId,
      friendId,
      status: "REQUESTED",
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    return { error: data.message };
  }
  return { data };
};

export const acceptFriend = async (userId: string, friendId: string) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: "No session found" };
  }
  const accessToken = session?.accessToken;
  if (!accessToken) {
    return { error: "No registered" };
  }
  const url = `${process.env.BACKEND_URL}/friendships`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.X_API_KEY as string,
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      userId,
      friendId,
      status: "ACCEPTED",
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    return { error: data.message };
  }
  return { data };
};
