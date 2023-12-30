"use client";

import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import React, { useState, useRef } from "react";

export const OTPInput = ({ length = 6, onChange }) => {
  const [otp, setOtp] = useState(Array(length).fill(""));
  const inputRefs = useRef([]);

  const handleInputChange = (index, value) => {
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
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // console.log(e.key);
    if (e.key === "Backspace" && index > 0 && !otp[index]) {
      // If backspace is pressed and the current input is empty, move focus to the previous input
      inputRefs.current[index - 1].focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      // If left arrow is pressed and the current input is empty, move focus to the previous input
      inputRefs.current[index - 1].focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      // If right arrow is pressed and the current input is empty, move focus to the next input
      inputRefs.current[index + 1].focus();
    }
  };

  const handleFocus = (index) => {
    // Select the current input's value on focus
    inputRefs.current[index].select();
  };

  React.useEffect(() => {
    // Focus on the first input on initial render
    inputRefs.current[0].focus();
  }, []);

  return (
    <AlertDialog open>
      <AlertDialogContent>
        <div className="flex justify-center gap-3">
          {otp.map((digit, index) => (
            <Input
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onFocus={() => handleFocus(index)}
              ref={(ref) => (inputRefs.current[index] = ref)}
              className="w-16 h-16 text-4xl text-center"
            />
          ))}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
