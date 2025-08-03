import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/app/hooks/reduxHooks";
import { showSnackbar } from "@/app/slices/snackbarSlice";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProductInCart } from "@/app/apis/updateProductInCart";
import { motion, AnimatePresence } from "framer-motion";
import { formatPrice } from "../../utils/formatPrice";

interface CartResponse {
  success: boolean;
  message?: string;
  data?: unknown;
}

type ProductCardProps = {
  name: string;
  price: number;
  image: string;
  productId: string;
  tags?: string[];
  onClick?: () => void;
  instock?: boolean;
};

const ProductCard = ({ name, price, image, productId, tags = [], onClick, instock = true }: ProductCardProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const auth = useAppSelector((state) => state.auth);
  
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  // Debug logging
  console.log("ProductCard tags:", tags);
  console.log("ProductCard name:", name);

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

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on quantity controls or add to cart button
    if ((e.target as HTMLElement).closest('.quantity-controls') || 
        (e.target as HTMLElement).closest('.add-to-cart-btn')) {
      e.stopPropagation();
      return;
    }
    
    if (onClick) {
      onClick();
    } else {
      router.push(`/products/${productId}`);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!auth.user || !auth.token) {
      // Redirect to login with current page as redirect parameter
      const currentPath = window.location.pathname;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    if (!instock) return;

    setIsAddingToCart(true);
    addToCartMutation.mutate({
      product_id: productId,
      quantity: quantity,
      type: 'product'
    });
  };

  const handleQuantityChange = (e: React.MouseEvent, change: number) => {
    e.stopPropagation();
    setQuantity(prev => Math.max(1, prev + change));
  };

  // Filter out valid tags that have corresponding images
  const validTags = tags.filter(tag => tagImageMap[tag]);

  return (
    <>
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

      <div
        className="border rounded-lg p-5 flex flex-col cursor-pointer items-center gap-2 h-full transition-transform duration-200 hover:shadow-lg group relative"
        onClick={handleCardClick}
      >
        {/* Tag images on top left - only show if there are valid tags */}
        {validTags.length > 0 && (
          <div className="absolute top-4 left-4 flex flex-wrap gap-1.5 z-10 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-md border border-gray-200">
            {validTags.map((tag) => (
              <div key={tag} className="relative group/tag">
                <Image
                  src={tagImageMap[tag]}
                  alt={tag.replace(/_/g, ' ')}
                  width={24}
                  height={24}
                  className="w-6 h-6 object-contain transition-transform duration-200 group-hover/tag:scale-110"
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

        <Image
          src={image}
          alt={name}
          width={200}
          height={200}
          className="object-cover w-[200px] h-[200px] transition-transform duration-200 group-hover:scale-110"
          style={{ width: "200px", height: "200px" }}
        />
        <h3 className="text-center text-sm min-h-[2.5em] flex items-center justify-center w-full">
          {name}
        </h3>
        <div className="flex items-center gap-2">
          <p className="text-base font-semibold">₹{formatPrice(price)}</p>
          <p className="text-xs">(inclusive of all taxes)</p>
        </div>
        <div className="flex flex-1" />
        <div className="flex flex-col w-full gap-2 mt-auto">
          <div className="flex items-center justify-between w-full gap-2 quantity-controls">
            <div className="flex items-center border rounded h-6 overflow-hidden">
              <button 
                className="px-2 h-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                onClick={(e) => handleQuantityChange(e, -1)}
                disabled={isAddingToCart || quantity <= 1}
              >
                -
              </button>
              <span className="border-l border-r px-3 text-sm flex items-center h-full min-w-[20px] justify-center">
                {isAddingToCart ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-3 h-3 border border-gray-400 border-t-green-500 rounded-full"
                  />
                ) : (
                  quantity
                )}
              </span>
              <button 
                className="px-2 pb-[2px] h-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                onClick={(e) => handleQuantityChange(e, 1)}
                disabled={isAddingToCart}
              >
                +
              </button>
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            disabled={isAddingToCart || !instock}
            className={`add-to-cart-btn w-full text-white px-4 py-1 rounded-[10px] font-medium transition-colors ${
              isAddingToCart || !instock
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {isAddingToCart ? (
              <div className="flex items-center justify-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-3 h-3 border-2 border-white border-t-transparent rounded-full"
                />
                Adding...
              </div>
            ) : !instock ? (
              "Out of Stock"
            ) : (
              "Add to Cart"
            )}
          </motion.button>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
