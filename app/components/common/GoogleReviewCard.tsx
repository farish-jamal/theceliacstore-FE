import React from "react";
import { Star } from "lucide-react";
import Image from "next/image";
import { Typography } from "../typography/Typography";

const GoogleReviewCard = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-8 w-full mb-4">
      <div className="bg-white rounded-lg shadow-md px-14 py-2">
        <div className="flex items-center justify-center mb-4">
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg"
            alt="Google"
            width={80}
            height={30}
            className="h-8 w-auto"
          />
        </div>
        <div className="flex items-center justify-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={20}
              fill={i < 4 ? "#FACC15" : i === 4 ? "#FACC15" : "none"}
              stroke="#FACC15"
              className={i < 4 ? "" : i === 4 ? "opacity-50" : "opacity-40"}
            />
          ))}
        </div>
        <Typography className="text-center text-sm text-gray-600">
          4.1 | 199 reviews
        </Typography>
      </div>
    </div>
  );
};

export default GoogleReviewCard; 