"use client";

import { Button } from "@/components/ui/button";
import BlogCard from "../cards/BlogCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../carousel/CustomCarousel";
import { ArrowRight } from "lucide-react";
import { useIsMobile } from "@/app/hooks/useIsMobile";

// Example blog data
const blogs = [
  {
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    title: "The Benefits of a Gluten-Free Diet",
    tag: "Health",
    views: 120,
    date: new Date("2024-05-01"),
  },
  {
    url: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2",
    title: "Top 10 Organic Essentials",
    tag: "Organic",
    views: 95,
    date: new Date("2024-04-28"),
  },
  {
    url: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca",
    title: "Lactose-Free Living: Tips & Tricks",
    tag: "Lifestyle",
    views: 80,
    date: new Date("2024-04-15"),
  },
];

const BlogsSection = () => {
  const isMobile = useIsMobile();

  return (
    <div className="mt-10 px-4 lg:px-0 mb-10">
      <h2 className="text-center text-3xl font-bold mb-4">Blogs</h2>
      <div className="w-full lg:w-4/5 mx-auto rounded-lg bg-white p-4">
        <Carousel
          opts={{
            align: "center",
            loop: true,
          }}
        >
          <CarouselContent className="p-4 gap-8">
            {blogs.map((blog, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <BlogCard
                  url={blog.url}
                  title={blog.title}
                  tag={blog.tag}
                  views={blog.views}
                  date={blog.date}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          {!isMobile && <CarouselPrevious />}
          {!isMobile && <CarouselNext />}
        </Carousel>

        <div className="flex justify-center my-6">
          <Button className="rounded-full w-[9rem] bg-[#4CAF50] hover:bg-[#4CAF50] font-bold py-5 flex items-center justify-center gap-2">
            Show More <ArrowRight className="w-5 h-5 stroke-2 mt-0.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlogsSection;
