import React from "react";

export type EmptySectionProps = {
  icon: React.ReactNode;
  text: string;
  className?: string;
};

const EmptySection = ({ icon, text, className }: EmptySectionProps) => (
  <div
    className={`flex flex-col items-center justify-center py-12 text-gray-400 ${
      className || ""
    }`}
  >
    <div className="mb-4 text-5xl">{icon}</div>
    <div className="text-lg font-medium">{text}</div>
  </div>
);

export default EmptySection;
