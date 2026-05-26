"use client";

import React, { useState } from "react";
import Navbar from "./components/navbar/Navbar";
import HomeProductGrid from "./components/home/HomeProductGrid";
import ReviewSection from "./components/home/ReviewSection";
import TopBrands from "./components/home/TopBrands";
import WhyChooseUs from "./components/home/WhyChooseUs";
import StoreInfo from "./components/home/StoreInfo";
import Footer from "./components/layout/Footer";
import { ArrowRight, WheatOff, MilkOff, Leaf } from "lucide-react";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const router = useRouter();
  const [dietaryFilter, setDietaryFilter] = useState<string | null>(null);

  const handleViewAllBundles = () => {
    router.push('/bundles');
  };

  return (
    <div className="flex-col min-h-screen">
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      {/* A) Delivery strip */}
      <div style={{ background: '#1b4332' }} className="py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 sm:gap-8">
          <div className="flex-1 text-center">
            <p className="text-sm font-medium text-[#d8f3dc]">Delivering across India</p>
            <p className="text-xs text-[#95d5b2]">Pan-India shipping on all orders</p>
          </div>
          <div className="hidden sm:block w-px h-7 bg-[#2d6a4f]" />
          <div className="flex-1 text-center">
            <p className="text-sm font-medium text-[#d8f3dc]">Celiac Friendly — verified</p>
            <p className="text-xs text-[#95d5b2]">Trusted, backed & certified</p>
          </div>
          <div className="hidden sm:block w-px h-7 bg-[#2d6a4f]" />
          <div className="flex-1 text-center">
            <p className="text-sm font-medium text-[#d8f3dc]">500+ products</p>
            <p className="text-xs text-[#95d5b2]">Health-first picks</p>
          </div>
        </div>
      </div>

      {/* B) Dietary needs tiles */}
      <section className="px-4 py-4 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm font-medium mb-3">Shop by dietary needs</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { key: 'glutenFree', label: 'Gluten Free', count: '400+', icon: <WheatOff size={24} color="#2d6a4f" /> },
              { key: 'lactoseFree', label: 'Lactose Free', icon: <MilkOff size={24} color="#2d6a4f" /> },
              { key: 'organic', label: 'Organic', count: '70+', icon: <Leaf size={24} color="#2d6a4f" /> },
            ].map(({ key, label, count, icon }) => (
              <button
                key={key}
                onClick={() => setDietaryFilter(dietaryFilter === key ? null : key)}
                className={`flex items-center gap-3 h-16 px-3 rounded-xl border text-left transition-colors ${
                  dietaryFilter === key
                    ? 'border-[#2d6a4f] bg-[#eaf6f0]'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                {icon}
                <div className="flex flex-col justify-center">
                  <p className="text-sm font-medium">{label}</p>
                  {count && <p className="text-xs text-[#2d6a4f]">{count} products</p>}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* C) Product grid with sidebar */}
      <HomeProductGrid dietaryFilter={dietaryFilter} />
      
      {/* View All Bundles Section */}
      <div className="bg-green-50 py-6 md:py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">
            Save More with Our Curated Bundles
          </h2>
          <p className="text-sm md:text-lg text-gray-600 mb-4 md:mb-8 max-w-2xl mx-auto">
            Discover our carefully curated bundles designed to save you money while providing the best gluten-free and health-conscious products.
          </p>
          <button
            onClick={handleViewAllBundles}
            className="bg-green-600 text-white px-6 py-2 md:px-8 md:py-3 rounded-full text-base md:text-lg font-medium hover:bg-green-700 transition-colors duration-200 flex items-center gap-2 mx-auto"
          >
            View All Bundles
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>
      
      <ReviewSection />
      <TopBrands />
      <WhyChooseUs />
      <StoreInfo />
      <Footer />
    </div>
  );
};

export default HomePage;
