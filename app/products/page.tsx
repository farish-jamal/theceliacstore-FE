"use client";
import Navbar from "../components/navbar/Navbar";
import ProductGrid from "../components/productgrid/ProductGrid";
import TopFloater from "../components/floater/TopFloater";
import Footer from "../components/layout/Footer";
import StoreInfo from "../components/home/StoreInfo";
import ActiveFilters from "../components/filters/ActiveFilters";
import { useProductFilters } from "../hooks/useProductFilters";
import { useState, useEffect } from "react";
import { getCategories, getBrands, getSubCategories, Category, Brand, SubCategory } from "../apis/getProducts";

const ProductsPage = () => {
  const { filters, updateFilter } = useProductFilters();
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data?.categories || []);
      } catch {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await getBrands();
        setBrands(res.data?.brands || []);
      } catch {
        setBrands([]);
      }
    };
    fetchBrands();
  }, []);

  // Fetch sub-categories when category changes
  useEffect(() => {
    const fetchSubCategories = async () => {
      if (filters.category) {
        try {
          const res = await getSubCategories(filters.category);
          setSubCategories(res.data || []);
        } catch {
          setSubCategories([]);
        }
      } else {
        setSubCategories([]);
      }
    };
    fetchSubCategories();
  }, [filters.category]);

  const handleRemoveFilter = (key: string) => {
    updateFilter(key as keyof typeof filters, undefined);
  };

  return (
    <>
      <TopFloater />
      <Navbar />
      <div className="bg-white py-4 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <ActiveFilters 
            filters={filters} 
            onRemoveFilter={handleRemoveFilter}
            categories={categories}
            brands={brands}
            subCategories={subCategories}
          />
        </div>
      </div>
      <ProductGrid />
      <StoreInfo />
      <Footer />
    </>
  );
};

export default ProductsPage;
