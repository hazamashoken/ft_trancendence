"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";

export async function getPublicChat() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: "No session found" };
  }
  const accessToken = session?.accessToken;
  if (!accessToken) {
    return { error: "No registered" };
  }

  const response = await fetch(`${process.env.BACKEND_URL}/channels/public`, {
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
    return { error: data.message };
  }

  return { data };
}

export async function sendChatMessage(chatId: string, payload: any) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: "No session found" };
  }
  const accessToken = session?.accessToken;
  if (!accessToken) {
    return { error: "No registered" };
  }

  const response = await fetch(
    `${process.env.BACKEND_URL}/channels/${chatId}/createmessage`,
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

export async function getUserChats(userId: string) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: "No session found" };
  }
  const accessToken = session?.accessToken;
  if (!accessToken) {
    return { error: "No registered" };
  }

  const response = await fetch(
    `${process.env.BACKEND_URL}/channels/${userId}/all`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.X_API_KEY as string,
        Authorization: `Bearer ${accessToken}`,
      },
      next: {
        tags: [`user:chat`],
      },
      cache: "no-cache",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    return { error: data.message };
  }

  return { data };
}

export async function getChatUser(chatId: string) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: "No session found" };
  }
  const accessToken = session?.accessToken;
  if (!accessToken) {
    return { error: "No registered" };
  }

  const response = await fetch(
    `${process.env.BACKEND_URL}/channels/${chatId}/users`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.X_API_KEY as string,
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-cache",
    }
  );
  const data = await response.json();

  if (!response.ok) {
    return { error: data.message };
  }

  return { data };
}

export async function createChannelAction(payload: any) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: "No session found" };
  }
  const accessToken = session?.accessToken;
  if (!accessToken) {
    return { error: "No registered" };
  }
  const url = `${process.env.BACKEND_URL}/channels/create/`;
  const response = await fetch(url, {
    method: "POST",
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
  revalidateTag(`user:chat`);
  return { data };
}

export async function addChannelUserAction(chatId: string, value: string) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: "No session found" };
  }
  const accessToken = session?.accessToken;
  if (!accessToken) {
    return { error: "No registered" };
  }
  const url = `${process.env.BACKEND_URL}/channels/${chatId}/addUser/${value}`;
  const response = await fetch(url, {
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

export const getChatMessage = async (chatId: string = "1") => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: "No session found" };
  }
  const accessToken = session?.accessToken;
  if (!accessToken) {
    return { error: "No registered" };
  }
  const res = await fetch(
    `${process.env.BACKEND_URL}/channels/${chatId}/messages`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.X_API_KEY as string,
        Authorization: `Bearer ${accessToken}`,
      },
      next: {
        tags: [`chat:${chatId}`],
      },
      cache: "no-cache",
    }
  );

  const data = await res.json();
  if (!res.ok) {
    return { error: data.message };
  }

  return { data };
};

export const getChannelData = async (chatId: string = "1") => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: "No session found" };
  }
  const accessToken = session?.accessToken;
  if (!accessToken) {
    return { error: "No registered" };
  }
  const res = await fetch(`${process.env.BACKEND_URL}/channels/${chatId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.X_API_KEY as string,
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-cache",
  });

  const data = await res.json();
  if (!res.ok) {
    return { error: data.message };
  }

  return { data };
};

export const leaveChannelAction = async (
  chatId: string = "1",
  user: string
) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: "No session found" };
  }
  const accessToken = session?.accessToken;
  if (!accessToken) {
    return { error: "No registered" };
  }
  const url = `${process.env.BACKEND_URL}/channels/${chatId}/quitChat/${user}`;
  const response = await fetch(url, {
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

  revalidateTag(`user:chat`);

  return { data };
};

export const updateChannelAction = async (chatId: string, payload: any) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: "No session found" };
  }
  const accessToken = session?.accessToken;
  if (!accessToken) {
    return { error: "No registered" };
  }
  const url = `${process.env.BACKEND_URL}/channels/${chatId}/update`;
  const response = await fetch(url, {
    method: "POST",
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
};

export const kickChatUser = async (chatId: any, userId: any) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: "No session found" };
  }
  const accessToken = session?.accessToken;
  if (!accessToken) {
    return { error: "No registered" };
  }
  const url = `${process.env.BACKEND_URL}/channels/${chatId}/kick/${userId}`;
  const response = await fetch(url, {
    method: "POST",
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

export const createDMChannelAction = async (user1: string, user2: string) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: "No session found" };
  }
  const accessToken = session?.accessToken;
  if (!accessToken) {
    return { error: "No registered" };
  }
  const url = `${process.env.BACKEND_URL}/channels/createDM`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.X_API_KEY as string,
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ user1: parseInt(user1), user2 }),
  });

  const data = await response.json();
  if (!response.ok) {
    return { error: data.message };
  }

  revalidateTag(`user:chat`);

  return { data };
};

export const muteChatUser = async (payload: {
  chatId: string;
  userId: string;
  mutedById: string | number;
  mutedUntil: string;
}) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: "No session found" };
  }
  const accessToken = session?.accessToken;
  if (!accessToken) {
    return { error: "No registered" };
  }

  const { chatId, ...body } = payload;
  if (typeof body.mutedById === "string") {
    body.mutedById = parseInt(body.mutedById);
  }

  const url = `${process.env.BACKEND_URL}/channels/${chatId}/muteUser`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.X_API_KEY as string,
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  if (!response.ok) {
    return { error: data.message };
  }

  return { data };
};

export const unMuteChatUser = async (payload: {
  chatId: string;
  userId: string | number;
}) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: "No session found" };
  }
  const accessToken = session?.accessToken;
  if (!accessToken) {
    return { error: "No registered" };
  }
  const { chatId, ...body } = payload;
  if (typeof body.userId === "string") {
    body.userId = parseInt(body.userId);
  }

  const url = `${process.env.BACKEND_URL}/channels/${chatId}/unmute`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.X_API_KEY as string,
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  if (!response.ok) {
    return { error: data.message };
  }

  return { data };
};

export const banChatUser = async (payload: {
  chatId: string;
  userId: string | number;
  adminId: string;
  reason?: string;
}) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: "No session found" };
  }
  const accessToken = session?.accessToken;
  if (!accessToken) {
    return { error: "No registered" };
  }
  const { chatId, adminId, ...body } = payload;
  if (typeof body.userId === "string") {
    body.userId = parseInt(body.userId);
  }
  body.reason = body.reason || "No reason provided";
  const url = `${process.env.BACKEND_URL}/channels/${chatId}/banUser/${adminId}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.X_API_KEY as string,
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  if (!response.ok) {
    return { error: data.message };
  }

  return { data };
};

export const addChatAdmin = async (chatId: string, userId: string) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: "No session found" };
  }
  const accessToken = session?.accessToken;
  if (!accessToken) {
    return { error: "No registered" };
  }
  const url = `${process.env.BACKEND_URL}/channels/${chatId}/addAdmin/${userId}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.X_API_KEY as string,
      Authorization: `Bearer ${accessToken}`,
    },
    body: null,
  });

  const data = await response.json();
  console.log(data);
  if (!response.ok) {
    return { error: data.message };
  }

  return { data };
};

export const removeChatAdmin = async (chatId: string, userId: string) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: "No session found" };
  }
  const accessToken = session?.accessToken;
  if (!accessToken) {
    return { error: "No registered" };
  }
  const url = `${process.env.BACKEND_URL}/channels/${chatId}/removeAdmin/${userId}`;
  const response = await fetch(url, {
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
};

export const joinProtectedChat = async (payload: {
  chatName: string;
  password: string;
}) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: "No session found" };
  }
  const accessToken = session?.accessToken;
  if (!accessToken) {
    return { error: "No registered" };
  }
  const url = `${process.env.BACKEND_URL}/channels/user-protected/`;
  const response = await fetch(url, {
    method: "POST",
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
};

export const joinPublicChat = async (chatId: string) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: "No session found" };
  }
  const accessToken = session?.accessToken;
  if (!accessToken) {
    return { error: "No registered" };
  }
  const url = `${process.env.BACKEND_URL}/channels/public/${chatId}`;
  const response = await fetch(url, {
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
};
