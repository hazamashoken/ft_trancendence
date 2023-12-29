"use client";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import { OTPInput } from "./otp-input";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { activateOtp, registerOtp } from "../../_action/otp";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { is } from "date-fns/locale";

export function RegisterOTP() {
  const { data, status, update } = useSession();
  const [isLoading, setIsLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [otp, setOtp] = React.useState<string>("");
  const [QRCode, setQRCode] = React.useState<string>("");
  const [isError, setIsError] = React.useState(false);
  const router = useRouter();
  React.useEffect(() => {
    setOpen(true);
    const handleRegister = async () => {
      setIsLoading(true);
      const res = await registerOtp();
      if (res.error) {
        toast.error(res.error);
        setOtp("");
      } else {
        setQRCode(res.data.qrcode);
      }
      setIsLoading(false);
    };
    handleRegister();
  }, []);

  React.useEffect(() => {
    const handleSubmit = async () => {
      setIsLoading(true);
      const res = await activateOtp({ code: otp });
      if (!res?.data?.success) {
        setIsError(true);
        toast.error("Invalid OTP");
      } else {
        update({ ...data, otp: true });
        router.push("/trancendence");
        return;
      }
      setIsLoading(false);
    };
    if (otp.length === 6 && !isError) {
      handleSubmit();
    }
  }, [otp, data, update]);

  React.useEffect(() => {
    if (!isError) return;
    const timer = setTimeout(() => {
      setIsError(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [isError]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="w-1/2">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">
            Scan QR to register OTP
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Scan QR code with your phone and enter the OTP
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex justify-center w-full ">
          {isLoading ? (
            <Skeleton className="w-[400px] h-[400px]" />
          ) : (
            <QRCodeCanvas size={400} value={QRCode} />
          )}
        </div>

        <OTPInput onChange={setOtp} isError={isError} isLoading={isLoading} />
      </AlertDialogContent>
    </AlertDialog>
  );
}
