"use client";

import React from "react";
import PromoCard from "../cards/PromoCard";
import ProductCard from "../cards/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/app/apis/getProducts";
import { Product, ProductParams } from "@/app/types/Product";
import PrimaryLoader from "@/app/components/loaders/PrimaryLoader";
import { useRouter } from "next/navigation";
import { convertToNumber } from "../../utils/formatPrice";

type ProductGridProps = {
  params: ProductParams;
};

const ProductGrid = ({ params }: ProductGridProps) => {
  const router = useRouter();
  const {
    data: productsDataRaw = [],
    isLoading,
  } = useQuery({
    queryKey: ["products", params],
    queryFn: async () => await getProducts({ params }),
    select: (data) => data?.data || [],
  });

  // Support both array and object with data property
  const productsData: Product[] = Array.isArray(productsDataRaw)
    ? productsDataRaw
    : (productsDataRaw.data || []);

  console.log("Products Data:", productsData);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-2 sm:px-4 py-6 w-full max-w-7xl mx-auto">
      {isLoading ? (
        <div className="col-span-full"><PrimaryLoader /></div>
      ) : (
        <>
          <div>
            <PromoCard
              title="Essentials Bundle"
              subtitle="GLUTEN FREE"
              buttonText="Shop Now"
              bgColor="bg-gray-200"
              styles="h-full"
            />
          </div>

          {productsData.slice(0, 4).map((product: Product) => {
            // Calculate stock status the same way as product detail page
            const isInStock = product.inventory ? product.inventory > 0 : product.instock;
            
            return (
              <ProductCard
                key={product._id || product.name}
                name={product.name}
                price={convertToNumber(product.price)}
                image={
                  product.banner_image ||
                  (product.images && product.images[0]) ||
                  "/product-1.png"
                }
                productId={product._id || ""}
                tags={product.tags}
                instock={isInStock}
                onClick={() => product._id && router.push(`/products/${product._id}`)}
                productData={product}
              />
            );
          })}

          {productsData.slice(0, 4).map((product: Product) => {
            // Calculate stock status the same way as product detail page
            const isInStock = product.inventory ? product.inventory > 0 : product.instock;
            
            return (
              <ProductCard
                key={product._id || product.name}
                name={product.name}
                price={convertToNumber(product.price)}
                image={
                  product.banner_image ||
                  (product.images && product.images[0]) ||
                  "/product-1.png"
                }
                productId={product._id || ""}
                tags={product.tags}
                instock={isInStock}
                onClick={() => product._id && router.push(`/products/${product._id}`)}
                productData={product}
              />
            );
          })}

          {/* Static Promo - last column of second row */}
          <PromoCard
            title="Gluten- Free Indulgence"
            subtitle="NOW IN A BUNDLE"
            buttonText="Shop Now"
            bgColor="bg-yellow-300"
            textColor="text-black"
            styles="h-full"
          />
        </>
      )}
    </div>
  );
};

export default ProductGrid;
