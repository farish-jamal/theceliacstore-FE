import React from "react";

interface CheckoutButtonProps {
  disabled?: boolean;
  onClick?: () => void;
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({ disabled, onClick }) => (
  <button
    className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors mt-6"
    disabled={disabled}
    onClick={onClick}
  >
    Proceed to Checkout
  </button>
);

export default CheckoutButton;
