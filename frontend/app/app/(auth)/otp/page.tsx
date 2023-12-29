import { redirect } from "next/navigation";
import { getOtp } from "../_action/otp";
import { OTPSetting } from "./_components/otp-setting";

export default async function OTPPage() {
  const res = await getOtp();

  return (
    <>
      <OTPSetting />
    </>
  );
}
