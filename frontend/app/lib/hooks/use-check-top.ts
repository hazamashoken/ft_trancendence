import { OtpStore, useOtpStore } from "@/store/otp";
import useStore from "@/store/use-store";
import React from "react";
import { useRouter } from "next/navigation";

export function useCheckOtp() {
  const is_verified = useStore(
    useOtpStore,
    (state: OtpStore) => state.verified
  );

  const setVerified = useStore(
    useOtpStore,
    (state: OtpStore) => state.setVerified
  );

  const router = useRouter();

  React.useEffect(() => {
    if (!is_verified) {
      router.push("/auth/otp/verify");
    }
  }, [is_verified, router]);

  return { is_verified, setVerified };
}
