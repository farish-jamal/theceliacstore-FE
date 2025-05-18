"use client";
import Navbar from "../components/navbar/Navbar";
import ProductGrid from "../components/productgrid/ProductGrid";
import TopFloater from "../components/floater/TopFloater";
import Footer from "../components/layout/Footer";
import StoreInfo from "../components/home/StoreInfo";
const page = () => {
  return (
    <>
      <TopFloater />
      <Navbar />
      <ProductGrid />
      <StoreInfo />
      <Footer />
    </>
  );
};

export default page;
