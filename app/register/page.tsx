"use client";

import { useState } from "react";
import Link from "next/link";
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
import { AxiosError } from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogPortal,
} from "@/components/ui/dialog";

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
        const { id, name, email, phone, token } = response.data;
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
    onError: (error: AxiosError<{ message?: string }>) => {
      console.log("ERROR",error);
      // Extract error message from the API response
      const errorMessage = 
        error?.response?.data?.message || 
        error?.message || 
        "Registration failed. Please check your details.";
      
      dispatch(
        showSnackbar({
          message: errorMessage,
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
    
    // Check if user agreed to terms
    if (!agreed) {
      setErrors({ agreed: "You must agree to the Terms and Privacy Policy" });
      return;
    }
    
    const result = registerSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    registerMutation.mutate({
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password,
      confirmPassword: form.confirmPassword,
    });
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

          <div className="space-y-2">
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
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      Terms
                    </button>
                  </DialogTrigger>
                  <DialogPortal>
                    <DialogContent 
                      className="max-w-2xl max-h-[80vh] overflow-y-auto"
                      showCloseButton={false}
                    >
                      <DialogHeader>
                        <DialogTitle>Terms of Service</DialogTitle>
                        <DialogDescription>
                          Please read and understand our terms of service before proceeding.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 text-sm text-gray-700">
                        <h3 className="font-semibold text-lg">1. Acceptance of Terms</h3>
                        <p>
                          By accessing and using The Celiac Store, you accept and agree to be bound by the terms and provision of this agreement.
                        </p>
                        
                        <h3 className="font-semibold text-lg">2. Use License</h3>
                        <p>
                          Permission is granted to temporarily download one copy of the materials on The Celiac Store for personal, non-commercial transitory viewing only.
                        </p>
                        
                        <h3 className="font-semibold text-lg">3. Product Information</h3>
                        <p>
                          We strive to provide accurate product information, but we cannot guarantee that all product descriptions or other content is accurate, complete, reliable, current, or error-free.
                        </p>
                        
                        <h3 className="font-semibold text-lg">4. Health and Dietary Information</h3>
                        <p>
                          Our products are gluten-free, but we recommend consulting with healthcare professionals regarding dietary restrictions and allergies.
                        </p>
                        
                        <h3 className="font-semibold text-lg">5. Limitation of Liability</h3>
                        <p>
                          In no event shall The Celiac Store or its suppliers be liable for any damages arising out of the use or inability to use the materials on our website.
                        </p>
                      </div>
                    </DialogContent>
                  </DialogPortal>
                </Dialog>{" "}
                and{" "}
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      Privacy Policies
                    </button>
                  </DialogTrigger>
                  <DialogPortal>
                    <DialogContent 
                      className="max-w-2xl max-h-[80vh] overflow-y-auto"
                      showCloseButton={false}
                    >
                      <DialogHeader>
                        <DialogTitle>Privacy Policy</DialogTitle>
                        <DialogDescription>
                          Please read and understand our privacy policy before proceeding.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 text-sm text-gray-700">
                        <h3 className="font-semibold text-lg">1. Information We Collect</h3>
                        <p>
                          We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.
                        </p>
                        
                        <h3 className="font-semibold text-lg">2. How We Use Your Information</h3>
                        <p>
                          We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.
                        </p>
                        
                        <h3 className="font-semibold text-lg">3. Information Sharing</h3>
                        <p>
                          We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.
                        </p>
                        
                        <h3 className="font-semibold text-lg">4. Data Security</h3>
                        <p>
                          We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                        </p>
                        
                        <h3 className="font-semibold text-lg">5. Cookies</h3>
                        <p>
                          We use cookies and similar technologies to enhance your experience on our website and to analyze how our services are used.
                        </p>
                        
                        <h3 className="font-semibold text-lg">6. Your Rights</h3>
                        <p>
                          You have the right to access, update, or delete your personal information. You may also opt out of certain communications from us.
                        </p>
                      </div>
                    </DialogContent>
                  </DialogPortal>
                </Dialog>
              </label>
            </div>
            {errors.agreed && (
              <p className="text-sm text-red-500">{errors.agreed}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-[#4CAF50] hover:bg-green-600 text-white p-5 font-bold text-base"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? "Creating account..." : "Create account"}
          </Button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 font-medium">
              Login
            </Link>
          </p>

          {/* Google Signup - Commented out for now */}
          {/* <div className="relative flex items-center justify-center">
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
          </Button> */}
        </form>
      </div>
    </div>
  );
};

export default Register;
