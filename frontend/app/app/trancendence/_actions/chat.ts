"use server";

export async function getPublicChat() {
  const response = await fetch(
    `${process.env.BACKEND_URL}/channels/public`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
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

  return data;
}

export async function addChannelUserAction(chatId: string, userId: string) {
  const url = `${process.env.BACKEND_URL}/channels/${chatId}/addUser/${userId}`;
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
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch ${res.url}`);
  }

  const data = await res.json();

  return data;
};