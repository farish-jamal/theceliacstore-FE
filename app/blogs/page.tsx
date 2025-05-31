"use client";

import React from "react";
import TopFloater from "../components/floater/TopFloater";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/layout/Footer";
import BlogCard from "../components/cards/BlogCard";
import { motion } from "framer-motion";

const blogs = [
  {
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    title: "The Benefits of a Gluten-Free Diet",
    tag: "Health",
    views: 120,
    date: new Date("2024-05-01"),
  },
  {
    url: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2",
    title: "Top 10 Organic Essentials",
    tag: "Organic",
    views: 95,
    date: new Date("2024-04-28"),
  },
  {
    url: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca",
    title: "Lactose-Free Living: Tips & Tricks",
    tag: "Lifestyle",
    views: 80,
    date: new Date("2024-04-15"),
  },
  {
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    title: "Understanding Celiac Disease",
    tag: "Education",
    views: 150,
    date: new Date("2024-05-05"),
  },
  {
    url: "https://images.unsplash.com/photo-1490818387583-1baba5e638af",
    title: "Best Gluten-Free Recipes for Beginners",
    tag: "Recipes",
    views: 200,
    date: new Date("2024-05-03"),
  },
  {
    url: "https://images.unsplash.com/photo-1495195134817-aeb325a55b65",
    title: "The Rise of Organic Food Movement",
    tag: "Trends",
    views: 175,
    date: new Date("2024-05-02"),
  },
];

const BlogsPage = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopFloater />
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {blogs.map((blog, index) => (
            <motion.div key={index} variants={item}>
              <BlogCard
                url={blog.url}
                title={blog.title}
                tag={blog.tag}
                views={blog.views}
                date={blog.date}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default BlogsPage;
