"use client";

import React, { useEffect, useMemo, useState } from "react";
import OrderTabs from "../components/orders/OrderTabs";
import OrderCard from "../components/orders/OrderCard";
import Header from "../components/layout/Header";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/layout/Footer";
import { getOrderHistory, Order } from "../apis/getOrderHistory";

type UiStatus = "Processing" | "Delivered" | "Cancelled";

function mapStatusToUi(status: string): UiStatus {
  const normalized = status.toLowerCase();
  if (normalized === "delivered" || normalized === "completed") return "Delivered";
  if (normalized === "cancelled" || normalized === "canceled") return "Cancelled";
  return "Processing";
}

function extractItemsList(order: Order): string[] {
  const names = order.items
    .map((i) => (i.type === "product" ? i.product?.name : ""))
    .filter(Boolean) as string[];
  return names;
}

function extractImage(order: Order): string {
  const first = order.items.find((i) => i.type === "product");
  return (first && first.product && first.product.banner_image) || "/product-1.png";
}

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("current");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError("");
    getOrderHistory()
      .then((res) => {
        if (!isMounted) return;
        const data = res?.data?.data || [];
        setOrders(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!isMounted) return;
        setError("Failed to fetch orders. Please try again.");
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const currentOrders = useMemo(() => orders.filter((o) => {
    const s = mapStatusToUi(o.status);
    return s === "Processing";
  }), [orders]);

  const pastOrders = useMemo(() => orders.filter((o) => {
    const s = mapStatusToUi(o.status);
    return s === "Delivered";
  }), [orders]);

  const cancelledOrders = useMemo(() => orders.filter((o) => {
    const s = mapStatusToUi(o.status);
    return s === "Cancelled";
  }), [orders]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">My Orders</h1>

          {loading && (
            <p className="text-center text-gray-500 py-8">Fetching your orders...</p>
          )}
          {!loading && error && (
            <p className="text-center text-red-500 py-8">{error}</p>
          )}
          {!loading && !error && (
            <>
              <OrderTabs activeTab={activeTab} onTabChange={setActiveTab} />
              <div className="mt-6">
                {activeTab === "current" && (
                  <div>
                    {currentOrders.map((order) => (
                      <OrderCard
                        key={order._id}
                        orderNumber={order._id}
                        status={mapStatusToUi(order.status)}
                        items={extractItemsList(order)}
                        imageUrl={extractImage(order)}
                      />
                    ))}
                    {currentOrders.length === 0 && (
                      <p className="text-center text-gray-500 py-8">No current orders</p>
                    )}
                  </div>
                )}
                {activeTab === "past" && (
                  <div>
                    {pastOrders.map((order) => (
                      <OrderCard
                        key={order._id}
                        orderNumber={order._id}
                        status={mapStatusToUi(order.status)}
                        items={extractItemsList(order)}
                        imageUrl={extractImage(order)}
                      />
                    ))}
                    {pastOrders.length === 0 && (
                      <p className="text-center text-gray-500 py-8">No past orders</p>
                    )}
                  </div>
                )}
                {activeTab === "cancelled" && (
                  <div>
                    {cancelledOrders.map((order) => (
                      <OrderCard
                        key={order._id}
                        orderNumber={order._id}
                        status={mapStatusToUi(order.status)}
                        items={extractItemsList(order)}
                        imageUrl={extractImage(order)}
                      />
                    ))}
                    {cancelledOrders.length === 0 && (
                      <p className="text-center text-gray-500 py-8">No cancelled orders</p>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}