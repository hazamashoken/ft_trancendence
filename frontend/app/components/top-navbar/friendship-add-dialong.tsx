"use client";

import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

const formSchema = z.object({
  username: z.string({ required_error: "required" }).min(1, "required"),
});

export function FriendshipAddUserDialog({}) {
  const [open, setOpen] = React.useState(false);
  const queryClient = useQueryClient();
  const form = useForm({
    resolver: zodResolver(formSchema),
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <DialogHeader>
              <DialogTitle>Send friend request</DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <InputForm
                name="username"
                label="Username"
                isRequired
                form={form}
                msg
              />
            </div>
            <DialogFooter>
              <Button onClick={form.handleSubmit(handleSubmit)}>send</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
