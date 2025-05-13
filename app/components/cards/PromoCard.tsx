import { ArrowRight } from "lucide-react";
import React from "react";

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
  return (
    <div
      className={`p-6 rounded-lg flex flex-col ${bgColor} ${textColor} ${styles}`}
    >
      <div className="flex flex-col items-center gap-1">
        <p className="text-xs uppercase text-center">{subtitle}</p>
        <h3 className="text-2xl text-center">{title}</h3>
      </div>
      <button className="mt-4 bg-white text-green-600 px-8 py-3 rounded-full text-sm border hover:bg-green-50 flex items-center gap-2 mx-auto">
        {buttonText}
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default PromoCard;
