"use client";

import { Loader2, Plus } from "lucide-react";
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
  username: z
    .string()
    .regex(/^[A-Za-z]+$/, "Only letters are allowed")
    .min(6, "Minimum 6 characters")
    .max(36, "Maximum 36 characters"),
});

export function FriendshipAddUserDialog({}) {
  const [open, setOpen] = React.useState(false);
  const queryClient = useQueryClient();
  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
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
              <Button
                type="submit"
                onClick={form.handleSubmit(handleSubmit)}
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <Loader2 className="w-4 h-4 my-4 text-zinc-500 animate-spin" />
                ) : (
                  "send"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
