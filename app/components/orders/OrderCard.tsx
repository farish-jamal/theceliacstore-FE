"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center p-4 border rounded-lg mb-4">
      <div className="relative w-20 h-20 sm:w-32 sm:h-32 shrink-0 self-center sm:self-auto order-2 sm:order-none">
        <Image
          src={imageUrl}
          alt={`Order ${orderNumber}`}
          fill
          className="object-cover rounded-lg"
        />
      </div>
      <div className="flex-1 min-w-0 order-1">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <span className={`text-sm ${
            status === "Processing" ? "text-orange-500" : 
            status === "Delivered" ? "text-green-500" : 
            "text-red-500"
          }`}>
            ○ {status}
          </span>
          <h3 className="font-medium break-all">#{orderNumber}</h3>
        </div>
        <p className="text-sm text-gray-600 break-words line-clamp-2">{items.join(", ")}</p>
        {/* {status !== "Processing" && ( */}
          <Button
            variant="outline"
            size="sm"
          className="mt-3 w-full sm:w-auto"
            onClick={() => router.push(`/orders/${orderNumber}`)}
          >
            View Details →
          </Button>
        {/* )} */}
      </div>
    </div>
  );
};

export default OrderCard; 