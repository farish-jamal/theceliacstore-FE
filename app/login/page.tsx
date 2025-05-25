"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { FloatingLabelInput } from "../components/input/FloatingLabelInput";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-lg w-full space-y-12">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="text-sm text-gray-600">
            Welcome back! Please enter your details to continue.
          </p>
        </div>

        <form className="space-y-6">
          <FloatingLabelInput
            id="email"
            name="email"
            type="email"
            label="Email"
            value={form.email}
            onChange={handleChange}
          />

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

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox
                id="rememberMe"
                checked={rememberMe}
                onCheckedChange={() => setRememberMe((prev) => !prev)}
              />
              <label
                htmlFor="rememberMe"
                className="text-sm text-gray-600 leading-6 cursor-pointer"
              >
                Remember me
              </label>
            </div>

            <Link
              href="/forgot-password"
              className="text-xs text-[#1976D2] hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#4CAF50] hover:bg-green-600 text-white p-5 font-bold text-base"
          >
            Login
          </Button>

          <p className="text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link href="/register" className="text-blue-600 font-medium">
              Sign up
            </Link>
          </p>

          <div className="relative flex items-center justify-center">
            <span className="text-gray-400 text-sm">Or Sign in with</span>
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

export default Login;
