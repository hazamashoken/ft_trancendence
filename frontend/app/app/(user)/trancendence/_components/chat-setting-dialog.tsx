import { InputForm } from "@/components/form/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { updateChannelAction } from "../_actions/chat";
import { IChatStore, useChatStore } from "@/store/chat";
import { Loader2, Settings } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChatType } from "@/app/api/channels/interfaces";
import { Badge } from "@/components/ui/badge";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

const formSchema = z
  .object({
    chatName: z.string({ required_error: "required" }).min(1, "required"),
    chatOwner: z.coerce.number(),
    password: z.string().optional(),
    chatType: z.string(),
  })
  .superRefine((v, ctx) => {
    if (v.chatType === "protected" && !v.password) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password is required",
        path: ["password"],
      });
    }
  });

export function ChatSettingMenu() {
  const { data: session } = useSession();
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
      resolver: zodResolver(formSchema),
      chatName: chatMeta.name,
      password: "",
      chatType: chatMeta.chatType as "public" | "private" | "protected",
    },
  });

  useEffect(() => {
    if (!chatMeta) return;
    form.reset({
      chatName: chatMeta.name,
      password: "",
      chatType: chatMeta.chatType as "public" | "private" | "protected",
    });
  }, [chatMeta, form]);

  const handleSubmit = async (values: any) => {
    const payload = {
      chatOwner: values.chatOwner,
      chatName: values.chatName?.trim(),
      chatType: values.chatType,
      password: values.chatType === "private" ? values.password?.trim() : null,
    };
    const res = await updateChannelAction(chatId, payload);
    if (res.error) {
      toast.error(res.error);
    } else {
      form.reset();
      setOpen(false);
      setChatMeta({
        ...chatMeta,
        name: res.data.chatName,
        chatType: res.data.chatType,
        data: null,
      });
      toast.success("Update channel successfully");
    }
  };
  const hidden = chatMeta?.data.chatOwner?.id !== session?.user?.id;
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        form.reset();
      }}
    >
      <DialogTrigger hidden={hidden}>
        <Settings />
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <DialogHeader>
              <DialogTitle>Create Channel</DialogTitle>
            </DialogHeader>
            <div className="p-4 space-y-2">
              <FormField
                control={form.control}
                name="chatType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Chat Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={chatMeta.chatType}
                        className="flex flex-row space-y-1"
                      >
                        {(
                          Object.values(ChatType) as [
                            | ChatType.DIRECT
                            | ChatType.PRIVATE
                            | ChatType.PROTECTED
                            | ChatType.PUBLIC
                          ]
                        )
                          .filter((value) => value !== ChatType.DIRECT)
                          .map((value, index) => (
                            <FormItem
                              key={index}
                              className="flex items-center space-x-3 space-y-0"
                            >
                              <FormControl>
                                <RadioGroupItem value={value} />
                              </FormControl>
                              <FormLabel className="font-normal">
                                <Badge>{value}</Badge>
                              </FormLabel>
                            </FormItem>
                          ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <InputForm
                label="Chat Name"
                name="chatName"
                form={form}
                isRequired
                msg
              />
              {form.watch("chatType") === "protected" ? (
                <InputForm
                  label="Password"
                  name="password"
                  form={form}
                  msg
                  isRequired
                />
              ) : (
                <div className="space-y-2">
                  <Label className="text-gray-300">
                    Password <span className="text-destructive"> *</span>
                  </Label>
                  <Input disabled value={form.watch("password") ?? ""} />
                </div>
              )}
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
