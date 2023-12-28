"use client";

import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "../ui/dialog";
import { Form } from "../ui/form";
import { InputForm } from "../form/input";
import { Button } from "../ui/button";
import { useEffect } from "react";

export function ChangeNameDialog(props: any) {
  const { session, open, setOpen } = props;
  const form = useForm({
    defaultValues: {
      displayName: session?.ftUser?.displayName,
    },
  });
  useEffect(() => {
    form.reset();
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Form {...form}>
        <form>
          <DialogContent>
            <DialogHeader>Change Username</DialogHeader>
            <DialogDescription>
              <InputForm
                label="Username"
                name="username"
                type="text"
                placeholder="Username"
                form={form}
              />
            </DialogDescription>
            <DialogFooter>
              <Button type="submit">save</Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
}
