import React from "react";
import { VerifyOtp } from "../_components/verify-otp";
import { getOtp } from "../../_action/otp";
import { redirect } from "next/navigation";

export default async function RegisterOTPPage() {
  const res = await getOtp();

  if (res.error) redirect("/trancendence");

  return (
    <>
      <VerifyOtp />
    </>
  );
}
