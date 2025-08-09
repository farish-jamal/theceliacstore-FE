"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Star, ShoppingCart } from "lucide-react";
import { Product } from "../../types/Product";
import { Bundle } from "../../apis/getBundles";
import { convertToNumber } from "../../utils/formatPrice";
import { useAppSelector } from "../../hooks/reduxHooks";
import { useRouter } from "next/navigation";

interface QuickViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  data: Product | Bundle;
  type: "product" | "bundle";
}

const QuickViewDialog: React.FC<QuickViewDialogProps> = ({
  isOpen,
  onClose,
  data,
  type
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const auth = useAppSelector((state) => state.auth);
  const router = useRouter();

  if (!isOpen) return null;

  const isProduct = type === "product";
  const product = isProduct ? data as Product : null;
  const bundle = !isProduct ? data as Bundle : null;

  const price = convertToNumber(isProduct ? product?.price : bundle?.price);
  const discountedPrice = convertToNumber(isProduct ? product?.discounted_price : bundle?.discounted_price);
  const images = isProduct ? product?.images : bundle?.images;
  const name = isProduct ? product?.name : bundle?.name;
  const description = isProduct ? product?.small_description : bundle?.description;
  const isInStock = isProduct ? product?.instock : true;

  const handleAddToCart = () => {
    if (!auth.user || !auth.token) {
      router.push('/login');
      return;
    }
    // TODO: Implement add to cart functionality
    console.log(`Adding ${type} to cart:`, data);
  };

  const handleViewFullDetails = () => {
    const path = isProduct ? `/products/${product?._id}` : `/bundles/${bundle?._id}`;
    router.push(path);
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Quick View</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image Section */}
            <div className="space-y-4">
              <div className="aspect-square relative overflow-hidden rounded-lg">
                <Image
                  src={images?.[selectedImage] || "/product-1.png"}
                  alt={name || ""}
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Thumbnail Images */}
              {images && images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {images.slice(0, 4).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-16 h-16 relative overflow-hidden rounded border-2 ${
                        selectedImage === index ? "border-green-500" : "border-gray-200"
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  {name}
                </h3>
                {description && (
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {description}
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-green-600">
                  ₹{discountedPrice || price}
                </span>
                {discountedPrice && discountedPrice < price && (
                  <span className="text-lg text-gray-500 line-through">
                    ₹{price}
                  </span>
                )}
                {discountedPrice && discountedPrice < price && (
                  <span className="text-sm text-green-600 font-medium">
                    {Math.round(((price - discountedPrice) / price) * 100)}% OFF
                  </span>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= 4 ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(4.0 • 150 reviews)</span>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isInStock ? "bg-green-500" : "bg-red-500"}`} />
                <span className={`text-sm ${isInStock ? "text-green-600" : "text-red-600"}`}>
                  {isInStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 hover:bg-gray-100 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 border-x border-gray-300">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!isInStock}
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
                <button
                  onClick={handleViewFullDetails}
                  className="flex-1 border border-green-600 text-green-600 py-3 px-6 rounded-lg font-medium hover:bg-green-50 transition-colors"
                >
                  View Full Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewDialog; 