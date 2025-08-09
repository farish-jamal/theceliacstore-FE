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

// Alternative open source brand logos (PNG, transparent)
const brands = [
  {
    name: "Chocolate Temptation",
    url: "/brand-1.webp",
    link: "/products?filter_brand=chocolate-temptation",
    value: "chocolate-temptation",
  },
  {
    name: "Sai Foods",
    url: "/brand-2.webp",
    link: "/products?filter_brand=sai-foods",
    value: "sai-foods",
  },
  {
    name: "BeWell",
    url: "/brand-3.webp",
    link: "/products?filter_brand=bewell",
    value: "bewell",
  },
  {
    name: "Zero G",
    url: "/brand-4.webp",
    link: "/products?filter_brand=zero-g",
    value: "zero-g",
  },
  {
    name: "Wheafree",
    url: "/brand-5.webp",
    link: "/products?filter_brand=wheafree",
    value: "wheafree",
  },
  {
    name: "Dr Gluten",
    url: "/brand-6.webp",
    link: "/products?filter_brand=dr-gluten",
    value: "dr-gluten",
  },
  {
    name: "Dr Schar",
    url: "/brand-7.webp",
    link: "/products?filter_brand=dr-schar",
    value: "dr-schar",
  },
  {
    name: "Anmolpreet",
    url: "/brand-8.webp",
    link: "/products?filter_brand=anmolpreet",
    value: "anmolpreet",
  },
  {
    name: "Whole Food",
    url: "/brand-9.webp",
    link: "/products?filter_brand=whole-food",
    value: "whole-food",
  },
  {
    name: "Cornitos",
    url: "/brand-10.webp",
    link: "/products?filter_brand=cornitos",
    value: "cornitos",
  },
  {
    name: "24 Mantra",
    url: "/brand-11.webp",
    link: "/products?filter_brand=24-mantra",
    value: "24-mantra",
  },
  {
    name: "Nutra Hi",
    url: "/brand-12.webp",
    link: "/products?filter_brand=nutra-hi",
    value: "nutra-hi",
  },
  {
    name: "Fidalgo",
    url: "/brand-13.webp",
    link: "/products?filter_brand=fidalgo",
    value: "fidalgo",
  },
  {
    name: "MAMA",
    url: "/brand-14.webp",
    link: "/products?filter_brand=mama",
    value: "mama",
  },
  {
    name: "So Good",
    url: "/brand-15.webp",
    link: "/products?filter_brand=so-good",
    value: "so-good",
  },
  {
    name: "Orgran",
    url: "/brand-16.webp",
    link: "/products?filter_brand=orgran",
    value: "orgran",
  },
];

const TopBrands = () => {
  const isMobile = useIsMobile();
  return (
    <div className="flex flex-col mt-10 px-4 lg:px-0 gap-8 mb-8">
      <Typography variant="h1" className="text-center text-3xl font-bold mb-4">
        Top Brands
      </Typography>

      <div className="w-full lg:w-[70%] mx-auto rounded-lg bg-white">
        <Carousel
          opts={{
            align: "center",
            loop: true,
          }}
        >
          <CarouselContent>
            {brands.map((brand, index) => (
              <CarouselItem
                key={index}
                className="flex items-center justify-center basis-1/2 md:basis-1/3 lg:basis-1/6"
              >
                <Link href={brand.link} className="w-full h-full flex items-center justify-center">
                  <Image
                    src={brand.url}
                    alt={brand.name}
                    width={180}
                    height={80}
                    className="w-auto h-20 object-contain bg-transparent"
                  />
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
