"use server";

export const addFriend = async (userId: string, friendId: string) => {
  const url = `${process.env.BACKEND_URL}/friendships`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      friendId,
      status: "REQUESTED"
    })
  });

  const data = await response.json();
  if (!response.ok) {
    return { error: data.message };
  }
  return { data };
}

export const acceptFriend = async (userId: string, friendId: string) => {
  const url = `${process.env.BACKEND_URL}/friendships`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      friendId,
      status: "ACCEPTED"
    })
  });

  const data = await response.json();
  if (!response.ok) {
    return { error: data.message };
  }
  return { data };
}