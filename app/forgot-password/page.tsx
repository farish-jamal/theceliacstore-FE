"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FloatingLabelInput } from "../components/input/FloatingLabelInput";
import { ArrowLeft } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "../apis/forgotPassword";
import { useAppDispatch } from "../hooks/reduxHooks";
import { showSnackbar } from "../slices/snackbarSlice";
import { z } from "zod";
import { AxiosError } from "axios";

const emailSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [countdown, setCountdown] = useState(0);
  const dispatch = useAppDispatch();

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const forgotPasswordMutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (response) => {
      if (response?.success) {
        dispatch(
          showSnackbar({
            message: response?.message || "Password reset link sent to your email!",
            type: "success",
          })
        );
        setCountdown(60); // Start 60-second countdown
        setEmail("");
      } else {
        dispatch(
          showSnackbar({
            message: response?.message || "Failed to send reset link. Please try again.",
            type: "error",
          })
        );
      }
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const errorMessage = 
        error?.response?.data?.message || 
        error?.message || 
        "Failed to send reset link. Please try again.";
      
      dispatch(
        showSnackbar({
          message: errorMessage,
          type: "error",
        })
      );
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Prevent submission during countdown
    if (countdown > 0) {
      return;
    }
    
    const result = emailSchema.safeParse({ email });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    
    forgotPasswordMutation.mutate({ email });
  };

  return (
    <div className="min-h-screen flex mt-[20vh] justify-center bg-white px-4">
      <div className="max-w-lg w-full space-y-12">
        {/* Back link */}
        <Link
          href="/login"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Back to login</span>
        </Link>

        <div className="space-y-3">
          <h1 className="text-3xl font-bold">Forgot your password?</h1>
          <p className="text-sm text-gray-600">
           Enter your email below to recover your password. We will send you a link to reset it.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <FloatingLabelInput
            id="email"
            name="email"
            type="email"
            label="Email"
            value={email}
            onChange={handleChange}
            error={errors.email}
          />

          <Button
            type="submit"
            className="w-full bg-[#4CAF50] hover:bg-green-600 text-white p-6 font-bold text-base disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={forgotPasswordMutation.isPending || countdown > 0}
          >
            {forgotPasswordMutation.isPending
              ? "Sending..."
              : countdown > 0
              ? `Resend in ${countdown}s`
              : "Submit"}
          </Button>
          
          {countdown > 0 && (
            <p className="text-sm text-gray-600 text-center">
              Please wait before requesting another password reset link
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
