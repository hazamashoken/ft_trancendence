"use client";

import { CheckboxForm } from "@/components/form/checkbox";
import { InputForm } from "@/components/form/input";
import { SelectForm } from "@/components/form/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { createChannelAction } from "../_actions/create-channel-action";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { addChannelUserAction } from "../_actions/add-channel-user-action";

export function ListUser(props: { data: any; chatId: string }) {
  const { data } = props;
  const form = useForm({
    defaultValues: {
      chatName: null,
      chatOwner: 0,
      password: null,
      maxUsers: null,
      chatType: "public" as "public" | "private",
    },
  });

  const handleSubmit = async (userId: any) => {
    const res = await addChannelUserAction(chatId, userId);
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
  console.log(data);

  return (
    <div className="space-y-4">
      <ScrollArea>
        <div className="container flex flex-col px-0 space-y-4">
          {data.map((user: any, index: number) => {
            return (
              <Avatar key={index}>
                <AvatarImage src={user.imageUrl} />
                <AvatarFallback>
                  {createAbbreviation(user.displayName)}
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
