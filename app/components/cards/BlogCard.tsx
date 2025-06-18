import React from "react";
import Image from "next/image";
import { Typography } from "../typography/Typography";
import { ArrowRight, MessageSquare, TagIcon } from "lucide-react";

type BlogCardProps = {
  url: string;
  title: string;
  tag: string;
  views: number;
  date: Date;
  onClick?: () => void;
};

const BlogCard = ({ url, title, tag, views, date, onClick }: BlogCardProps) => {
  return (
    <div
      className="w-full shadow-sm rounded-lg overflow-hidden bg-white cursor-pointer"
      onClick={onClick}
    >
      <Image
        src={url}
        alt="Blog Image"
        height={200}
        width={200}
        className="w-full h-64 object-cover"
      />
      <div className="flex flex-col gap-2 p-4">
        <div className="flex flex-row gap-4 items-center">
          <div className="flex flex-row gap-2 items-center">
            <TagIcon className="w-4 h-4 text-gray-400" />
            <Typography className="text-sm text-gray-500">{tag}</Typography>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <MessageSquare className="w-4 h-4 text-gray-400" />
            <Typography className="text-sm text-gray-500">{views}</Typography>
          </div>
        </div>
        <Typography className="font-semibold text-lg">{title}</Typography>
        <div className="flex items-center gap-1 text-green-700 cursor-pointer mt-2">
          <Typography className="text-sm font-medium">Read More</Typography>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
