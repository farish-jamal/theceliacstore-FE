"use client";

import React, { useState } from "react";
import Header from "../components/layout/Header";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/layout/Footer";
import Image from "next/image";
import { X } from "lucide-react";

const userData = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+91 98765 43210",
  avatar: "https://res.cloudinary.com/dacwig3xk/image/upload/v1748708075/ab0df74c3f8d1807d7434a10a51793aec32c56a7_ihzbsj.jpg",
  preferences: {
    dietary: ["Gluten Free", "Lactose Free"]
  }
};

const AccountPage = () => {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const PasswordChangeModal = () => {
    if (!isPasswordModalOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
          <button 
            onClick={() => setIsPasswordModalOpen(false)}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
          
          <h2 className="text-xl font-semibold mb-6">Change Password</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Current Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">New Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Confirm New Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setIsPasswordModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700">
                Update Password
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            {/* Profile Header */}
            <div className="flex items-center gap-4 mb-8 pb-6 border-b">
              <div className="relative w-20 h-20">
                <Image
                  src={userData.avatar}
                  alt={userData.name}
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">My Account</h1>
                <p className="text-gray-500">{userData.email}</p>
              </div>
              <button
                onClick={() => setIsPasswordModalOpen(true)}
                className="px-4 py-2 text-sm text-green-600 border border-green-600 rounded-md hover:bg-green-50"
              >
                Change Password
              </button>
            </div>

            {/* Personal Information */}
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={userData.name}
                      className="w-full px-3 py-2 border rounded-md"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Email</label>
                    <input
                      type="email"
                      value={userData.email}
                      className="w-full px-3 py-2 border rounded-md"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={userData.phone}
                      className="w-full px-3 py-2 border rounded-md"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              {/* Dietary Preferences */}
              <div className="pt-6 border-t">
                <h2 className="text-lg font-semibold mb-4">Dietary Preferences</h2>
                <div className="flex gap-2">
                  {userData.preferences.dietary.map((pref) => (
                    <span
                      key={pref}
                      className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm"
                    >
                      {pref}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PasswordChangeModal />
      <Footer />
    </div>
  );
};

export default AccountPage;
