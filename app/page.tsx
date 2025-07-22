"use client";

import React, { useState, useEffect } from "react";
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
import { ProductParams } from "./types/Product";
import { getCategories } from "./apis/getCategories";

// Temporary Category type until a shared one is created
interface Category {
  _id: string;
  name: string;
  description: string;
  discount_label_text?: string;
  meta_data?: Record<string, unknown>;
  newly_launched?: boolean;
  is_active?: boolean;
  images: string[];
  tags?: string;
  createdAt?: string;
  updatedAt?: string;
}

const HomePage = () => {
  const [params, setParams] = useState<ProductParams>({
    page: 1,
    per_page: 10,
    category: "",
  });
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategories()
      .then((data) => {
        setCategories(data.data.categories || []);
      })
      .catch(() => {
        // Optionally handle error
      })
      .finally(() => {
        // Remove loadingCategories and its setter
      });
  }, []);

  return (
    <div className="flex-col min-h-screen">
      <Header />
      <Navbar />
      <MainSlider />
      <DietaryCategories />
      <PopularCategories params={params} setParams={setParams} categories={categories} />
      <ProductGrid params={params} />
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
