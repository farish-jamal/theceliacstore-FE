"use client";
import * as React from "react";
import { useAppSelector, useAppDispatch } from "../hooks/reduxHooks";
import { cn } from "@/lib/utils";
import { hideSnackbar } from "../slices/snackbarSlice";

export default function GlobalSnackbar() {
  const { open, message, type } = useAppSelector((state) => state.snackbar);
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
        "fixed bottom-6 left-1/2 z-50 -translate-x-1/2 px-6 py-3 rounded shadow-lg text-white transition-all",
        type === "error" ? "bg-red-600" : type === "success" ? "bg-green-600" : "bg-gray-800"
      )}
      role="alert"
    >
      {message}
    </div>
  );
}
