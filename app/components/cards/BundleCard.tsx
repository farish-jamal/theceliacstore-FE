import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency, convertToNumber } from "@/app/utils/formatPrice";
import { MongoDBDecimal } from "@/app/types/Product";
import QuickViewButton from "../buttons/QuickViewButton";
import QuickViewDialog from "../dialogs/QuickViewDialog";
import { Bundle } from "../../apis/getBundles";

interface BundleCardProps {
  name: string;
  price: MongoDBDecimal | number;
  originalPrice?: MongoDBDecimal | number;
  image: string;
  bundleId: string;
  productCount?: number;
  tags?: string[];
  bundleData?: Bundle; // Add bundle data for quick view
}

const BundleCard: React.FC<BundleCardProps> = ({
  name,
  price,
  originalPrice,
  image,
  bundleId,
  productCount = 0,
  tags = [],
  bundleData,
}) => {
  const [showQuickView, setShowQuickView] = useState(false);

  // Convert MongoDB Decimal objects to numbers for calculations
  const priceNum = convertToNumber(price);
  const originalPriceNum = originalPrice ? convertToNumber(originalPrice) : undefined;
  
  const savings = originalPriceNum ? originalPriceNum - priceNum : 0;
  const savingsPercentage = originalPriceNum ? Math.round((savings / originalPriceNum) * 100) : 0;

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

  // Filter out valid tags that have corresponding images
  const validTags = tags.filter(tag => tagImageMap[tag]);

  return (
    <>
      <Link href={`/bundles/${bundleId}`}>
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer relative group">
          <div className="relative">
            <div className="aspect-square relative overflow-hidden">
              <Image
                src={image || "/product-1.png"}
                alt={name}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
              
              {/* Quick View Button */}
              {bundleData && (
                <div 
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <QuickViewButton
                    onClick={() => setShowQuickView(true)}
                  />
                </div>
              )}
            </div>
            
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
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2">
              {name}
            </h3>
            
            {/* Save percentage and item count badges after title */}
            <div className="flex items-center gap-2 mb-3">
              {savings > 0 && (
                <div className="bg-green-500 text-white text-xs px-2 py-1 rounded font-semibold">
                  Save {savingsPercentage}%
                </div>
              )}
              {productCount > 0 && (
                <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                  {productCount} items
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-green-600">
                ₹{formatCurrency(priceNum)}
              </span>
              {originalPriceNum && originalPriceNum > priceNum && (
                <span className="text-sm text-gray-500 line-through">
                  ₹{formatCurrency(originalPriceNum)}
                </span>
              )}
            </div>
            {savings > 0 && (
              <p className="text-xs text-green-600 font-medium mt-1">
                You save ₹{formatCurrency(savings)}
              </p>
            )}
          </div>
        </div>
      </Link>

      {/* Quick View Dialog */}
      {bundleData && (
        <QuickViewDialog
          isOpen={showQuickView}
          onClose={() => setShowQuickView(false)}
          data={bundleData}
          type="bundle"
        />
      )}
    </>
  );
};

export default BundleCard; 