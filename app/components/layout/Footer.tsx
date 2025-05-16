// components/Footer.tsx
import { Facebook, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer
      style={{
        backgroundImage: "url('/footer-image.png')", 
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
      className="text-gray-800 py-12 px-6 md:px-16"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* THE CELIAC STORE */}
        <div>
          <h3 className="font-bold text-lg mb-4">THE CELIAC STORE</h3>
          <p className="text-sm mb-4">
            Founded In 2016, We Stock Gluten Free, Organic & Lactose Free Brands Across All Categories. We Offer Doorstep Delivery Across India And Based Out Of Defence Colony, New Delhi.
          </p>
          <div className="flex gap-4">
            <a href="#" aria-label="Facebook">
              <Facebook className="text-blue-600" />
            </a>
            <a href="#" aria-label="Instagram">
              <Instagram className="text-pink-500" />
            </a>
          </div>
        </div>

        {/* COMPANY */}
        <div>
          <h3 className="font-bold text-lg mb-4">COMPANY</h3>
          <ul className="text-sm space-y-2">
            <li><a href="#">About Us</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms & Conditions</a></li>
            <li><a href="#">Refund Policy</a></li>
          </ul>
        </div>

        {/* USEFUL LINKS */}
        <div>
          <h3 className="font-bold text-lg mb-4">USEFUL LINKS</h3>
          <ul className="text-sm space-y-2">
            <li><a href="#">My Account</a></li>
            <li><a href="#">Track Your Order</a></li>
            <li><a href="#">FAQs</a></li>
            <li><a href="#">Contact Us</a></li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="font-bold text-lg mb-4">CONTACT</h3>
          <ul className="text-sm space-y-2">
            <li>+91 12345 67890</li>
            <li>info@theceliacstore.in</li>
            <li>Defence Colony, New Delhi</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
