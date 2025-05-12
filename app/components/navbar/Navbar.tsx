"use client";

import Image from "next/image";
import { useState } from "react";
import { ShoppingBag, ChevronDown, Search, CircleUser } from "lucide-react";
import { Input } from "@/components/ui/input";
import CartIcon from "@/app/icons/CartIcon";

const navItems = [
  { label: "Home" },
  { label: "Shop", icon: <ShoppingBag className="ml-1 h-5 w-5" /> },
  { label: "Blog" },
  { label: "About us", icon: <ChevronDown className="ml-1 h-5 w-5" /> },
];

const categoriesItems = [
  { label: "Best Sellers" },
  { label: "Imported Picks" },
  { label: "Fresh Cakes (Delhi NCR)" },
];

const Navbar = () => {
  const [active, setActive] = useState("Home");
  const [activeCategory, setActiveCategory] = useState("Best Sellers");

  return (
    <div className="flex flex-col shadow-[0px_4px_12px_0px_rgba(0,0,0,0.16)]">
      <div className="flex items-center justify-between bg-[#fff] px-24 py-2 border-b-[1px] border-[#E6E6E6]">
        <div className="flex items-center gap-12">
          <Image
            src="/celiac-brand-logo.png"
            alt="logo"
            width={200}
            height={200}
          />
          <NavItems active={active} setActive={setActive} />
        </div>
        <div className="flex items-center justify-end gap-8">
          <div className="relative w-70">
            <Input
              type="text"
              placeholder="Search..."
              className="w-full border border-gray-300 rounded-[2rem] px-5 pr-10 py-[1.35rem]"
            />
            <Search className="absolute right-5 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 cursor-pointer rounded-full hover:bg-slate-50 p-2">
              <CartIcon />
            </div>
            {/* <Button variant="ghost" size="icon" className="rounded-full p-0"> */}
            <div className="flex items-center gap-1 cursor-pointer rounded-full hover:bg-slate-50 p-2">
              <CircleUser className="h-8 w-8" />
              <ChevronDown className="h-4 w-4 mt-2" />
            </div>
            {/* </Button> */}
          </div>
        </div>
      </div>

      <div className="flex items-center px-24 py-3 bg-[#fff]">
        <CategoryItem active={activeCategory} setActive={setActiveCategory} />
      </div>
    </div>
  );
};

const NavItems = ({
  active,
  setActive,
}: {
  active: string;
  setActive: (label: string) => void;
}) => (
  <div className="flex items-center gap-8">
    {navItems.map((item) => (
      <div
        key={item.label}
        onClick={() => setActive(item.label)}
        className={`flex items-center cursor-pointer font-medium text-[18px] transition-colors
          ${active === item.label ? "text-[#4CAF50]" : "text-[#717171"}
        `}
      >
        {item.label}
        {item.icon}
      </div>
    ))}
  </div>
);

const CategoryItem = ({
  active,
  setActive,
}: {
  active: string;
  setActive: (label: string) => void;
}) => (
  <div className="flex items-center gap-8">
    {categoriesItems.map((item) => (
      <div
        key={item.label}
        onClick={() => setActive(item.label)}
        className={`flex items-center cursor-pointer font-bold text-[14px] transition-colors
          ${active === item.label ? "text-[#F76C6B]" : "text-[#333333"}
        `}
      >
        {item.label}
      </div>
    ))}
  </div>
);

export default Navbar;
