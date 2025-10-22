"use client";
import { Carousel } from "@/components/ui/carousel";
import { useRouter } from "next/navigation";

const slides = [
  {
    title: "Gluten Free",
    button: "Shop Now",
    src: "/banner20.jpeg",
    path: "/products?category=68c8e3d9c668f51ededb9a24",
  },
  {
    title: "Shop Gluten Free Best Sellers",
    button: "Shop Now",
    src: "/banner21.jpg",
    path: "/products?category=68c8e3d9c668f51ededb9a24&filter=bestsellers",
  },
  {
    title: "Shop Organic",
    button: "Shop Now",
    src: "/banner22.jpg",
    path: "/products?category=68c8e5b9c668f51ededb9a30",
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
