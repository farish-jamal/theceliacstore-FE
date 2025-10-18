"use client";

import React, { useState } from "react";
import Header from "./components/layout/Header";
import Navbar from "./components/navbar/Navbar";
import MainSlider from "./components/home/MainSlider";
import DietaryCategories from "./components/home/DietaryCategories";
import PopularCategories from "./components/home/PopularCategories";
import ProductGrid from "./components/home/ProductGrid";
import ReviewSection from "./components/home/ReviewSection";
import TopBrands from "./components/home/TopBrands";
import WhyChooseUs from "./components/home/WhyChooseUs";
import StoreInfo from "./components/home/StoreInfo";
import Footer from "./components/layout/Footer";
import { ProductParams } from "./types/Product";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const [params] = useState<ProductParams>({
    page: 1,
    per_page: 10,
    category: [],
  });
  const router = useRouter();

  const handleViewAllBundles = () => {
    router.push('/bundles');
  };

  const handleShopAllProducts = () => {
    router.push('/products');
  };

  return (
    <div className="flex-col min-h-screen">
      <Header />
      <Navbar />
      <MainSlider />
      <DietaryCategories />
      <PopularCategories />
      <ProductGrid params={params} />

      <button
            onClick={handleShopAllProducts}
            className="bg-green-600 text-white px-6 py-2 md:px-10 md:py-2 rounded-full text-base md:text-lg font-medium hover:bg-green-700 transition-colors duration-200 flex items-center gap-2 mx-auto mb-5"
          >
            Shop All Products
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>
      
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
