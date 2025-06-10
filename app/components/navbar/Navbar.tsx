"use client";

import Image from "next/image";
import { useState } from "react";
import {
  ShoppingBag,
  ChevronDown,
  Search,
  CircleUser,
  Menu,
  X,
  LogOut,
  CircleHelp,
  ClipboardList,
  Settings2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import CartIcon from "@/app/icons/CartIcon";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Typography } from "../typography/Typography";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/app/hooks/reduxHooks";
import { logout as logoutAction } from "@/app/slices/authSlice";

const navItems = [
  { label: "Home", path: "/" },
  {
    label: "Shop",
    icon: <ShoppingBag className="ml-1 h-5 w-5" />,
    path: "/products",
  },
  { label: "Blog", path: "/blog" },
  {
    label: "About us",
    icon: <ChevronDown className="ml-1 h-5 w-5" />,
    path: "/about",
  },
];

const categoriesItems = [
  { label: "Best Sellers" },
  { label: "Imported Picks" },
  { label: "Fresh Cakes (Delhi NCR)" },
];

const Navbar = () => {
  const [active, setActive] = useState("Home");
  const [activeCategory, setActiveCategory] = useState("Best Sellers");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  console.log("auth", auth);
  const handleLogout = () => {
    dispatch(logoutAction());
    router.push("/login");
  };

  return (
    <header className="flex flex-col w-full">
      {/* Main Nav */}
      <nav className="flex items-center justify-between bg-[#fff] px-4 md:px-12 lg:px-24 py-2 border-b border-[#E6E6E6] w-full">
        <div className="flex items-center gap-4 md:gap-12">
          <Link href="/" aria-label="Home">
            <Image
              src="/celiac-brand-logo.png"
              alt="logo"
              width={140}
              height={40}
              className="h-10 w-auto"
            />
          </Link>
          {/* Desktop Nav */}
          <div className="hidden md:block">
            <NavItems active={active} setActive={setActive} />
          </div>
        </div>
        {/* Search & Icons */}
        <div className="flex items-center gap-4 md:gap-8">
          <div className="relative w-40 md:w-60 hidden md:block">
            <Input
              type="text"
              placeholder="Search..."
              className="w-full border border-gray-300 rounded-[2rem] px-5 pr-10 py-2"
              aria-label="Search"
            />
            <Search
              className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
              aria-hidden
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => router.push("/cart")}
              className="flex items-center gap-1 cursor-pointer rounded-full hover:bg-slate-50 p-2"
              aria-label="Cart"
            >
              <CartIcon />
            </button>
            {/* User menu with shadcn dropdown, only if logged in */}
            {auth.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex items-center gap-1 cursor-pointer rounded-full hover:bg-slate-50 p-2"
                    aria-label="User menu"
                    type="button"
                  >
                    <CircleUser className="h-7 w-7" />
                    <ChevronDown className="h-4 w-4 mt-1" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44 p-1">
                  <DropdownMenuItem asChild className="py-2">
                    <Typography variant="h3">
                      {`Welcome${
                        auth.user.name
                          ? ", " + auth.user.name
                          : auth.user.email
                          ? ", " + auth.user.email
                          : "!"
                      }`}
                    </Typography>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="mx-2" />
                  <DropdownMenuItem asChild>
                    <Link href="/account" className="flex items-center gap-2">
                      <Settings2 className="h-4 w-4 rotate-90" />
                      My Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="flex items-center gap-2">
                      <ClipboardList className="h-4 w-4" />
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/help" className="flex items-center gap-2">
                      <CircleHelp className="h-4 w-4" />
                      Help
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="mx-2" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-600 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 text-red-600" />
                    Signout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 rounded-full border border-green-500 text-green-600 font-semibold hover:bg-green-50 transition-colors"
              >
                Login
              </Link>
            )}
          </div>
          {/* Hamburger for mobile */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Open menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#E6E6E6] px-4 py-4 z-50">
          <NavItems active={active} setActive={setActive} mobile />
          <div className="mt-4">
            <Input
              type="text"
              placeholder="Search..."
              className="w-full border border-gray-300 rounded-[2rem] px-5 pr-10 py-2"
              aria-label="Search"
            />
          </div>
          <div className="mt-4">
            <CategoryItem
              active={activeCategory}
              setActive={setActiveCategory}
              mobile
            />
          </div>
        </div>
      )}

      {/* Desktop Categories */}
      <section
        className="hidden md:flex items-center px-12 lg:px-24 py-3 bg-[#fff]"
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
  mobile = false,
}: {
  active: string;
  setActive: (label: string) => void;
  mobile?: boolean;
}) => {
  const router = useRouter();

  return (
    <ul
      className={`flex flex-col ${mobile ? "gap-4" : "md:flex-row md:gap-8"} ${
        mobile ? "" : "items-center"
      }`}
    >
      {navItems.map((item) => (
        <li key={item.label}>
          <button
            type="button"
            onClick={() => {
              setActive(item.label);
              if (item.path) {
                router.push(item.path);
              }
            }}
            className={`flex items-center font-medium text-[18px] cursor-pointer transition-colors bg-transparent outline-none
            ${active === item.label ? "text-[#4CAF50]" : "text-[#717171]"}
            hover:text-[#4CAF50]`}
            aria-current={active === item.label ? "page" : undefined}
          >
            {item.label}
            {item.icon}
          </button>
        </li>
      ))}
    </ul>
  );
};

const CategoryItem = ({
  active,
  setActive,
  mobile = false,
}: {
  active: string;
  setActive: (label: string) => void;
  mobile?: boolean;
}) => (
  <ul className={`flex ${mobile ? "flex-col gap-4" : "items-center gap-8"}`}>
    {categoriesItems.map((item) => (
      <li key={item.label}>
        <button
          type="button"
          onClick={() => setActive(item.label)}
          className={`flex items-center font-bold text-[14px] transition-colors cursor-pointer bg-transparent outline-none
            ${active === item.label ? "text-[#F76C6B]" : "text-[#333333]"}
            hover:text-[#F76C6B]`}
          aria-current={active === item.label ? "page" : undefined}
        >
          {item.label}
        </button>
      </li>
    ))}
  </ul>
);

export default Navbar;
