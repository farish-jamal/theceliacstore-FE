"use client";
import TopFloater from "@/app/components/floater/TopFloater";
import Footer from "@/app/components/layout/Footer";
import Navbar from "@/app/components/navbar/Navbar";
import React, { useState } from "react";
import ProductSlider from "@/app/components/productsider/ProductSlider";
import FrequentlyBought from "@/app/components/frequentlybought/FrequentlyBought";

const thumbnails = [
  "https://res.cloudinary.com/dacwig3xk/image/upload/fl_preserve_transparency/v1747513129/183b94b37929bc9eee61fb523d8bef99602cb329_rabkid.jpg?_s=public-apps",
  "https://res.cloudinary.com/dacwig3xk/image/upload/fl_preserve_transparency/v1747513129/828c7686eb0e33b2b2a9b791c342983d6fee1747_ubi5ay.jpg?_s=public-apps",
  "https://res.cloudinary.com/dacwig3xk/image/upload/fl_preserve_transparency/v1747513129/183b94b37929bc9eee61fb523d8bef99602cb329_rabkid.jpg?_s=public-apps",
];

// Example bundle items
const bundleItems = [
  {
    id: 1,
    name: "Wheafree Gluten Free Multigrain Flour 1000 Gms",
    price: 170.00,
    image: thumbnails[0],
    quantity: 1
  },
  {
    id: 2,
    name: "Sai Healthy Atta 1000 Gms",
    price: 160.00,
    image: thumbnails[1],
    quantity: 1
  },
  {
    id: 3,
    name: "Dr. Gluten Platinum Chapati Flour 1000 Gms",
    price: 180.00,
    image: thumbnails[2],
    quantity: 1
  }
];

export default function BundleDetailPage() {
  const [selectedThumb, setSelectedThumb] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const totalPrice = bundleItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const originalPrice = totalPrice * 1.2; // 20% more than bundle price
  const savings = originalPrice - totalPrice;

  return (
    <div className="bg-gray-50">
      <TopFloater />
      <Navbar />
      <div className="max-w-7xl mx-auto py-8 px-4 flex flex-col lg:flex-row gap-12">
        {/* Left: Image Gallery */}
        <div className="w-full lg:w-[45%]">
          <div className="flex gap-6">
            {/* Thumbnails on the left */}
            <div className="flex flex-col gap-3">
              {thumbnails.map((src, idx) => (
                <div
                  key={idx}
                  className={`w-24 h-24 p-2 bg-white rounded-lg shadow-sm cursor-pointer ${
                    selectedThumb === idx ? "border-2 border-green-500" : ""
                  }`}
                >
                  <img
                    src={src}
                    alt="thumb"
                    className="w-full h-full object-contain"
                    onClick={() => setSelectedThumb(idx)}
                  />
                </div>
              ))}
            </div>
            {/* Main image */}
            <div className="flex-1 aspect-square rounded-lg max-h-[400px]">
              <img
                src={thumbnails[selectedThumb]}
                alt="main"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Right: Bundle Info */}
        <div className="w-full lg:w-[55%]">
          <h1 className="text-2xl font-semibold mb-2">
            Gluten-Free Essentials Bundle
          </h1>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded-sm text-xs font-medium">
              💰 Bundle Deal
            </span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xl font-bold text-gray-900">₹{totalPrice.toFixed(2)}</span>
            <span className="text-sm text-gray-400 line-through">₹{originalPrice.toFixed(2)}</span>
            <span className="text-xs text-green-600">Save ₹{savings.toFixed(2)}</span>
            <span className="text-xs text-gray-500">
              (Inclusive of all taxes)
            </span>
          </div>

          <div className="bg-white rounded-lg p-4 mb-6">
            <h3 className="font-medium mb-3">Bundle Contents:</h3>
            <div className="space-y-3">
              {bundleItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-gray-50 rounded-lg p-1">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{item.name}</h4>
                    <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-sm font-medium">
                    ₹{item.price.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-gray-300 rounded-full">
              <button
                className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-700"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                –
              </button>
              <input
                type="number"
                value={quantity}
                min={1}
                readOnly
                className="w-12 h-10 text-center border-x border-gray-300 bg-transparent"
              />
              <button
                className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-700"
                onClick={() => setQuantity((q) => q + 1)}
              >
                +
              </button>
            </div>
            <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-6 rounded-full text-sm transition-colors">
              Add Bundle to Cart
            </button>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <div>
              <span className="font-medium text-gray-900">Bundle Type:</span>{" "}
              Gluten-Free Essentials
            </div>
            <div>
              <span className="font-medium text-gray-900">Total Items:</span>{" "}
              {bundleItems.length}
            </div>
            <div>
              <span className="font-medium text-gray-900">Savings:</span>{" "}
              ₹{savings.toFixed(2)} ({((savings/originalPrice) * 100).toFixed(0)}% off)
            </div>
          </div>
        </div>
      </div>

      {/* Bundle Description */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Bundle Description</h2>
          <p className="text-gray-600 mb-6">
            This carefully curated bundle brings together essential gluten-free products for your daily needs. Perfect for those following a gluten-free lifestyle, this bundle offers great value and convenience. Each product is certified gluten-free and made with high-quality ingredients.
          </p>
          
          <h3 className="font-medium mb-2">Bundle Benefits:</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
            <li>Save up to 20% compared to buying items individually</li>
            <li>All products are certified gluten-free</li>
            <li>Perfect for daily cooking needs</li>
            <li>High-quality ingredients</li>
            <li>Long shelf life</li>
          </ul>

          <h3 className="font-medium mb-2">Storage Instructions:</h3>
          <p className="text-gray-600">
            Store in a cool, dry place away from direct sunlight. Once opened, keep in an airtight container.
          </p>
        </div>
      </div>

      <FrequentlyBought />
      <ProductSlider title="You May Also Like" image={thumbnails[1]} />
      <ProductSlider title="Best Sellers" image={thumbnails[0]} />
      <Footer />
    </div>
  );
}
