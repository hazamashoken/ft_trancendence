"use client";

import { CheckboxForm } from "@/components/form/checkbox";
import { InputForm } from "@/components/form/input";
import { SelectForm } from "@/components/form/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { addChannelUserAction } from "../../_actions/chat";

import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IChatStore, useChatStore } from "@/store/chat";
import { useState } from "react";

import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Skeleton } from "@/components/ui/skeleton";
import { UserItem } from "./user-item";
import { getBannedUsers } from "@/app/api/channels/channelsApi";

const formSchema = z.object({
  username: z.string().min(1, "username is required"),
});

export function ListUser(props: {
  data: any;
  userId: string;
  bannedUsers: any;
}) {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const [
    chatId,
    chatList,
    chatUserList,
    chatMeta,
    chatIsLoading,
    setChatId,
    setChatList,
    setChatUserList,
    setChatMeta,
    setChatIsLoading,
  ] = useChatStore((state: IChatStore) => [
    state.chatId,
    state.chatList,
    state.chatUserList,
    state.chatMeta,
    state.chatIsLoading,
    state.setChatId,
    state.setChatList,
    state.setChatUserList,
    state.setChatMeta,
    state.setChatIsLoading,
  ]);
  const { data: rawData, userId, bannedUsers } = props;
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  const handleAddUser = async (value: any) => {
    const res = await addChannelUserAction(chatId, value.username);
    if (res.data) {
      toast.success("Add user success");
      setOpen(false);
      setChatUserList(res.data);
      form.reset();
    } else {
      toast.error(res.error);
    }
  };
  // filer out myself with userId
  const data = rawData;
  // rawData?.filter((user: any) => user.id !== parseInt(userId)) ?? [];

  return (
    <div className="flex flex-col justify-center h-full p-2 pt-12 space-y-2">
      <ScrollArea className="h-[750px] pl-3" scrollHideDelay={10}>
        <Badge className="w-14">Owner</Badge>
        <div className="container flex flex-col justify-center px-0 space-y-2">
          {!chatIsLoading ? (
            data
              ?.filter((user: any) => user.role === "owner")
              .map((user: any, index: number) => {
                return (
                  <UserItem
                    key={index}
                    user={user}
                    chatId={chatId}
                    authUser={session?.user}
                  />
                );
              })
          ) : (
            <div className="container flex flex-col px-0 space-y-2">
              <Skeleton className="relative flex w-10 h-10 overflow-hidden rounded-full shrink-0" />
            </div>
          )}
        </div>
        <Badge className="w-14">Admin</Badge>
        <div className="container flex flex-col justify-center px-0 space-y-2">
          {!chatIsLoading ? (
            data
              ?.filter((user: any) => user.role === "admin")
              .map((user: any, index: number) => {
                return <UserItem key={index} user={user} chatId={chatId} />;
              })
          ) : (
            <div className="container flex flex-col px-0 space-y-2">
              <Skeleton className="relative flex w-10 h-10 overflow-hidden rounded-full shrink-0" />
            </div>
          )}
        </div>
        <Badge className="w-14">User</Badge>
        <div className="container flex flex-col justify-center px-0 space-y-2">
          {!chatIsLoading ? (
            data
              ?.filter((user: any) => user.role === "user")
              .map((user: any, index: number) => {
                return <UserItem key={index} user={user} chatId={chatId} />;
              })
          ) : (
            <div className="container flex flex-col px-0 space-y-2">
              <Skeleton className="relative flex w-10 h-10 overflow-hidden rounded-full shrink-0" />
            </div>
          )}
        </div>
        <Badge className="w-14">Ban</Badge>
        <div className="container flex flex-col justify-center px-0 space-y-2">
          {!chatIsLoading ? (
            bannedUsers?.map((user: any, index: number) => {
              return (
                <UserItem key={index} user={user.bannedUser} chatId={chatId} />
              );
            })
          ) : (
            <div className="container flex flex-col px-0 space-y-2">
              <Skeleton className="relative flex w-10 h-10 overflow-hidden rounded-full shrink-0" />
            </div>
          )}
        </div>
      </ScrollArea>
      <Dialog
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
          form.reset();
        }}
      >
        <Tooltip delayDuration={10}>
          {chatMeta.chatType !== "direct" && (
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button className="w-10 h-10 rounded-full">+</Button>
              </DialogTrigger>
            </TooltipTrigger>
          )}
          <TooltipContent>Add User</TooltipContent>
        </Tooltip>
        <DialogContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddUser)}>
              <div>
                <InputForm
                  label="Username"
                  name="username"
                  form={form}
                  isRequired
                  msg
                />
                <DialogFooter>
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? (
                      <Loader2 className="w-4 h-4 my-4 text-zinc-500 animate-spin" />
                    ) : (
                      "invite"
                    )}
                  </Button>
                </DialogFooter>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
