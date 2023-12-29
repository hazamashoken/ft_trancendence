"use client";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export function PlayerAvatar(props: any) {
  const { imageUrl, displayName, id, stat } = props;

  return (
    <HoverCard openDelay={400} closeDelay={200}>
      <HoverCardTrigger>
        <Avatar className="w-20 h-20">
          <AvatarImage src={imageUrl} />
          <AvatarFallback>{id}</AvatarFallback>
        </Avatar>
      </HoverCardTrigger>
      <HoverCardContent className="container w-full">
        <CardContent>
          <p>{displayName}</p>
          <p># {id}</p>
          <Separator />
          <div className="container flex gap-2">
            <p>win: {stat?.win ?? "1"}</p>
            <p>lose: {stat?.lose ?? "1"}</p>
            <p>ratio: {stat?.win / stat?.lose ?? "100"}%</p>
          </div>
        </CardContent>
      </HoverCardContent>
    </HoverCard>
  );
}
