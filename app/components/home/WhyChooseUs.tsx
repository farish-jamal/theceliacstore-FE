import DeliveryIcon from "@/app/icons/DeliveryIcon";
import { Typography } from "../typography/Typography";
import SecurePaymentIcon from "@/app/icons/SecurePaymentIcon";
import ProductBoxIcon from "@/app/icons/ProductBoxIcon";
import CakeIcon from "@/app/icons/CakeIcon";

const features = [
  {
    title: "Nation Wide Shopping",
    subtitle: "All over India Delivery",
    icon: <DeliveryIcon />,
  },
  {
    title: "100% Secure Payment",
    subtitle: "We ensure your money is save",
    icon: <SecurePaymentIcon />,
  },
  {
    title: "470+ Gluten Free Products",
    subtitle: "More than any store",
    icon: <ProductBoxIcon />,
  },
  {
    title: "Bakery (Delhi NCR only)",
    subtitle: "Gluten Free Cakes in Delhi NCR",
    icon: <CakeIcon />,
  },
];

const WhyChooseUs = () => {
  return (
    <div className="flex flex-col mt-10 px-4 lg:px-0 gap-10 w-full">
      <Typography variant="h1" className="text-center text-3xl font-bold">
        Why Choose Us
      </Typography>

      <div className="flex flex-row flex-wrap md:gap-16 gap-12 items-center justify-center mb-4">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-row gap-4 items-center">
            {feature.icon}
            <div className="flex flex-col">
              <Typography variant="p" className="text-base font-bold">
                {feature.title}
              </Typography>
              <Typography variant="p" className="text-sm text-gray-500">
                {feature.subtitle}
              </Typography>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyChooseUs;
