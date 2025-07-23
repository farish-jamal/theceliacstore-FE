"use client";
import TopFloater from "@/app/components/floater/TopFloater";
import Footer from "@/app/components/layout/Footer";
import Navbar from "@/app/components/navbar/Navbar";
import React, { useState, useEffect } from "react";
import ProductSlider from "@/app/components/productsider/ProductSlider";
import FrequentlyBought from "@/app/components/frequentlybought/FrequentlyBought";
import { getBundle, Bundle } from "@/app/apis/getBundles";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { formatPrice, convertToNumber } from "@/app/utils/formatPrice";
import { useAppSelector, useAppDispatch } from "@/app/hooks/reduxHooks";
import { showSnackbar } from "@/app/slices/snackbarSlice";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProductInCart } from "@/app/apis/updateProductInCart";
import { motion, AnimatePresence } from "framer-motion";

interface CartResponse {
  success: boolean;
  message?: string;
  data?: unknown;
}

export default function BundleDetailPage() {
  const [selectedThumb, setSelectedThumb] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [bundle, setBundle] = useState<Bundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const auth = useAppSelector((state) => state.auth);
  
  const bundleId = params.id as string;

  // Add to cart mutation for bundles
  const addToCartMutation = useMutation({
    mutationFn: updateProductInCart,
    onSuccess: (response) => {
      const cartResponse = response?.response as CartResponse;
      if (cartResponse?.success) {
        setShowSuccessAnimation(true);
        dispatch(showSnackbar({ 
          message: "Bundle added to cart successfully!", 
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
          message: cartResponse?.message || "Failed to add bundle to cart", 
          type: "error" 
        }));
      }
    },
    onError: (error) => {
      console.error("Error adding bundle to cart:", error);
      dispatch(showSnackbar({ 
        message: "Failed to add bundle to cart. Please try again.", 
        type: "error" 
      }));
    },
    onSettled: () => {
      setIsAddingToCart(false);
    }
  });

  const handleAddToCart = () => {
    if (!auth.user || !auth.token) {
      // Redirect to login with current page as redirect parameter
      const currentPath = `/bundles/${bundleId}`;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    if (!bundle) return;

    setIsAddingToCart(true);
    addToCartMutation.mutate({
      bundle_id: bundle._id || bundleId,
      quantity: quantity,
      type: 'bundle'
    });
  };

  useEffect(() => {
    const fetchBundle = async () => {
      if (!bundleId) return;
      
      setLoading(true);
      try {
        const response = await getBundle(bundleId);
        console.log("Bundle detail API response:", response); // Debug log
        if (response.success && response.data) {
          setBundle(response.data);
        } else {
          setBundle(null);
        }
      } catch (error) {
        console.error("Error fetching bundle:", error);
        setBundle(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBundle();
  }, [bundleId]);

  if (loading) {
    return (
      <div className="bg-gray-50">
        <TopFloater />
        <Navbar />
        <div className="max-w-7xl mx-auto py-8 px-4">
          <div className="text-center py-10">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!bundle) {
    return (
      <div className="bg-gray-50">
        <TopFloater />
        <Navbar />
        <div className="max-w-7xl mx-auto py-8 px-4">
          <div className="text-center py-10">
            <h2 className="text-xl font-semibold mb-2">Bundle not found</h2>
            <Link href="/bundles" className="text-green-600 hover:text-green-700">
              Back to Bundles
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Convert MongoDB Decimal objects to numbers for calculations
  const bundlePrice = convertToNumber(bundle.price);
  const bundleDiscountedPrice = convertToNumber(bundle.discounted_price);
  
  const totalPrice = bundleDiscountedPrice || bundlePrice;
  const originalPrice = bundlePrice;
  const savings = originalPrice - totalPrice;
  const savingsPercentage = Math.round((savings / originalPrice) * 100);

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

  // Aggregate all unique tags from all products in the bundle
  const allTags = bundle.products?.reduce((acc: string[], item) => {
    if (item.product?.tags) {
      item.product.tags.forEach(tag => {
        if (!acc.includes(tag)) {
          acc.push(tag);
        }
      });
    }
    return acc;
  }, []) || [];

  // Filter out valid tags that have corresponding images
  const validTags = allTags.filter(tag => tagImageMap[tag]);

  return (
    <div className="bg-gray-50">
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
      
      <TopFloater />
      <Navbar />
      <div className="max-w-7xl mx-auto py-8 px-4 flex flex-col lg:flex-row gap-12">
        {/* Left: Image Gallery */}
        <div className="w-full lg:w-[45%]">
          <div className="flex gap-6">
            {/* Thumbnails on the left */}
            <div className="flex flex-col gap-3">
              {bundle.images?.map((src, idx) => (
                <div
                  key={idx}
                  className={`w-24 h-24 p-2 bg-white rounded-lg shadow-sm cursor-pointer ${
                    selectedThumb === idx ? "border-2 border-green-500" : ""
                  }`}
                >
                  <img
                    src={src}
                    alt="thumb"
                    className="w-full h-full object-contain"
                    onClick={() => setSelectedThumb(idx)}
                  />
                </div>
              ))}
            </div>
            {/* Main image */}
            <div className="flex-1 aspect-square rounded-lg max-h-[400px]">
              <img
                src={bundle.images?.[selectedThumb] || bundle.images?.[0] || ""}
                alt="main"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Right: Bundle Info */}
        <div className="w-full lg:w-[55%]">
          <div className="bg-white py-3 text-sm mb-4">
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              Home
            </Link>
            <span className="mx-2 text-gray-400">›</span>
            <Link href="/bundles" className="text-gray-500 hover:text-gray-700">
              Bundles
            </Link>
            <span className="mx-2 text-gray-400">›</span>
            <span className="text-gray-700">{bundle.name}</span>
          </div>

          <h1 className="text-2xl font-semibold mb-2">
            {bundle.name}
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
            <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded-sm text-xs font-medium">
              💰 Bundle Deal
            </span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xl font-bold text-gray-900">₹{formatPrice(totalPrice)}</span>
            <span className="text-sm text-gray-400 line-through">₹{formatPrice(originalPrice)}</span>
            <span className="text-xs text-green-600">Save ₹{formatPrice(savings)}</span>
            <span className="text-xs text-gray-500">
              (Inclusive of all taxes)
            </span>
          </div>

          <div className="bg-white rounded-lg p-4 mb-6">
            <h3 className="font-medium mb-3">Bundle Contents:</h3>
            <div className="space-y-3">
              {bundle.products?.filter(item => item.product).map((item) => {
                const product = item.product;
                
                let displayPrice = convertToNumber(product.discounted_price ?? product.price);
                let productName = product.name;
                
                // If there's a variant selected, use variant details
                if (item.variant_sku && product.variants && product.variants.length > 0) {
                  const selectedVariant = product.variants.find(v => v.sku === item.variant_sku);
                  if (selectedVariant) {
                    displayPrice = convertToNumber(selectedVariant.discounted_price ?? selectedVariant.price);
                    productName = `${product.name} (${selectedVariant.name})`;
                  }
                }
                
                return (
                  <div key={item._id} className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-gray-50 rounded-lg p-1">
                      <img
                        src={product.banner_image || product.images?.[0] || ""}
                        alt={product.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">{productName}</h4>
                      <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-medium">
                      ₹{formatPrice(displayPrice)}
                      {item.quantity > 1 && (
                        <span className="text-xs text-gray-500 block">
                          ₹{formatPrice(displayPrice * item.quantity)} total
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
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
              disabled={isAddingToCart}
              className={`flex-1 font-medium py-2.5 px-6 rounded-full text-sm transition-colors ${
                isAddingToCart
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
              ) : (
                "Add Bundle to Cart"
              )}
            </motion.button>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <div>
              <span className="font-medium text-gray-900">Bundle Type:</span>{" "}
              {bundle.name}
            </div>
            <div>
              <span className="font-medium text-gray-900">Total Items:</span>{" "}
              {bundle.products?.reduce((total, item) => total + item.quantity, 0) || 0}
            </div>
            <div>
              <span className="font-medium text-gray-900">Savings:</span>{" "}
              ₹{formatPrice(savings)} ({savingsPercentage}% off)
            </div>
          </div>
        </div>
      </div>

      {/* Bundle Description */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Bundle Description</h2>
          <p className="text-gray-600 mb-6">
            {bundle.description}
          </p>
          
          <h3 className="font-medium mb-2">Bundle Benefits:</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
            <li>Save up to {savingsPercentage}% compared to buying items individually</li>
            <li>All products are carefully curated for quality</li>
            <li>Perfect for your daily needs</li>
            <li>High-quality ingredients</li>
            <li>Convenient packaging</li>
          </ul>

          <h3 className="font-medium mb-2">Storage Instructions:</h3>
          <p className="text-gray-600">
            Store in a cool, dry place away from direct sunlight. Once opened, keep in an airtight container.
          </p>
        </div>
      </div>

      <FrequentlyBought />
      <ProductSlider title="You May Also Like" image={bundle.images?.[0] || ""} />
      <ProductSlider title="Best Sellers" image={bundle.images?.[0] || ""} />
      <Footer />
    </div>
  );
}
