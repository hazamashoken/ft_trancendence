"use client";

import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { InputForm } from "@/components/form/input";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export function ChangeNameDialog(props: any) {
  const { session, open, setOpen } = props;
  const form = useForm({
    defaultValues: {
      username: "",
    },
  });
  useEffect(() => {
    form.reset();
  }, [open, form]);

  const handleSubmit = async (values: any) => {};

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>Change Username</DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <InputForm
              label="Username"
              name="username"
              type="text"
              placeholder="Username"
              form={form}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <Loader2 className="w-4 h-4 my-4 text-zinc-500 animate-spin" />
              ) : (
                "save"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
