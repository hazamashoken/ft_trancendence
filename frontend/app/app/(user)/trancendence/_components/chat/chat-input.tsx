"use client";

import * as z from "zod";
import axios from "axios";
// import qs from "query-string";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useModal } from "@/lib/hooks/use-modal-store";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import ApiClient from "@/app/api/api-client";
import { sendChatMessage } from "../../_actions/chat";
import { useSession } from "next-auth/react";

interface ChatInputProps {
  apiUrl: string;
  query: Record<string, any>;
  name: string;
  type: "conversation" | "channel";
  userId: string;
  chatId: string;
}

const formSchema = z.object({
  message: z.string().min(1),
  userId: z.coerce.number(),
});

export const ChatInput = ({
  apiUrl,
  query,
  name,
  type,
  userId,
  chatId,
}: ChatInputProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
      userId: parseInt(userId),
    },
  });

  const { data } = useSession();

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!chatId) {
      return;
    }

    const accessToken = data?.accessToken;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/channels/${chatId}/createmessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY as string,
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(values),
      }
    );
    const d = await res.json();

    if (!res.ok) {
      toast.error(d);
      return;
    }
    form.reset();
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative p-4 pb-6">
                    <Input
                      disabled={isLoading || !chatId}
                      className="px-4 py-6 border-0 border-none bg-zinc-200/90 dark:bg-zinc-700/75 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                      type="text"
                      placeholder={`Message ${
                        type === "conversation" ? name : "#" + name
                      }`}
                      {...field}
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </>
  );
};
