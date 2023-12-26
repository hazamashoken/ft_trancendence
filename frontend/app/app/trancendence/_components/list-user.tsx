"use client";

import { CheckboxForm } from "@/components/form/checkbox";
import { InputForm } from "@/components/form/input";
import { SelectForm } from "@/components/form/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { createChannelAction, addChannelUserAction } from "../_actions/chat";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ListUser(props: { data: any; chatId: string }) {
  const { data, chatId } = props;
  const form = useForm({
    defaultValues: {
      username: "",
    },
  });

  const handleSubmit = async (value: any) => {
    console.log(value);
    const res = await addChannelUserAction(chatId, value.username);
    console.log(res);
  };

  function createAbbreviation(sentence: string) {
    // Split the sentence into words
    const words = sentence.split(" ");

    // Initialize an empty string to store the abbreviation
    let abbreviation = "";

    // Loop through each word and append the first letter (up to 4 characters) to the abbreviation
    for (let i = 0; i < words.length; i++) {
      const firstLetter = words[i][0]; // Get the first letter of the word
      abbreviation += firstLetter.slice(0, 4); // Append the first letter, limiting to 4 characters
    }

    return abbreviation;
  }

  return (
    <div className="space-y-4">
      <ScrollArea>
        <div className="container flex flex-col px-0 space-y-4">
          {data.map((user: any, index: number) => {
            return (
              <div key={index}>
                <Popover>
                  <ContextMenu>
                    <PopoverTrigger asChild>
                      <ContextMenuTrigger>
                        <Tooltip delayDuration={10}>
                          <TooltipTrigger>
                            <Avatar>
                              <AvatarImage src={user.imageUrl} />
                              <AvatarFallback>
                                {createAbbreviation(user.displayName)}
                              </AvatarFallback>
                            </Avatar>
                          </TooltipTrigger>
                          <TooltipContent>{user.displayName}</TooltipContent>
                        </Tooltip>
                      </ContextMenuTrigger>
                    </PopoverTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem>invite to game</ContextMenuItem>
                      <ContextMenuSeparator />
                      <ContextMenuItem>add friend</ContextMenuItem>
                      <ContextMenuItem>remove friend</ContextMenuItem>
                      <ContextMenuSeparator />
                      <ContextMenuItem>kick</ContextMenuItem>
                      <ContextMenuItem>ban</ContextMenuItem>
                    </ContextMenuContent>
                    <PopoverContent className="w-[300px] space-y-10">
                      <div className="flex">
                        <Avatar className="w-[70px] h-[70px]">
                          <AvatarImage
                            src={user.imageUrl}
                            className="w-[70px] h-[70px]"
                          />
                          <AvatarFallback className="w-[70px] h-[70px]">
                            {createAbbreviation(user.displayName)}
                          </AvatarFallback>
                        </Avatar>
                        status: {user.status}
                      </div>
                      <Card className="w-full">
                        <CardContent>
                          <p>{user.displayName}</p>
                          <p># {user.id}</p>
                          <Separator />
                          <div className="flex gap-2">
                            <p>win: {user?.stat?.win ?? "1"}</p>
                            <p>lose: {user?.stat?.lose ?? "1"}</p>
                            <p>
                              ratio:{" "}
                              {user?.stat?.win / user?.stat?.lose ?? "100"}%
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </PopoverContent>
                  </ContextMenu>
                </Popover>
              </div>
            );
          })}
        </div>
      </ScrollArea>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-10 h-10 rounded-full">+</Button>
        </DialogTrigger>
        <DialogContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <InputForm
                label="Username"
                name="username"
                form={form}
                isRequired
              />
              {form.watch("chatType") === "private" && (
                <InputForm label="Password" name="password" form={form} />
              )}
              <Button>Create</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
