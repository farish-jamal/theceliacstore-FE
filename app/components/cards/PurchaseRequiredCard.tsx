import React from "react";

interface PurchaseRequiredCardProps {
  onBackToProducts?: () => void;
}

const PurchaseRequiredCard: React.FC<PurchaseRequiredCardProps> = ({ onBackToProducts }) => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
      <div className="mb-4">
        <svg className="mx-auto h-16 w-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      </div>
      
      <h3 className="text-lg font-semibold text-blue-900 mb-2">
        Purchase Required to Review
      </h3>
      
      <p className="text-blue-700 mb-6 max-w-md mx-auto">
        To write a review for this product, you need to have purchased it first. 
        This helps ensure authentic feedback from verified customers.
      </p>
      
      <div className="space-y-3">
        <button
          onClick={onBackToProducts}
          className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Browse Products
        </button>
        
        <p className="text-sm text-blue-600">
          Already purchased this product? Make sure you're logged in with the correct account.
        </p>
      </div>
    </div>
  );
};

export default PurchaseRequiredCard;
