"use server";

export async function createChannelAction(payload) {
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