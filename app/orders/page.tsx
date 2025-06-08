"use client";

import React, { useState } from "react";
import OrderTabs from "../components/orders/OrderTabs";
import OrderCard from "../components/orders/OrderCard";
import Header from "../components/layout/Header";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/layout/Footer";

const sampleOrders = {
  current: [
    {
      orderNumber: "GFC12345",
      status: "Processing",
      items: ["Gluten-Free Burger Buns", "Pizza Base", "Pasta & more"],
      imageUrl: "https://res.cloudinary.com/dacwig3xk/image/upload/v1748708075/ab0df74c3f8d1807d7434a10a51793aec32c56a7_ihzbsj.jpg",
    },
  ],
  past: [
    {
      orderNumber: "GFC67890",
      status: "Delivered",
      items: ["Gluten-Free Bread", "Cookies", "Snacks"],
      imageUrl: "https://res.cloudinary.com/dacwig3xk/image/upload/v1748708075/ab0df74c3f8d1807d7434a10a51793aec32c56a7_ihzbsj.jpg",
    },
  ],
  cancelled: [],
};

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("current");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">My Orders</h1>
          
          <OrderTabs activeTab={activeTab} onTabChange={setActiveTab} />
          
          <div className="mt-6">
            {activeTab === "current" && (
              <div>
                {sampleOrders.current.map((order) => (
                  <OrderCard
                    key={order.orderNumber}
                    orderNumber={order.orderNumber}
                    status={order.status as "Processing" | "Delivered" | "Cancelled"}
                    items={order.items}
                    imageUrl={order.imageUrl}
                  />
                ))}
                {sampleOrders.current.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No current orders</p>
                )}
              </div>
            )}
            
            {activeTab === "past" && (
              <div>
                {sampleOrders.past.map((order) => (
                  <OrderCard
                    key={order.orderNumber}
                    orderNumber={order.orderNumber}
                    status={order.status as "Processing" | "Delivered" | "Cancelled"}
                    items={order.items}
                    imageUrl={order.imageUrl}
                  />
                ))}
                {sampleOrders.past.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No past orders</p>
                )}
              </div>
            )}
            
            {activeTab === "cancelled" && (
              <div>
                {sampleOrders.cancelled.map((order: any) => (
                  <OrderCard
                    key={order.orderNumber}
                    orderNumber={order.orderNumber}
                    status={order.status as "Processing" | "Delivered" | "Cancelled"}
                    items={order.items}
                    imageUrl={order.imageUrl}
                  />
                ))}
                {sampleOrders.cancelled.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No cancelled orders</p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 