import React from "react";

type PrimaryLoaderProps = {
  className?: string;
};

const PrimaryLoader = ({ className }: PrimaryLoaderProps) => (
  <div
    className={`flex items-center justify-center w-full py-8 ${
      className || ""
    }`}
  >
    <span className="inline-block w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></span>
  </div>
);

export default PrimaryLoader;
