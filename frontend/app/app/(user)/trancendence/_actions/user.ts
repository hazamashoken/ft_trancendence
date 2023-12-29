"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";

export const blockUser = async (payload: any) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: "No session found" };
  }
  const accessToken = session?.accessToken;
  if (!accessToken) {
    return { error: "No registered" };
  }
  const { userId, blockId } = payload;
  const url = `${process.env.BACKEND_URL}/user/${userId}/block`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.X_API_KEY as string,
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ userId: blockId }),
  });

  const data = await response.json();
  if (!response.ok) {
    return { error: data.message };
  }
  return { data };
};

export const unblockUser = async (payload: any) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: "No session found" };
  }
  const accessToken = session?.accessToken;
  if (!accessToken) {
    return { error: "No registered" };
  }
  const { userId, blockId } = payload;
  const url = `${process.env.BACKEND_URL}/user/${userId}/unblock`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.X_API_KEY as string,
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ userId: blockId }),
  });

  const data = await response.json();
  if (!response.ok) {
    return { error: data.message };
  }
  return { data };
};

export const getBlockUsers = async (userId: string = "1") => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: "No session found" };
  }
  const accessToken = session?.accessToken;
  if (!accessToken) {
    return { error: "No registered" };
  }
  const url = `${process.env.BACKEND_URL}/user/${userId}/block`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.X_API_KEY as string,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    return { error: data.message };
  }
  return { data };
};
