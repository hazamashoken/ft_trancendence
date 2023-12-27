"use server";

export const blockUser = async (payload: any) => {
  const { userId, blockId } = payload;
  const url = `${process.env.BACKEND_URL}/user/${userId}/block`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId: blockId })
  });

  const data = await response.json();
  if (!response.ok) {
    return { error: data.message };
  }
  return { data };
}

export const unblockUser = async (payload: any) => {
  const { userId, blockId } = payload;
  const url = `${process.env.BACKEND_URL}/user/${userId}/unblock`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId: blockId })
  });

  const data = await response.json();
  if (!response.ok) {
    return { error: data.message };
  }
  return { data };
}

export const getBlockUsers = async (userId: string = "1") => {
  const url = `${process.env.BACKEND_URL}/user/${userId}/block`;
  const response = await fetch(url, {
    method: "GET",
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

