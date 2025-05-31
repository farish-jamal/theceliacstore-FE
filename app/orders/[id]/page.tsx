"use client";

import React from 'react';
import Header from '../../components/layout/Header';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/layout/Footer';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const orderDetails = {
  orderNumber: "GFC12345",
  status: "Processing",
  orderDate: "March 15, 2024",
  expectedDelivery: "March 18, 2024",
  totalAmount: "₹2,499",
  paymentMethod: "Credit Card",
  shippingAddress: {
    name: "John Doe",
    street: "123 Gluten Free Street",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110001",
    phone: "+91 98765 43210"
  },
  items: [
    {
      id: 1,
      name: "Gluten-Free Burger Buns",
      quantity: 2,
      price: "₹499",
      image: "https://res.cloudinary.com/dacwig3xk/image/upload/v1748708075/ab0df74c3f8d1807d7434a10a51793aec32c56a7_ihzbsj.jpg"
    },
    {
      id: 2,
      name: "Pizza Base",
      quantity: 1,
      price: "₹699",
      image: "https://res.cloudinary.com/dacwig3xk/image/upload/v1748708075/ab0df74c3f8d1807d7434a10a51793aec32c56a7_ihzbsj.jpg"
    }
  ],
  trackingSteps: [
    { id: 1, title: "Order Placed", date: "March 15, 2025, 10:30 AM", completed: true },
    { id: 2, title: "Processing", date: "March 15, 2025, 2:45 PM", completed: true },
    { id: 3, title: "Shipped", date: "Expected March 17", completed: false },
    { id: 4, title: "Delivered", date: "Expected March 18", completed: false }
  ]
};

const OrderDetailsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/orders" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold">Order #{orderDetails.orderNumber}</h1>
            <span className={`text-sm px-3 py-1 rounded-full ${
              orderDetails.status === "Processing" ? "bg-orange-100 text-orange-600" :
              orderDetails.status === "Delivered" ? "bg-green-100 text-green-600" :
              "bg-red-100 text-red-600"
            }`}>
              {orderDetails.status}
            </span>
          </div>

          {/* Order Timeline */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Order Timeline</h2>
            <div className="flex justify-between">
              {orderDetails.trackingSteps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center relative flex-1">
                  {index < orderDetails.trackingSteps.length - 1 && (
                    <div className={`absolute top-4 left-1/2 w-full h-0.5 ${
                      step.completed ? "bg-green-500" : "bg-gray-200"
                    }`} />
                  )}
                  <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${
                    step.completed ? "bg-green-500" : "bg-gray-200"
                  }`}>
                    {step.completed ? (
                      <CheckCircle className="w-6 h-6 text-white" />
                    ) : (
                      <div className="w-3 h-3 rounded-full bg-white" />
                    )}
                  </div>
                  <p className="text-sm font-medium mt-2">{step.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{step.date}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Order Items */}
            <div className="md:col-span-2 bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">Order Items</h2>
              <div className="space-y-4">
                {orderDetails.items.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0">
                    <div className="relative w-20 h-20 shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      <p className="text-sm font-medium mt-1">{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Info */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-semibold mb-4">Order Information</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Order Date</p>
                    <p className="font-medium">{orderDetails.orderDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Expected Delivery</p>
                    <p className="font-medium">{orderDetails.expectedDelivery}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="font-medium">{orderDetails.totalAmount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <p className="font-medium">{orderDetails.paymentMethod}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
                <div className="space-y-2">
                  <p className="font-medium">{orderDetails.shippingAddress.name}</p>
                  <p className="text-gray-600">{orderDetails.shippingAddress.street}</p>
                  <p className="text-gray-600">
                    {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.pincode}
                  </p>
                  <p className="text-gray-600">{orderDetails.shippingAddress.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrderDetailsPage;
