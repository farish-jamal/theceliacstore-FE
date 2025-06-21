import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";

type ProductCardProps = {
  name: string;
  price: number;
  image: string;
  productId: string;
  tags?: string[];
  onClick?: () => void;
};

const ProductCard = ({ name, price, image, productId, tags = [], onClick }: ProductCardProps) => {
  const router = useRouter();

  // Debug logging
  console.log("ProductCard tags:", tags);
  console.log("ProductCard name:", name);

  // Mapping of tags to their corresponding image files
  const tagImageMap: Record<string, string> = {
    no_palm_oil: "/no_palm_oil.png",
    organic: "/organic.png",
    no_gmo: "/no_gmo.png",
    no_aritificial_flavors: "/no_artifical.png",
    vegan: "/vegan.png",
    sugar_free: "/suger_free.png",
    gluten_free: "/gluten_free.png",
    soya_free: "/soya_free.png",
    no_preservatives: "/no_preservation.png",
    lactose_free: "/lactoase_free.png",
    no_flavor_enhancer: "/no_free_enhancer.png"
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push(`/products/${productId}`);
    }
  };

  // Filter out valid tags that have corresponding images
  const validTags = tags.filter(tag => tagImageMap[tag]);

  return (
    <div
      className="border rounded-lg p-5 flex flex-col cursor-pointer items-center gap-2 h-full transition-transform duration-200 hover:shadow-lg group relative"
      onClick={handleCardClick}
    >
      {/* Tag images on top left - only show if there are valid tags */}
      {validTags.length > 0 && (
        <div className="absolute top-4 left-4 flex flex-wrap gap-1.5 z-10 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-md border border-gray-200">
          {validTags.map((tag) => (
            <div key={tag} className="relative group/tag">
              <Image
                src={tagImageMap[tag]}
                alt={tag.replace(/_/g, ' ')}
                width={24}
                height={24}
                className="w-6 h-6 object-contain transition-transform duration-200 group-hover/tag:scale-110"
              />
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover/tag:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20">
                {tag.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
              </div>
            </div>
          ))}
        </div>
      )}

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
        </div>
        <button className="bg-green-500 w-full text-white px-4 py-1 rounded-[10px]">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
