import Image from "next/image";
import { Typography } from "../typography/Typography";
import { Button } from "@/components/ui/button";
import { MapPin, PhoneCall } from "lucide-react";

const StoreInfo = () => {
  return (
    <div className="bg-[#EDF2EE] flex flex-col md:flex-row py-8 md:py-[5%] px-4 md:px-[10%] gap-8 md:gap-24 items-center">
      <Image
        src={"/store-image.png"}
        alt="Store"
        width={500}
        height={450}
        className="object-cover w-full max-w-xs md:max-w-[500px] h-auto"
        priority
      />

      <div className="flex flex-col justify-between gap-5 my-4 md:my-8 w-full">
        <div className="flex flex-col gap-6 md:gap-8">
          <Typography
            variant="h1"
            className="text-2xl md:text-h leading-8 md:leading-10 text-center md:text-left"
          >
            Reach Our Delhi Store & <br /> Shop in Person!
          </Typography>

          <Typography className="text-base md:text-h leading-6 text-gray-500 text-center md:text-left">
            Get 1:1 guidance and recommendations based on your dietary{" "}
            <br className="hidden md:block" />
            requirements
          </Typography>
        </div>

        <div className="flex flex-col md:flex-row gap-3 md:gap-2 w-full md:w-auto items-center md:items-start justify-center md:justify-start">
          <Button className="rounded-full w-full md:w-[11rem] bg-[#4CAF50] hover:bg-[#4CAF50] font-bold py-4 md:py-5 flex items-center justify-center gap-2">
            <MapPin /> Get Directions
          </Button>

          <Button
            variant="outline"
            className="rounded-full border-1 border-black w-full md:w-[8rem] bg-transparent font-bold py-4 md:py-5 flex items-center justify-center gap-2"
          >
            <PhoneCall /> Call Us
          </Button>

          <Button
            variant="outline"
            className="rounded-full border-1 border-black w-full md:w-[8rem] bg-transparent font-bold py-4 md:py-5 flex items-center justify-center gap-2"
          >
            Whatsapp
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StoreInfo;
