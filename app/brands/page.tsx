import React from "react";
import Link from "next/link";
import TopFloater from "../components/floater/TopFloater";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/layout/Footer";

const BrandsPage = () => {
  const alphabets = [
    "0-9",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];
  const brands = [
    {
      id: 1,
      name: "Mantra Organic",
      image:
        "https://res.cloudinary.com/dacwig3xk/image/upload/fl_preserve_transparency/v1747568888/648e7a0d24ecdcb4284ba4e8cf4305f3097a1dfb_pcwroo.jpg?_s=public-apps",
      category: "M",
    },
    {
      id: 2,
      name: "Anmolpreet Food Products",
      image:
        "https://res.cloudinary.com/dacwig3xk/image/upload/fl_preserve_transparency/v1747568889/bdad9d1a38545895ef3e2154bb779e3dc9946048_hpkjv6.jpg?_s=public-apps",
      category: "A",
    },
    {
      id: 3,
      name: "Be Well",
      image:
        "https://res.cloudinary.com/dacwig3xk/image/upload/fl_preserve_transparency/v1747568888/e6941bbf2aebc2b06c6fb8f81abc759566b92e6c_uxesla.jpg?_s=public-apps",
      category: "B",
    },
    {
      id: 4,
      name: "Cornitos",
      image:
        "https://res.cloudinary.com/dacwig3xk/image/upload/fl_preserve_transparency/v1747568888/38cbe74902e3791306bb53def48a203bf68f15ce_nziy4d.jpg?_s=public-apps",
      category: "C",
    },
    {
      id: 5,
      name: "Dr. Gluten",
      image:
        "https://res.cloudinary.com/dacwig3xk/image/upload/fl_preserve_transparency/v1747568889/73bc8574b61e3847add9f246221bdd2c161035a1_ljt0gl.jpg?_s=public-apps",
      category: "D",
    },
    {
      id: 6,
      name: "Fidalgo",
      image:
        "https://res.cloudinary.com/dacwig3xk/image/upload/fl_preserve_transparency/v1747568888/b40b0341190585ff7d321bbaab1a53d0db22482e_ehm8er.jpg?_s=public-apps",
      category: "F",
    },
    {
      id: 7,
      name: "GadoRite",
      image:
        "https://res.cloudinary.com/dacwig3xk/image/upload/fl_preserve_transparency/v1747568888/512efc82c47e23b1ec34a34d8cec56ba59e7bc2e_nbr2b5.jpg?_s=public-apps",
      category: "G",
    },
    {
      id: 8,
      name: "Mama",
      image:
        "https://res.cloudinary.com/dacwig3xk/image/upload/fl_preserve_transparency/v1747568888/3d968a1ac86943acd8f7fcdaed0901086a32b886_p4hdio.jpg?_s=public-apps",
      category: "M",
    },
    {
      id: 9,
      name: "NutraHi",
      image:
        "https://res.cloudinary.com/dacwig3xk/image/upload/fl_preserve_transparency/v1747569213/1d5dd752115cd7158a1044b8a696bc03c337040e_e5fnj2.jpg?_s=public-apps",
      category: "N",
    },
    {
      id: 10,
      name: "Orgran",
      image:
        "https://res.cloudinary.com/dacwig3xk/image/upload/fl_preserve_transparency/v1747569214/ad64817644466fbf8cc3d17994e30f7c332e26fb_pixftw.jpg?_s=public-apps",
      category: "O",
    },
    {
      id: 11,
      name: "Sai",
      image:
        "https://res.cloudinary.com/dacwig3xk/image/upload/fl_preserve_transparency/v1747569214/0cab80a593e35149f62259af0e99006e0b2f7ccd_mvhdti.jpg?_s=public-apps",
      category: "S",
    },
  ];

  return (
    <>
      <TopFloater />
      <Navbar />
      <div>
        <div className="bg-green-500 py-2 px-4">
          <div className="max-w-7xl mx-auto flex items-center text-white text-sm">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <span className="mx-2">›</span>
            <Link href="/product" className="hover:underline">
              Product
            </Link>
            <span className="mx-2">›</span>
            <span>All Brands (A-Z)</span>
          </div>
        </div>
        <div className="max-w-7xl mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold text-center mb-8">Brands (A-Z)</h1>
          <div className="border-t border-b py-4 mb-12">
            <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2">
              {alphabets.map((letter) => (
                <Link
                  href={`#${letter}`}
                  key={letter}
                  className="text-blue-500 hover:text-blue-700 px-1"
                >
                  {letter}
                </Link>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {brands.map((brand) => (
              <Link href={`/brands/${brand.id}`} key={brand.id}>
                <div className="flex items-center justify-center p-4 border border-gray-100 rounded-md hover:shadow-md transition-shadow h-32">
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BrandsPage;
