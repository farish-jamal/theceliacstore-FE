"use client";
import Navbar from "../components/navbar/Navbar";
import BundleGrid from "../components/bundlegrid/BundleGrid";
import TopFloater from "../components/floater/TopFloater";
import Footer from "../components/layout/Footer";
import StoreInfo from "../components/home/StoreInfo";
import BundleActiveFilters from "../components/filters/BundleActiveFilters";
import { useBundleFilters } from "../hooks/useBundleFilters";
import { useState, useEffect } from "react";
import { getCategories, getBrands, getSubCategories, Category, Brand, SubCategory } from "../apis/getProducts";

const BundlesPage = () => {
  const { filters, updateFilter } = useBundleFilters();
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

  const handleRemoveFilter = (key: string, value?: string | number | boolean | string[]) => {
    // Use a more direct approach to avoid TypeScript issues
    const updateFilterAny = updateFilter as (key: string, value: any) => void;
    
    if (key === "category" || key === "sub_category" || key === "brands") {
      // For array-based filters, pass the updated array
      updateFilterAny(key, value);
    } else {
      // For other filters, clear them by setting to undefined
      updateFilterAny(key, undefined);
    }
  };

  return (
    <>
      <TopFloater />
      <Navbar />
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 pt-3">
          <BundleActiveFilters 
            filters={filters} 
            onRemoveFilter={handleRemoveFilter}
            categories={categories}
            brands={brands}
            subCategories={subCategories}
          />
        </div>
      </div>
      <BundleGrid />
      <StoreInfo />
      <Footer />
    </>
  );
};

export default BundlesPage;
