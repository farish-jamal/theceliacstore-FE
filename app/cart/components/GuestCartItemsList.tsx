import React, { useState } from "react";
import { GuestCartItem } from "@/app/types/GuestCart";
import GuestCartItemCard from "./GuestCartItemCard";
import SmallLoader from "./SmallLoader";
import { useDispatch } from "react-redux";
import { showSnackbar } from "@/app/slices/snackbarSlice";
import { setGuestCart } from "@/app/slices/guestCartSlice";
import { updateGuestCartItemQuantity, removeFromGuestCart } from "@/app/utils/guestCart";

export type GuestCartItemsListProps = {
  items: GuestCartItem[];
};

const GuestCartItemsList: React.FC<GuestCartItemsListProps> = ({ items }) => {
  const dispatch = useDispatch();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleQuantityChange = (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    
    setLoadingId(itemId);
    
    try {
      const updatedCart = updateGuestCartItemQuantity(itemId, quantity);
      dispatch(setGuestCart(updatedCart));
    } catch (error) {
      console.error("Error updating cart:", error);
      dispatch(showSnackbar({
        message: "Failed to update item quantity. Please try again.",
        type: "error"
      }));
    } finally {
      setLoadingId(null);
    }
  };

  const handleRemove = (itemId: string) => {
    setLoadingId(itemId);
    
    try {
      const updatedCart = removeFromGuestCart(itemId);
      dispatch(setGuestCart(updatedCart));
      dispatch(showSnackbar({
        message: "Item removed from cart successfully",
        type: "success"
      }));
    } catch (error) {
      console.error("Error removing item:", error);
      dispatch(showSnackbar({
        message: "Failed to remove item from cart. Please try again.",
        type: "error"
      }));
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div>
      {items.map((item) => (
        <div
          key={item.id}
          className={
            loadingId === item.id
              ? "opacity-50 pointer-events-none"
              : ""
          }
        >
          <GuestCartItemCard
            item={item}
            onQuantityChange={(qty) => handleQuantityChange(item.id, qty)}
            onRemove={() => handleRemove(item.id)}
            loading={loadingId === item.id}
          />
          {loadingId === item.id && (
            <div className="text-center text-xs text-gray-400">
              <SmallLoader />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default GuestCartItemsList;

