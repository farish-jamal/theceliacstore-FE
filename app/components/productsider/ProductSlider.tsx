import React, { useRef } from "react";
import ProductCard from "../cards/ProductCard";

const ProductSlider = ({ title, image }: { title: string; image: string }) => {
  const sliderRef = useRef<HTMLDivElement>(null);

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
            {Array.from({ length: 8 }).map((_, i) => (
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
            ))}
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
