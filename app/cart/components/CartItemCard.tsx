import React from "react";
import Image from "next/image";
import { CartItem } from "@/app/types/Cart";
import { formatCurrency } from "@/app/utils/formatPrice";

export type CartItemCardProps = {
  item: CartItem;
  onQuantityChange?: (quantity: number) => void;
  onRemove?: () => void;
  loading?: boolean;
};

const CartItemCard: React.FC<CartItemCardProps> = ({ item, onQuantityChange, onRemove, loading }) => {
  const { quantity, price, total } = item;

  // Handle different item types
  const isProduct = item.type === "product";
  const isBundle = item.type === "bundle";

  // Get display properties based on item type
  const name = isProduct ? item.product.name :
    isBundle && typeof item.bundle === "object" ? item.bundle.name :
      "Bundle"; // fallback if bundle is just an ID

  const description = isProduct ? item.product.small_description :
    isBundle && typeof item.bundle === "object" ? item.bundle.description :
      "Bundle package"; // fallback

  const banner_image = isProduct ? item.product.banner_image :
    isBundle && typeof item.bundle === "object" && item.bundle.images?.[0] ? item.bundle.images[0] :
      null;

  const images = isProduct ? item.product.images :
    isBundle && typeof item.bundle === "object" ? item.bundle.images :
      [];

  return (
    <div className="flex gap-4 items-center border-b py-4">
      <Image
        src={banner_image || (images?.[0]) || "/product-1.png"}
        alt={name}
        width={80}
        height={80}
        className="object-cover rounded w-20 h-20"
      />
      <div className="flex-1">
        <div className="font-semibold text-base mb-1">{name}</div>
        <div className="text-xs text-gray-500 mb-2 line-clamp-2">
          {description}
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-green-700">₹{formatCurrency(price)}</span>
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center border rounded h-8 overflow-hidden bg-gray-50">
          <button
            className="px-2 h-full flex items-center justify-center text-lg cursor-pointer hover:bg-gray-200 transition-colors"
            onClick={() => onQuantityChange && onQuantityChange(quantity - 1)}
            disabled={quantity <= 1 || loading}
            style={{ pointerEvents: loading ? 'none' : 'auto' }}
          >
            -
          </button>
          <span className="border-l border-r px-3 text-base flex items-center h-full min-w-[32px] justify-center">
            {loading ? <span className="inline-block w-4 h-4 border-2 border-gray-300 border-t-green-500 rounded-full animate-spin"></span> : quantity}
          </span>
          <button
            className="px-2 h-full flex items-center justify-center text-lg cursor-pointer hover:bg-gray-200 transition-colors"
            onClick={() => onQuantityChange && onQuantityChange(quantity + 1)}
            disabled={loading}
            style={{ pointerEvents: loading ? 'none' : 'auto' }}
          >
            +
          </button>
        </div>
        <button
          className="text-xs text-red-500 hover:underline mt-1"
          onClick={onRemove}
          disabled={loading}
          style={{ pointerEvents: loading ? 'none' : 'auto' }}
        >
          Remove
        </button>
      </div>
      <div className="font-semibold text-base min-w-[60px] text-right">₹{formatCurrency(total)}</div>
    </div>
  );
};

export default CartItemCard;
