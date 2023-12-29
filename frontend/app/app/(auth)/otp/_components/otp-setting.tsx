"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import React from "react";
import { useRouter } from "next/navigation";

export function OTPSetting() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  React.useEffect(() => {
    setOpen(true);
  }, []);
  return (
    <>
      <AlertDialog open={open}>
        <AlertDialogContent>
          <AlertDialogHeader className="flex flex-col items-center justify-center">
            <AlertDialogTitle className="text-2xl font-bold">
              OTP Setting
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              You can enable OTP to secure your account
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex items-center justify-center gap-6">
            <Button onClick={() => router.push("/otp/register")}>
              Enable OTP
            </Button>
            <Button
              variant={"destructive"}
              onClick={() => router.push("/trancendence")}
            >
              Skip
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
