import Image from "next/image";
import { Typography } from "../typography/Typography";
import { Button } from "@/components/ui/button";
import { MapPin, PhoneCall } from "lucide-react";

const StoreInfo = () => {
  return (
    <div className="bg-[#EDF2EE] flex flex-row py-[5%] px-[10%] gap-24">
      <Image
        src={"/store-image.png"}
        alt="Store"
        width={500}
        height={450}
        className="object-cover"
      />

      <div className="flex flex-col justify-between gap-5 my-8">
        <div className="flex flex-col gap-8">
          <Typography variant="h1" className="text-h leading-10">
            Reach Our Delhi Store & <br /> Shop in Person!
          </Typography>

          <Typography className="text-h leading-6 text-gray-500">
            Get 1:1 guidance and recommendations based on your dietary <br />{" "}
            requirements
          </Typography>
        </div>

        <div className="flex flex-row gap-2">
          <Button className="rounded-full w-[11rem] bg-[#4CAF50] hover:bg-[#4CAF50] font-bold py-5 flex items-center justify-center gap-2">
            <MapPin /> Get Directions
          </Button>

          <Button
            variant="outline"
            className="rounded-full border-1 border-black w-[8rem] bg-transparent font-bold py-5 flex items-center justify-center gap-2"
          >
            <PhoneCall /> Call Us
          </Button>

          <Button
            variant="outline"
            className="rounded-full border-1 border-black w-[8rem] bg-transparent font-bold py-5 flex items-center justify-center gap-2"
          >
            Whatsapp
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StoreInfo;
