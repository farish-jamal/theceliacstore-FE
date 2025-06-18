"use client";

import React from "react";
import TopFloater from "../components/floater/TopFloater";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/layout/Footer";
import BlogCard from "../components/cards/BlogCard";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getBlogs } from "../apis/getBlogs";
import { Blog } from "../types/Blog";
import PrimaryLoader from "../components/loaders/PrimaryLoader";
import EmptySection from "../components/EmptySection";
import { FileX } from "lucide-react";
import { useRouter } from "next/navigation";

const BlogsPage = () => {
  const router = useRouter();
  
  const { data: blogsData, isLoading } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => await getBlogs(),
    select: (data) => data?.data || [],
  });

  const blogs: Blog[] = Array.isArray(blogsData) ? blogsData : [];

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
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <PrimaryLoader />
          </div>
        ) : blogs.length === 0 ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <EmptySection icon={<FileX />} text="No blogs available" />
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {blogs.map((blog, index) => (
              <motion.div key={blog._id || index} variants={item}>
                <BlogCard
                  url={blog.banner_image_url}
                  title={blog.title}
                  tag={blog.is_featured ? "Featured" : "Blog"}
                  views={0}
                  date={blog.createdAt ? new Date(blog.createdAt) : new Date()}
                  onClick={() => blog._id && router.push(`/blogs/${blog._id}`)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default BlogsPage;
