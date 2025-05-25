import { Typography } from "../typography/Typography";
import {
  ChevronDown,
  ChevronRight,
  LanguagesIcon,
  PhoneCallIcon,
} from "lucide-react";

const TopFloater = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between bg-[#58B45B] px-4 md:px-24 py-2 gap-2 md:gap-0">
      <div className="flex items-center gap-1 w-full md:w-auto justify-center md:justify-start">
        <Typography className="text-[#fff] font-bold text-sm text-center md:text-left">
          10% OFF ON FEATURED UPCOMING BRANDS
        </Typography>
        <ChevronRight className="inline h-4 w-4 text-white" strokeWidth={3} />
      </div>

      {/* On mobile: language and phone in same row. On desktop: row with gap */}
      <div className="flex flex-row md:flex-row items-center gap-4 w-full md:w-auto justify-center md:justify-end">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <LanguagesIcon
              className="inline h-4 w-4 text-white"
              strokeWidth={3}
            />
            <Typography className="text-[#fff] font-bold text-sm">
              Select Language
            </Typography>
            <ChevronDown
              className="inline h-4 w-4 text-white"
              strokeWidth={3}
            />
          </div>
          <div className="flex items-center gap-1">
            <PhoneCallIcon className="inline h-4 w-4 text-white" />
            <Typography className="text-[#fff] font-bold text-sm">
              9810107887
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopFloater;
