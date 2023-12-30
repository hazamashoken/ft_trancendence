"use client";
import { OTPAuth } from "@/components/otp-auth";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <OTPAuth>{children}</OTPAuth>
    </>
  );
}
