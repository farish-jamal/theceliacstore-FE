import React, { useState } from "react";
import { motion } from "framer-motion";
import { AddReviewRequest } from "@/app/types/Review";

interface AddReviewFormProps {
  onSubmit: (reviewData: AddReviewRequest) => void;
  isSubmitting: boolean;
  onCancel?: () => void;
}

const AddReviewForm: React.FC<AddReviewFormProps> = ({ onSubmit, isSubmitting, onCancel }) => {
  const [formData, setFormData] = useState<AddReviewRequest>({
    title: "",
    rating: 0,
    description: "",
  });

  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.rating === 0) {
      return;
    }
    onSubmit(formData);
  };

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleInputChange = (field: keyof AddReviewRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderStars = () => {
    return [...Array(5)].map((_, i) => {
      const starNumber = i + 1;
      const isFilled = starNumber <= (hoveredRating || formData.rating);
      
      return (
        <button
          key={i}
          type="button"
          className="focus:outline-none transition-colors"
          onClick={() => handleRatingClick(starNumber)}
          onMouseEnter={() => setHoveredRating(starNumber)}
          onMouseLeave={() => setHoveredRating(0)}
          disabled={isSubmitting}
        >
          <svg
            className={`w-8 h-8 transition-colors ${
              isFilled ? "text-yellow-400 fill-current" : "text-gray-300"
            } ${!isSubmitting ? "hover:text-yellow-500" : ""}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      );
    });
  };

  const getRatingText = (rating: number) => {
    const texts = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];
    return texts[rating] || "";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Write a Review</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Rating *
          </label>
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              {renderStars()}
            </div>
            {formData.rating > 0 && (
              <span className="text-sm text-gray-600 ml-2">
                {getRatingText(formData.rating)}
              </span>
            )}
          </div>
          {formData.rating === 0 && (
            <p className="text-red-500 text-sm mt-1">Please select a rating</p>
          )}
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Review Title
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="Summarize your experience"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            disabled={isSubmitting}
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Your Review *
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Share your experience with this product..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
            disabled={isSubmitting}
            required
          />
          {formData.description.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              {formData.description.length} characters
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          )}
          <motion.button
            type="submit"
            disabled={isSubmitting || formData.rating === 0 || !formData.description.trim()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Submitting...</span>
              </div>
            ) : (
              "Submit Review"
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddReviewForm;
