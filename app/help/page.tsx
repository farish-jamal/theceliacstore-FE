import React from "react";
import TopFloater from "../components/floater/TopFloater";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/layout/Footer";
import { Typography } from "../components/typography/Typography";
import {
  Mail,
  Phone,
  MapPin,
  CircleHelp,
  FileText,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";

const HelpPage = () => {
  const faqs = [
    {
      question: "What is The Celiac Store?",
      answer:
        "The Celiac Store is your trusted source for gluten-free, organic, and lactose-free products. Founded in 2016, we offer doorstep delivery across India from our base in Defence Colony, New Delhi.",
    },
    {
      question: "How do I track my order?",
      answer:
        "You can track your order by logging into your account and visiting the 'Track Order' section. You'll receive regular updates on your order status via email and SMS.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We accept returns within 7 days of delivery for unopened products in their original packaging. Please refer to our Refund Policy for detailed information.",
    },
    {
      question: "Do you ship internationally?",
      answer:
        "Currently, we only offer shipping within India. We're working on expanding our delivery network to serve international customers in the future.",
    },
  ];

  const supportCategories = [
    {
      icon: <CircleHelp className="h-8 w-8 text-green-600" />,
      title: "FAQs",
      description: "Find answers to commonly asked questions",
      link: "#faqs",
    },
    {
      icon: <FileText className="h-8 w-8 text-green-600" />,
      title: "Policies",
      description: "Learn about our shipping and returns policies",
      link: "/policies",
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-green-600" />,
      title: "Contact Support",
      description: "Get in touch with our customer service team",
      link: "#contact",
    },
  ];

  return (
    <div className="flex-col min-h-screen">
      <TopFloater />
      <Navbar />

      <main className="flex-1 py-8 px-4 md:px-16">
        {/* Header */}
        <div className="text-center mb-12">
          <Typography variant="h1" className="text-3xl font-bold mb-4">
            How Can We Help You?
          </Typography>
          <div className="w-12 h-1 bg-green-500 mx-auto mt-2 rounded-full" />
        </div>

        {/* Support Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {supportCategories.map((category, index) => (
            <Link href={category.link} key={index}>
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex flex-col items-center text-center">
                  {category.icon}
                  <h3 className="text-xl font-semibold mt-4 mb-2">
                    {category.title}
                  </h3>
                  <p className="text-gray-600">{category.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* FAQs Section */}
        <section id="faqs" className="mb-16">
          <Typography
            variant="h2"
            className="text-2xl font-bold mb-8 text-center"
          >
            Frequently Asked Questions
          </Typography>
          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="mb-16">
          <Typography
            variant="h2"
            className="text-2xl font-bold mb-8 text-center"
          >
            Contact Us
          </Typography>
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Phone className="h-6 w-6 text-green-600" />
                  <div>
                    <h4 className="font-semibold">Phone</h4>
                    <p className="text-gray-600">+91 9810107887</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Mail className="h-6 w-6 text-green-600" />
                  <div>
                    <h4 className="font-semibold">Email</h4>
                    <p className="text-gray-600">info@theceliacstore.in</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <MapPin className="h-6 w-6 text-green-600" />
                  <div>
                    <h4 className="font-semibold">Address</h4>
                    <p className="text-gray-600">Defence Colony, New Delhi</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <h4 className="font-semibold mb-4">Business Hours</h4>
                <div className="space-y-2 text-gray-600">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 4:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HelpPage;
