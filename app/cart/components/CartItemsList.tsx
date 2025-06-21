import React, { useState } from "react";
import { CartItem } from "@/app/types/Cart";
import CartItemCard from "./CartItemCard";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProductInCart } from "@/app/apis/updateProductInCart";
import SmallLoader from "./SmallLoader";

export type CartItemsListProps = {
  items: CartItem[];
};

const CartItemsList: React.FC<CartItemsListProps> = ({ items }) => {
  const queryClient = useQueryClient();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const mutation = useMutation({
    mutationFn: updateProductInCart,
    onSettled: () => {
      setLoadingId(null);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const handleQuantityChange = (itemId: string, quantity: number) => {
    const item = items.find((i) => i._id === itemId);
    if (!item || !item.product._id) return;
    setLoadingId(itemId);
    mutation.mutate({ product_id: item.product._id as string, quantity });
  };

  const handleRemove = (itemId: string) => {
    const item = items.find((i) => i._id === itemId);
    if (!item || !item.product._id) return;
    setLoadingId(itemId);
    mutation.mutate({ product_id: item.product._id as string, quantity: 0 });
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
