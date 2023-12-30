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
import { removeOtp } from "../../_action/otp";
import { toast } from "sonner";
import useLocalStorage from "@/lib/hooks/use-local-storage";

export function OTPSetting({ isEnabled }: { isEnabled: boolean }) {
  const [is_verified, setOtpVerified] = useLocalStorage("otp", false);
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  React.useEffect(() => {
    setOpen(true);
  }, []);

  // console.log("isEnabled", isEnabled);

  const handleDisableOTP = async () => {
    const res = await removeOtp();
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("OTP disabled successfully");
      setOtpVerified(false);
      router.refresh();
    }
  };
  return (
    <>
      <AlertDialog open={open}>
        <AlertDialogContent>
          <AlertDialogHeader className="flex flex-col items-center justify-center">
            <AlertDialogTitle className="text-2xl font-bold">
              OTP Setting
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              You can {!isEnabled ? "enable" : "disable"} OTP to{" "}
              {!isEnabled ? "secure" : "unsecure"} your account. OTP is a 6
              digit code that is generated every 30 seconds to verify your
              identity.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex items-center justify-center gap-6">
            {!isEnabled ? (
              <Button onClick={() => router.push("/otp/register")}>
                Enable OTP
              </Button>
            ) : (
              <Button variant={"destructive"} onClick={handleDisableOTP}>
                Disable OTP
              </Button>
            )}
            <Button
              variant={"secondary"}
              onClick={() => router.push("/trancendence")}
            >
              Home
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
