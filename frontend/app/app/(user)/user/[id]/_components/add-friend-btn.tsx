"use client";

import { addFriendId } from "@/components/top-navbar/_actions/friendship";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function AddFriendBtn({ id }: { id: number }) {
  return (
    <Button
      onClick={async () => {
        const res = await addFriendId({ userId: id });
        if (res.data) {
          toast.success("Add friend success");
        } else {
          toast.error(res.error);
        }
      }}
    >
      Add Friend
    </Button>
  );
}
