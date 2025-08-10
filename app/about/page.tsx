"use client";

import React from "react";
import Image from "next/image";
import Navbar from "../components/navbar/Navbar";
import Header from "../components/layout/Header";
import WhyChooseUs from "../components/home/WhyChooseUs";
import StoreInfo from "../components/home/StoreInfo";
import Footer from "../components/layout/Footer";

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Navbar />
      {/* Hero Sections */}
      <section className="container mx-auto px-4 md:py-8 flex flex-col md:flex-row items-center justify-between gap-8 lg:px-[7%]">
        <div className="flex-1 max-w-xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-8">
            Your one-stop shop for{" "}
            <span className="block">
              gluten-free, lactose-free, and organic
            </span>
            <span className="text-green-500">goodness</span>
            <span>.</span>
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Founded by a fellow celiac, The Celiac Store is a haven for those
            seeking healthy and delicious food options. We offer a wide
            selection of top Indian & International gluten-free, lactose-free,
            and organic brands, ensuring you&apos;ll find everything you need to
            satisfy your cravings without compromising your health
          </p>
        </div>
        <div className="flex-1 relative">
          <div className="w-full h-[400px] relative">
            <Image
              src="https://res.cloudinary.com/dacwig3xk/image/upload/fl_preserve_transparency/v1748708075/ab0df74c3f8d1807d7434a10a51793aec32c56a7_ihzbsj.jpg?_s=public-apps"
              alt="Gluten-free and organic products basket"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          Step Inside Our Store
        </h2>
        <p className="text-gray-600 text-lg text-center mb-12">
          Get a glimpse of our physical store — where clean, gluten-free living
          meets warm community spirit.
        </p>
        <div className="max-w-4xl mx-auto aspect-video">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/A_rmagt7eoE"
            title="The Celiac Store Introduction"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg shadow-xl"
          ></iframe>
        </div>
      </section>
      <WhyChooseUs />
      <StoreInfo />
      <Footer />
    </div>
  );
};

export default AboutPage;
