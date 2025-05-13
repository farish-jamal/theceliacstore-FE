"use client";

import Image from "next/image";
import { useState } from "react";
import { ShoppingBag, ChevronDown, Search, CircleUser } from "lucide-react";
import { Input } from "@/components/ui/input";
import CartIcon from "@/app/icons/CartIcon";
import Link from "next/link";

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
    <header className="flex flex-col ">
      {/* shadow-[0px_4px_12px_0px_rgba(0,0,0,0.16)] */}
      <nav
        className="flex items-center justify-between bg-[#fff] px-24 py-2 border-b-[1px] border-[#E6E6E6]"
        aria-label="Main navigation"
      >
        <div className="flex items-center gap-12">
          <Link href="/" aria-label="Home">
            <Image
              src="/celiac-brand-logo.png"
              alt="logo"
              width={200}
              height={200}
            />
          </Link>
          <NavItems active={active} setActive={setActive} />
        </div>
        <div className="flex items-center justify-end gap-8">
          <div className="relative w-70">
            <Input
              type="text"
              placeholder="Search..."
              className="w-full border border-gray-300 rounded-[2rem] px-5 pr-10 py-[1.35rem]"
              aria-label="Search"
            />
            <Search
              className="absolute right-5 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400"
              aria-hidden
            />
          </div>
          <div className="flex items-center gap-4">
            <div
              className="flex items-center gap-1 cursor-pointer rounded-full hover:bg-slate-50 p-2"
              aria-label="Cart"
            >
              <CartIcon />
            </div>
            <div
              className="flex items-center gap-1 cursor-pointer rounded-full hover:bg-slate-50 p-2"
              aria-label="User menu"
            >
              <CircleUser className="h-8 w-8" />
              <ChevronDown className="h-4 w-4 mt-2" />
            </div>
          </div>
        </div>
      </nav>

      <section
        className="flex items-center px-24 py-3 bg-[#fff]"
        aria-label="Categories"
      >
        <CategoryItem active={activeCategory} setActive={setActiveCategory} />
      </section>
    </header>
  );
};

const NavItems = ({
  active,
  setActive,
}: {
  active: string;
  setActive: (label: string) => void;
}) => (
  <ul className="flex items-center gap-8">
    {navItems.map((item) => (
      <li key={item.label}>
        <button
          type="button"
          onClick={() => setActive(item.label)}
          className={`flex items-center font-medium text-[18px] transition-colors bg-transparent outline-none
            ${active === item.label ? "text-[#4CAF50]" : "text-[#717171]"}
          `}
          aria-current={active === item.label ? "page" : undefined}
        >
          {item.label}
          {item.icon}
        </button>
      </li>
    ))}
  </ul>
);

const CategoryItem = ({
  active,
  setActive,
}: {
  active: string;
  setActive: (label: string) => void;
}) => (
  <ul className="flex items-center gap-8">
    {categoriesItems.map((item) => (
      <li key={item.label}>
        <button
          type="button"
          onClick={() => setActive(item.label)}
          className={`flex items-center font-bold text-[14px] transition-colors bg-transparent outline-none
            ${active === item.label ? "text-[#F76C6B]" : "text-[#333333]"}
          `}
          aria-current={active === item.label ? "page" : undefined}
        >
          {item.label}
        </button>
      </li>
    ))}
  </ul>
);

export default Navbar;
