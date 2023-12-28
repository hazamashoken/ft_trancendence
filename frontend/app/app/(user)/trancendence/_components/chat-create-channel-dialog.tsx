import { InputForm } from "@/components/form/input";
import { SelectForm } from "@/components/form/select";
import { Button } from "@/components/ui/button";
import { createChannelAction } from "../_actions/chat";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { toast } from "sonner";

const formSchema = z.object({
  chatName: z.string({ required_error: "required" }).min(1, "required"),
  chatOwner: z.coerce.number(),
  password: z.string().nullable(),
  chatType: z.string(),
});

export function CreateChannelDialog(props: any) {
  const { userId, setChatId, setOpen, open } = props;
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      chatName: "",
      chatOwner: userId,
      password: null,
      chatType: "public" as "public" | "private",
    },
  });
  const handleSubmit = async (values: any) => {
    const payload = {
      chatOwner: parseInt(values.chatOwner),
      chatName: values.chatName?.trim(),
      chatType: values.chatType,
      password: values.chatType == "private" ? values.password?.trim() : null,
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
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <DialogHeader>
              <DialogTitle>Create Channel</DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <InputForm
                label="Chat Name"
                name="chatName"
                form={form}
                isRequired
                msg
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
                <>
                  <InputForm label="Password" name="password" form={form} msg />
                </>
              )}
            </div>
            <DialogFooter>
              <Button type="submit" onClick={form.handleSubmit(handleSubmit)}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
