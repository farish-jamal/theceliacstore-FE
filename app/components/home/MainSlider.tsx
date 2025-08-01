"use client";
import { Carousel } from "@/components/ui/carousel";

const slides = [
  {
    title: "Gluten Free",
    button: "Discover",
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Shop Gluten Free Best Sellers",
    button: "Book Now",
    src: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Shop Lactose Free",
    button: "See More",
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
  },
];

const MainSlider = () => {
  return (
    <div className="w-[100%] mt-1">
      <Carousel slides={slides} />
    </div>
  );
};

export default MainSlider;
