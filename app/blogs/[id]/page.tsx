"use client";

import React from "react";
import TopFloater from "@/app/components/floater/TopFloater";
import Navbar from "@/app/components/navbar/Navbar";
import Footer from "@/app/components/layout/Footer";
import { motion } from "framer-motion";
import Image from "next/image";
import { Typography } from "@/app/components/typography/Typography";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

const SingleBlogPage = () => {
  const blog = {
    title: "The Benefits of a Gluten-Free Diet",
    coverImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    author: "John Doe",
    date: formatDate(new Date("2024-05-01")),
    content: `
# The Benefits of a Gluten-Free Diet

Living gluten-free isn't just a trend – it's a lifestyle choice that can significantly impact your health and well-being. For those with celiac disease or gluten sensitivity, eliminating gluten from their diet is essential for maintaining good health.

## Understanding Gluten Sensitivity

Gluten sensitivity can manifest in various ways, including:

- Digestive issues
- Fatigue
- Headaches
- Joint pain
- Skin problems

## Benefits of Going Gluten-Free

1. **Improved Digestion**
   - Reduced bloating
   - Better nutrient absorption
   - Improved gut health

2. **Increased Energy**
   - Better sleep quality
   - Enhanced mental clarity
   - Reduced fatigue

3. **Reduced Inflammation**
   - Less joint pain
   - Improved skin condition
   - Better overall health

## Tips for Transitioning

Making the switch to a gluten-free diet can be challenging, but here are some helpful tips:

1. Start with naturally gluten-free foods
2. Read labels carefully
3. Plan your meals in advance
4. Find gluten-free alternatives for your favorite foods

> Remember: Always consult with a healthcare professional before making significant dietary changes.

### Conclusion

A gluten-free diet can be a game-changer for those with gluten sensitivity or celiac disease. With proper planning and knowledge, you can maintain a healthy, delicious, and satisfying gluten-free lifestyle.
    `,
    tags: ["Health", "Diet", "Wellness"],
  };

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
              src={blog.coverImage}
              alt={blog.title}
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
              {blog.title}
            </Typography>

            <div className="flex items-center gap-4 text-gray-600 mb-8">
              <span>{blog.author}</span>
              <span>•</span>
              <span>{blog.date}</span>
            </div>

            <div className="prose prose-lg max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-gray-600 prose-strong:text-gray-800 prose-ul:list-disc prose-ol:list-decimal prose-li:text-gray-600 prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {blog.content}
              </ReactMarkdown>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </article>
      </motion.main>

      <Footer />
    </div>
  );
};

export default SingleBlogPage;
