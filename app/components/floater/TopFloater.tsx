"use client";

import { Typography } from "../typography/Typography";
import {
  ChevronDown,
  LanguagesIcon,
  PhoneCallIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useAppSelector, useAppDispatch } from "@/app/hooks/reduxHooks";
import { setLanguage } from "@/app/slices/languageSlice";


const TopFloater = () => {
  const dispatch = useAppDispatch();
  const { label: languageLabel, code: languageCode } = useAppSelector(
    (state) => state.language
  );

  const languages = [
    { label: "English", code: "en" },
    { label: "हिंदी", code: "hi" },
    { label: "मराठी", code: "mr" },
    { label: "বাংলা", code: "bn" },
    { label: "ગુજરાતી", code: "gu" },
    { label: "தமிழ்", code: "ta" },
    { label: "తెలుగు", code: "te" },
    { label: "Français", code: "fr" },
    { label: "Español", code: "es" },
    { label: "Italiano", code: "it" },
    { label: "Deutsch", code: "de" },
  ];
  return (
    <div className="flex flex-col md:flex-row items-center justify-between bg-[#58B45B] px-4 md:px-24 py-2 gap-2 md:gap-0">
      <div className="flex items-center gap-1 w-full md:w-auto justify-center md:justify-start">
        {/* <ChevronRight className="inline h-4 w-4 text-white" strokeWidth={3} /> */}
      </div>

      {/* On mobile: language and phone in same row. On desktop: row with gap */}
      <div className="flex flex-row md:flex-row items-center gap-4 w-full md:w-auto justify-center md:justify-end">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <LanguagesIcon
              className="inline h-4 w-4 text-white"
              strokeWidth={3}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 bg-transparent border-none outline-none text-white font-bold text-sm cursor-pointer">
                  {languageLabel}
                  <ChevronDown className="inline h-4 w-4 text-white ml-1" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => dispatch(setLanguage(lang))}
                    className={
                      languageCode === lang.code
                        ? "font-bold text-[#4CAF50]"
                        : ""
                    }
                  >
                    {lang.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
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
