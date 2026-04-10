import React, { useState, useEffect } from "react";
import { formatCurrency } from "@/app/utils/formatPrice";
import { BACKEND_URL } from "@/app/constants/URL";

function roundToNearest50(value: number): number {
  return Math.round(value / 50) * 50;
}

function getShippingRange(calculated: number): { low: number; high: number } {
  return {
    low: roundToNearest50(calculated * 0.85),
    high: roundToNearest50(calculated * 1.15),
  };
}

interface OrderSummaryProps {
  subtotal: number;
  shippingCharge: number;
  finalPrice: number;
  isGuest?: boolean;
  guestCartWeightGrams?: number;
  onShippingEstimate?: (pincode: string, estimatedCharge: number) => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal,
  shippingCharge,
  finalPrice,
  isGuest = false,
  guestCartWeightGrams = 0,
  onShippingEstimate,
}) => {
  const [pincode, setPincode] = useState("");
  const [estimatedCharge, setEstimatedCharge] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [pincodeError, setPincodeError] = useState("");

  useEffect(() => {
    if (pincode.length !== 6) {
      setEstimatedCharge(null);
      setPincodeError("");
      return;
    }

    const calculateShipping = async () => {
      setIsCalculating(true);
      setPincodeError("");

      try {
        const weight = guestCartWeightGrams > 0 ? guestCartWeightGrams : 500;
        const response = await fetch(
          `${BACKEND_URL}/api/delivery-zone/calculate?pincode=${pincode}&weight_in_grams=${weight}`
        );
        const data = await response.json();

        if (data.success && data.data?.delivery_price !== undefined) {
          const charge = data.data.delivery_price;
          setEstimatedCharge(charge);
          onShippingEstimate?.(pincode, charge);
        } else {
          setPincodeError("Could not estimate for this pincode.");
          setEstimatedCharge(null);
          onShippingEstimate?.(pincode, 0);
        }
      } catch {
        setPincodeError("Could not connect. Please try again.");
        setEstimatedCharge(null);
      } finally {
        setIsCalculating(false);
      }
    };

    calculateShipping();
  }, [pincode, guestCartWeightGrams]);

  const renderShippingDisplay = () => {
    if (!isGuest) {
      return (
        <span>
          {shippingCharge > 0
            ? "₹" + formatCurrency(shippingCharge)
            : "To be calculated"}
        </span>
      );
    }

    if (isCalculating) {
      return <span className="text-gray-400 text-sm">Calculating...</span>;
    }

    if (estimatedCharge !== null) {
      const { low, high } = getShippingRange(estimatedCharge);
      if (low === 0 && high === 0) {
        return <span className="text-green-600 text-sm font-medium">Free</span>;
      }
      return (
        <span className="text-gray-800 text-sm font-medium">
          ₹{low} – ₹{high}
        </span>
      );
    }

    return (
      <span className="text-gray-400 text-sm">To be calculated</span>
    );
  };

  return (
    <div className="border-t-2 pt-4 space-y-3">

      {/* Pincode estimator — shown first for guests */}
      {isGuest && (
        <div className="space-y-1 pb-2">
          <label className="text-sm text-gray-600">
            Enter pincode to estimate delivery
          </label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="e.g. 110001"
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
            className="w-full border-2 rounded-lg px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
          />
          {pincodeError && (
            <p className="text-xs text-red-500">{pincodeError}</p>
          )}
        </div>
      )}

      <div className="flex justify-between text-gray-600">
        <span className="font-semibold">Subtotal</span>
        <span>₹{formatCurrency(subtotal)}</span>
      </div>

      <div className="flex justify-between text-gray-600">
        <span className="font-semibold">Delivery Charges</span>
        {renderShippingDisplay()}
      </div>

      <div className="flex justify-between font-semibold text-lg pt-2 border-t mt-2">
        <span>Estimated Total</span>
        <span className="text-green-600">₹{formatCurrency(finalPrice)}</span>
      </div>

      {isGuest && estimatedCharge !== null && (
        <p className="text-xs text-gray-400">
          * Delivery charge is an estimate. Final amount confirmed before dispatch.
        </p>
      )}
    </div>
  );
};

export default OrderSummary;