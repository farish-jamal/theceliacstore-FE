"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Package, Truck, MapPin, Calendar, CreditCard, Phone, ArrowLeft } from "lucide-react";
import Link from "next/link";
import TopFloater from "@/app/components/floater/TopFloater";
import Navbar from "@/app/components/navbar/Navbar";
import Footer from "@/app/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { OrderItem, OrderAddress } from "@/app/apis/placeOrder";

const OrderConfirmationPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Get order details from URL params
  const orderId = searchParams.get("orderId");
  const orderNumber = searchParams.get("orderNumber");
  const totalAmount = searchParams.get("totalAmount");
  const discountedAmount = searchParams.get("discountedAmount");
  const estimatedDelivery = searchParams.get("estimatedDelivery");
  const createdAt = searchParams.get("createdAt");
  
  // Parse complex data from JSON
  const itemsData = searchParams.get("items");
  const addressData = searchParams.get("address");
  
  let items: OrderItem[] = [];
  let shippingAddress: OrderAddress | null = null;
  
  try {
    if (itemsData) {
      items = JSON.parse(itemsData);
    }
    if (addressData) {
      shippingAddress = JSON.parse(addressData);
    }
  } catch (error) {
    console.error("Error parsing order data:", error);
  }

  useEffect(() => {
    // Simulate loading effect
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Calculate totals
  const subtotal = parseFloat(totalAmount || "0");
  const discountAmount = subtotal - parseFloat(discountedAmount || "0");
  const finalTotal = parseFloat(discountedAmount || totalAmount || "0");

  // Format order date
  const orderDate = createdAt ? new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) : 'N/A';

  // Helper function to get item details
  const getItemDetails = (item: OrderItem) => {
    if (item.type === "product" && item.product) {
      return {
        id: item._id,
        name: item.product.name,
        quantity: item.quantity,
        price: `₹${item.product.discounted_price || item.product.price}`,
        originalPrice: item.product.price !== item.product.discounted_price ? `₹${item.product.price}` : null,
        image: item.product.banner_image || "/placeholder-product.png",
        type: "Product" as const
      };
    } else if (item.type === "bundle" && item.bundle) {
      return {
        id: item._id,
        name: item.bundle.name,
        quantity: item.quantity,
        price: `₹${item.bundle.discounted_price || item.bundle.price}`,
        originalPrice: item.bundle.price !== item.bundle.discounted_price ? `₹${item.bundle.price}` : null,
        image: item.bundle.images?.[0] || "/placeholder-bundle.png",
        type: "Bundle" as const,
        description: item.bundle.description
      };
    }
    
    // Fallback for unknown types
    return {
      id: item._id,
      name: "Unknown Item",
      quantity: item.quantity,
      price: `₹${item.discounted_total_amount || item.total_amount}`,
      originalPrice: null,
      image: "/placeholder-product.png",
      type: "Unknown" as const
    };
  };

  const orderDetails = {
    orderId: orderId || "N/A",
    orderNumber: orderNumber || "N/A",
    totalAmount: `₹${finalTotal}`,
    estimatedDelivery: estimatedDelivery || "N/A",
    orderDate,
    paymentMethod: "Cash on Delivery",
    items: items.map(getItemDetails),
    shippingAddress: shippingAddress ? {
      name: shippingAddress.name,
      street: shippingAddress.address,
      city: shippingAddress.city,
      state: shippingAddress.state,
      pincode: shippingAddress.pincode,
      phone: shippingAddress.mobile
    } : null
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600 text-lg">Processing your order...</p>
        </motion.div>
      </div>
    );
  }

  if (!orderId || !orderDetails.shippingAddress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Order Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn&apos;t find your order details. Please check your order confirmation email.</p>
          <Link href="/" className="text-green-600 hover:text-green-700 font-semibold">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <TopFloater />
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-12 h-12 text-green-600" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-4xl font-bold text-gray-900 mb-2"
          >
            Order Confirmed!
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-xl text-gray-600 mb-4"
          >
            Thank you for your purchase. Your order has been successfully placed.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-md"
          >
            <Package className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-gray-900">Order #{orderDetails.orderNumber}</span>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="text-sm text-gray-500 mt-2"
          >
            Placed on {orderDetails.orderDate}
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Package className="w-6 h-6 text-green-600" />
                Your Items ({orderDetails.items.length})
              </h2>
              
              <div className="space-y-4">
                {orderDetails.items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="w-20 h-20 bg-white rounded-lg overflow-hidden shadow-sm">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://res.cloudinary.com/dacwig3xk/image/upload/fl_preserve_transparency/v1747513129/183b94b37929bc9eee61fb523d8bef99602cb329_rabkid.jpg";
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          item.type === "Bundle" 
                            ? "bg-purple-100 text-purple-700" 
                            : "bg-blue-100 text-blue-700"
                        }`}>
                          {item.type}
                        </span>
                      </div>
                      <p className="text-gray-600">Quantity: {item.quantity}</p>
                      {"description" in item && item.description && (
                        <p className="text-sm text-gray-500 mt-1 overflow-hidden" style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {item.description}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{item.price}</p>
                      {item.originalPrice && (
                        <p className="text-sm text-gray-500 line-through">{item.originalPrice}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Delivery Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Truck className="w-6 h-6 text-green-600" />
                Delivery Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Shipping Address</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {orderDetails.shippingAddress.name}<br />
                      {orderDetails.shippingAddress.street}<br />
                      {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.pincode}<br />
                      <Phone className="inline w-4 h-4 mr-1" />
                      {orderDetails.shippingAddress.phone}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Estimated Delivery</h3>
                    <p className="text-gray-600">{orderDetails.estimatedDelivery}</p>
                    <p className="text-sm text-green-600 mt-1">Standard Delivery (5-7 business days)</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Order Summary Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-6"
          >
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                                  )}
                  <hr />
                  <div className="flex justify-between text-xl font-semibold">
                    <span>Total</span>
                    <span className="text-green-600">{orderDetails.totalAmount}</span>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <CreditCard className="w-4 h-4" />
                    <span className="text-sm">Payment Method</span>
                  </div>
                  <p className="font-semibold">{orderDetails.paymentMethod}</p>
                </div>
              </div>

             {/* Action Buttons */}
             <div className="space-y-3">
               <Button
                 onClick={() => router.push(`/orders/${orderDetails.orderId}`)}
                 className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-lg font-semibold"
               >
                 Track Order
               </Button>
             </div>
          </motion.div>
        </div>

        {/* Continue Shopping */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="text-center mt-12"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold text-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Continue Shopping
          </Link>
        </motion.div>

        {/* Customer Support */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 mt-8 text-center"
        >
          <h3 className="text-xl font-semibold mb-4">Need Help?</h3>
          <p className="text-gray-600 mb-4">
            Our customer support team is here to assist you with any questions about your order.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="border-2 border-green-200 hover:border-green-300">
              Live Chat
            </Button>
            <Button variant="outline" className="border-2 border-green-200 hover:border-green-300">
              Call Support
            </Button>
            <Button variant="outline" className="border-2 border-green-200 hover:border-green-300">
              Email Us
            </Button>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderConfirmationPage; 