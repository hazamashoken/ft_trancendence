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

  if (response.status !== 200) {
    throw new Error(data.message);
  }

  return data;
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

  if (response.status !== 200) {
    throw new Error(data.message);
  }

  return data;
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

  if (response.status !== 200) {
    throw new Error(data.message);
  }

  return data;
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

  if (response.status !== 201) {
    throw new Error(data.message);
  }
  revalidateTag(`user:chat`);
  return data;
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

  if (response.status !== 201) {
    throw new Error(data.message);
  }

  return data;
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

  if (!res.ok) {
    throw new Error(`Failed to fetch ${res.url}`);
  }

  const data = await res.json();

  return data;
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

  if (!res.ok) {
    throw new Error(`Failed to fetch ${res.url}`);
  }

  const data = await res.json();

  return data;
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

  if (response.status !== 201) {
    throw new Error(data.message);
  }

  revalidateTag(`user:chat`);

  return data;
}

export const updateChannelAction = async (chatId: string = "1", payload: any) => {
  console.log(payload)
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
  if (response.status !== 201) {
    throw new Error(data.message);
  }
  return data;
}