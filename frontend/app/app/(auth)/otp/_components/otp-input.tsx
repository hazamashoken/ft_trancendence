"use client";

import { Input } from "@/components/ui/input";
import { cx } from "class-variance-authority";
import React, { useState, useRef } from "react";

export const OTPInput = ({
  length = 6,
  onChange,
  isLoading,
  isError,
}: {
  length?: number;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  isLoading?: boolean;
  isError?: boolean;
}) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<HTMLInputElement[]>([]);

  React.useEffect(() => {
    if (isError) {
      setOtp(Array(length).fill(""));
      inputRefs.current[0]?.focus();
    }
  }, [isError]);

  const handleInputChange = (index: number, value: string) => {
    // Check if the value is a number and ignore if it's not
    if (!/^[0-9]*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Join the OTP array into a string and pass it to the parent component
    const otpString = newOtp.join("");
    onChange(otpString);

    // Auto focus to the next input if the current input has a value
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && index > 0 && !otp[index]) {
      // If backspace is pressed and the current input is empty, move focus to the previous input
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      // If left arrow is pressed and the current input is empty, move focus to the previous input
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      // If right arrow is pressed and the current input is empty, move focus to the next input
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleFocus = (index: number) => {
    // Select the current input's value on focus
    inputRefs.current[index]?.select();
  };

  React.useEffect(() => {
    // Focus on the first input on initial render
    if (otp.length > 0 && !otp[0]) {
      inputRefs.current[0]?.focus();
    } else {
      inputRefs.current[otp.length - 1]?.focus();
    }
  }, [isLoading]);

  return (
    <div className="flex justify-center gap-3">
      {otp.map((digit, index) => (
        <Input
          key={index}
          type="text"
          maxLength={1}
          disabled={isLoading || isError}
          value={digit}
          onChange={(e) => handleInputChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onFocus={() => handleFocus(index)}
          ref={(ref) => (inputRefs.current[index] = ref as HTMLInputElement)}
          className={cx({
            "w-16 h-16 text-4xl text-center": true,
            "border border-red-500": isError,
          })}
        />
      ))}
    </div>
  );
};
