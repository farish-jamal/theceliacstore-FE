"use client";
import { Carousel } from "@/components/ui/carousel";
import { useRouter } from "next/navigation";

const slides = [
  {
    title: "Shop Gluten Free",
    button: "Shop Now",
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    path: "/products?category=gluten-free",
  },
  {
    title: "Shop Gluten Free Bestsellers",
    button: "Shop Now",
    src: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
    path: "/products?category=gluten-free&filter=bestsellers",
  },
  {
    title: "Shop Lactose Free",
    button: "Shop Now",
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    path: "/products?category=lactose-free",
  },
];

const MainSlider = () => {
  const router = useRouter();

  const handleButtonClick = (path: string) => {
    router.push(path);
  };

  return (
    <div className="w-[100%] mt-1">
      <Carousel slides={slides} onButtonClick={handleButtonClick} />
    </div>
  );
};

export default MainSlider;
