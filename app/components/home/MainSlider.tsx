"use client";
import { Carousel } from "@/components/ui/carousel";
import { useRouter } from "next/navigation";

const slides = [
  {
    src: "/banner20.jpeg",
    path: "/products?category=68c8e3d9c668f51ededb9a24",
  },
  {
    src: "/banner21.jpg",
    path: "/products?category=68c8e3d9c668f51ededb9a24&filter=bestsellers",
  },
  {
    src: "/banner22.jpg",
    path: "/products?category=68c8e5b9c668f51ededb9a30",
  },
];

const MainSlider = () => {
  const router = useRouter();

  const handleSlideClick = (path: string) => {
    router.push(path);
  };

  return (
    <div className="w-full mt-0 md:mt-1 ">
      <Carousel 
        slides={slides} 
        onSlideClick={handleSlideClick}
        mobileImageFit="cover"
      />
    </div>
  );
};

export default MainSlider;
