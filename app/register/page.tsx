"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { FloatingLabelInput } from "../components/input/FloatingLabelInput";
import { useMutation } from "@tanstack/react-query";
import { useAppDispatch } from "../hooks/reduxHooks";
import { setAuth } from "../slices/authSlice";
import { showSnackbar } from "../slices/snackbarSlice";
import { useRouter } from "next/navigation";
import { registerUser } from "../apis/registerUser";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phone: z.string().min(1, "Phone is required"),
  password: z.string().min(1, "Password is required"),
  confirmPassword: z.string().min(1, "Confirm Password is required"),
});

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const dispatch = useAppDispatch();
  const router = useRouter();
  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (response) => {
      if (response?.success && response.data) {
        const { id, name, email, phone } = response.data.user;
        const { token } = response.data;
        dispatch(setAuth({ user: { id, name, email, phone }, token }));
        dispatch(
          showSnackbar({
            message: "Registration successful!",
            type: "success",
          })
        );
        router.replace("/");
      } else {
        dispatch(
          showSnackbar({
            message:
              response?.message ||
              "Registration failed. Please try again.",
            type: "error",
          })
        );
      }
    },
    onError: () => {
      dispatch(
        showSnackbar({
          message: "Registration failed. Please check your details.",
          type: "error",
        })
      );
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const result = registerSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    registerMutation.mutate(form);
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

        <form className="space-y-6" onSubmit={handleSubmit}>
          <FloatingLabelInput
            id="name"
            name="name"
            label="Name"
            value={form.name}
            onChange={handleChange}
            error={errors.name}
          />

          <div className="grid grid-cols-2 gap-4">
            <FloatingLabelInput
              id="email"
              name="email"
              type="email"
              label="Email"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
            />
            <FloatingLabelInput
              id="phone"
              name="phone"
              type="tel"
              label="Phone Number"
              value={form.phone}
              onChange={handleChange}
              error={errors.phone}
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
              error={errors.password}
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
              error={errors.confirmPassword}
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
