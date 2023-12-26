"use server";

export const blockUser = async (payload: any) => {
  const url = `${process.env.BACKEND_URL}/user/block`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  if (response.status !== 201) {
    throw new Error(data.message);
  }
  return data;
}

export const unblockUser = async (payload: any) => {
  const url = `${process.env.BACKEND_URL}/user/unblock`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  if (response.status !== 201) {
    throw new Error(data.message);
  }
  return data;
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
  if (response.status !== 200) {
    throw new Error(data.message);
  }
  return data;
}

