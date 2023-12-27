"use server";

import { revalidateTag } from "next/cache";

export async function getPublicChat() {
  const response = await fetch(
    `${process.env.BACKEND_URL}/channels/public`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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

export async function getUserChats(userId: string) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/channels/${userId}/all`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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
  const response = await fetch(
    `${process.env.BACKEND_URL}/channels/${chatId}/users`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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
  const url = `${process.env.BACKEND_URL}/channels/create/`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  console.log(data)
  if (!response.ok) {
    return { error: data.message };
  }
  revalidateTag(`user:chat`);
  return { data };
}

export async function addChannelUserAction(chatId: string, value: string) {
  const url = `${process.env.BACKEND_URL}/channels/${chatId}/addUser/${value}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: null
  });

  const data = await response.json();

  if (!response.ok) {
    return { error: data.message };
  }

  return { data };
}



export const getChatMessage = async (chatId: string = "1") => {
  const res = await fetch(
    `${process.env.BACKEND_URL}/channels/${chatId}/messages`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/channels/${chatId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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


export const leaveChannelAction = async (chatId: string = "1", user: string) => {
  const url = `${process.env.BACKEND_URL}/channels/${chatId}/quitChat/${user}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: null
  });

  const data = await response.json();

  if (!response.ok) {
    return { error: data.message };
  }

  revalidateTag(`user:chat`);

  return { data };
}

export const updateChannelAction = async (chatId: string = "1", payload: any) => {
  const url = `${process.env.BACKEND_URL}/channels/${chatId}/update`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  console.log(data)
  if (!response.ok) {
    return { error: data.message };
  }
  return { data };
}


export const kickChatUser = async (chatId: any, userId: any) => {
  const url = `${process.env.BACKEND_URL}/channels/${chatId}/kick/${userId}/`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  if (!response.ok) {
    return { error: data.message };
  }
  return { data };
}

export const createDMChannelAction = async (user1: string, user2: string) => {
  const url = `${process.env.BACKEND_URL}/channels/createDM`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user1, user2 })
  });

  const data = await response.json();
  if (!response.ok) {
    return { error: data.message };
  }

  revalidateTag(`user:chat`);

  return { data }
}

export const muteChatUser = async (payload: { chatId: string, userId: string, mutedById: string | number, mutedUntil: string }) => {

  const { chatId, ...body } = payload;
  if (typeof body.mutedById === "string") {
    body.mutedById = parseInt(body.mutedById);
  }

  console.log(body.mutedUntil)

  const url = `${process.env.BACKEND_URL}/channels/${chatId}/muteUser`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body)
  });

  const data = await response.json();
  if (!response.ok) {
    return { error: data.message };
  }

  return { data }
}

export const unMuteChatUser = async (payload: { chatId: string, userId: string | number }) => {

  const { chatId, ...body } = payload;
  if (typeof body.userId === "string") {
    body.userId = parseInt(body.userId);
  }

  const url = `${process.env.BACKEND_URL}/channels/${chatId}/unmute`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body)
  });

  const data = await response.json();
  if (!response.ok) {
    return { error: data.message };
  }

  return { data }
}