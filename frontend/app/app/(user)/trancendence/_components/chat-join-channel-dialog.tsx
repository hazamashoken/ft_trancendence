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
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";

export function JoinChannelDialog(props: any) {
  const { userId, setChatId, setOpen, open } = props;
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
      }}
    >
      <DialogContent>
        <DialogHeader>Join channel</DialogHeader>
        <DialogDescription>holder</DialogDescription>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
