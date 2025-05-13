import Image from "next/image";

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
        <h2 id="dietary-heading" className="text-4xl font-bold text-gray-800">
          Your Dietary Needs
        </h2>
        <div className="w-12 h-1 bg-green-500 mx-auto mt-2 rounded-full" />
      </div>

      <ul className="flex flex-row items-center justify-evenly gap-10 max-w-6xl mx-auto px-4">
        {dietaryItems.map(({ title, imageSrc, bgColor }, idx) => (
          <li key={idx} className={`flex flex-col items-center relative`}>
            <Image
              src={imageSrc}
              alt={title}
              width={200}
              height={200}
              className="object-contain"
            />
            <div
              className={`${bgColor} p-4 rounded-full absolute h-45 w-45 z-[-1]`}
            />
            <h3 className="mt-4 text-xl font-medium text-gray-700">{title}</h3>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default DietaryCategories;
