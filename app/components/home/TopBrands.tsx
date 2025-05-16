import Image from "next/image";
import { Typography } from "../typography/Typography";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../carousel/CustomCarousel";

// Alternative open source brand logos (PNG, transparent)
const brands = [
  {
    name: "Nestle",
    url: "https://logo.clearbit.com/nestle.com",
  },
  {
    name: "Kellogg's",
    url: "https://logo.clearbit.com/kelloggs.com",
  },
  {
    name: "Quaker",
    url: "https://logo.clearbit.com/quakeroats.com",
  },
  {
    name: "Barilla",
    url: "https://logo.clearbit.com/barilla.com",
  },
  {
    name: "Alpro",
    url: "https://logo.clearbit.com/alpro.com",
  },
  {
    name: "Oatly",
    url: "https://logo.clearbit.com/oatly.com",
  },
  {
    name: "Silk",
    url: "https://logo.clearbit.com/silk.com",
  },
  {
    name: "Daiya",
    url: "https://logo.clearbit.com/daiyafoods.com",
  },
  {
    name: "Beyond Meat",
    url: "https://logo.clearbit.com/beyondmeat.com",
  },
  {
    name: "Impossible Foods",
    url: "https://logo.clearbit.com/impossiblefoods.com",
  },
];

const TopBrands = () => {
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
                <Image
                  src={brand.url}
                  alt={brand.name}
                  width={180}
                  height={80}
                  className="w-auto h-20 object-contain bg-transparent"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
};

export default TopBrands;
