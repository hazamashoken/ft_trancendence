"use client";
// Next
import Link from "next/link";

// Components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NotificationItem } from "./friendship-item";

// Icons
import { Bell, BellOff, Loader2Icon } from "lucide-react";

// // Types
// import { INotification } from "./types";

// lib
// import { useNotificationMutate } from "@/lib/data/mutate/use-notification-mutate";

export function NotificationBtn(props: any) {
  const { count, items } = props;

  const { handleNotifySeen, handleNotifyHidden, loading } = props;
  // useNotificationMutate({ data: items });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button id="layout-notify-btn" variant="outline" size="icon">
          <Bell className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[25.25rem] p-0" align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between px-6 py-4 border-b border-zinc-200/90">
            <div className="flex flex-row items-center gap-x-2">
              <CardTitle className="text-xl font-semibold -tracking-[0.009rem]">
                Friendship
              </CardTitle>
              {/* <Badge className="text-white bg-gradient-to-l from-blue-400 to-primary">
                {items?.filter((i) => i.seen === false)?.length ?? 0}
              </Badge> */}
            </div>
            {Number(count) !== 0 && (
              <Button
                variant="link"
                className={`text-primary text-xs`}
                onClick={() => handleNotifySeen()}
              >
                add friend
              </Button>
            )}
          </CardHeader>
          <CardContent className="relative flex flex-col p-0">
            <ul className="p-0 list-none max-h-[34rem] overflow-x-hidden overflow-y-auto">
              {!items && items?.length > 0 ? (
                items?.map((item: any) => (
                  <NotificationItem
                    key={item.id}
                    {...item}
                    onHidden={handleNotifyHidden}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-[34rem] gap-4">
                  <BellOff size={120} strokeWidth={0.5} color="#71717a" />
                  <p className="font-medium text-zinc-500">
                    คุณยังไม่มีการแจ้งเตือน
                  </p>
                </div>
              )}
            </ul>
            {loading && (
              <div className="absolute top-0 left-0 z-10 flex items-center justify-center w-full h-full bg-white/20 backdrop-blur-sm">
                <Loader2Icon className="animate-spin text-primary" size={40} />
              </div>
            )}
          </CardContent>
          <CardFooter className="p-4 border-t border-zinc-200/90">
            <Link
              id="layout-notify-link"
              href={"/notification"}
              className={`${buttonVariants({
                variant: "ghost",
              })} text-blue-500 font-medium text-sm h-4 w-full`}
              prefetch={false}
            >
              ดูทั้งหมด
            </Link>
          </CardFooter>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
