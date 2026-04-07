"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function DeliveryNotice() {
  const [isVisible, setIsVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Check localStorage on mount
    const dismissed = localStorage.getItem("deliveryNoticeDismissed");
    if (dismissed === "true") {
      setIsVisible(false);
    }
    setIsMounted(true);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("deliveryNoticeDismissed", "true");
  };

  // Prevent hydration mismatch
  if (!isMounted) return null;

  if (!isVisible) return null;

  return (
    <div className="w-full bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-300 px-4 py-4 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <span className="text-xl">📦</span>
          <p className="text-sm text-amber-900">
            <span className="font-semibold">Delivery Notice:</span> Charges applicable on all orders. We'll confirm before shipping. Call{" "}
            <a 
              href="tel:9810107887" 
              className="font-semibold text-amber-700 hover:text-amber-900 underline"
            >
              9810107887
            </a>{" "}
            for details.
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 text-amber-600 hover:text-amber-800 transition-colors p-1"
          aria-label="Close notice"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}