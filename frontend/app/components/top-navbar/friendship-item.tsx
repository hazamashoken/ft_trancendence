"use client";
// Components
import { Button } from "@/components/ui/button";

// Icons
import { Check, X } from "lucide-react";

// Datetime
import { acceptFriend, removeFriend } from "./_actions/friendship";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cx } from "class-variance-authority";

export function NotificationItem(props: any) {
  const { status, friend, isInGame, isOnline } = props;

  return (
    <li
      className={cx({
        "flex flex-row justify-between p-6 border-b gap-x-4 border-zinc-200/90 last:border-0 hover:bg-zinc-50":
          true,
        "bg-zinc-50": status === "WAITING",
        "bg-green-400": isOnline,
        "bg-blue-400": isInGame,
      })}
    >
      <div className="flex flex-col text-sm leading-5 gap-y-1">
        <Avatar>
          <AvatarImage src={friend.imageUrl} />
          <AvatarFallback>{friend.displayName[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <strong className="text-slate-900 line-clamp-1 max-w-[16rem]">
          {friend.displayName ?? "-"}
        </strong>
        <p className="text-slate-500 line-clamp-1 max-w-[16rem]">
          FRIENDSHIP {status ?? "-"}
        </p>
      </div>
      <div className="flex flex-row items-center gap-y-4">
        {status === "WAITING" && (
          <Button
            id="notify-delete-btn"
            variant="ghost"
            size="icon"
            onClick={async () => {
              const res = await acceptFriend({ userId: friend.id });
              if (res.error) {
                toast.error(res.error);
              } else {
                toast.success("Friend request accepted");
              }
            }}
          >
            <Check />
          </Button>
        )}
        <Button
          id="notify-delete-btn"
          variant="ghost"
          size="icon"
          onClick={async () => {
            const res = await removeFriend({ userId: friend.id });
            if (res.error) {
              toast.error(res.error);
            } else {
              if (status === "WAITING") {
                toast.success("Friend request rejected");
              } else {
                toast.success("Friend removed");
              }
            }
          }}
        >
          <X />
        </Button>
      </div>
    </li>
  );
}
