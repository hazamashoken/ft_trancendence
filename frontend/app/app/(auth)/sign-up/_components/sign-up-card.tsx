"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import React, { useState, useRef } from "react";
import { verifyOtp } from "../../_action/otp";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { InputForm } from "@/components/form/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Form } from "@/components/ui/form";
import { ImageUpload } from "@/components/top-navbar/upload-avatar";
import { updateAccount } from "@/components/top-navbar/_actions/account";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  displayName: z
    .string()
    .regex(/^[A-Za-z]+$/, "Only letters are allowed")
    .min(6, "Minimum 6 characters")
    .max(36, "Maximum 36 characters"),
});

export function SignUpCard() {
  const { data, status, update } = useSession();
  const [open, setOpen] = React.useState(false);
  const [url, setUrl] = React.useState<string>("");
  const router = useRouter();
  React.useEffect(() => {
    setOpen(true);
  }, []);

  React.useEffect(() => {
    if (data?.user?.id) {
      setUrl(data?.user?.imageUrl!);
    }
  }, [data]);

  const form = useForm({
    defaultValues: {
      displayName: "",
    },
  });

  const handleSubmit = async (values: any) => {
    const res = await updateAccount(values);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Username set successfully");
    }
  };
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl text-center">
            User Settings
          </AlertDialogTitle>
        </AlertDialogHeader>
        <Form {...form}>
          <form className="space-y-4">
            <InputForm
              label="Username"
              name="displayName"
              type="text"
              placeholder="username"
              form={form}
              msg
            />
            <Button
              type="submit"
              onClick={form.handleSubmit(handleSubmit)}
              disabled={form.formState.isSubmitting}
              className="w-full"
            >
              {form.formState.isSubmitting ? (
                <Loader2 className="w-4 h-4 my-4 text-zinc-500 animate-spin" />
              ) : (
                "save"
              )}
            </Button>
          </form>
        </Form>
        <ImageUpload
          type="original"
          width={120}
          height={120}
          logo={url}
          setUrl={setUrl}
        />
        <Button
          type="button"
          onClick={() => {
            router.push("/otp");
          }}
        >
          Next
        </Button>
      </AlertDialogContent>
    </AlertDialog>
  );
}
