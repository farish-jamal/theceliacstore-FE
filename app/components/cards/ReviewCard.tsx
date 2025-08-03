import React from "react";
import { Typography } from "../typography/Typography";
import Image from "next/image";
import { Star } from "lucide-react";
import CommentIcon from "@/app/icons/CommentIcon";

type ReviewCardProps = {
  name: string;
  review: string;
  rating: number;
  url: string;
  type: string;
};

const ReviewCard = ({ name, review, rating, url, type }: ReviewCardProps) => {
  return (
    <div className="flex flex-col justify-between shadow-[0_4px_12px_0_rgba(0,0,0,0.08)] px-8 py-8 rounded-lg gap-4 m-4 min-h-[280px] bg-white">
      <CommentIcon />
      <Typography className="text-sm mt-2 text-gray-800 flex-1">
        {review}
      </Typography>
      <div className="flex justify-between items-center gap-2 mt-4">
        <div className="flex items-center gap-2">
          <Image
            src={url}
            alt={name}
            width={50}
            height={50}
            className="rounded-full"
          />
          <div>
            <p className="font-semibold text-xs">{name}</p>
            <p className="text-xs text-gray-500">{type}</p>
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              fill={i < rating ? "#FACC15" : "none"}
              stroke="#FACC15"
              className={i < rating ? "" : "opacity-40"}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
