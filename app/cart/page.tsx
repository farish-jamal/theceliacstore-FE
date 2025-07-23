"use client";

import React, { useState } from "react";
import TopFloater from "@/app/components/floater/TopFloater";
import Navbar from "@/app/components/navbar/Navbar";
import Footer from "@/app/components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Settings2 } from "lucide-react";
import ProductSlider from "../components/productsider/ProductSlider";
import { useQuery } from "@tanstack/react-query";
import { getCart } from "@/app/apis/getCart";
import { Cart } from "@/app/types/Cart";
import CartItemsList from "./components/CartItemsList";
import { isArrayWithValues } from "@/app/utils/isArrayWithValues/index";
import EmptyCart from "./components/EmptyCart";
import AddressCard from "./components/AddressCard";
import OrderSummary from "./components/OrderSummary";
import CheckoutButton from "./components/CheckoutButton";

interface Address {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  isDefault: boolean;
}

const initialAddresses = [
  {
    id: 1,
    name: "John Doe",
    address: "123 Main St, Apt 4B",
    city: "New York",
    state: "NY",
    zip: "10001",
    phone: "123-456-7890",
    isDefault: true,
  },
  {
    id: 2,
    name: "John Doe",
    address: "456 Park Ave",
    city: "New York",
    state: "NY",
    zip: "10002",
    phone: "123-456-7890",
    isDefault: false,
  },
];

const availableCoupons = [
  {
    code: "SAVE10",
    description: "10% off on your entire order",
    expiryDate: "2024-12-31",
    minimumOrder: 500,
  },
  {
    code: "WELCOME20",
    description: "20% off on your first order",
    expiryDate: "2024-12-31",
    minimumOrder: 1000,
  },
  {
    code: "FREESHIP",
    description: "Free shipping on orders above ₹1500",
    expiryDate: "2024-12-31",
    minimumOrder: 1500,
  },
];

const thumbnails = [
  "https://res.cloudinary.com/dacwig3xk/image/upload/fl_preserve_transparency/v1747513129/183b94b37929bc9eee61fb523d8bef99602cb329_rabkid.jpg?_s=public-apps",
  "https://res.cloudinary.com/dacwig3xk/image/upload/fl_preserve_transparency/v1747513129/828c7686eb0e33b2b2a9b791c342983d6fee1747_ubi5ay.jpg?_s=public-apps",
  "https://res.cloudinary.com/dacwig3xk/image/upload/fl_preserve_transparency/v1747513129/183b94b37929bc9eee61fb523d8bef99602cb329_rabkid.jpg?_s=public-apps",
];

const CartPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    select: (res) => res?.data?.data,
  });

  console.log("data", data);
  const cart: Cart | undefined = data;

  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [selectedAddress, setSelectedAddress] = useState(addresses[0].id);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [showEditAddress, setShowEditAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [showAddressSelect, setShowAddressSelect] = useState(false);
  const [showCoupons, setShowCoupons] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  // Defensive: handle undefined/null cart or items
  const items = isArrayWithValues(cart?.items) ? cart.items : [];
  console.log("Cart items:", data, items);
  const subtotal = items.reduce(
    (acc, item) => acc + (typeof item.price === 'number' ? item.price : 0) * item.quantity,
    0
  );
  const discount = appliedCoupon ? subtotal * 0.1 : 0;
  const total = subtotal - discount;

  const addNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newAddress = {
      id: addresses.length + 1,
      name: formData.get("fullName") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      zip: formData.get("zip") as string,
      phone: formData.get("phone") as string,
      isDefault: formData.get("default") === "on",
    };

    setAddresses((prev) => {
      if (newAddress.isDefault) {
        return prev
          .map((addr) => ({ ...addr, isDefault: false }))
          .concat(newAddress);
      }
      return [...prev, newAddress];
    });
    setShowAddAddress(false);
  };

  const editAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAddress) return;

    const formData = new FormData(e.target as HTMLFormElement);
    const updatedAddress = {
      id: editingAddress.id,
      name: formData.get("fullName") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      zip: formData.get("zip") as string,
      phone: formData.get("phone") as string,
      isDefault: formData.get("default") === "on",
    };

    setAddresses((prev) => {
      if (updatedAddress.isDefault) {
        return prev.map((addr) =>
          addr.id === updatedAddress.id
            ? updatedAddress
            : { ...addr, isDefault: false }
        );
      }
      return prev.map((addr) =>
        addr.id === updatedAddress.id ? updatedAddress : addr
      );
    });
    setShowEditAddress(false);
    setEditingAddress(null);
  };

  const applyCoupon = () => {
    const coupon = availableCoupons.find((c) => c.code === couponCode);
    if (!coupon) {
      alert("Invalid coupon code");
      return;
    }

    if (subtotal < coupon.minimumOrder) {
      alert(`This coupon requires a minimum order of ₹${coupon.minimumOrder}`);
      return;
    }

    setAppliedCoupon(couponCode);
    setCouponCode("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopFloater />
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items Section */}
          <div className="lg:w-2/3">
            <AnimatePresence>
              {isLoading ? (
                <div className="bg-white rounded-xl p-8 text-center">
                  Loading...
                </div>
              ) : !isArrayWithValues(cart?.items) ? (
                <EmptyCart />
              ) : (
                <CartItemsList items={cart.items} />
              )}
            </AnimatePresence>
          </div>

          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-4">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

              <div className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="flex-1 border-2 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none"
                  />
                  <button
                    onClick={applyCoupon}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Apply
                  </button>
                </div>
                <button
                  onClick={() => setShowCoupons(true)}
                  className="text-green-600 text-sm mt-2 hover:text-green-700 font-medium"
                >
                  View Available Coupons
                </button>
                {appliedCoupon && (
                  <div className="flex items-center justify-between mt-3 text-green-600 text-sm bg-green-50 p-2 rounded-lg">
                    <span>Coupon {appliedCoupon} applied - 10% off</span>
                    <button
                      onClick={() => setAppliedCoupon(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Delivery Address</h3>
                  <button
                    onClick={() => setShowAddAddress(true)}
                    className="text-green-600 font-medium hover:text-green-700 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add New
                  </button>
                </div>
                <div
                  className="border-2 rounded-xl p-4 cursor-pointer hover:border-gray-300"
                  onClick={() => setShowAddressSelect(true)}
                >
                  {addresses.find((addr) => addr.id === selectedAddress) ? (
                    <AddressCard
                      {...addresses.find(
                        (addr) => addr.id === selectedAddress
                      )!}
                    />
                  ) : (
                    <p className="text-gray-500 text-center">
                      Select a delivery address
                    </p>
                  )}
                </div>
              </div>

              <OrderSummary
                subtotal={subtotal}
                discount={discount}
                total={total}
              />
              <CheckoutButton disabled={!isArrayWithValues(cart?.items)} />
            </div>
          </div>
        </div>
      </main>

      <ProductSlider title="Recommended for you" image={thumbnails[1]} />
      <ProductSlider title="Best Sellers" image={thumbnails[0]} />

      {showAddAddress && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Add New Address</h2>
              <button
                onClick={() => setShowAddAddress(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={addNewAddress} className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="fullName"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  className="w-full border-2 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="address"
                >
                  Street Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  className="w-full border-2 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    htmlFor="city"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    className="w-full border-2 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    htmlFor="state"
                  >
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    className="w-full border-2 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    htmlFor="zip"
                  >
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    id="zip"
                    name="zip"
                    className="w-full border-2 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    htmlFor="phone"
                  >
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full border-2 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <input
                  type="checkbox"
                  id="default"
                  name="default"
                  className="rounded border-2 text-green-600 focus:ring-green-500"
                />
                <label htmlFor="default" className="text-sm">
                  Set as default address
                </label>
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors mt-6 font-medium"
              >
                Add Address
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}

      {showCoupons && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Available Coupons</h2>
              <button
                onClick={() => setShowCoupons(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              {availableCoupons.map((coupon) => (
                <div
                  key={coupon.code}
                  className="border-2 border-dashed border-green-200 rounded-lg p-4 hover:border-green-500 transition-colors cursor-pointer"
                  onClick={() => {
                    setCouponCode(coupon.code);
                    setShowCoupons(false);
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-green-600">
                        {coupon.code}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {coupon.description}
                      </p>
                    </div>
                    <button
                      className="text-green-600 text-sm font-medium hover:text-green-700 bg-green-50 px-3 py-1 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCouponCode(coupon.code);
                        setShowCoupons(false);
                      }}
                    >
                      Use Code
                    </button>
                  </div>
                  <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
                    <span>Min. Order: ₹{coupon.minimumOrder}</span>
                    <span>Expires: {coupon.expiryDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}

      {showAddressSelect && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Select Address</h2>
              <button
                onClick={() => setShowAddressSelect(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-3">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    selectedAddress === address.id
                      ? "border-green-500 bg-green-50 shadow-sm"
                      : "hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className="flex-1"
                      onClick={() => {
                        setSelectedAddress(address.id);
                        setShowAddressSelect(false);
                      }}
                    >
                      <p className="font-medium mb-1">{address.name}</p>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {address.address}, {address.city},
                        <br />
                        {address.state} {address.zip}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {address.phone}
                      </p>
                      {address.isDefault && (
                        <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                          Default
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setEditingAddress(address);
                        setShowEditAddress(true);
                        setShowAddressSelect(false);
                      }}
                      className="text-gray-400 hover:text-gray-600 p-1"
                    >
                      <Settings2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}

      {showEditAddress && editingAddress && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Edit Address</h2>
              <button
                onClick={() => {
                  setShowEditAddress(false);
                  setEditingAddress(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={editAddress} className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="fullName"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  defaultValue={editingAddress.name}
                  className="w-full border-2 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="address"
                >
                  Street Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  defaultValue={editingAddress.address}
                  className="w-full border-2 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    htmlFor="city"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    defaultValue={editingAddress.city}
                    className="w-full border-2 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    htmlFor="state"
                  >
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    defaultValue={editingAddress.state}
                    className="w-full border-2 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    htmlFor="zip"
                  >
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    id="zip"
                    name="zip"
                    defaultValue={editingAddress.zip}
                    className="w-full border-2 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    htmlFor="phone"
                  >
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    defaultValue={editingAddress.phone}
                    className="w-full border-2 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <input
                  type="checkbox"
                  id="default"
                  name="default"
                  defaultChecked={editingAddress.isDefault}
                  className="rounded border-2 text-green-600 focus:ring-green-500"
                />
                <label htmlFor="default" className="text-sm">
                  Set as default address
                </label>
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors mt-6 font-medium"
              >
                Save Changes
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
      <Footer />
    </div>
  );
};

export default CartPage;
