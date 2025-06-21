import React from "react";
import Link from "next/link";
import Image from "next/image";

interface BundleCardProps {
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  bundleId: string;
  productCount?: number;
}

const BundleCard: React.FC<BundleCardProps> = ({
  name,
  price,
  originalPrice,
  image,
  bundleId,
  productCount = 0,
}) => {
  const savings = originalPrice ? originalPrice - price : 0;
  const savingsPercentage = originalPrice ? Math.round((savings / originalPrice) * 100) : 0;

  return (
    <Link href={`/bundles/${bundleId}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer">
        <div className="relative">
          <div className="aspect-square relative overflow-hidden">
            <Image
              src={image || "/product-1.png"}
              alt={name}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          {savings > 0 && (
            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded font-semibold">
              Save {savingsPercentage}%
            </div>
          )}
          {productCount > 0 && (
            <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
              {productCount} items
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2">
            {name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-green-600">
              ₹{price.toFixed(2)}
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-sm text-gray-500 line-through">
                ₹{originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          {savings > 0 && (
            <p className="text-xs text-green-600 font-medium mt-1">
              You save ₹{savings.toFixed(2)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default BundleCard; 