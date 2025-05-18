"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { FloatingLabelInput } from "../components/input/FloatingLabelInput";

const Register = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-lg w-full space-y-12">
        <div>
          <h1 className="text-3xl font-bold">Sign up</h1>
          <p className="text-sm text-gray-600">
            Let’s get you all set up so you can access your personal account.
          </p>
        </div>

        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <FloatingLabelInput
              id="firstName"
              name="firstName"
              label="First Name"
              value={form.firstName}
              onChange={handleChange}
            />
            <FloatingLabelInput
              id="lastName"
              name="lastName"
              label="Last Name"
              value={form.lastName}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FloatingLabelInput
              id="email"
              name="email"
              type="email"
              label="Email"
              value={form.email}
              onChange={handleChange}
            />
            <FloatingLabelInput
              id="phone"
              name="phone"
              type="tel"
              label="Phone Number"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div className="relative">
            <FloatingLabelInput
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              label="Password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
            />
            <div
              className="absolute inset-y-0 right-3 top-[5px] flex items-center cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>

          <div className="relative">
            <FloatingLabelInput
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              label="Confirm Password"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={handleChange}
            />
            <div
              className="absolute inset-y-0 right-3 top-[5px] flex items-center cursor-pointer"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="terms"
              className="mt-1"
              checked={agreed}
              onCheckedChange={() => setAgreed((prev) => !prev)}
            />
            <label
              htmlFor="terms"
              className="text-sm text-gray-600 leading-6 cursor-pointer"
            >
              I agree to all the{" "}
              <a href="#" className="text-blue-600 underline">
                Terms
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-600 underline">
                Privacy Policies
              </a>
            </label>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#4CAF50] hover:bg-green-600 text-white p-5 font-bold text-base"
          >
            Create account
          </Button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 font-medium">
              Login
            </Link>
          </p>

          <div className="relative flex items-center justify-center">
            <span className="text-gray-400 text-sm">Or Sign up with</span>
          </div>

          <Button
            variant="outline"
            className="w-full border-gray-300 p-5 text-gray-700 gap-2"
          >
            <Image
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="h-5 w-5"
              width={20}
              height={20}
            />
            Sign in with Google
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Register;
