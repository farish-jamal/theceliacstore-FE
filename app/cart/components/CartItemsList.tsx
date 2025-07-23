import React, { useState } from "react";
import { CartItem } from "@/app/types/Cart";
import CartItemCard from "./CartItemCard";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProductInCart } from "@/app/apis/updateProductInCart";
import SmallLoader from "./SmallLoader";
import { useDispatch } from "react-redux";
import { showSnackbar } from "@/app/slices/snackbarSlice";

export type CartItemsListProps = {
  items: CartItem[];
};

const CartItemsList: React.FC<CartItemsListProps> = ({ items }) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  
  const mutation = useMutation({
    mutationFn: updateProductInCart,
    onSuccess: (data, variables) => {
      setLoadingId(null);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      
      // Show success message for removal (quantity 0)
      if (variables.quantity === 0) {
        dispatch(showSnackbar({
          message: "Item removed from cart successfully",
          type: "success"
        }));
      }
    },
    onError: (error, variables) => {
      setLoadingId(null);
      console.error("Cart operation error:", error);
      
      const isRemoval = variables.quantity === 0;
      dispatch(showSnackbar({
        message: isRemoval 
          ? "Failed to remove item from cart. Please try again."
          : "Failed to update item quantity. Please try again.",
        type: "error"
      }));
    },
  });

  const handleQuantityChange = (itemId: string, quantity: number) => {
    const item = items.find((i) => i._id === itemId);
    if (!item || quantity < 1) return;
    
    setLoadingId(itemId);
    
    if (item.type === "product") {
      mutation.mutate({ 
        product_id: item.product._id as string, 
        quantity, 
        type: 'product' 
      });
    } else if (item.type === "bundle") {
      const bundleId = typeof item.bundle === "string" ? item.bundle : item.bundle._id;
      mutation.mutate({ 
        bundle_id: bundleId, 
        quantity, 
        type: 'bundle' 
      });
    }
  };

  const handleRemove = (itemId: string) => {
    const item = items.find((i) => i._id === itemId);
    if (!item) return;
    
    setLoadingId(itemId);
    
    if (item.type === "product") {
      mutation.mutate({ 
        product_id: item.product._id as string, 
        quantity: 0, 
        type: 'product' 
      });
    } else if (item.type === "bundle") {
      const bundleId = typeof item.bundle === "string" ? item.bundle : item.bundle._id;
      mutation.mutate({ 
        bundle_id: bundleId, 
        quantity: 0, 
        type: 'bundle' 
      });
    }
  };

  console.log("Rendering CartItemsList with items:", items);
  return (
    <div>
      {items.map((item) => (
        <div
          key={item._id}
          className={
            loadingId === item._id
              ? "opacity-50 pointer-events-none"
              : ""
          }
        >
          <CartItemCard
            item={item}
            onQuantityChange={(qty) => handleQuantityChange(item._id, qty)}
            onRemove={() => handleRemove(item._id)}
            loading={loadingId === item._id}
          />
          {loadingId === item._id && (
            <div className="text-center text-xs text-gray-400">
              <SmallLoader />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CartItemsList;
