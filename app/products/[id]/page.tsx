"use client";
import TopFloater from "@/app/components/floater/TopFloater";
import Footer from "@/app/components/layout/Footer";
import Navbar from "@/app/components/navbar/Navbar";
import React, { useState, useEffect } from "react";
import FrequentlyBought from "@/app/components/frequentlybought/FrequentlyBought";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { getProduct } from "@/app/apis/getProducts";
import { getReviews } from "@/app/apis/getReviews";
import { addReview } from "@/app/apis/addReview";
import { Product, Variant } from "@/app/types/Product";
import { AddReviewRequest } from "@/app/types/Review";
import ProductSlider from "@/app/components/productsider/ProductSlider";
import ProductReviewCard from "@/app/components/cards/ProductReviewCard";
import ReviewsSummary from "@/app/components/cards/ReviewsSummary";
import AddReviewForm from "@/app/components/forms/AddReviewForm";
import { useAppSelector, useAppDispatch } from "@/app/hooks/reduxHooks";
import { showSnackbar } from "@/app/slices/snackbarSlice";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { updateProductInCart } from "@/app/apis/updateProductInCart";
import { motion, AnimatePresence } from "framer-motion";
import { formatPrice, convertToNumber } from "@/app/utils/formatPrice";
import ProductDetailSkeleton from "@/app/components/loaders/ProductDetailSkeleton";

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
  const [activeTab, setActiveTab] = useState<'info' | 'reviews'>('info');
  const [showAddReviewForm, setShowAddReviewForm] = useState(false);

  // Fetch reviews
  const { data: reviewsRaw, isLoading: reviewsLoading, error: reviewsError } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => getReviews(productId),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Transform backend response (array) into summary shape expected by UI
  const reviewsData = React.useMemo(() => {
    const reviews = reviewsRaw?.data || [];
    const totalReviews = reviews.length;
    const averageRating = totalReviews
      ? reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / totalReviews
      : 0;
    const ratingDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((r) => {
      const key = Math.round(Number(r.rating) || 0) as 1|2|3|4|5;
      if (ratingDistribution[key] !== undefined) ratingDistribution[key] += 1;
    });
    return {
      data: {
        reviews,
        totalReviews,
        averageRating,
        ratingDistribution,
      },
      success: true,
    };
  }, [reviewsRaw]);

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

  // Add review mutation
  const addReviewMutation = useMutation({
    mutationFn: (reviewData: AddReviewRequest) => addReview(productId, reviewData),
    onSuccess: (response) => {
      if (response.success) {
        dispatch(showSnackbar({ 
          message: "Review submitted successfully!", 
          type: "success" 
        }));
        // Invalidate reviews query to refresh reviews data
        queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
        setShowAddReviewForm(false);
      } else {
        dispatch(showSnackbar({ 
          message: response.message || "Failed to submit review", 
          type: "error" 
        }));
      }
    },
    onError: (error) => {
      console.error("Error adding review:", error);
      dispatch(showSnackbar({ 
        message: "Failed to submit review. Please try again.", 
        type: "error" 
      }));
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
      variant_sku: selectedVariant?.sku,
      type: 'product'
    });
  };

  const getProductUrl = (): string => {
    const relativeUrl = `/products/${productId}`;
    if (typeof window !== 'undefined' && window.location?.origin) {
      return `${window.location.origin}${relativeUrl}`;
    }
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
    return `${siteUrl}${relativeUrl}`;
  };

  const copyToClipboard = async (text: string, successMessage?: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const tempInput = document.createElement('input');
        tempInput.value = text;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }
      if (successMessage) {
        dispatch(showSnackbar({ message: successMessage, type: 'success' }));
      }
    } catch {
      dispatch(showSnackbar({ message: 'Failed to copy to clipboard', type: 'error' }));
    }
  };

  const handleShare = async () => {
    const url = getProductUrl();
    const shareData: ShareData = {
      title: product?.name || 'Product',
      text: product?.small_description || 'Check this out',
      url,
    };
    try {
      if (navigator?.share) {
        await navigator.share(shareData);
      } else {
        await copyToClipboard(url, 'Product link copied to clipboard');
      }
    } catch {
      // If user cancels share, silently ignore; otherwise fallback to copy
      await copyToClipboard(url, 'Product link copied to clipboard');
    }
  };

  const handleAddReview = (reviewData: AddReviewRequest) => {
    if (!auth.user || !auth.token) {
      // Redirect to login with current page as redirect parameter
      const currentPath = `/products/${productId}`;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }
    
    addReviewMutation.mutate(reviewData);
  };

  const handleShowAddReviewForm = () => {
    if (!auth.user || !auth.token) {
      // Redirect to login with current page as redirect parameter
      const currentPath = `/products/${productId}`;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }
    
    setShowAddReviewForm(true);
  };

  if (loading) {
    return <ProductDetailSkeleton />;
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
  const formattedAllTags = product.tags?.map((tag) => tag.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())) || [];

  // Check if product has variants
  const hasVariants = product.variants && product.variants.length > 0;
  const isVariantInStock = selectedVariant ? selectedVariant.inventory > 0 : (product.inventory ? product.inventory > 0 : product.instock);

  // Determine what price to show
  const showVariantPricing = hasVariants && selectedVariant;
  const displayPrice = showVariantPricing ? selectedVariant!.discounted_price || selectedVariant!.price : product.discounted_price || product.price;
  const displayOriginalPrice = showVariantPricing ? selectedVariant!.price : product.price;
  
  // Convert to numbers for calculations
  const displayPriceNum = convertToNumber(displayPrice);
  const displayOriginalPriceNum = convertToNumber(displayOriginalPrice);
  
  const displayDiscountPercentage = displayPriceNum && displayOriginalPriceNum && displayPriceNum < displayOriginalPriceNum
    ? Math.round(((displayOriginalPriceNum - displayPriceNum) / displayOriginalPriceNum) * 100)
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
                  {src && (
                    <Image
                      src={src}
                      alt={`${product.name} ${idx + 1}`}
                      width={96}
                      height={96}
                      className="w-full h-full object-contain cursor-pointer"
                      onClick={() => setSelectedThumb(idx)}
                    />
                  )}
                </div>
              ))}
            </div>
            {/* Main image */}
            <div className="flex-1 aspect-square rounded-lg max-h-[400px]">
              {displayImages[selectedThumb] && (
                <Image
                  src={displayImages[selectedThumb]}
                  alt={product.name}
                  width={400}
                  height={400}
                  className="w-full h-full object-contain"
                />
              )}
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
                  <Image
                    src={tagImageMap[tag]}
                    alt={tag.replace(/_/g, ' ')}
                    width={32}
                    height={32}
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
            <span className="text-sm text-gray-600">{product.brand?.name}</span>
            <div className="ml-auto flex gap-3 items-center text-gray-400">
              <button
                className="hover:text-gray-600"
                aria-label="More info"
                title="More info"
                onClick={() => setActiveTab('info')}
              >
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                </svg>
              </button>
              <button
                className="hover:text-gray-600"
                aria-label="Share product"
                title="Share product"
                onClick={handleShare}
              >
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
          <button
            className={`px-6 py-3 ${activeTab === 'info' ? 'border-b-2 border-green-500 text-green-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('info')}
          >
            Additional Information
          </button>
          <button
            className={`px-6 py-3 ${activeTab === 'reviews' ? 'border-b-2 border-green-500 text-green-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews
          </button>
        </div>
        {activeTab === 'info' ? (
          <div className="flex flex-col lg:flex-row gap-12 py-8 px-[10%]">
            <div className="w-full lg:w-2/3 text-sm space-y-3">
              <div className="flex">
                <span className="w-48 text-gray-600">Variant:</span>{" "}
                <span>{selectedVariant?.name || "N/A"}</span>
              </div>
              <div className="flex">
                <span className="w-48 text-gray-600">SKU:</span>{" "}
                <span>{product.sku || "N/A"}</span>
              </div>
              <div className="flex">
                <span className="w-48 text-gray-600">Brand:</span>{" "}
                <span>{product.brand?.name || "N/A"}</span>
              </div>
              <div className="flex">
                <span className="w-48 text-gray-600">Stock Status:</span>{" "}
                <span>{isVariantInStock ? "Available" : "Out of Stock"}</span>
              </div>
              <div className="flex">
                <span className="w-48 text-gray-600">Status:</span>{" "}
                <span>{product.status || "N/A"}</span>
              </div>
              <div className="flex">
                <span className="w-48 text-gray-600">Tags:</span>{" "}
                <span>{formattedAllTags.length ? formattedAllTags.join(', ') : 'N/A'}</span>
              </div>
              <div className="flex">
                <span className="w-48 text-gray-600">Weight:</span>{" "}
                <span>{product.weight_in_grams ? `${product.weight_in_grams} g` : 'N/A'}</span>
              </div>
              <div className="flex">
                <span className="w-48 text-gray-600">Type:</span>{" "}
                <span>{product.tags?.includes('gluten_free') ? 'Gluten Free' : 'N/A'}</span>
              </div>
              <div className="flex">
                <span className="w-48 text-gray-600">Inventory:</span>{" "}
                <span>{typeof product.inventory === 'number' ? product.inventory : (isVariantInStock ? 'Available' : 'Out of Stock')}</span>
              </div>
              <div className="flex">
                <span className="w-48 text-gray-600">Best Seller:</span>{" "}
                <span>{product.is_best_seller ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex">
                <span className="w-48 text-gray-600">Price:</span>{" "}
                <span>₹{formatPrice(displayPrice)}</span>
              </div>
              {displayOriginalPrice && displayPrice && displayPrice < displayOriginalPrice && (
                <div className="flex">
                  <span className="w-48 text-gray-600">MRP:</span>{" "}
                  <span className="line-through text-gray-400">₹{formatPrice(displayOriginalPrice)}</span>
                </div>
              )}
            </div>
            
            {/* Quick Review Button in Info Tab */}
            <div className="w-full lg:w-1/3">
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Share Your Experience</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Help other customers by sharing your review of this product.
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setActiveTab('reviews');
                    setTimeout(() => {
                      handleShowAddReviewForm();
                    }, 100);
                  }}
                  disabled={addReviewMutation.isPending}
                  className="w-full px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Write a Review
                </motion.button>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8">
            {reviewsLoading ? (
              <div className="text-center py-10">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                <p className="mt-2 text-gray-500">Loading reviews...</p>
              </div>
            ) : reviewsError ? (
              <div className="text-center py-10 text-red-500">
                Failed to load reviews. Please try again later.
              </div>
            ) : reviewsData?.data ? (
              <div className="space-y-6">
                {/* Reviews Summary */}
                <ReviewsSummary reviewsData={reviewsData.data} />
                
                {/* Add Review Button */}
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Customer Reviews ({reviewsData.data.totalReviews})
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleShowAddReviewForm}
                    disabled={addReviewMutation.isPending}
                    className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Write a Review
                  </motion.button>
                </div>

                {/* Add Review Form */}
                <AnimatePresence>
                  {showAddReviewForm && (
                    <AddReviewForm
                      onSubmit={handleAddReview}
                      isSubmitting={addReviewMutation.isPending}
                      onCancel={() => setShowAddReviewForm(false)}
                    />
                  )}
                </AnimatePresence>
                
                {/* Individual Reviews */}
                {reviewsData.data.reviews.length > 0 ? (
                  <div className="grid gap-4">
                    {reviewsData.data.reviews.map((review) => (
                      <ProductReviewCard key={review._id} review={review} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <div className="text-gray-400 mb-4">
                      <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                    <p className="text-gray-500 mb-4">Be the first to review this product!</p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleShowAddReviewForm}
                      disabled={addReviewMutation.isPending}
                      className="px-6 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Write the First Review
                    </motion.button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Show review form even when no reviews data */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Customer Reviews
                    </h3>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleShowAddReviewForm}
                      disabled={addReviewMutation.isPending}
                      className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Write a Review
                    </motion.button>
                  </div>

                  {/* Add Review Form */}
                  <AnimatePresence>
                    {showAddReviewForm && (
                      <AddReviewForm
                        onSubmit={handleAddReview}
                        isSubmitting={addReviewMutation.isPending}
                        onCancel={() => setShowAddReviewForm(false)}
                      />
                    )}
                  </AnimatePresence>

                  {!showAddReviewForm && (
                    <div className="text-center py-10">
                      <div className="text-gray-400 mb-4">
                        <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                      <p className="text-gray-500 mb-4">Be the first to review this product!</p>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleShowAddReviewForm}
                        disabled={addReviewMutation.isPending}
                        className="px-6 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Write the First Review
                      </motion.button>
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>
        )}
      </div>
      <FrequentlyBought currentProductId={productId} />
      <ProductSlider
        title="Recommended for you"
        image={"https://res.cloudinary.com/dacwig3xk/image/upload/v1748809663/uploads/images/a7qwl65t93onu0ino3pg.png"}
        productIdForRecommendations={productId}
      />
      <ProductSlider title="Best Sellers" image={"https://res.cloudinary.com/dacwig3xk/image/upload/v1748809663/uploads/images/a7qwl65t93onu0ino3pg.png"} fetchBestSellers={true} />
      <Footer />
    </div>
  );
}




