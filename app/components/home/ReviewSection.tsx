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
    name: "Anjali Soi / Jammu",
    review:
      "My husband has been suffering from celiac disease for the last 15 years. Besides the disease, he also suffered as there were not much options available to eat. And then searching the internet one day, I found the celiac store. I called them. They responded. And it has been a beautiful journey since then.",
    rating: 5,
    url: "https://i0.wp.com/theceliacstore.com/wp-content/uploads/2023/11/anjali-soi-125x125-1.webp?w=125&ssl=1",
    type: "Customer",
  },
  {
    name: "Kapil / Delhi",
    review:
      "My child had to shift to a lactose free diet a year ago and since then we've been ordering from The Celiac Store because we like their service and their supportiveness in every little thing. Half my son's favorite dishes he would have had to leave had we not found Celiac Store and had they not been so helpful in every which way.",
    rating: 4,
    url: "https://i0.wp.com/theceliacstore.com/wp-content/uploads/2023/11/kapil-125x125-1.webp?resize=96%2C96&ssl=1",
    type: "Customer",
  },
  {
    name: "CR Chaudhary / Delhi",
    review:
      "Celiac store is the best destination in India whether you visit physically or place your demand online. It has a very large variety of gluten free products foreign made as well as Indian made. I have been a regular customer of this store since last two years and I have gotten wonderful and in time service.",
    rating: 5,
    url: "https://i0.wp.com/theceliacstore.com/wp-content/uploads/2023/11/cr-chaudhary-125x125-1.webp?resize=96%2C96&ssl=1",
    type: "Customer",
  },
  {
    name: "Anshul Gupta / Lucknow",
    review:
      "Shifting to Wheat free and lactose free diet for someone outside a tier 1 city is very difficult. Had it not been for the Celiac Store which I found on Google, I would not have found out that I can have food other than rice and south indian.",
    rating: 5,
    url: "https://i0.wp.com/theceliacstore.com/wp-content/uploads/2023/11/anshul-gupta-125x125-1.webp?w=125&ssl=1",
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
            align: "start",
            loop: true,
            slidesToScroll: 1,
          }}
          className="p-0 sm:p-4"
        >
          <CarouselContent>
            {reviews.map((review, index) => (
              <CarouselItem
                key={index}
                className={
                  isMobile
                    ? "pl-4 basis-full"
                    : "pl-4 md:basis-1/2 lg:basis-1/3"
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
            <div className="flex justify-center items-center gap-4 mt-4">
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
