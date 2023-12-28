import { InputForm } from "@/components/form/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { updateChannelAction } from "../_actions/chat";
import { IChatStore, useChatStore } from "@/store/chat";
import { SelectForm } from "@/components/form/select";
import { Settings } from "lucide-react";

export function ChatSettingMenu() {
  const [open, setOpen] = useState(false);
  const [
    chatId,
    chatList,
    chatUserList,
    chatMeta,
    setChatId,
    setChatList,
    setChatUserList,
    setChatMeta,
  ] = useChatStore((state: IChatStore) => [
    state.chatId,
    state.chatList,
    state.chatUserList,
    state.chatMeta,
    state.setChatId,
    state.setChatList,
    state.setChatUserList,
    state.setChatMeta,
  ]);
  const form = useForm({
    defaultValues: {
      chatName: chatMeta.name,
      password: null,
      chatType: "public" as "public" | "private",
    },
  });

  useEffect(() => {
    if (!chatMeta) return;
    form.reset({
      chatName: chatMeta.name,
      password: null,
      chatType: chatMeta.chatType as "public" | "private",
    });
  }, [chatMeta]);
  const handleSubmit = async (values: any) => {
    const payload = {
      chatOwner: values.chatOwner,
      chatName: values.chatName?.trim(),
      chatType: values.chatType,
      password: values.chatType === "private" ? values.password?.trim() : null,
    };
    const res = await updateChannelAction(chatId, payload);
    if (res.data) {
      form.reset();
      setOpen(false);
      setChatMeta({
        ...chatMeta,
        name: res.data.chatName,
        chatType: res.data.chatType,
        data: null,
      });
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
      <DialogTrigger>
        <Settings />
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
            <Button>Save</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
