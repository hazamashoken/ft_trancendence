import axios from "axios";
import { getSession } from "next-auth/react";

const ApiClient = (env: "NODE" | "CLIENT" | string = "CLIENT") => {
  const instance = axios.create({
    baseURL:
      env === "NODE"
        ? process.env.BACKEND_URL
        : process.env.NEXT_PUBLIC_BACKEND_URL,
    timeout: 3000,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "x-api-key":
        env === "NODE"
          ? process.env.X_API_KEY
          : process.env.NEXT_PUBLIC_X_API_KEY,
    },
  });
  instance.interceptors.request.use(async (request) => {
    const session = await getSession();
    if (session) {
      request.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    return request;
  });
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.log(`error`, error);
    }
  );
  return instance;
};

export default ApiClient;
