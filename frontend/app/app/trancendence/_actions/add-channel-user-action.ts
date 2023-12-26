"use server";

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