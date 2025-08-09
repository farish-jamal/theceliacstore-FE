"use client";

import { ArrowRight } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";

type PromoCardProps = {
  title: string;
  subtitle: string;
  buttonText: string;
  bgColor: string;
  textColor?: string;
  styles?: string;
};

const PromoCard = ({
  title,
  subtitle,
  buttonText,
  bgColor,
  textColor = "text-black",
  styles,
}: PromoCardProps) => {
  const router = useRouter();

  const handleButtonClick = () => {
    // Redirect to bundles page
    router.push('/bundles');
  };

  return (
    <div
      className={`p-6 rounded-lg flex flex-col ${bgColor} ${textColor} ${styles}`}
    >
      <div className="flex flex-col items-center gap-1">
        <p className="text-xs uppercase text-center">{subtitle}</p>
        <h3 className="text-2xl text-center">{title}</h3>
      </div>
      <button 
        onClick={handleButtonClick}
        className="mt-4 bg-white text-green-600 px-8 py-3 rounded-full text-sm border hover:bg-green-50 flex items-center gap-2 mx-auto transition-colors duration-200"
      >
        {buttonText}
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default PromoCard;
