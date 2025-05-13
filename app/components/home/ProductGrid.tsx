"use client";

import React from "react";
import PromoCard from "../cards/PromoCard";
import ProductCard from "../cards/ProductCard";

const products = Array.from({ length: 13 }, (_, i) => ({
  id: i,
  name: "24 Mantra Organic Jaggery Powder 500GM",
  price: 80,
  image: "/product-1.png",
}));

const ProductGrid = () => {
  return (
    <div className="grid grid-cols-5 gap-4 px-4 py-6 w-[90vw] max-w-full mx-auto">
      {/* Static Promo - 1st row, 1st column */}
      <div>
        <PromoCard
          title="Essentials Bundle"
          subtitle="GLUTEN FREE"
          buttonText="Shop Now"
          bgColor="bg-gray-200"
          styles="h-[80%]"
        />
      </div>

      {/* Dynamic Product Cards for rest of first row */}
      {products.slice(0, 4).map((product) => (
        <ProductCard
          key={product.id}
          name={product.name}
          price={product.price}
          image={product.image}
        />
      ))}

      {/* Dynamic Product Cards for second row */}
      {products.slice(4, 8).map((product) => (
        <ProductCard
          key={product.id}
          name={product.name}
          price={product.price}
          image={product.image}
        />
      ))}

      {/* Static Promo - last column of second row */}
      <PromoCard
        title="Gluten- Free Indulgence"
        subtitle="NOW IN A BUNDLE"
        buttonText="Shop Now"
        bgColor="bg-yellow-300"
        textColor="text-black"
        styles="h-[80%]"
      />
    </div>
  );
};

export default ProductGrid;
