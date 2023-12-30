"use client";

import { getOtp } from "@/app/(auth)/_action/otp";
import { useCheckOtp } from "@/lib/hooks/use-check-top";
import React from "react";
import { useRouter } from "next/navigation";
import useLocalStorage from "@/lib/hooks/use-local-storage";

export function OTPAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [is_verified, setOtpVerified] = useLocalStorage("otp", false);

  React.useEffect(() => {
    const checkOTP = async () => {
      getOtp().then((res) => {
        if (res.is_otp_enabled && !is_verified) {
          router.push("/otp/verify");
        }
      });
    };
    checkOTP();
  }, [is_verified]);

  return <>{children}</>;
}
