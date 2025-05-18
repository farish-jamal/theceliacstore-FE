"use client";
import TopFloater from "@/app/components/floater/TopFloater";
import Footer from "@/app/components/layout/Footer";
import Navbar from "@/app/components/navbar/Navbar";
import React, { useState } from "react";
import ProductSlider from "@/app/components/productsider/ProductSlider";

const thumbnails = [
  "https://res.cloudinary.com/dacwig3xk/image/upload/fl_preserve_transparency/v1747513129/183b94b37929bc9eee61fb523d8bef99602cb329_rabkid.jpg?_s=public-apps",
  "https://res.cloudinary.com/dacwig3xk/image/upload/fl_preserve_transparency/v1747513129/828c7686eb0e33b2b2a9b791c342983d6fee1747_ubi5ay.jpg?_s=public-apps",
  "https://res.cloudinary.com/dacwig3xk/image/upload/fl_preserve_transparency/v1747513129/183b94b37929bc9eee61fb523d8bef99602cb329_rabkid.jpg?_s=public-apps",
];

export default function ProductDetailPage() {
  const [selectedThumb, setSelectedThumb] = useState(0);
  const [selectedWeight, setSelectedWeight] = useState(1);
  const [quantity, setQuantity] = useState(5);
  const weights = ["500 g", "1000 g"];

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
        {/* Right: Product Info */}
        <div className="w-full lg:w-[55%]">
          <h1 className="text-2xl font-semibold mb-2">
            Wheafree Gluten Free Multigrain Flour 1000 Gms
          </h1>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-red-50 text-red-500 px-2 py-0.5 rounded-sm text-xs font-medium">
              🔥 Popular Picks
            </span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xl font-bold text-gray-900">₹170.00</span>
            <span className="text-sm text-gray-400 line-through">₹220.00</span>
            <span className="text-xs text-red-500">(X% Off)</span>
            <span className="text-xs text-gray-500">
              (Inclusive of all taxes)
            </span>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-gray-600">Brand:</span>
            <img
              src="https://res.cloudinary.com/dacwig3xk/image/upload/fl_preserve_transparency/v1747513129/01b20525870a709af943f41817e7b9a6907f52b5_f5einw.jpg?_s=public-apps"
              alt="Wheafree"
              className="h-10"
            />
            <div className="ml-auto flex gap-3 items-center text-gray-400">
              <button className="hover:text-gray-600">
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M13.5 3a1.5 1.5 0 0 0-3 0h3zM12 22a1 1 0 0 0 1-1h-2a1 1 0 0 0 1 1zm7-3a1 1 0 0 0 0-2v2zM5 19a1 1 0 0 0 0-2v2zm7-16v16h2V3h-2zm8 16v-2h-2v2h2zm-16 0h16v-2H4v2z" />
                </svg>
              </button>
              <button className="hover:text-gray-600">
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                </svg>
              </button>
              <button className="hover:text-gray-600">
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
                </svg>
              </button>
            </div>
          </div>
          <p className="text-gray-600 mb-6 text-sm leading-relaxed">
            Wheafree Gluten-Free Multigrain Flour (1000 Gms): Embrace a
            gluten-free lifestyle with Wheafree&apos;s Gluten-Free Multigrain
            Flour. This 1000 Gms pack is a blend of nutritious grains, finely
            milled to perfection, providing a versatile and wholesome
            alternative for those seeking gluten-free options in their daily
            cooking.
          </p>
          <div className="flex gap-3 mb-6">
            {weights.map((w, idx) => (
              <button
                key={w}
                onClick={() => setSelectedWeight(idx)}
                className={`px-6 py-2 rounded-full border-2 text-sm font-medium transition-all ${
                  selectedWeight === idx
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                }`}
              >
                {w}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 mb-6">
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
              Add to Cart
            </button>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <div>
              <span className="font-medium text-gray-900">Category:</span>{" "}
              Flour, Gluten Free, Wheat Free
            </div>
            <div>
              <span className="font-medium text-gray-900">Tag:</span> Flour,
              Wheat Free
            </div>
            <div>
              <span className="font-medium text-gray-900">Bundles:</span> dfrfd
              cx cxv cx xc xc xc
            </div>
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-4 mt-8">
        <div className="flex border-b justify-center items-center">
          <button className="px-6 py-3 text-gray-500 hover:text-gray-700">
            Descriptions
          </button>
          <button className="px-6 py-3 border-b-2 border-green-500 text-green-600 font-medium">
            Additional Information
          </button>
          <button className="px-6 py-3 text-gray-500 hover:text-gray-700">
            Reviews
          </button>
        </div>
        <div className="flex flex-col lg:flex-row gap-12 py-8 px-[10%]">
          <div className="w-full lg:w-1/2 text-sm space-y-3">
            <div className="flex">
              <span className="w-40 text-gray-600">Weight:</span>{" "}
              <span>03</span>
            </div>
            <div className="flex">
              <span className="w-40 text-gray-600">Type:</span>{" "}
              <span>Gluten Free</span>
            </div>
            <div className="flex">
              <span className="w-40 text-gray-600">Category:</span>{" "}
              <span>Flour</span>
            </div>
            <div className="flex">
              <span className="w-40 text-gray-600">Stock Status:</span>{" "}
              <span>Available (5,413)</span>
            </div>
            <div className="flex">
              <span className="w-40 text-gray-600">Manufactured by:</span>{" "}
              <span>xyz</span>
            </div>
            <div className="flex">
              <span className="w-40 text-gray-600">Manufacturer Address:</span>{" "}
              <span>xyz</span>
            </div>
            <div className="flex">
              <span className="w-40 text-gray-600">Date of MFD:</span>{" "}
              <span>xyz</span>
            </div>
            <div className="flex">
              <span className="w-40 text-gray-600">Expire Date:</span>{" "}
              <span>xyz</span>
            </div>
            <div className="flex">
              <span className="w-40 text-gray-600">Customer Care:</span>{" "}
              <span>xyz</span>
            </div>
            <div className="flex">
              <span className="w-40 text-gray-600">Batch Number:</span>{" "}
              <span>xyz</span>
            </div>
            <div className="flex">
              <span className="w-40 text-gray-600">Country of Origin:</span>{" "}
              <span>xyz</span>
            </div>
            <div className="mt-6 flex items-center  justify-center gap-3 border py-6 px-4 rounded-lg max-w-fit">
              <div className="w-10 h-10 rounded-full items-center justify-center">
                <img
                  src="https://res.cloudinary.com/dacwig3xk/image/upload/fl_preserve_transparency/v1747550786/Vector_ru0gp0.jpg?_s=public-apps"
                  alt="Wheafree"
                  className="h-10"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-medium">100% Gluten Free</span>
                <span className="text-gray-500">Certified Gluten Free</span>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="aspect-square -mt-10 rounded-lg max-h-[450px]">
              <img
                src={thumbnails[1]}
                alt="back"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
      <ProductSlider title="Recommended for you" image={thumbnails[1]} />
      <ProductSlider title="Best Sellers" image={thumbnails[0]} />
      <Footer />
    </div>
  );
}
