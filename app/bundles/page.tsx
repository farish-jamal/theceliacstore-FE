"use client";
import Navbar from "../components/navbar/Navbar";
import BundleGrid from "../components/bundlegrid/BundleGrid";
import TopFloater from "../components/floater/TopFloater";
import Footer from "../components/layout/Footer";
import StoreInfo from "../components/home/StoreInfo";

const page = () => {
  return (
    <>
      <TopFloater />
      <Navbar />
      <BundleGrid />
      <StoreInfo />
      <Footer />
    </>
  );
};

export default page;
