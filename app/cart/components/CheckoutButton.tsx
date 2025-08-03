import React from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { placeOrder, PlaceOrderPayload } from "@/app/apis/placeOrder";
import { useAppDispatch } from "@/app/hooks/reduxHooks";
import { showSnackbar } from "@/app/slices/snackbarSlice";

interface CheckoutButtonProps {
  disabled?: boolean;
  cartId?: string;
  addressId?: string;
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({ 
  disabled, 
  cartId, 
  addressId
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const placeOrderMutation = useMutation({
    mutationFn: placeOrder,
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
          // Encode complex data as JSON
          items: JSON.stringify(items),
          address: JSON.stringify(address),
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

  const handleCheckout = () => {
    if (!cartId || !addressId) {
      dispatch(
        showSnackbar({
          message: "Please select a delivery address and ensure your cart is not empty.",
          type: "error",
        })
      );
      return;
    }

    const payload: PlaceOrderPayload = {
      cartId,
      addressId,
    };

    placeOrderMutation.mutate(payload);
  };

  return (
    <button
      className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={disabled || placeOrderMutation.isPending}
      onClick={handleCheckout}
    >
      {placeOrderMutation.isPending ? "Placing Order..." : "Proceed to Checkout"}
    </button>
  );
};

export default CheckoutButton;
