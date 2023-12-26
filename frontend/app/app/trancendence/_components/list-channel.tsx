"use client";

import { InputForm } from "@/components/form/input";
import { SelectForm } from "@/components/form/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { createChannelAction } from "../_actions/chat";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "@/store/chat";

export function ListChannel(props: { data: any }) {
  const { data } = props;
  const [chatId, setChatId] = useChatStore((state) => [
    state.chatId,
    state.setChatId,
  ]);
  const form = useForm({
    defaultValues: {
      chatName: null,
      chatOwner: 0,
      password: null,
      maxUsers: null,
      chatType: "public" as "public" | "private",
    },
  });

  const handleSubmit = async (values: any) => {
    const res = await createChannelAction(values);
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
          {data.map((channel: any, index: number) => {
            return (
              <Avatar key={index} onClick={() => setChatId(channel.chatId)}>
                <AvatarFallback>
                  {createAbbreviation(channel.chatName)}
                </AvatarFallback>
              </Avatar>
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
                label="Chat Name"
                name="chatName"
                form={form}
                isRequired
              />
              <SelectForm
                label="Chat Type"
                name="chatType"
                form={form}
                isRequired
                options={[
                  { label: "Public", value: "public" },
                  { label: "Private", value: "private" },
                ]}
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
