import React from "react";
import Header from "./components/layout/Header";
import Navbar from "./components/navbar/Navbar";
import MainSlider from "./components/home/MainSlider";
import DietaryCategories from "./components/home/DietaryCategories";
import PopularCategories from "./components/home/PopularCategories";
import ProductGrid from "./components/home/ProductGrid";
import ReviewSection from "./components/home/ReviewSection";
import TopBrands from "./components/home/TopBrands";
import WhyChooseUs from "./components/home/WhyChooseUs";
import BlogsSection from "./components/home/BlogsSection";
import StoreInfo from "./components/home/StoreInfo";
import Footer from "./components/layout/Footer";

const HomePage = () => {
  return (
    <div className="flex-col min-h-screen">
      <Header />
      <Navbar />
      <MainSlider />
      <DietaryCategories />
      <PopularCategories />
      <ProductGrid />
      <ReviewSection />
      <TopBrands />
      <WhyChooseUs />
      <BlogsSection />
      <StoreInfo />
      <Footer />
    </div>
  );
};

export default HomePage;
