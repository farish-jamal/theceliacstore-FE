import Image from "next/image";
import { Typography } from "../typography/Typography";

const dietaryItems = [
  {
    title: "Gluten-Free",
    imageSrc: "/multigrain.png",
    bgColor: "bg-green-200",
  },
  {
    title: "Lactose-Free",
    imageSrc: "/plant-based-beverage.png",
    bgColor: "bg-blue-200",
  },
  {
    title: "Organcic-Essential",
    imageSrc: "/honey.png",
    bgColor: "bg-yellow-200",
  },
];

const DietaryCategories = () => {
  return (
    <section aria-labelledby="dietary-heading" className="py-10">
      <div className="text-center mb-8">
        <Typography variant="h1">Your Dietary Needs</Typography>
        <div className="w-12 h-1 bg-green-500 mx-auto mt-2 rounded-full" />
      </div>

      <ul className="flex flex-col md:flex-row items-center justify-evenly gap-10 max-w-6xl mx-auto px-4">
        {dietaryItems.map(({ title, imageSrc, bgColor }, idx) => (
          <li
            key={idx}
            className="flex flex-col items-center relative w-48 md:w-56"
          >
            <div
              className={`${bgColor} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full h-32 w-32 md:h-44 md:w-44 z-[-1]`}
            />
            <Image
              src={imageSrc}
              alt={title}
              width={120}
              height={120}
              className="object-contain relative z-10"
            />
            <h3 className="mt-4 text-xl font-medium text-gray-700 text-center">
              {title}
            </h3>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default DietaryCategories;
