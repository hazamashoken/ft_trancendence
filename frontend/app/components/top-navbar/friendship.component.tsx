// import { getNotification } from "@/lib/data/get-data/get-notification";
"use client";
import ApiClient from "@/app/api/api-client";
import { FriendshipBtn } from "./friendship-btn";
import { useQuery } from "@tanstack/react-query";
import { useSocket } from "../providers/socket-provider";
import React from "react";

export function FriendShipList() {
  const { isConnected } = useSocket();
  const [friends, setFriends] = React.useState([]);

  const client = ApiClient("CLIENT");
  const { data, isError, isLoading } = useQuery({
    queryKey: ["friends"],
    enabled: isConnected,
    queryFn: () => client.get(`/me/friends`).then((res) => res.data),
    refetchInterval: 2000,
  });

  React.useEffect(() => {
    if (!data) return;
    setFriends(data);
  }, [data]);

  return (
    <>
      <FriendshipBtn items={friends} loading={isLoading} />
    </>
  );
}
