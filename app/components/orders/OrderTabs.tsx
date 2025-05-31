"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface OrderTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const OrderTabs: React.FC<OrderTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: "current", label: "Current Orders" },
    { id: "past", label: "Past Orders" },
    { id: "cancelled", label: "Cancelled Orders" },
  ];

  return (
    <div className="border-b border-gray-200">
      <nav className="flex space-x-8" aria-label="Order Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap",
              activeTab === tab.id
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            )}
            aria-current={activeTab === tab.id ? "page" : undefined}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default OrderTabs; 