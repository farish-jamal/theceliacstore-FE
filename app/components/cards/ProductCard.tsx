import Image from "next/image";
import React from "react";

type ProductCardProps = {
  name: string;
  price: number;
  image: string;
};

const ProductCard = ({ name, price, image }: ProductCardProps) => {
  return (
    <div className="border rounded-lg p-4 flex flex-col items-center gap-2">
      <Image
        src={image}
        alt={name}
        width={200}
        height={200}
        className="object-contain"
      />
      <h3 className="text-center text-sm">{name}</h3>
      <div className="flex items-center gap-2">
        <p className="text-base font-semibold">₹{price.toFixed(2)}</p>
        <p className="text-xs">(inclusive of all taxes)</p>
      </div>

      <div className="flex items-center justify-between w-full gap-2">
        <div className="flex items-center border rounded h-6 overflow-hidden">
          <button className="px-2 h-full flex items-center justify-center">
            -
          </button>
          <span className="border-l border-r px-3 text-sm flex items-center h-full">
            {1}
          </span>
          <button className="px-2 pb-[2px] h-full flex items-center justify-center">
            +
          </button>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-[4px]">
          <p className="text-[8.5px]">GLUTEN - FREE</p>
        </div>
      </div>

      <button className="bg-green-500 w-full text-white px-4 py-1 mt-1 rounded-[10px]">
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
