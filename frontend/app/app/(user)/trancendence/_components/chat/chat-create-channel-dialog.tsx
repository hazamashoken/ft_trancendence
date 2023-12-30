import { InputForm } from "@/components/form/input";
import { SelectForm } from "@/components/form/select";
import { Button } from "@/components/ui/button";
import { createChannelAction } from "../../_actions/chat";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { toast } from "sonner";
import { ChatType } from "@/app/api/channels/interfaces";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const formSchema = z
  .object({
    chatName: z
      .string({ required_error: "required" })
      .min(1, "required")
      .regex(
        /^[a-zA-Z0-9\-\_]*$/,
        "Only alphanumeric, dash and underscore characters are allowed"
      ),
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

export function CreateChannelDialog(props: any) {
  const { userId, setChatId, setOpen, open } = props;
  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      chatName: "",
      chatOwner: userId,
      password: "",
      chatType: "public" as "public" | "private" | "protected",
    },
  });

  const handleSubmit = async (values: any) => {
    const payload = {
      chatOwner: parseInt(values.chatOwner),
      chatName: values.chatName?.trim(),
      chatType: values.chatType,
      password: values.chatType == "protected" ? values.password?.trim() : null,
    };
    const res = await createChannelAction(payload);
    if (res.data) {
      toast.success("Channel created successfully");
      setChatId(res.data.chatId);
      form.reset();
      setOpen(false);
    } else {
      toast.error(res.error);
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
      <DialogContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
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
                        defaultValue={ChatType.PUBLIC}
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
                          ?.filter((value) => value !== ChatType.DIRECT)
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
                  "create"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
