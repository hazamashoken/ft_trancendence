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
import { useRouter } from "next/navigation";
import useLocalStorage from "@/lib/hooks/use-local-storage";

export const VerifyOtp = () => {
  const { data, status, update } = useSession();
  const [isLoading, setIsLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [otp, setOtp] = React.useState<string>("");
  const [isError, setIsError] = React.useState(false);
  const router = useRouter();
  const [is_verified, setOtpVerified] = useLocalStorage("otp", false);

  React.useEffect(() => {
    if (is_verified) {
      router.push("/trancendence");
    }
    setOpen(true);
    useOtpStore.persist.rehydrate();
  }, []);

  const handleSubmit = async () => {
    setIsLoading(true);
    verifyOtp({ code: otp }).then((res) => {
      if (res.error) {
        toast.error(res.error);
        setIsError(true);
      } else if (!res.data.success) {
        toast.error("Invalid OTP");
        setIsError(true);
      } else {
        toast.success("OTP verified successfully");
        update({ ...data, otp: true });
        setOtpVerified(true);
        router.push("/trancendence");
        return;
      }
      setIsLoading(false);
    });
  };
  React.useEffect(() => {
    if (otp.length === 6 && !isError && !isLoading) {
      handleSubmit();
    }
  }, [otp, data, update]);

  React.useEffect(() => {
    if (!isError) return;
    const timer = setTimeout(() => {
      setIsError(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [isError]);

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
