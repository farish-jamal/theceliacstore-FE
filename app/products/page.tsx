"use client";
import Navbar from "../components/navbar/Navbar";
import ProductGrid from "../components/productgrid/ProductGrid";
import TopFloater from "../components/floater/TopFloater";
const page = () => {
  return (
    <>
      <TopFloater />
      <Navbar />
      <ProductGrid />
    </>
  );
};

export default page;
