"use client";

import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Form } from "../ui/form";
import { InputForm } from "../form/input";
import { Button } from "../ui/button";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { updateAccount } from "./_actions/account";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  displayName: z
    .string()
    .regex(/^[A-Za-z]+$/, "Only letters are allowed")
    .min(6, "Minimum 6 characters")
    .max(36, "Maximum 36 characters"),
});

export function ChangeNameDialog(props: any) {
  const { session, open, setOpen } = props;
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: session?.ftUser?.displayName,
    },
  });
  useEffect(() => {
    form.reset();
  }, [open, form]);

  const handleSubmit = async (values: any) => {
    const res = await updateAccount(values);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Username changed successfully");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <Form {...form}>
          <form className="space-y-4">
            <DialogHeader>
              <DialogTitle>Change Username</DialogTitle>
            </DialogHeader>
            <InputForm
              label="Username"
              name="displayName"
              type="text"
              placeholder="username"
              form={form}
              msg
            />
            <DialogFooter>
              <Button
                type="submit"
                onClick={form.handleSubmit(handleSubmit)}
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <Loader2 className="w-4 h-4 my-4 text-zinc-500 animate-spin" />
                ) : (
                  "save"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
