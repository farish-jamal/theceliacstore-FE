"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { useAppSelector } from "@/app/hooks/reduxHooks";
import { motion, AnimatePresence } from "framer-motion";

const FloatingCart = () => {
  const router = useRouter();
  const pathname = usePathname();

  const guestCartItems = useAppSelector((state) => state.guestCart.cart.items);
  const itemCount = guestCartItems.reduce((total, item) => total + item.quantity, 0);

  const isVisible = itemCount > 0 && pathname !== "/cart";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="floating-cart"
          initial={{ opacity: 0, y: 40, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.8 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-6 right-6 z-[90]"
        >
          <button
            onClick={() => router.push("/cart")}
            aria-label={`Cart, ${itemCount} item${itemCount !== 1 ? "s" : ""}`}
            className="flex items-center gap-3 bg-primary hover:opacity-90 text-primary-foreground px-5 py-4 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-opacity"
          >
            <div className="relative">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-3 -right-3 bg-destructive text-destructive-foreground text-[11px] font-bold w-[22px] h-[22px] flex items-center justify-center rounded-full border-2 border-background">
                {itemCount}
              </span>
            </div>
            <span className="font-bold text-sm tracking-wide uppercase pr-1">
              Cart
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingCart;