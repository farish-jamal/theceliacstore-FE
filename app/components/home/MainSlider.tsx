"use client";
import { Carousel } from "@/components/ui/carousel";
import { useRouter } from "next/navigation";

const slides = [
  {
    title: "Gluten Free",
    button: "Discover",
    src: "/banner12.png",
    path: "/products?category=gluten-free",
  },
  {
    title: "Shop Gluten Free Best Sellers",
    button: "Book Now",
    src: "/banner12.png",
    path: "/products?category=gluten-free&filter=bestsellers",
  },
  {
    title: "Shop Lactose Free",
    button: "See More",
    src: "/banner12.png",
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
