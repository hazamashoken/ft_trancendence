"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import React, { useState, useRef } from "react";
import { OTPInput } from "./otp-input";
import { verifyOtp } from "../../_action/otp";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export const VerifyOtp = () => {
  const { data, status, update } = useSession();
  const [isLoading, setIsLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [otp, setOtp] = React.useState<string>("");
  const [isError, setIsError] = React.useState(false);
  React.useEffect(() => {
    setOpen(true);
  }, []);

  React.useEffect(() => {
    const handleSubmit = async () => {
      setIsLoading(true);
      const res = await verifyOtp({ code: otp });
      if (res.error) {
        toast.error(res.error);
        setIsError(true);
      } else {
        update({ ...data, otp: true });
        setOpen(false);
      }
      setIsLoading(false);
    };
    console.log(isError);
    if (otp.length === 6 && !isError) {
      handleSubmit();
    }
  }, [otp, data, update]);

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl text-center">
            Enter your TOTP
          </AlertDialogTitle>
        </AlertDialogHeader>
        <OTPInput onChange={setOtp} isLoading={isLoading} isError={isError} />
      </AlertDialogContent>
    </AlertDialog>
  );
};
