"use client";
import TopFloater from "@/app/components/floater/TopFloater";
import Footer from "@/app/components/layout/Footer";
import Navbar from "@/app/components/navbar/Navbar";
import React, { useState, useEffect } from "react";
import ProductSlider from "@/app/components/productsider/ProductSlider";
import FrequentlyBought from "@/app/components/frequentlybought/FrequentlyBought";
import { getBundle, Bundle } from "@/app/apis/getBundles";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function BundleDetailPage() {
  const [selectedThumb, setSelectedThumb] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [bundle, setBundle] = useState<Bundle | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const bundleId = params.id as string;

  useEffect(() => {
    const fetchBundle = async () => {
      if (!bundleId) return;
      
      setLoading(true);
      try {
        const response = await getBundle(bundleId);
        console.log("Bundle detail API response:", response); // Debug log
        if (response.success && response.data) {
          setBundle(response.data);
        } else {
          setBundle(null);
        }
      } catch (error) {
        console.error("Error fetching bundle:", error);
        setBundle(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBundle();
  }, [bundleId]);

  if (loading) {
    return (
      <div className="bg-gray-50">
        <TopFloater />
        <Navbar />
        <div className="max-w-7xl mx-auto py-8 px-4">
          <div className="text-center py-10">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!bundle) {
    return (
      <div className="bg-gray-50">
        <TopFloater />
        <Navbar />
        <div className="max-w-7xl mx-auto py-8 px-4">
          <div className="text-center py-10">
            <h2 className="text-xl font-semibold mb-2">Bundle not found</h2>
            <Link href="/bundles" className="text-green-600 hover:text-green-700">
              Back to Bundles
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const totalPrice = bundle.discounted_price ?? bundle.price;
  const originalPrice = bundle.price;
  const savings = originalPrice - totalPrice;
  const savingsPercentage = Math.round((savings / originalPrice) * 100);

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
              {bundle.images?.map((src, idx) => (
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
                src={bundle.images?.[selectedThumb] || bundle.images?.[0] || ""}
                alt="main"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Right: Bundle Info */}
        <div className="w-full lg:w-[55%]">
          <div className="bg-white py-3 text-sm mb-4">
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              Home
            </Link>
            <span className="mx-2 text-gray-400">›</span>
            <Link href="/bundles" className="text-gray-500 hover:text-gray-700">
              Bundles
            </Link>
            <span className="mx-2 text-gray-400">›</span>
            <span className="text-gray-700">{bundle.name}</span>
          </div>

          <h1 className="text-2xl font-semibold mb-2">
            {bundle.name}
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
              {bundle.products?.map((product) => (
                <div key={product._id} className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-gray-50 rounded-lg p-1">
                    <img
                      src={product.banner_image || product.images?.[0] || ""}
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{product.name}</h4>
                    <p className="text-xs text-gray-500">Quantity: 1</p>
                  </div>
                  <div className="text-sm font-medium">
                    ₹{(product.discounted_price ?? product.price).toFixed(2)}
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
              {bundle.name}
            </div>
            <div>
              <span className="font-medium text-gray-900">Total Items:</span>{" "}
              {bundle.products?.length || 0}
            </div>
            <div>
              <span className="font-medium text-gray-900">Savings:</span>{" "}
              ₹{savings.toFixed(2)} ({savingsPercentage}% off)
            </div>
          </div>
        </div>
      </div>

      {/* Bundle Description */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Bundle Description</h2>
          <p className="text-gray-600 mb-6">
            {bundle.description}
          </p>
          
          <h3 className="font-medium mb-2">Bundle Benefits:</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
            <li>Save up to {savingsPercentage}% compared to buying items individually</li>
            <li>All products are carefully curated for quality</li>
            <li>Perfect for your daily needs</li>
            <li>High-quality ingredients</li>
            <li>Convenient packaging</li>
          </ul>

          <h3 className="font-medium mb-2">Storage Instructions:</h3>
          <p className="text-gray-600">
            Store in a cool, dry place away from direct sunlight. Once opened, keep in an airtight container.
          </p>
        </div>
      </div>

      <FrequentlyBought />
      <ProductSlider title="You May Also Like" image={bundle.images?.[1] || ""} />
      <ProductSlider title="Best Sellers" image={bundle.images?.[0] || ""} />
      <Footer />
    </div>
  );
}
