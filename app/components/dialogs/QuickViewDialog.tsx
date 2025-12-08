"use client";

import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import Image from "next/image";
import { X, Star, ShoppingCart } from "lucide-react";
import { Product } from "../../types/Product";
import { Bundle } from "../../apis/getBundles";
import { convertToNumber } from "../../utils/formatPrice";
import { useAppSelector } from "../../hooks/reduxHooks";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProductInCart } from "../../apis/updateProductInCart";
import { addProductToGuestCart, addBundleToGuestCart } from "../../utils/guestCart";
import { showSnackbar } from "@/app/slices/snackbarSlice";
import { setGuestCart } from "@/app/slices/guestCartSlice";

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
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const addToCartMutation = useMutation({
    mutationFn: updateProductInCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      dispatch(
        showSnackbar({ message: "Added to cart", type: "success" })
      );
      onClose();
    },
    onError: () => {
      dispatch(
        showSnackbar({
          message: "Failed to add to cart. Please try again.",
          type: "error",
        })
      );
    },
  });

  // Create a portal root to avoid clipping by transformed/scroll parents
  const portalElement = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const el = document.createElement('div');
    el.setAttribute('id', 'quick-view-portal');
    return el;
  }, []);

  useEffect(() => {
    if (!portalElement) return;
    document.body.appendChild(portalElement);
    return () => {
      try { document.body.removeChild(portalElement); } catch {}
    };
  }, [portalElement]);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = originalOverflow; };
  }, [isOpen]);

  if (!isOpen || !portalElement) return null;

  const isProduct = type === "product";
  const product = isProduct ? data as Product : null;
  const bundle = !isProduct ? data as Bundle : null;

  const price = convertToNumber(isProduct ? product?.price : bundle?.price);
  const discountedPrice = convertToNumber(isProduct ? product?.discounted_price : bundle?.discounted_price);
  const images = isProduct ? product?.images : bundle?.images;
  const name = isProduct ? product?.name : bundle?.name;
  const description = isProduct ? product?.small_description : bundle?.description;
  const isInStock = isProduct
    ? (product?.inventory ? product.inventory > 0 : product?.instock)
    : true;

  const handleAddToCart = () => {
    // If user is logged in, use API cart
    if (auth.user && auth.token) {
      if (isProduct && product?._id) {
        addToCartMutation.mutate({
          product_id: product._id,
          quantity,
          type: 'product',
        });
        return;
      }

      if (!isProduct && bundle?._id) {
        addToCartMutation.mutate({
          bundle_id: bundle._id,
          quantity,
          type: 'bundle',
        });
      }
    } else {
      // Guest user - use localStorage cart
      try {
        if (isProduct && product) {
          const updatedCart = addProductToGuestCart(product, quantity);
          dispatch(setGuestCart(updatedCart));
        } else if (!isProduct && bundle) {
          const updatedCart = addBundleToGuestCart(bundle, quantity);
          dispatch(setGuestCart(updatedCart));
        }
        
        dispatch(
          showSnackbar({ message: "Added to cart", type: "success" })
        );
        onClose();
      } catch (error) {
        console.error("Error adding to guest cart:", error);
        dispatch(
          showSnackbar({
            message: "Failed to add to cart. Please try again.",
            type: "error",
          })
        );
      }
    }
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

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[9999] p-2 sm:p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center py-3 px-4 sm:py-4 sm:px-6 border-b">
          <h2 className="text-lg sm:text-xl font-semibold">Quick View</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
            {/* Image Section */}
            <div className="space-y-3 sm:space-y-4">
              <div className="relative overflow-hidden rounded-lg max-w-sm mx-auto sm:max-w-none" style={{ aspectRatio: '1 / 0.7' }}>
                <Image
                  src={images?.[selectedImage] || "/product-1.png"}
                  alt={name || ""}
                  fill
                  className="object-contain"
                />
              </div>
              
              {/* Thumbnail Images */}
              {images && images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto justify-center sm:justify-start">
                  {images.slice(0, 4).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 relative overflow-hidden rounded border-2 ${
                        selectedImage === index ? "border-green-500" : "border-gray-200"
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${name} ${index + 1}`}
                        fill
                        className="object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="space-y-3 sm:space-y-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                  {name}
                </h3>
                {description && (
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {description}
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <span className="text-xl sm:text-2xl font-bold text-green-600">
                  ₹{discountedPrice || price}
                </span>
                {discountedPrice && discountedPrice < price && (
                  <span className="text-base sm:text-lg text-gray-500 line-through">
                    ₹{price}
                  </span>
                )}
                {discountedPrice && discountedPrice < price && (
                  <span className="text-xs sm:text-sm text-green-600 font-medium">
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
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!isInStock || addToCartMutation.isPending}
                  className="flex-1 bg-green-600 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {addToCartMutation.isPending ? 'Adding...' : 'Add to Cart'}
                </button>
                <button
                  onClick={handleViewFullDetails}
                  className="flex-1 border border-green-600 text-green-600 py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg font-medium hover:bg-green-50 transition-colors"
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

  return ReactDOM.createPortal(modalContent, portalElement);
};

export default QuickViewDialog; 