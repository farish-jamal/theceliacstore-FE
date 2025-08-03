import { Facebook, Instagram } from "lucide-react";
import { Typography } from "../typography/Typography";
import Image from "next/image";

const CONTACT_INFO = {
  phone: "+91 98101 07887",
  email: "theceliacstore@gmail.com",
  address: "A373, Defence Colony, New Delhi",
};

const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/theceliacstore",
  instagram: "https://www.instagram.com/theceliacstore/",
};

const paymentLogos = [
  {
    name: "UPI",
    src: "/upi.png",
  },
  {
    name: "Visa",
    src: "/visa.png",
  },
  {
    name: "Mastercard",
    src: "/master_card.png",
  },
  {
    name: "RuPay",
    src: "/rupay.png",
  },
  {
    name: "AMEX",
    src: "/amex.png",
  },
  {
    name: "Diners Club",
    src: "/diners_club.png",
  },
  {
    name: "Net Banking",
    src: "/net_banking.jpg",
  },
];

const Footer = () => {
  return (
    <footer
      style={{
        backgroundImage: "url('/footer-image.png')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "100% 100%",
      }}
      className="text-gray-800 py-12 px-6 md:px-16 flex flex-col gap-16"
    >
      {/* Top Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 sm:gap-16 md:gap-24">
        {/* THE CELIAC STORE */}
        <div className="text-center md:text-left">
          <h3 className="font-bold text-lg mb-4">THE CELIAC STORE</h3>
          <p className="text-sm mb-4">
            Founded In 2016, We Stock Gluten Free, Organic & Lactose Free Brands
            Across All Categories. We Offer Doorstep Delivery Across India And
            Based Out Of Defence Colony, New Delhi.
          </p>
          <div className="flex gap-4 mt-4 justify-center md:justify-start flex-wrap">
            <a 
              href={SOCIAL_LINKS.facebook} 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <Facebook className="text-blue-600" />
            </a>
            <a 
              href={SOCIAL_LINKS.instagram} 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <Instagram className="text-pink-500" />
            </a>
          </div>
        </div>

        {/* COMPANY */}
        <div className="text-center md:text-left">
          <h3 className="font-bold text-lg mb-4">COMPANY</h3>
          <ul className="text-sm space-y-2">
            <li>
              <a href="#">About Us</a>
            </li>
            <li>
              <a href="#">Privacy Policy</a>
            </li>
            <li>
              <a href="#">Terms & Conditions</a>
            </li>
            <li>
              <a href="#">Refund Policy</a>
            </li>
          </ul>
        </div>

        {/* USEFUL LINKS */}
        <div className="text-center md:text-left">
          <h3 className="font-bold text-lg mb-4">USEFUL LINKS</h3>
          <ul className="text-sm space-y-2">
            <li>
              <a href="#">My Account</a>
            </li>
            <li>
              <a href="#">Track Your Order</a>
            </li>
            <li>
              <a href="#">FAQs</a>
            </li>
            <li>
              <a href="#">Contact Us</a>
            </li>
          </ul>
        </div>

        {/* CONTACT */}
        <div className="text-center md:text-left">
          <h3 className="font-bold text-lg mb-4">CONTACT</h3>
          <ul className="text-sm space-y-2">
            <li>{CONTACT_INFO.phone}</li>
            <li>{CONTACT_INFO.email}</li>
            <li>{CONTACT_INFO.address}</li>
          </ul>
        </div>
      </div>

      {/* Bottom Section with Payment Logos */}
      <div className="flex flex-col items-center justify-center gap-8 w-full">
        <Typography className="text-base text-[#5E5A54]">
          Accepted Payments
        </Typography>

        <div className="flex items-center justify-center gap-6 flex-wrap">
          {paymentLogos.map((logo) => (
            <Image
              key={logo.name}
              src={logo.src}
              alt={logo.name}
              width={150}
              height={150}
              className="h-8 w-auto object-contain"
              loading="lazy"
            />
          ))}
        </div>

        <Typography className="text-base text-[#5E5A54] text-center">
          The Celiac Store. All Rights Reserved
        </Typography>
      </div>
    </footer>
  );
};

export default Footer;
