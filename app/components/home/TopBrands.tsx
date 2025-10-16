"use client";

import Image from "next/image";
import { Typography } from "../typography/Typography";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../carousel/CustomCarousel";
import { useIsMobile } from "@/app/hooks/useIsMobile";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getBrands, Brand } from "@/app/apis/getBrands";
import BrandSkeleton from "../loaders/BrandSkeleton";

// Alternative open source brand logos (PNG, transparent)
// const brands = [
//   {
//     name: "Chocolate Temptation",
//     url: "/brand-1.webp",
//     link: "/products?filter_brand=chocolate-temptation",
//     value: "chocolate-temptation",
//   },
//   {
//     name: "Sai Foods",
//     url: "/brand-2.webp",
//     link: "/products?filter_brand=sai-foods",
//     value: "sai-foods",
//   },
//   {
//     name: "BeWell",
//     url: "/brand-3.webp",
//     link: "/products?filter_brand=bewell",
//     value: "bewell",
//   },
//   {
//     name: "Zero G",
//     url: "/brand-4.webp",
//     link: "/products?filter_brand=zero-g",
//     value: "zero-g",
//   },
//   {
//     name: "Wheafree",
//     url: "/brand-5.webp",
//     link: "/products?filter_brand=wheafree",
//     value: "wheafree",
//   },
//   {
//     name: "Dr Gluten",
//     url: "/brand-6.webp",
//     link: "/products?filter_brand=dr-gluten",
//     value: "dr-gluten",
//   },
//   {
//     name: "Dr Schar",
//     url: "/brand-7.webp",
//     link: "/products?filter_brand=dr-schar",
//     value: "dr-schar",
//   },
//   {
//     name: "Anmolpreet",
//     url: "/brand-8.webp",
//     link: "/products?filter_brand=anmolpreet",
//     value: "anmolpreet",
//   },
//   {
//     name: "Whole Food",
//     url: "/brand-9.webp",
//     link: "/products?filter_brand=whole-food",
//     value: "whole-food",
//   },
//   {
//     name: "Cornitos",
//     url: "/brand-10.webp",
//     link: "/products?filter_brand=cornitos",
//     value: "cornitos",
//   },
//   {
//     name: "24 Mantra",
//     url: "/brand-11.webp",
//     link: "/products?filter_brand=24-mantra",
//     value: "24-mantra",
//   },
//   {
//     name: "Nutra Hi",
//     url: "/brand-12.webp",
//     link: "/products?filter_brand=nutra-hi",
//     value: "nutra-hi",
//   },
//   {
//     name: "Fidalgo",
//     url: "/brand-13.webp",
//     link: "/products?filter_brand=fidalgo",
//     value: "fidalgo",
//   },
//   {
//     name: "MAMA",
//     url: "/brand-14.webp",
//     link: "/products?filter_brand=mama",
//     value: "mama",
//   },
//   {
//     name: "So Good",
//     url: "/brand-15.webp",
//     link: "/products?filter_brand=so-good",
//     value: "so-good",
//   },
//   {
//     name: "Orgran",
//     url: "/brand-16.webp",
//     link: "/products?filter_brand=orgran",
//     value: "orgran",
//   },
// ];

const TopBrands = () => {
  const isMobile = useIsMobile();
  
  // Fetch brands from API
  const { data: brandsResponse, isLoading, error } = useQuery({
    queryKey: ['brands'],
    queryFn: getBrands,
  });

  // Default brand logo for brands without images
  const defaultBrandLogo = "/brand-1.webp";

  if (isLoading) {
    return (
      <div className="flex flex-col mt-6 md:mt-10 px-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <Typography variant="h1" className="text-center text-xl md:text-3xl font-bold">
          Top Brands
        </Typography>
        <BrandSkeleton />
      </div>
    );
  }

  if (error || !brandsResponse?.data?.brands) {
    return (
      <div className="flex flex-col mt-6 md:mt-10 px-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <Typography variant="h1" className="text-center text-xl md:text-3xl font-bold">
          Top Brands
        </Typography>
        <div className="text-center text-gray-500">
          Failed to load brands. Please try again later.
        </div>
      </div>
    );
  }

  const brands = brandsResponse.data.brands;

  return (
    <div className="flex flex-col mt-6 md:mt-10 px-4 gap-4 md:gap-6 mb-6 md:mb-8">
      <Typography variant="h1" className="text-center text-xl md:text-3xl font-bold">
        Top Brands
      </Typography>

      <div className="w-full lg:w-[80%] mx-auto">
        <Carousel
          opts={{
            align: "start",
            loop: true,
            dragFree: true,
          }}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {brands.map((brand: Brand) => (
              <CarouselItem
                key={brand._id}
                className="pl-2 md:pl-4 basis-1/3 md:basis-1/4 lg:basis-1/6"
              >
                <Link 
                  href={`/products?brands=${brand._id}`} 
                  className="flex flex-col items-center justify-center p-2 md:p-4 hover:scale-105 transition-transform duration-200"
                >
                  <Image
                    src={brand.images && brand.images.length > 0 ? brand.images[0] : defaultBrandLogo}
                    alt={brand.name}
                    width={120}
                    height={60}
                    className="w-auto h-12 md:h-16 object-contain bg-transparent max-w-full"
                  />
                  <span className="text-xs md:text-sm text-gray-700 text-center font-medium mt-1 md:mt-2 line-clamp-1">
                    {brand.name}
                  </span>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          {!isMobile && <CarouselPrevious />}
          {!isMobile && <CarouselNext />}
        </Carousel>
      </div>
    </div>
  );
};

export default TopBrands;
