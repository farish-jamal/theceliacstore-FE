import Image from "next/image";
import React from "react";

type ProductCardProps = {
  name: string;
  price: number;
  image: string;
  onClick?: () => void;
};

const ProductCard = ({ name, price, image, onClick }: ProductCardProps) => {
  return (
    <div
      className="border rounded-lg p-4 flex flex-col cursor-pointer items-center gap-2 h-full transition-transform duration-200 hover:scale-105 hover:shadow-lg hover:border-green-500 group"
      onClick={onClick}
    >
      <Image
        src={image}
        alt={name}
        width={200}
        height={200}
        className="object-cover w-[200px] h-[200px] transition-transform duration-200 group-hover:scale-110"
        style={{ width: "200px", height: "200px" }}
      />
      <h3 className="text-center text-sm min-h-[2.5em] flex items-center justify-center w-full">
        {name}
      </h3>
      <div className="flex items-center gap-2">
        <p className="text-base font-semibold">₹{price.toFixed(2)}</p>
        <p className="text-xs">(inclusive of all taxes)</p>
      </div>
      <div className="flex flex-1" />
      <div className="flex flex-col w-full gap-2 mt-auto">
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
        <button className="bg-green-500 w-full text-white px-4 py-1 rounded-[10px]">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
