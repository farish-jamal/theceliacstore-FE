"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FloatingLabelInput } from "../components/input/FloatingLabelInput";
import { ArrowLeft } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
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

        <form className="space-y-6">
          <FloatingLabelInput
            id="email"
            name="email"
            type="email"
            label="Email"
            value={email}
            onChange={handleChange}
          />

          <Button
            type="submit"
            className="w-full bg-[#4CAF50] hover:bg-green-600 text-white p-6 font-bold text-base"
          >
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
