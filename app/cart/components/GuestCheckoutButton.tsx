import React, { useState } from "react";
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

interface GuestCheckoutButtonProps {
  disabled?: boolean;
  cart: GuestCart;
}

const GuestCheckoutButton: React.FC<GuestCheckoutButtonProps> = ({ 
  disabled, 
  cart 
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [guestAddress, setGuestAddress] = useState<GuestAddress | null>(null);

  const placeOrderMutation = useMutation({
    mutationFn: placeGuestOrder,
    onSuccess: (response) => {
      if (response?.success && response.data) {
        const { _id, totalAmount, discountedTotalAmount, createdAt, items, address } = response.data;
        
        // Generate order number from ID (first 8 characters)
        const orderNumber = `GFC${_id.slice(-8).toUpperCase()}`;
        
        // Calculate estimated delivery (7 days from now)
        const estimatedDeliveryDate = new Date();
        estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 7);
        const estimatedDelivery = estimatedDeliveryDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        
        // Clear guest cart
        clearGuestCart();
        dispatch(clearGuestCartState());
        
        // Show success message
        dispatch(
          showSnackbar({
            message: "Order placed successfully!",
            type: "success",
          })
        );

        // Navigate to confirmation page with order details
        const searchParams = new URLSearchParams({
          orderId: _id,
          orderNumber,
          totalAmount: totalAmount.toString(),
          discountedAmount: discountedTotalAmount.toString(),
          estimatedDelivery,
          createdAt,
          items: JSON.stringify(items),
          address: JSON.stringify(address),
          isGuest: 'true',
        });

        router.push(`/order-confirmation?${searchParams.toString()}`);
      } else {
        dispatch(
          showSnackbar({
            message: response?.message || "Failed to place order. Please try again.",
            type: "error",
          })
        );
      }
    },
    onError: (error) => {
      console.error("Order placement error:", error);
      dispatch(
        showSnackbar({
          message: "Failed to place order. Please check your connection and try again.",
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
    
    // Proceed with checkout
    proceedToCheckout(address);
  };

  const proceedToCheckout = (address: GuestAddress) => {
    // Prepare the payload
    const items = cart.items.map(item => {
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

    // Show address form for guest checkout
    setShowAddressForm(true);
  };

  return (
    <>
      <button
        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={disabled || placeOrderMutation.isPending}
        onClick={handleCheckout}
      >
        {placeOrderMutation.isPending ? "Placing Order..." : "Proceed to Checkout"}
      </button>

      {/* Guest Address Form Modal */}
      <AnimatePresence>
        {showAddressForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Delivery Address</h2>
                <button
                  onClick={() => setShowAddressForm(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
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
                  <label className="block text-sm font-medium mb-2" htmlFor="email">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full border-2 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none"
                    required
                    defaultValue={guestAddress?.email || ""}
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
                    defaultValue={guestAddress?.pincode || ""}
                  />
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Subtotal:</span>
                    <span>₹{cart.total_price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Shipping:</span>
                    <span>{cart.shipping_charge === 0 ? "Free" : `₹${cart.shipping_charge.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>₹{cart.final_price.toFixed(2)}</span>
                  </div>
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
      </AnimatePresence>
    </>
  );
};

export default GuestCheckoutButton;

