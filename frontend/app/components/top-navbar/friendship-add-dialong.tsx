"use client";

import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { Form } from "../ui/form";
import { InputForm } from "../form/input";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { addFriendUsername } from "./_actions/friendship";
import { toast } from "sonner";
import React from "react";

export function FriendshipAddUserDialog({}) {
  const [open, setOpen] = React.useState(false);
  const queryClient = useQueryClient();
  const form = useForm({
    defaultValues: {
      username: "",
    },
  });

  const handleSubmit = async (values: any) => {
    const res = await addFriendUsername(values);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Friend request sent");
      form.reset();
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button size={"icon"} variant={"outline"}>
          <Plus size={24} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogHeader>Add friend</DialogHeader>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <InputForm name="username" label="username" form={form} />
            <Button>send friend request</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
