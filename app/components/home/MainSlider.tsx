"use client";
import { Carousel } from "@/components/ui/carousel";
import { useRouter } from "next/navigation";

const slides = [
  {
    title: "Gluten Free",
    button: "Shop Now",
    src: "/banner12.png",
    path: "/products?category=gluten-free",
  },
  {
    title: "Shop Gluten Free Best Sellers",
    button: "Shop Now",
    src: "/banner12.png",
    path: "/products?category=gluten-free&filter=bestsellers",
  },
  {
    title: "Shop Lactose Free",
    button: "Shop Now",
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
    <div className="w-full mt-0 md:mt-1 ">
      <Carousel 
        slides={slides} 
        onButtonClick={handleButtonClick}
        mobileImageFit="cover"
      />
    </div>
  );
};

export default MainSlider;
