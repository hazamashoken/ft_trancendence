import React from "react";
import { RegisterOTP } from "../_components/register-otp";
import { getOtp } from "../../_action/otp";
import { redirect } from "next/navigation";

export default async function TOTPPage() {
  const res = await getOtp();

  if (!res.error) redirect("/trancendence");

  return (
    <>
      <RegisterOTP />
    </>
  );
}
