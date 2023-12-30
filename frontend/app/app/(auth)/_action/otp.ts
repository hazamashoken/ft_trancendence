"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";

export async function getOtp() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: "No session found" };
  }
  const accessToken = session?.accessToken;
  if (!accessToken) {
    return { error: "No registered" };
  }

  const response = await fetch(`${process.env.BACKEND_URL}/me/security/2fa`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.X_API_KEY as string,
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-cache",
  });

  const data = await response.json();

  if (!response.ok) {
    return { is_otp_enabled: false, error: data.message };
  }

  return { is_otp_enabled: true, error: null };
}
export async function registerOtp() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: "No session found" };
  }
  const accessToken = session?.accessToken;
  if (!accessToken) {
    return { error: "No registered" };
  }

  const response = await fetch(`${process.env.BACKEND_URL}/me/security/2fa`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.X_API_KEY as string,
      Authorization: `Bearer ${accessToken}`,
    },
    body: null,
  });

  const data = await response.json();

  if (!response.ok) {
    return { error: data.message };
  }

  return { data };
}
export async function removeOtp() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: "No session found" };
  }
  const accessToken = session?.accessToken;
  if (!accessToken) {
    return { error: "No registered" };
  }

  const response = await fetch(`${process.env.BACKEND_URL}/me/security/2fa`, {
    method: "DELETE",
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
export async function verifyOtp(payload: { code: string }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: "No session found" };
  }
  const accessToken = session?.accessToken;
  if (!accessToken) {
    return { error: "No registered" };
  }

  const response = await fetch(
    `${process.env.BACKEND_URL}/me/security/2fa/verify`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.X_API_KEY as string,
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    return { error: data.message };
  }

  return { data };
}
export async function activateOtp(payload: { code: string }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: "No session found" };
  }
  const accessToken = session?.accessToken;
  if (!accessToken) {
    return { error: "No registered" };
  }

  const response = await fetch(
    `${process.env.BACKEND_URL}/me/security/2fa/activate`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.X_API_KEY as string,
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    return { error: data.message };
  }

  return { data };
}
