"use client";

import { InputForm } from "@/components/form/input";
import { SelectForm } from "@/components/form/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { createUserAction } from "../_actions/create-user-action";
import React from "react";

export function CreateUserBtn(props) {
  const [open, setOpen] = React.useState(false);
  const { data, profile } = props;
  const form = useForm({
    defaultValues: {
      intraId: profile?.id,
      firstName: profile?.first_name,
      lastName: profile?.last_name,
    },
  });

  const handleSubmit = async (values: any) => {
    const res = await createUserAction(values);
    console.log(res);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>create user</Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <Button>Create</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
