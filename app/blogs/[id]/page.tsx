"use client";

import React from "react";
import TopFloater from "@/app/components/floater/TopFloater";
import Navbar from "@/app/components/navbar/Navbar";
import Footer from "@/app/components/layout/Footer";
import { motion } from "framer-motion";
import Image from "next/image";
import { Typography } from "@/app/components/typography/Typography";
import { useQuery } from "@tanstack/react-query";
import { getBlogById } from "@/app/apis/getBlogs";
import { useParams } from "next/navigation";
import PrimaryLoader from "@/app/components/loaders/PrimaryLoader";
import EmptySection from "@/app/components/EmptySection";
import { FileX } from "lucide-react";

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

const SingleBlogPage = () => {
  const params = useParams();
  const blogId = params.id as string;

  const { data: blogData, isLoading, isError } = useQuery({
    queryKey: ["blog", blogId],
    queryFn: async () => await getBlogById(blogId),
    select: (data) => data?.data,
    enabled: !!blogId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopFloater />
        <Navbar />
        <div className="flex justify-center items-center min-h-[400px]">
          <PrimaryLoader />
        </div>
        <Footer />
      </div>
    );
  }

  if (isError || !blogData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopFloater />
        <Navbar />
        <div className="flex justify-center items-center min-h-[400px]">
          <EmptySection icon={<FileX />} text="Blog not found" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopFloater />
      <Navbar />

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto px-4 py-12"
      >
        <article className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="relative w-full h-[400px]">
            <Image
              src={blogData.banner_image_url}
              alt={blogData.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="p-8">
            <Typography
              variant="h1"
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              {blogData.title}
            </Typography>

            <div className="flex items-center gap-4 text-gray-600 mb-8">
              <span>{blogData.author.name}</span>
              <span>•</span>
              <span>{blogData.createdAt ? formatDate(new Date(blogData.createdAt)) : "Unknown date"}</span>
            </div>

            <div className="prose prose-lg max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-gray-600 prose-strong:text-gray-800 prose-ul:list-disc prose-ol:list-decimal prose-li:text-gray-600 prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic">
              <div 
                dangerouslySetInnerHTML={{ __html: blogData.content }}
                className="prose prose-lg max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-gray-600 prose-strong:text-gray-800 prose-ul:list-disc prose-ol:list-decimal prose-li:text-gray-600 prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic"
              />
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                {blogData.is_featured ? "Featured" : "Blog"}
              </span>
            </div>
          </div>
        </article>
      </motion.main>

      <Footer />
    </div>
  );
};

export default SingleBlogPage;
