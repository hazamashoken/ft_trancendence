// import { getNotification } from "@/lib/data/get-data/get-notification";
"use client";
import ApiClient from "@/app/api/api-client";
import { NotificationBtn } from "./friendship-btn";
import { useQuery } from "@tanstack/react-query";
import { useSocket } from "../providers/socket-provider";
import React from "react";
import { FriendshipAddUserDialog } from "./friendship-add-dialong";

export function Notification() {
  // const data = await getNotification();

  const { isConnected } = useSocket();
  const [friends, setFriends] = React.useState([]);

  const client = ApiClient("CLIENT");
  const { data, isError, isLoading } = useQuery({
    queryKey: ["friends"],
    enabled: isConnected,
    queryFn: () => client.get(`/me/friends`).then((res) => res.data),
    refetchInterval: 1000,
  });

  React.useEffect(() => {
    if (!data) return;
    setFriends(data);
  }, [data]);

  return (
    <>
      <FriendshipAddUserDialog />
      <NotificationBtn items={friends} loading={isLoading} />
    </>
  );
}
