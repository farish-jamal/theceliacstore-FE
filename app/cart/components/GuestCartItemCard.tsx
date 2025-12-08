import React from "react";
import Image from "next/image";
import { GuestCartItem, GuestProductCartItem, GuestBundleCartItem } from "@/app/types/GuestCart";
import { formatCurrency } from "@/app/utils/formatPrice";

export type GuestCartItemCardProps = {
  item: GuestCartItem;
  onQuantityChange?: (quantity: number) => void;
  onRemove?: () => void;
  loading?: boolean;
};

const GuestCartItemCard: React.FC<GuestCartItemCardProps> = ({ 
  item, 
  onQuantityChange, 
  onRemove, 
  loading 
}) => {
  const { quantity, price, total } = item;

  // Handle different item types
  const isProduct = item.type === "product";
  const isBundle = item.type === "bundle";

  // Get display properties based on item type
  const getDisplayData = () => {
    if (isProduct) {
      const productItem = item as GuestProductCartItem;
      let name = productItem.product.name;
      let description = productItem.product.small_description;
      
      // If variant is selected, show variant name
      if (productItem.variant_sku && productItem.product.variants) {
        const variant = productItem.product.variants.find(v => v.sku === productItem.variant_sku);
        if (variant) {
          name = `${name} (${variant.name})`;
        }
      }
      
      const banner_image = productItem.product.banner_image;
      const images = productItem.product.images || [];
      
      return { name, description, banner_image, images };
    } else if (isBundle) {
      const bundleItem = item as GuestBundleCartItem;
      return {
        name: bundleItem.bundle.name,
        description: bundleItem.bundle.description,
        banner_image: bundleItem.bundle.images?.[0] || null,
        images: bundleItem.bundle.images || [],
      };
    }
    
    return {
      name: "Item",
      description: "",
      banner_image: null,
      images: [],
    };
  };

  const { name, description, banner_image, images } = getDisplayData();

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
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-gray-300 border-t-green-500 rounded-full animate-spin"></span>
            ) : (
              quantity
            )}
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
      <div className="font-semibold text-base min-w-[60px] text-right">
        ₹{formatCurrency(total)}
      </div>
    </div>
  );
};

export default GuestCartItemCard;

