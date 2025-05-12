import { Typography } from "../typography/Typography";
import {
  ChevronDown,
  ChevronRight,
  LanguagesIcon,
  PhoneCallIcon,
} from "lucide-react";

const TopFloater = () => {
  return (
    <div className="flex items-center justify-between bg-[#58B45B] px-24 py-2">
      <div className="flex items-center gap-1">
        <Typography className="text-[#fff] font-bold text-sm">
          10% OFF ON FEATURED UPCOMING BRANDS
        </Typography>
        <ChevronRight className="inline h-4 w-4 text-white" strokeWidth={3} />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <LanguagesIcon
            className="inline h-4 w-4 text-white "
            strokeWidth={3}
          />

          <Typography className="text-[#fff] font-bold text-sm">
            Select Language
          </Typography>
          <ChevronDown className="inline h-4 w-4 text-white " strokeWidth={3} />
        </div>

        <div className="flex items-center gap-1">
          <PhoneCallIcon className="inline h-4 w-4 text-white" />
          <Typography className="text-[#fff] font-bold text-sm">
            9810107887
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default TopFloater;
