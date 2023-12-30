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
  const [status, setStatus] = React.useState([]);

  const client = ApiClient("CLIENT");
  const friendQuery = useQuery({
    queryKey: ["friends"],
    enabled: isConnected,
    queryFn: () => client.get(`/me/friends`).then((res) => res.data),
    refetchInterval: 2000,
  });
  // const statusQuery = useQuery({
  //   queryKey: ["status"],
  //   enabled: isConnected,
  //   queryFn: () => client.get(`/user-sessions`).then((res) => res.data),
  //   refetchInterval: 2000,
  // });

  React.useEffect(() => {
    if (!friendQuery.data) return;
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
