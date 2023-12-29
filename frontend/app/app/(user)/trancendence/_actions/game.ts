"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";

export async function createMatch() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: "No session found" };
  }
  const accessToken = session?.accessToken;
  if (!accessToken) {
    return { error: "No registered" };
  }

  const response = await fetch(`${process.env.BACKEND_URL}/matchs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.X_API_KEY as string,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) return { error: data.message };
  return { data };
}
export async function getMatchs() {
  const session = await getServerSession(authOptions);
  if (!session) return { error: "No session found" };

  const accessToken = session?.accessToken;
  if (!accessToken) return { error: "No registered" };

  const response = await fetch(`${process.env.BACKEND_URL}/matchs`, {
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
}
export async function joinMatch(matchId: number) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: "No session found" };
  }
  const accessToken = session?.accessToken;
  if (!accessToken) {
    return { error: "No registered" };
  }

  const response = await fetch(
    `${process.env.BACKEND_URL}/matchs/${matchId}/join`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.X_API_KEY as string,
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    return { error: data.message };
  }

  return { data };
}
export async function leaveMatch(matchId: number) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: "No session found" };
  }
  const accessToken = session?.accessToken;
  if (!accessToken) {
    return { error: "No registered" };
  }

  const response = await fetch(
    `${process.env.BACKEND_URL}/matchs/${matchId}/leave`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.X_API_KEY as string,
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    return { error: data.message };
  }

  return { data };
}
