import { InputForm } from "@/components/form/input";
import { SelectForm } from "@/components/form/select";
import { Button } from "@/components/ui/button";
import {
  createChannelAction,
  getPublicChat,
  getUserChats,
} from "../_actions/chat";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import React from "react";
import { set } from "lodash";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createAbbreviation } from "@/lib/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

function ChannelItem(props: any) {
  const { chatId, chatName, chatType, chatOwner } = props;

  return (
    <div className="flex flex-col justify-center text-center w-14">
      <HoverCard openDelay={400} closeDelay={300}>
        <HoverCardTrigger className="cursor-pointer">
          <Avatar className="w-14 h-14">
            <AvatarImage src={chatOwner.imageUrl} />
            <AvatarFallback>{createAbbreviation(chatName)}</AvatarFallback>
          </Avatar>
        </HoverCardTrigger>
        <HoverCardContent className="w-fit">
          <big className="truncate">chat name: {chatName}</big>
          <div className="flex flex-col gap-2">
            <p className="">owner: {chatOwner.displayName}</p>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}

function ChannelSkeleton() {
  return (
    <>
      <Skeleton className="rounded-full w-14 h-14" />
    </>
  );
}

const formSchema = z.object({
  chatName: z.string().min(1, "Chat name is required"),
  password: z.string().min(1, "Password is required"),
});

export function JoinChannelDialog(props: any) {
  const { userId, setChatId, setOpen, open } = props;
  const [chatList, setChatList] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      chatName: "",
      password: "",
    },
  });

  const handleSubmit = async (values: any) => {
    const payload = {
      chatOwner: parseInt(values.chatOwner),
      chatName: values.chatName?.trim(),
      chatType: values.chatType,
      password: values.chatType == "private" ? values.password?.trim() : null,
    };
    const res = await createChannelAction(payload);
    if (res.data) {
      toast.success("Channel created successfully");
      setChatId(res.data.chatId);
      setOpen(false);
    } else {
      toast.error(res.error);
    }
  };

  React.useEffect(() => {
    if (!open) return;
    const getData = async () => {
      setIsLoading(true);
      const res = await getPublicChat();
      setChatList(res.data);
      setIsLoading(false);
    };
    getData();
  }, [open]);

  const rows = [];
  for (let i = 0; i < 12; i++) {
    rows.push(<ChannelSkeleton key={i} />);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join channel</DialogTitle>
        </DialogHeader>
        <Tabs>
          <TabsList>
            <TabsTrigger value="public">Public</TabsTrigger>
            <TabsTrigger value="private">Protected</TabsTrigger>
          </TabsList>
          <TabsContent value="public" className="space-y-4">
            <Input
              onChange={(event) => {
                setSearch(event.target.value);
              }}
              placeholder="Search channel"
            />
            <div className="flex flex-wrap gap-6 justify-left">
              {isLoading
                ? rows
                : chatList
                    .filter(
                      (item: any) =>
                        item.chatName
                          .toLowerCase()
                          .indexOf(search.toLowerCase()) !== -1
                    )
                    .map((item: any) => (
                      <ChannelItem key={item.chatId} {...item} />
                    ))}
            </div>
          </TabsContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <TabsContent value="private">
                <InputForm
                  name="chatName"
                  label="Chat Name"
                  form={form}
                  msg
                  isRequired
                />
                <InputForm
                  name="password"
                  label="Password"
                  form={form}
                  msg
                  isRequired
                />
                <DialogFooter>
                  <Button type="submit">join</Button>
                </DialogFooter>
              </TabsContent>
            </form>
          </Form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
