"use client";

import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { InputForm } from "@/components/form/input";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>Change Username</DialogHeader>
        <Form {...form}>
          <form>
            <InputForm
              label="Username"
              name="username"
              type="text"
              placeholder="Username"
              form={form}
            />
            <Button type="submit">Change</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
