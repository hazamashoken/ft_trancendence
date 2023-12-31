"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function PlayerAvatar(props: any) {
  const { imageUrl, displayName, id, stats } = props;

  console.log(stats);

  return (
    <Avatar className="w-20 h-20">
      <AvatarImage src={imageUrl} />
      <AvatarFallback>{id}</AvatarFallback>
    </Avatar>
  );
}
