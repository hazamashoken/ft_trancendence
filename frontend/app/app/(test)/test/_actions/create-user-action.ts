"use server";

export async function createUserAction(payload) {
  const url = `${process.env.BACKEND_URL}/users/`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (response.status !== 200) {
    throw new Error(data.message);
  }

  return data;
}