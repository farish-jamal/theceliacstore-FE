"use client";
import * as React from "react";
import { useAppSelector, useAppDispatch } from "../hooks/reduxHooks";
import { cn } from "@/lib/utils";
import { hideSnackbar } from "../slices/snackbarSlice";

// Position classes
const positionClasses: Record<string, string> = {
  "bottom-center": "fixed bottom-6 left-1/2 -translate-x-1/2",
  "top-center": "fixed top-6 left-1/2 -translate-x-1/2",
  "bottom-right": "fixed bottom-6 right-6",
  "bottom-left": "fixed bottom-6 left-6",
  "top-right": "fixed top-6 right-6",
  "top-left": "fixed top-6 left-6",
};

export default function GlobalSnackbar() {
  const { open, message, type, position = "top-right", title, subtitle, onClick } = useAppSelector((state) => state.snackbar);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        dispatch(hideSnackbar());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [open, dispatch]);

  if (!open) return null;

  return (
    <div
      className={cn(
        positionClasses[position] || positionClasses["top-right"],
        "z-50 px-6 py-3 rounded shadow-lg text-white transition-all cursor-pointer",
        type === "error"
          ? "bg-red-600"
          : type === "success"
          ? "bg-green-600"
          : "bg-gray-800"
      )}
      role="alert"
      onClick={() => {
        if (typeof onClick === "function") onClick();
        dispatch(hideSnackbar());
      }}
    >
      {title && <div className="font-bold text-base mb-1">{title}</div>}
      {message && <div className="text-sm">{message}</div>}
      {subtitle && <div className="text-xs mt-1 opacity-80">{subtitle}</div>}
    </div>
  );
}
