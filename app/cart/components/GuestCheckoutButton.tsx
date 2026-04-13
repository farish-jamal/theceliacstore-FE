import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/app/hooks/reduxHooks";
import { showSnackbar } from "@/app/slices/snackbarSlice";
import { clearGuestCartState } from "@/app/slices/guestCartSlice";
import { placeGuestOrder, GuestPlaceOrderPayload } from "@/app/apis/placeOrder";
import { clearGuestCart } from "@/app/utils/guestCart";
import { GuestCart, GuestAddress } from "@/app/types/GuestCart";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { BACKEND_URL } from "@/app/constants/URL";

function roundToNearest50(value: number): number {
  return Math.round(value / 50) * 50;
}

function getShippingRange(calculated: number): { low: number; high: number } {
  return {
    low: roundToNearest50(calculated * 0.85),
    high: roundToNearest50(calculated * 1.15),
  };
}

interface GuestCheckoutButtonProps {
  disabled?: boolean;
  cart: GuestCart;
  initialPincode?: string;
  initialShippingCharge?: number;
}

const GuestCheckoutButton: React.FC<GuestCheckoutButtonProps> = ({
  disabled,
  cart,
  initialPincode = "",
  initialShippingCharge = 0,
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [guestAddress, setGuestAddress] = useState<GuestAddress | null>(null);

  // Shipping estimate state inside modal
  const [modalPincode, setModalPincode] = useState(initialPincode);
  const [estimatedCharge, setEstimatedCharge] = useState<number | null>(
    initialShippingCharge > 0 ? initialShippingCharge : null
  );
  const [isCalculating, setIsCalculating] = useState(false);
  const [pincodeError, setPincodeError] = useState("");

  // When modal opens, sync with latest initialPincode from cart page
  useEffect(() => {
  if (showAddressForm) {
    setModalPincode(initialPincode || "");
    setEstimatedCharge(initialShippingCharge > 0 ? initialShippingCharge : null);
    setPincodeError("");
  }
  }, [showAddressForm]);

  // Recalculate when pincode changes inside modal
  useEffect(() => {
    if (modalPincode.length !== 6) {
      setEstimatedCharge(null);
      setPincodeError("");
      return;
    }

    const calculateShipping = async () => {
      setIsCalculating(true);
      setPincodeError("");

      try {
        const weight = cart.items.reduce((total, item) => {
          if (item.type === "product") {
            return total + ((item.product.weight_in_grams || 0) * item.quantity);
          }
          return total;
        }, 0) || 500;

        const response = await fetch(
          `${BACKEND_URL}/api/delivery-zone/calculate?pincode=${modalPincode}&weight_in_grams=${weight}`
        );
        const data = await response.json();

        if (data.success && data.data?.delivery_price !== undefined) {
          setEstimatedCharge(data.data.delivery_price);
        } else {
          setPincodeError("Could not estimate for this pincode.");
          setEstimatedCharge(null);
        }
      } catch {
        setPincodeError("Could not connect. Please try again.");
        setEstimatedCharge(null);
      } finally {
        setIsCalculating(false);
      }
    };

    calculateShipping();
  }, [modalPincode]);

  const renderShippingDisplay = () => {
    if (isCalculating) {
      return <span className="text-gray-400">Calculating...</span>;
    }
    if (estimatedCharge !== null) {
      const { low, high } = getShippingRange(estimatedCharge);
      if (low === 0 && high === 0) {
        return <span className="text-green-600">Free</span>;
      }
      return <span>₹{low} – ₹{high}</span>;
    }
    return <span className="text-gray-400">We'll call & confirm</span>;
  };

  const placeOrderMutation = useMutation({
    mutationFn: placeGuestOrder,
    onSuccess: (response) => {
      if (response?.success && response.data) {
        const {
          _id,
          orderNumber,
          totalAmount,
          discountedTotalAmount,
          createdAt,
          items,
          address,
        } = response.data;

        const estimatedDeliveryDate = new Date();
        estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 7);
        const estimatedDelivery = estimatedDeliveryDate.toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        );

        clearGuestCart();
        dispatch(clearGuestCartState());

        dispatch(
          showSnackbar({
            message: "Order placed successfully!",
            type: "success",
          })
        );

        const searchParams = new URLSearchParams({
          orderId: _id,
          orderNumber: orderNumber?.toString() || _id,
          totalAmount: totalAmount.toString(),
          discountedAmount: discountedTotalAmount.toString(),
          estimatedDelivery,
          createdAt,
          items: JSON.stringify(items),
          address: JSON.stringify(address),
          isGuest: "true",
          shippingLow: estimatedCharge !== null ? roundToNearest50(estimatedCharge * 0.85).toString() : "0",
          shippingHigh: estimatedCharge !== null ? roundToNearest50(estimatedCharge * 1.15).toString() : "0",
        });

        router.push(`/order-confirmation?${searchParams.toString()}`);
      } else {
        dispatch(
          showSnackbar({
            message:
              response?.message || "Failed to place order. Please try again.",
            type: "error",
          })
        );
      }
    },
    onError: (error) => {
      console.error("Order placement error:", error);
      dispatch(
        showSnackbar({
          message:
            "Failed to place order. Please check your connection and try again.",
          type: "error",
        })
      );
    },
  });

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    const address: GuestAddress = {
      name: formData.get("fullName") as string,
      email: formData.get("email") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      pincode: formData.get("zip") as string,
      mobile: formData.get("phone") as string,
    };

    setGuestAddress(address);
    setShowAddressForm(false);
    proceedToCheckout(address);
  };

  const proceedToCheckout = (address: GuestAddress) => {
    const items = cart.items.map((item) => {
      if (item.type === "product") {
        return {
          type: "product" as const,
          product_id: item.product._id,
          quantity: item.quantity,
          variant_sku: item.variant_sku,
        };
      } else {
        return {
          type: "bundle" as const,
          bundle_id: item.bundle._id,
          quantity: item.quantity,
        };
      }
    });

    const payload: GuestPlaceOrderPayload = {
      items,
      address,
    };

    placeOrderMutation.mutate(payload);
  };

  const handleCheckout = () => {
    if (cart.items.length === 0) {
      dispatch(
        showSnackbar({
          message: "Your cart is empty. Please add items to proceed.",
          type: "error",
        })
      );
      return;
    }
    setShowAddressForm(true);
  };

  React.useEffect(() => {
    if (showAddressForm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showAddressForm]);

  return (
    <>
      <button
        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={disabled || placeOrderMutation.isPending}
        onClick={handleCheckout}
      >
        {placeOrderMutation.isPending ? "Placing Order..." : "Proceed to Checkout"}
      </button>

      {typeof window !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {showAddressForm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]"
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    setShowAddressForm(false);
                  }
                }}
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl max-h-[90vh] overflow-y-auto relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Delivery Address</h2>
                    <button
                      onClick={() => setShowAddressForm(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      type="button"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">
                    Please enter your delivery address to complete the order.
                  </p>

                  <form onSubmit={handleAddressSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" htmlFor="fullName">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        className="w-full border-2 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none"
                        required
                        defaultValue={guestAddress?.name || ""}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" htmlFor="phone">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        pattern="[0-9]{10}"
                        title="Please enter a valid 10-digit mobile number"
                        className="w-full border-2 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none"
                        required
                        defaultValue={guestAddress?.mobile || ""}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" htmlFor="address">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        className="w-full border-2 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none"
                        required
                        defaultValue={guestAddress?.address || ""}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2" htmlFor="city">
                          City *
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          className="w-full border-2 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none"
                          required
                          defaultValue={guestAddress?.city || ""}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" htmlFor="state">
                          State *
                        </label>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          className="w-full border-2 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none"
                          required
                          defaultValue={guestAddress?.state || ""}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" htmlFor="zip">
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        id="zip"
                        name="zip"
                        pattern="[0-9]{6}"
                        title="Please enter a valid 6-digit PIN code"
                        className="w-full border-2 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none"
                        required
                        value={modalPincode}
                        onChange={(e) => setModalPincode(e.target.value.replace(/\D/g, ""))}
                        maxLength={6}
                      />
                      {pincodeError && (
                        <p className="text-xs text-red-500 mt-1">{pincodeError}</p>
                      )}
                    </div>

                    <div className="border-t pt-4 mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Subtotal:</span>
                        <span>₹{cart.total_price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Shipping:</span>
                        {renderShippingDisplay()}
                      </div>
                      <div className="flex justify-between font-semibold border-t pt-2">
                      <span>Estimated Total:</span>
                      <span>
                        {estimatedCharge !== null
                          ? `₹${(cart.total_price + roundToNearest50(estimatedCharge * 1.15)).toFixed(2)}`
                          : `₹${cart.total_price.toFixed(2)} + delivery charges`}
                      </span>
                      </div>
                      <p className="text-xs text-gray-400">
                        * Delivery charge is an estimate. Final amount confirmed before dispatch.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={placeOrderMutation.isPending}
                      className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors mt-4 font-medium disabled:opacity-50"
                    >
                      {placeOrderMutation.isPending ? "Placing Order..." : "Place Order"}
                    </button>
                  </form>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    By placing this order, you agree to our Terms & Conditions and Privacy Policy.
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
};

export default GuestCheckoutButton;