"use client";
import { Carousel } from "@/components/ui/carousel";
import { useRouter } from "next/navigation";

const slides = [
  {
    title: "Gluten Free",
    button: "Discover",
    src: "https://cdn-edhge.nitrocdn.com/dfVPCUWKqkfovjbPcXXRKXjmPelKAlzA/assets/images/optimized/rev-c793097/theceliacstore.com/wp-content/uploads/2023/11/banner-1.webp",
    path: "/products?category=gluten-free",
  },
  {
    title: "Shop Gluten Free Best Sellers",
    button: "Book Now",
    src: "https://cdn-edhge.nitrocdn.com/dfVPCUWKqkfovjbPcXXRKXjmPelKAlzA/assets/images/optimized/rev-c793097/theceliacstore.com/wp-content/uploads/2023/11/banner-1.webp",
    path: "/products?category=gluten-free&filter=bestsellers",
  },
  {
    title: "Shop Lactose Free",
    button: "See More",
    src: "https://cdn-edhge.nitrocdn.com/dfVPCUWKqkfovjbPcXXRKXjmPelKAlzA/assets/images/optimized/rev-c793097/theceliacstore.com/wp-content/uploads/2023/11/banner-1.webp",
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
