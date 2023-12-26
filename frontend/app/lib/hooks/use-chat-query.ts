// import qs from "query-string";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { useSocket } from "@/components/providers/socket-provider";
import { useEffect, useState } from "react";
import axios from "axios";

interface ChatQueryProps {
  queryKey: string;
  apiUrl: string;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
};


export const useChatQuery = ({
  queryKey,
  apiUrl,
  paramKey,
  paramValue
}: ChatQueryProps) => {
  const { isConnected } = useSocket();
  // const [data, setData] = useState<any>([]);
  const { data } = useQuery({
    queryKey: [queryKey],
    enabled: isConnected,
    queryFn: () => fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json()),
  });

  return { data };

  // const {
  //   data,
  //   fetchNextPage,
  //   hasNextPage,
  //   isFetchingNextPage,
  //   status,
  // } = useInfiniteQuery({
  //   initialPageParam: undefined,
  //   queryKey: [queryKey],
  //   queryFn: fetchMessages,
  //   getNextPageParam: (lastPage) => lastPage?.nextCursor,
  //   refetchInterval: isConnected ? false : 1000,
  // });

  // return {
  //   data,
  //   fetchNextPage,
  //   hasNextPage,
  //   isFetchingNextPage,
  //   status,
  // };
}