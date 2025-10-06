import React, { useRef } from "react";
import ProductCard from "../cards/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../../apis/getProducts";
import { ProductParams } from "../../types/Product";
import PrimaryLoader from "../loaders/PrimaryLoader";

interface ProductSliderProps {
  title: string;
  image: string;
  fetchBestSellers?: boolean;
}

const ProductSlider = ({ title, image, fetchBestSellers = false }: ProductSliderProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);

  // Set up query parameters
  const queryParams: ProductParams = {
    page: 1,
    per_page: 10,
    ...(fetchBestSellers && { is_best_seller: true })
  };

  // Fetch products using React Query
  const {
    data: productsData,
    isLoading,
    error
  } = useQuery({
    queryKey: ["products", queryParams],
    queryFn: async () => await getProducts({ params: queryParams }),
    enabled: fetchBestSellers, // Only fetch when fetchBestSellers is true
    select: (data) => data?.data?.data || [],
  });

  const products = productsData || [];

  const scrollLeft = () => {
    if (sliderRef.current) {
      const scrollAmount = 280;
      const start = sliderRef.current.scrollLeft;
      const target = start - scrollAmount;
      animateScroll(start, target);
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      const scrollAmount = 280;
      const start = sliderRef.current.scrollLeft;
      const target = start + scrollAmount;
      animateScroll(start, target);
    }
  };

  const animateScroll = (start: number, target: number) => {
    if (!sliderRef.current) return;
    
    const duration = 300;
    const startTime = performance.now();
    
    const animateStep = (timestamp: number) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = easeOutCubic(progress);
      const currentPosition = start + (target - start) * easeProgress;
      
      if (sliderRef.current) {
        sliderRef.current.scrollLeft = currentPosition;
      }
      
      if (progress < 1) {
        requestAnimationFrame(animateStep);
      }
    };
    
    requestAnimationFrame(animateStep);
  };
  
  const easeOutCubic = (x: number): number => {
    return 1 - Math.pow(1 - x, 3);
  };

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">{title}</h2>

        <div className="relative">
          <button
            className="absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md z-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
            onClick={scrollLeft}
            aria-label="Previous products"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <div
            ref={sliderRef}
            className="flex overflow-x-auto gap-5 px-5 py-2 transition-all duration-300 ease-out"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {fetchBestSellers ? (
              isLoading ? (
                <div className="flex items-center justify-center w-full">
                  <PrimaryLoader />
                </div>
              ) : error ? (
                <div className="flex items-center justify-center w-full text-gray-500">
                  Failed to load products
                </div>
              ) : products.length > 0 ? (
                products.map((product) => {
                  // Calculate stock status the same way as product detail page
                  const isInStock = product.inventory ? product.inventory > 0 : product.instock;
                  
                  return (
                    <div key={product._id} className="flex-none w-[260px] transform transition-transform duration-300 hover:scale-105">
                      <ProductCard
                        name={product.name}
                        price={typeof product.price === 'number' ? product.price : parseFloat(product.price.$numberDecimal)}
                        image={product.images?.[0] || image}
                        productId={product._id || ''}
                        tags={product.tags || []}
                        instock={isInStock}
                      />
                    </div>
                  );
                })
              ) : (
                <div className="flex items-center justify-center w-full text-gray-500">
                  No best sellers found
                </div>
              )
            ) : (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex-none w-[260px] transform transition-transform duration-300 hover:scale-105">
                  <ProductCard
                    name="24 Mantra Organic Jaggery Powder 500GM"
                    price={80}
                    image={image}
                    productId={`slider-product-${i}`}
                    tags={[]}
                    instock={true}
                  />
                </div>
              ))
            )}
          </div>

          <button
            className="absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md z-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
            onClick={scrollRight}
            aria-label="Next products"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </div>
  );
};

export default ProductSlider;
