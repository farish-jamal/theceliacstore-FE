"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface OrderCardProps {
  orderNumber: string;
  status: "Processing" | "Delivered" | "Cancelled";
  items: string[];
  imageUrl: string;
}

const OrderCard: React.FC<OrderCardProps> = ({
  orderNumber,
  status,
  items,
  imageUrl,
}) => {
  return (
    <div className="flex gap-6 items-center p-4 border rounded-lg mb-4">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <span className={`text-sm ${
            status === "Processing" ? "text-orange-500" : 
            status === "Delivered" ? "text-green-500" : 
            "text-red-500"
          }`}>
            ○ {status}
          </span>
          <h3 className="font-medium">#{orderNumber}</h3>
        </div>
        <p className="text-sm text-gray-600">{items.join(", ")}</p>
        {status === "Processing" ? (
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
          >
            Track Order →
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
          >
            View Details →
          </Button>
        )}
      </div>
      <div className="relative w-32 h-32 shrink-0">
        <Image
          src={imageUrl}
          alt={`Order ${orderNumber}`}
          fill
          className="object-cover rounded-lg"
        />
      </div>
    </div>
  );
};

export default OrderCard; 