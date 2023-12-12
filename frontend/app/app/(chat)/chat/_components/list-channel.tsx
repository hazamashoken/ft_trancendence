"use client";

import { CheckboxForm } from "@/components/form/checkbox";
import { InputForm } from "@/components/form/input";
import { SelectForm } from "@/components/form/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { createChannelAction } from "../_actions/create-channel-action";

export function ListChannel(props: { data: any }) {
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

  const handleSubmit = async (values: any) => {
    const res = await createChannelAction(values);
    console.log(res);
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button>create channel</Button>
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
      {data.map((channel: any, index: number) => {
        return (
          <div key={index}>
            <pre>{JSON.stringify(channel, null, 4)}</pre>
          </div>
        );
      })}
    </>
  );
}
