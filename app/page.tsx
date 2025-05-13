import React from "react";
import Header from "./components/layout/Header";
import Navbar from "./components/navbar/Navbar";
import MainSlider from "./components/home/MainSlider";
import DietaryCategories from "./components/home/DietaryCategories";
import PopularCategories from "./components/home/PopularCategories";
import ProductGrid from "./components/home/ProductGrid";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen w-full ">
      <Header />
      <Navbar />
      <MainSlider />
      <DietaryCategories />
      <PopularCategories />
      <ProductGrid />
    </div>
  );
};

export default HomePage;
