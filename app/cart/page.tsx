"use client";

import React, { useState } from "react";
import TopFloater from "@/app/components/floater/TopFloater";
import Navbar from "@/app/components/navbar/Navbar";
import Footer from "@/app/components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Settings2 } from "lucide-react";
import ProductSlider from "../components/productsider/ProductSlider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCart } from "@/app/apis/getCart";
import { Cart } from "@/app/types/Cart";
import CartItemsList from "./components/CartItemsList";
import { isArrayWithValues } from "@/app/utils/isArrayWithValues/index";
import EmptyCart from "./components/EmptyCart";
import AddressCard from "./components/AddressCard";
import OrderSummary from "./components/OrderSummary";
import CheckoutButton from "./components/CheckoutButton";
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} from "@/app/apis/addressService";
import { Address, CreateAddressPayload } from "@/app/types/Address";
import { useAppSelector } from "@/app/hooks/reduxHooks";

// Convert API Address to the local Address interface used in the component
interface LocalAddress {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  isDefault: boolean;
}

const convertApiAddressToLocal = (apiAddress: Address): LocalAddress => {
  console.log("🔄 Converting API address:", apiAddress);

  const converted = {
    id: apiAddress._id || "",
    name: apiAddress.name || "",
    address: apiAddress.address || "",
    city: apiAddress.city || "",
    state: apiAddress.state || "",
    zip: apiAddress.pincode || "",
    phone: apiAddress.mobile || "",
    isDefault: apiAddress.isPrimary || false, // Convert isPrimary to isDefault for local use
  };

  console.log("✅ Converted to local address:", converted);
  return converted;
};


const thumbnails = [
  "https://res.cloudinary.com/dacwig3xk/image/upload/fl_preserve_transparency/v1747513129/183b94b37929bc9eee61fb523d8bef99602cb329_rabkid.jpg?_s=public-apps",
  "https://res.cloudinary.com/dacwig3xk/image/upload/fl_preserve_transparency/v1747513129/828c7686eb0e33b2b2a9b791c342983d6fee1747_ubi5ay.jpg?_s=public-apps",
  "https://res.cloudinary.com/dacwig3xk/image/upload/fl_preserve_transparency/v1747513129/183b94b37929bc9eee61fb523d8bef99602cb329_rabkid.jpg?_s=public-apps",
];

const CartPage = () => {
  const queryClient = useQueryClient();

  // Get user from Redux store
  const user = useAppSelector((state) => state.auth.user);
  const userId = user?.id;

  const { data: cartData, isLoading: cartLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    select: (res) => res?.data?.data,
  });

  const { data: addressData, isLoading: addressLoading } = useQuery({
    queryKey: ["addresses", userId],
    queryFn: async () => {
      if (!userId) {
        return {
          success: true,
          data: { addresses: [], total: 0 },
          message: "No user",
          statusCode: 200,
        };
      }
      const response = await getAddresses(userId);
      console.log("🌐 RAW API RESPONSE:", response);
      return response;
    },
    select: (res) => {
      console.log("🔍 SELECT FUNCTION INPUT:", res);
      const addresses = res?.data || []; // data is directly the addresses array
      console.log("🔍 EXTRACTED ADDRESSES:", addresses);
      return addresses;
    },
    enabled: !!userId, // Only run query if userId exists
  });

  console.log("🔍 ADDRESS DEBUG INFO:");
  console.log("Raw addressData from API:", addressData);
  console.log("UserId:", userId);
  console.log("Address loading:", addressLoading);

  const cart: Cart | undefined = cartData;
  const addresses: LocalAddress[] = Array.isArray(addressData)
    ? addressData.map(convertApiAddressToLocal)
    : [];

  console.log("Final addresses array:", addresses);
  console.log("Address array length:", addresses.length);

  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [showEditAddress, setShowEditAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<LocalAddress | null>(
    null
  );
  const [showAddressSelect, setShowAddressSelect] = useState(false);

  // Set default selected address when addresses load
  React.useEffect(() => {
    console.log("🎯 ADDRESS SELECTION LOGIC:");
    console.log("Addresses available:", addresses.length);
    console.log("Current selectedAddress:", selectedAddress);

    if (addresses.length > 0 && !selectedAddress) {
      const defaultAddress =
        addresses.find((addr) => addr.isDefault) || addresses[0];
      console.log("Setting default address:", defaultAddress);
      setSelectedAddress(defaultAddress.id);
    }
  }, [addresses, selectedAddress]);

  const createAddressMutation = useMutation({
    mutationFn: async (payload: CreateAddressPayload) => {
      return await createAddress(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses", userId] });
      setShowAddAddress(false);
    },
    onError: (error) => {
      console.error("Error creating address:", error);
      alert("Failed to create address. Please try again.");
    },
  });

  const updateAddressMutation = useMutation({
    mutationFn: async ({
      addressId,
      payload,
    }: {
      addressId: string;
      payload: CreateAddressPayload;
    }) => {
      return await updateAddress(addressId, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses", userId] });
      setShowEditAddress(false);
      setEditingAddress(null);
    },
    onError: (error) => {
      console.error("Error updating address:", error);
      alert("Failed to update address. Please try again.");
    },
  });

  const deleteAddressMutation = useMutation({
    mutationFn: async (addressId: string) => {
      return await deleteAddress(addressId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses", userId] });
    },
    onError: (error) => {
      console.error("Error deleting address:", error);
      alert("Failed to delete address. Please try again.");
    },
  });

  // Defensive: handle undefined/null cart or items
  const items = isArrayWithValues(cart?.items) ? cart.items : [];
  console.log("Cart items:", cartData, items);
  const subtotal = items.reduce(
    (acc, item) =>
      acc + (typeof item.price === "number" ? item.price : 0) * item.quantity,
    0
  );
  const total = subtotal;

  const addNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newAddress: CreateAddressPayload = {
      name: formData.get("fullName") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      pincode: formData.get("zip") as string,
      mobile: formData.get("phone") as string,
      isPrimary: formData.get("default") === "on",
    };

    if (!userId) {
      alert("Please log in to add an address");
      return;
    }
    createAddressMutation.mutate(newAddress);
  };

  const editAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAddress) return;

    const formData = new FormData(e.target as HTMLFormElement);
    const updatedAddress: CreateAddressPayload = {
      name: formData.get("fullName") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      pincode: formData.get("zip") as string,
      mobile: formData.get("phone") as string,
      isPrimary: formData.get("default") === "on",
    };

    if (!userId) {
      alert("Please log in to update an address");
      return;
    }
    updateAddressMutation.mutate({
      addressId: editingAddress.id,
      payload: updatedAddress,
    });
  };

  const handleDeleteAddress = (addressId: string) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      if (!userId) {
        alert("Please log in to delete an address");
        return;
      }
      deleteAddressMutation.mutate(addressId);
    }
  };


  // If user is not logged in, show login prompt
  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopFloater />
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Please Log In</h2>
            <p className="text-gray-600 mb-6">
              You need to be logged in to view your cart and manage addresses.
            </p>
            <button
              onClick={() => (window.location.href = "/login")}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Go to Login
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopFloater />
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items Section */}
          <div className="lg:w-2/3">
            <AnimatePresence>
              {cartLoading ? (
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
                  {(() => {
                    console.log("🏠 ADDRESS DISPLAY LOGIC:");
                    console.log("addressLoading:", addressLoading);
                    console.log("addresses array:", addresses);
                    console.log("selectedAddress:", selectedAddress);
                    const foundAddress = addresses.find(
                      (addr) => addr.id === selectedAddress
                    );
                    console.log("Found selected address:", foundAddress);

                    if (addressLoading) {
                      return (
                        <p className="text-gray-500 text-center">
                          Loading addresses...
                        </p>
                      );
                    } else if (foundAddress) {
                      return <AddressCard {...foundAddress} />;
                    } else {
                      return (
                        <p className="text-gray-500 text-center">
                          Select a delivery address
                        </p>
                      );
                    }
                  })()}
                </div>
              </div>

              <OrderSummary
                subtotal={subtotal}
                total={total}
              />
              <CheckoutButton 
                disabled={!isArrayWithValues(cart?.items) || !selectedAddress} 
                cartId={cart?._id}
                addressId={selectedAddress}
              />
            </div>
          </div>
        </div>
      </main>

      <ProductSlider
        title="Recommended for you"
        image={thumbnails[1]}
        productIdForRecommendations={
          cart?.items?.[0]?.type === "product" 
            ? cart.items[0].product._id 
            : "68e16239e9dceb0798c28534"
        }
      />
      <ProductSlider title="Best Sellers" image={thumbnails[0]} fetchBestSellers={true} />

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
                    PIN Code
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
                    Mobile
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
                disabled={createAddressMutation.isPending}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors mt-6 font-medium disabled:opacity-50"
              >
                {createAddressMutation.isPending ? "Adding..." : "Add Address"}
              </button>
            </form>
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
                    <div className="flex gap-2">
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
                      <button
                        onClick={() => handleDeleteAddress(address.id)}
                        className="text-red-400 hover:text-red-600 p-1"
                        disabled={deleteAddressMutation.isPending}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
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
                    PIN Code
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
                    Mobile
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
                disabled={updateAddressMutation.isPending}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors mt-6 font-medium disabled:opacity-50"
              >
                {updateAddressMutation.isPending ? "Saving..." : "Save Changes"}
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
