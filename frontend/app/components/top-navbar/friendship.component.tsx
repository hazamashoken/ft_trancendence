// import { getNotification } from "@/lib/data/get-data/get-notification";
"use client";
import ApiClient from "@/app/api/api-client";
import { FriendshipBtn } from "./friendship-btn";
import { useQuery } from "@tanstack/react-query";
import { useSocket } from "../providers/socket-provider";
import React from "react";
import { useSession } from "next-auth/react";

export function FriendShipList() {
  const { isConnected } = useSocket();
  const [friends, setFriends] = React.useState([]);
  const { data: session } = useSession();

  const friendQuery = useQuery({
    queryKey: ["friends"],
    enabled: isConnected && !!session?.accessToken,
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/me/friends`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
          "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY as string,
        },
        cache: "no-cache",
      }).then((res) => res.json()),
    refetchInterval: 2000,
  });
  // const statusQuery = useQuery({
  //   queryKey: ["status"],
  //   enabled: isConnected,
  //   queryFn: () => client.get(`/user-sessions`).then((res) => res.data),
  //   refetchInterval: 2000,
  // });

  React.useEffect(() => {
    if (friendQuery.isError) return;
    setFriends(friendQuery.data);
  }, [friendQuery.data]);

  // React.useEffect(() => {
  //   if (!statusQuery.data) return;
  //   setStatus(statusQuery.data);
  // }, [statusQuery.data]);

  return (
    <>
      <FriendshipBtn items={friends} loading={friendQuery.isLoading} />
    </>
  );
}
