"use client";

import { Typography } from "../typography/Typography";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../carousel/CustomCarousel";
import ReviewCard from "../cards/ReviewCard";
import { useIsMobile } from "@/app/hooks/useIsMobile";

const reviews = [
  {
    name: "John Doe",
    review:
      "Pellentesque eu nibh eget mauris congue mattis mattis nec tellus. Pellentesque eu nibh eget mauris congue mattis mattis nec tellus.. Phasellus imperdiet elit eu magna dictum, !",
    rating: 5,
    url: "https://randomuser.me/api/portraits/men/1.jpg",
    type: "Customer",
  },
  {
    name: "Jane Smith",
    review:
      "Pellentesque eu nibh eget mauris congue mattis mattis nec tellus. Pellentesque eu nibh eget mauris congue mattis mattis nec tellus...",
    rating: 4,
    url: "https://randomuser.me/api/portraits/women/2.jpg",
    type: "Customer",
  },
  {
    name: "Sam Wilson",
    review:
      "Pellentesque eu nibh eget mauris congue mattis mattis nec tellus. Pellentesque eu nibh eget mauris congue mattis mattis nec tellus..",
    rating: 5,
    url: "https://randomuser.me/api/portraits/men/3.jpg",
    type: "Customer",
  },
];

const ReviewSection = () => {
  const isMobile = useIsMobile();
  return (
    <div className="mt-10 px-2 sm:px-4 lg:px-0 gap-12">
      <Typography variant="h1" className="text-center text-3xl font-bold mb-4">
        Why do People Love us?
      </Typography>

      <div className="w-full max-w-full lg:w-4/5 mx-auto rounded-lg overflow-x-hidden">
        <Carousel
          opts={{
            align: "center",
            loop: true,
          }}
          className="p-0 sm:p-4"
        >
          <CarouselContent>
            {reviews.map((review, index) => (
              <CarouselItem
                key={index}
                className={
                  isMobile
                    ? "min-w-0 w-full flex-shrink-0"
                    : "md:basis-1/2 lg:basis-1/3"
                }
              >
                <ReviewCard
                  name={review.name}
                  review={review.review}
                  rating={review.rating}
                  url={review.url}
                  type={review.type}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          {isMobile ? (
            <div className="flex justify-center items-center gap-4 mt-2">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          ) : (
            <>
              <CarouselPrevious />
              <CarouselNext />
            </>
          )}
        </Carousel>
      </div>
    </div>
  );
};

export default ReviewSection;
