"use client";
import TopFloater from "@/app/components/floater/TopFloater";
import Footer from "@/app/components/layout/Footer";
import Navbar from "@/app/components/navbar/Navbar";
import React, { useState, useEffect } from "react";
import FrequentlyBought from "@/app/components/frequentlybought/FrequentlyBought";
import { useParams, useRouter } from "next/navigation";
import { getProduct } from "@/app/apis/getProducts";
import { Product, Variant } from "@/app/types/Product";
import ProductSlider from "@/app/components/productsider/ProductSlider";
import { useAppSelector, useAppDispatch } from "@/app/hooks/reduxHooks";
import { showSnackbar } from "@/app/slices/snackbarSlice";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProductInCart } from "@/app/apis/updateProductInCart";
import { motion, AnimatePresence } from "framer-motion";
import { formatPrice } from "@/app/utils/formatPrice";

interface CartResponse {
  success: boolean;
  message?: string;
  data?: unknown;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const auth = useAppSelector((state) => state.auth);
  
  const productId = params.id as string;
  
  const [selectedThumb, setSelectedThumb] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: updateProductInCart,
    onSuccess: (response) => {
      const cartResponse = response?.response as CartResponse;
      if (cartResponse?.success) {
        setShowSuccessAnimation(true);
        dispatch(showSnackbar({ 
          message: "Product added to cart successfully!", 
          type: "success" 
        }));
        // Invalidate cart query to refresh cart data
        queryClient.invalidateQueries({ queryKey: ["cart"] });
        
        // Hide success animation after 1.5 seconds and redirect to cart
        setTimeout(() => {
          setShowSuccessAnimation(false);
          router.push('/cart');
        }, 1500);
      } else {
        dispatch(showSnackbar({ 
          message: cartResponse?.message || "Failed to add product to cart", 
          type: "error" 
        }));
      }
    },
    onError: (error) => {
      console.error("Error adding to cart:", error);
      dispatch(showSnackbar({ 
        message: "Failed to add product to cart. Please try again.", 
        type: "error" 
      }));
    },
    onSettled: () => {
      setIsAddingToCart(false);
    }
  });

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      
      setLoading(true);
      try {
        const response = await getProduct(productId);
        const productData = response.data || null;
        setProduct(productData);
        
        // Auto-select first variant if available
        if (productData?.variants && productData.variants.length > 0) {
          setSelectedVariant(productData.variants[0]);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Reset thumbnail selection when variant changes
  useEffect(() => {
    setSelectedThumb(0);
  }, [selectedVariant]);

  const handleAddToCart = () => {
    if (!auth.user || !auth.token) {
      // Redirect to login with current page as redirect parameter
      const currentPath = `/products/${productId}`;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    if (!product) return;

    // Check if variant selection is required and selected
    if (product.variants && product.variants.length > 0 && !selectedVariant) {
      dispatch(showSnackbar({ 
        message: "Please select a variant before adding to cart", 
        type: "error" 
      }));
      return;
    }

    setIsAddingToCart(true);
    addToCartMutation.mutate({
      product_id: product._id || productId,
      quantity: quantity,
      variant_id: selectedVariant?._id
    });
  };

  if (loading) {
    return (
      <div className="bg-gray-50">
        <TopFloater />
        <Navbar />
        <div className="max-w-7xl mx-auto py-8 px-4">
          <div className="text-center py-10">Loading...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-gray-50">
        <TopFloater />
        <Navbar />
        <div className="max-w-7xl mx-auto py-8 px-4">
          <div className="text-center py-10">Product not found</div>
        </div>
      </div>
    );
  }

  const allImages = [product.banner_image, ...(product.images || [])].filter(Boolean);
  
  // Use variant images if a variant is selected, otherwise use product images
  const displayImages = selectedVariant && selectedVariant.images && selectedVariant.images.length > 0
    ? selectedVariant.images
    : allImages;

  // Mapping of tags to their corresponding image files
  const tagImageMap: Record<string, string> = {
    no_palm_oil: "/no_palm_oil.png",
    organic: "/organic.png",
    no_gmo: "/no_gmo.png",
    no_aritificial_flavors: "/no_artifical.png",
    vegan: "/vegan.png",
    sugar_free: "/suger_free.png",
    gluten_free: "/gluten_free.png",
    soya_free: "/soya_free.png",
    no_preservatives: "/no_preservation.png",
    lactose_free: "/lactoase_free.png",
    no_flavor_enhancer: "/no_free_enhancer.png"
  };

  // Filter out valid tags that have corresponding images
  const validTags = product.tags?.filter(tag => tagImageMap[tag]) || [];

  // Check if product has variants
  const hasVariants = product.variants && product.variants.length > 0;
  const isVariantInStock = selectedVariant ? selectedVariant.inventory > 0 : (product.inventory ? product.inventory > 0 : product.instock);

  // Determine what price to show
  const showVariantPricing = hasVariants && selectedVariant;
  const displayPrice = showVariantPricing ? selectedVariant!.discounted_price || selectedVariant!.price : product.discounted_price || product.price;
  const displayOriginalPrice = showVariantPricing ? selectedVariant!.price : product.price;
  const displayDiscountPercentage = displayPrice && displayOriginalPrice && displayPrice < displayOriginalPrice
    ? Math.round(((displayOriginalPrice - displayPrice) / displayOriginalPrice) * 100)
    : 0;

  return (
    <div className="bg-gray-50">
      <TopFloater />
      <Navbar />
      
      {/* Success Animation Overlay */}
      <AnimatePresence>
        {showSuccessAnimation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="bg-green-500 text-white rounded-full p-8 shadow-2xl"
            >
              <motion.svg
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-16 h-16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </motion.svg>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto py-8 px-4 flex flex-col lg:flex-row gap-12">
        {/* Left: Image Gallery */}
        <div className="w-full lg:w-[45%]">
          <div className="flex gap-6">
            {/* Thumbnails on the left */}
            <div className="flex flex-col gap-3">
              {displayImages.map((src, idx) => (
                <div
                  key={idx}
                  className={`w-24 h-24 p-2 bg-white rounded-lg shadow-sm cursor-pointer ${
                    selectedThumb === idx ? "border-2 border-green-500" : ""
                  }`}
                >
                  <img
                    src={src}
                    alt={`${product.name} ${idx + 1}`}
                    className="w-full h-full object-contain"
                    onClick={() => setSelectedThumb(idx)}
                  />
                </div>
              ))}
            </div>
            {/* Main image */}
            <div className="flex-1 aspect-square rounded-lg max-h-[400px]">
              <img
                src={displayImages[selectedThumb]}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
        {/* Right: Product Info */}
        <div className="w-full lg:w-[55%]">
          <h1 className="text-2xl font-semibold mb-2">
            {product.name}
          </h1>
          
          {/* Tag images after title */}
          {validTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {validTags.map((tag) => (
                <div key={tag} className="relative group/tag">
                  <img
                    src={tagImageMap[tag]}
                    alt={tag.replace(/_/g, ' ')}
                    className="w-8 h-8 object-contain transition-transform duration-200 group-hover/tag:scale-110"
                  />
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover/tag:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20">
                    {tag.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 mb-2">
            {product.is_best_seller && (
              <span className="bg-red-50 text-red-500 px-2 py-0.5 rounded-sm text-xs font-medium">
                🔥 Popular Picks
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xl font-bold text-gray-900">
              ₹{formatPrice(displayPrice)}
            </span>
            {displayPrice && displayOriginalPrice && displayPrice < displayOriginalPrice && (
              <>
                <span className="text-sm text-gray-400 line-through">
                  ₹{formatPrice(displayOriginalPrice)}
                </span>
                <span className="text-xs text-red-500">({displayDiscountPercentage}% Off)</span>
              </>
            )}
            <span className="text-xs text-gray-500">
              (Inclusive of all taxes)
            </span>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-gray-600">Brand:</span>
            <div className="ml-auto flex gap-3 items-center text-gray-400">
              <button className="hover:text-gray-600">
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M13.5 3a1.5 1.5 0 0 0-3 0h3zM12 22a1 1 0 0 0 1-1h-2a1 1 0 0 0 1 1zm7-3a1 1 0 0 0 0-2v2zM5 19a1 1 0 0 0 0-2v2zm7-16v16h2V3h-2zm8 16v-2h-2v2h2zm-16 0h16v-2H4v2z" />
                </svg>
              </button>
              <button className="hover:text-gray-600">
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                </svg>
              </button>
              <button className="hover:text-gray-600">
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
                </svg>
              </button>
            </div>
          </div>
          <p className="text-gray-600 mb-6 text-sm leading-relaxed">
            {product.small_description}
          </p>
          
          {/* Variant Selection */}
          {hasVariants && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Select Variant:</h3>
              <div className="flex flex-wrap gap-3">
                {product.variants?.map((variant) => (
                  <button
                    key={variant._id}
                    onClick={() => setSelectedVariant(variant)}
                    disabled={!variant.inventory || variant.inventory <= 0}
                    className={`px-6 py-3 rounded-full border-2 text-sm font-medium transition-all ${
                      selectedVariant?._id === variant._id
                        ? "border-green-500 bg-green-50 text-green-700"
                        : variant.inventory && variant.inventory > 0
                        ? "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                        : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-medium">{variant.name}</div>
                      <div className="text-xs font-medium">
                        ₹{formatPrice(variant.discounted_price || variant.price)}
                      </div>
                      {variant.discounted_price && variant.price > variant.discounted_price && (
                        <div className="text-xs text-gray-400 line-through">
                          ₹{formatPrice(variant.price)}
                        </div>
                      )}
                      {(!variant.inventory || variant.inventory <= 0) && (
                        <div className="text-xs text-red-500">Out of Stock</div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              {!selectedVariant && (
                <p className="text-red-500 text-sm mt-2">Please select a variant to continue</p>
              )}
            </div>
          )}
          
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center border border-gray-300 rounded-full">
              <button
                className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-700"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={isAddingToCart}
              >
                –
              </button>
              <input
                type="number"
                value={quantity}
                min={1}
                readOnly
                className="w-12 h-10 text-center border-x border-gray-300 bg-transparent"
              />
              <button
                className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-700"
                onClick={() => setQuantity((q) => q + 1)}
                disabled={isAddingToCart}
              >
                +
              </button>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={isAddingToCart || !isVariantInStock || (hasVariants && !selectedVariant)}
              className={`flex-1 font-medium py-2.5 px-6 rounded-full text-sm transition-colors relative overflow-hidden ${
                isAddingToCart || !isVariantInStock || (hasVariants && !selectedVariant)
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {isAddingToCart ? (
                <div className="flex items-center justify-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                  Adding...
                </div>
              ) : !isVariantInStock ? (
                "Out of Stock"
              ) : hasVariants && !selectedVariant ? (
                "Select Variant"
              ) : (
                "Add to Cart"
              )}
            </motion.button>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <div>
              <span className="font-medium text-gray-900">Stock:</span>{" "}
              {isVariantInStock ? "In Stock" : "Out of Stock"}
            </div>
            {selectedVariant && (
              <div>
                <span className="font-medium text-gray-900">Selected Variant:</span>{" "}
                {selectedVariant.name}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-4 mt-8">
        <div className="flex border-b justify-center items-center">
          <button className="px-6 py-3 text-gray-500 hover:text-gray-700">
            Descriptions
          </button>
          <button className="px-6 py-3 border-b-2 border-green-500 text-green-600 font-medium">
            Additional Information
          </button>
          <button className="px-6 py-3 text-gray-500 hover:text-gray-700">
            Reviews
          </button>
        </div>
        <div className="flex flex-col lg:flex-row gap-12 py-8 px-[10%]">
          <div className="w-full lg:w-1/2 text-sm space-y-3">
            <div className="flex">
              <span className="w-40 text-gray-600">Variant:</span>{" "}
              <span>{selectedVariant?.name || "N/A"}</span>
            </div>
            <div className="flex">
              <span className="w-40 text-gray-600">Type:</span>{" "}
              <span>Gluten Free</span>
            </div>
            <div className="flex">
              <span className="w-40 text-gray-600">Category:</span>{" "}
              <span>Flour</span>
            </div>
            <div className="flex">
              <span className="w-40 text-gray-600">Stock Status:</span>{" "}
              <span>{isVariantInStock ? "Available" : "Out of Stock"}</span>
            </div>
            <div className="flex">
              <span className="w-40 text-gray-600">Manufactured by:</span>{" "}
              <span>xyz</span>
            </div>
            <div className="flex">
              <span className="w-40 text-gray-600">Manufacturer Address:</span>{" "}
              <span>xyz</span>
            </div>
            <div className="flex">
              <span className="w-40 text-gray-600">Date of MFD:</span>{" "}
              <span>xyz</span>
            </div>
            <div className="flex">
              <span className="w-40 text-gray-600">Expire Date:</span>{" "}
              <span>xyz</span>
            </div>
            <div className="flex">
              <span className="w-40 text-gray-600">Customer Care:</span>{" "}
              <span>xyz</span>
            </div>
            <div className="flex">
              <span className="w-40 text-gray-600">Batch Number:</span>{" "}
              <span>xyz</span>
            </div>
            <div className="flex">
              <span className="w-40 text-gray-600">Country of Origin:</span>{" "}
              <span>xyz</span>
            </div>
            <div className="mt-6 flex items-center  justify-center gap-3 border py-6 px-4 rounded-lg max-w-fit">
              <div className="w-10 h-10 rounded-full items-center justify-center">
                <img
                  src="https://res.cloudinary.com/dacwig3xk/image/upload/fl_preserve_transparency/v1747550786/Vector_ru0gp0.jpg?_s=public-apps"
                  alt="Wheafree"
                  className="h-10"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-medium">100% Gluten Free</span>
                <span className="text-gray-500">Certified Gluten Free</span>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="aspect-square -mt-10 rounded-lg max-h-[450px]">
              <img
                src={"https://res.cloudinary.com/dacwig3xk/image/upload/v1748809663/uploads/images/a7qwl65t93onu0ino3pg.png"}
                alt="back"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
      <FrequentlyBought />
      <ProductSlider title="Recommended for you" image={"https://res.cloudinary.com/dacwig3xk/image/upload/v1748809663/uploads/images/a7qwl65t93onu0ino3pg.png"} />
      <ProductSlider title="Best Sellers" image={"https://res.cloudinary.com/dacwig3xk/image/upload/v1748809663/uploads/images/a7qwl65t93onu0ino3pg.png"} />
      <Footer />
    </div>
  );
}




