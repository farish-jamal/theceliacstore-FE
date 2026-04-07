"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { updateProductInCart } from "@/app/apis/updateProductInCart";
import { getProduct } from "@/app/apis/getProducts"; 
// ✅ Synchronized with your guestCartSlice.ts
import { addItemToGuestCart } from "@/app/slices/guestCartSlice"; 

import TopFloater from "@/app/components/floater/TopFloater";
import Navbar from "@/app/components/navbar/Navbar";
import Footer from "@/app/components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Edit, Trash2 } from "lucide-react";
import ProductSlider from "../components/productsider/ProductSlider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCart } from "@/app/apis/getCart";
import { Cart } from "@/app/types/Cart";
import CartItemsList from "./components/CartItemsList";
import GuestCartItemsList from "./components/GuestCartItemsList";
import { isArrayWithValues } from "@/app/utils/isArrayWithValues/index";
import EmptyCart from "./components/EmptyCart";
import OrderSummary from "./components/OrderSummary";
import CheckoutButton from "./components/CheckoutButton";
import GuestCheckoutButton from "./components/GuestCheckoutButton";
import CartItemsSkeleton from "./components/CartItemSkeleton";
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} from "@/app/apis/addressService";
import { Address, CreateAddressPayload } from "@/app/types/Address";
import { useAppSelector, useAppDispatch } from "@/app/hooks/reduxHooks";
import { setGuestCart } from "@/app/slices/guestCartSlice";
import { getGuestCart } from "@/app/utils/guestCart";

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
  return {
    id: apiAddress._id || "",
    name: apiAddress.name || "",
    address: apiAddress.address || "",
    city: apiAddress.city || "",
    state: apiAddress.state || "",
    zip: apiAddress.pincode || "",
    phone: apiAddress.mobile || "",
    isDefault: apiAddress.isPrimary || false,
  };
};

const thumbnails = [
  "https://res.cloudinary.com/dacwig3xk/image/upload/fl_preserve_transparency/v1747513129/183b94b37929bc9eee61fb523d8bef99602cb329_rabkid.jpg?_s=public-apps",
  "https://res.cloudinary.com/dacwig3xk/image/upload/fl_preserve_transparency/v1747513129/828c7686eb0e33b2b2a9b791c342983d6fee1747_ubi5ay.jpg?_s=public-apps",
  "https://res.cloudinary.com/dacwig3xk/image/upload/fl_preserve_transparency/v1747513129/183b94b37929bc9eee61fb523d8bef99602cb329_rabkid.jpg?_s=public-apps",
];

const CartPage = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  
  const searchParams = useSearchParams();
  const productToAdd = searchParams.get("add");
  
  const [isGoogleAdding, setIsGoogleAdding] = useState(false);
  const processedProduct = useRef<string | null>(null);

  const user = useAppSelector((state) => state.auth.user);
  const userId = user?.id;
  const isLoggedIn = !!userId;

  const guestCart = useAppSelector((state) => state.guestCart.cart);
  const isGuestCartInitialized = useAppSelector((state) => state.guestCart.isInitialized);

  useEffect(() => {
    if (!isLoggedIn && !isGuestCartInitialized) {
      const storedCart = getGuestCart();
      dispatch(setGuestCart(storedCart));
    }
  }, [isLoggedIn, isGuestCartInitialized, dispatch]);

  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [showEditAddress, setShowEditAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<LocalAddress | null>(null);
  const [showAddressSelect, setShowAddressSelect] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingAddressId, setDeletingAddressId] = useState<string>("");

  useEffect(() => {
    if (productToAdd && productToAdd !== processedProduct.current && !isGoogleAdding) {
      processedProduct.current = productToAdd;

      const autoAddToCart = async () => {
        setIsGoogleAdding(true);
        try {
          if (isLoggedIn) {
            await updateProductInCart({
              product_id: productToAdd,
              quantity: 1,
              type: "product"
            });
            queryClient.invalidateQueries({ queryKey: ["cart"] });
          } else {
            const productResponse = await getProduct(productToAdd);
            const product = productResponse.data;
            
            if (!product || !product._id || !product.price) {
              throw new Error("Invalid product data received from database.");
            }

            // ✅ Payload matches the GuestCartItem type requirements
            dispatch(addItemToGuestCart({ 
                id: product._id,
                product: product, 
                price: product.price,
                quantity: 1, 
                total: product.price,
                type: "product" 
            }));
          }

          window.history.replaceState(null, "", window.location.pathname);
        } catch (error: any) {
          console.error("Failed to auto-add Google Shopping item:", error);
          const errorMsg = error?.response?.data?.message || error?.message || "Unknown error occurred.";
          alert(`Could not add item to cart: ${errorMsg}`);
        } finally {
          setIsGoogleAdding(false);
        }
      };

      autoAddToCart();
    }
  }, [productToAdd, isLoggedIn, dispatch, queryClient]);

  const { data: cartData, isLoading: cartLoading } = useQuery({
    queryKey: ["cart", selectedAddress],
    queryFn: () => getCart(selectedAddress),
    select: (res) => res?.data?.data,
    enabled: isLoggedIn,
  });

  const { data: addressData, isLoading: addressLoading } = useQuery({
    queryKey: ["addresses", userId],
    queryFn: async () => {
      if (!userId) {
        return { success: true, data: { addresses: [], total: 0 }, message: "No user", statusCode: 200 };
      }
      return await getAddresses(userId);
    },
    select: (res) => res?.data || [],
    enabled: isLoggedIn,
  });

  const cart: Cart | undefined = cartData;
  const addresses: LocalAddress[] = useMemo(
    () => Array.isArray(addressData) ? addressData.map(convertApiAddressToLocal) : [],
    [addressData]
  );

  React.useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      const defaultAddress = addresses.find((addr) => addr.isDefault) || addresses[0];
      setSelectedAddress(defaultAddress.id);
    }
  }, [addresses]);

  const createAddressMutation = useMutation({
    mutationFn: async (payload: CreateAddressPayload) => createAddress(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses", userId] });
      setShowAddAddress(false);
    },
    onError: () => alert("Failed to create address. Please try again."),
  });

  const updateAddressMutation = useMutation({
    mutationFn: async ({ addressId, payload }: { addressId: string; payload: CreateAddressPayload; }) => updateAddress(addressId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses", userId] });
      setShowEditAddress(false);
      setEditingAddress(null);
    },
    onError: () => alert("Failed to update address. Please try again."),
  });

  const deleteAddressMutation = useMutation({
    mutationFn: async (addressId: string) => deleteAddress(addressId),
    onSuccess: (_, addressId) => {
      queryClient.invalidateQueries({ queryKey: ["addresses", userId] });
      if (selectedAddress === addressId) {
        const remainingAddresses = addresses.filter((addr) => addr.id !== addressId);
        if (remainingAddresses.length > 0) {
          const defaultAddress = remainingAddresses.find((addr) => addr.isDefault) || remainingAddresses[0];
          setSelectedAddress(defaultAddress.id);
        } else {
          setSelectedAddress("");
        }
      }
    },
    onError: () => alert("Failed to delete address. Please try again."),
  });

  const items = isLoggedIn ? (isArrayWithValues(cart?.items) ? cart.items : []) : guestCart.items;
  const hasItems = items.length > 0;
  
  const subtotal = isLoggedIn ? (cart?.total_price || 0) : guestCart.total_price;
  const shippingCharge = isLoggedIn ? (cart?.shipping_charge || 0) : guestCart.shipping_charge;
  const finalPrice = isLoggedIn ? (cart?.final_price || 0) : guestCart.final_price;

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

    if (!userId) return alert("Please log in to add an address");
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

    if (!userId) return alert("Please log in to update an address");
    updateAddressMutation.mutate({ addressId: editingAddress.id, payload: updatedAddress });
  };

  const handleDeleteAddress = (addressId: string) => {
    setDeletingAddressId(addressId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteAddress = () => {
    if (!userId) return alert("Please log in to delete an address");
    deleteAddressMutation.mutate(deletingAddressId);
    setShowDeleteConfirm(false);
    setDeletingAddressId("");
  };

  const getRecommendationProductId = (): string => {
    if (isLoggedIn && cart?.items?.[0]?.type === "product") {
      return cart.items[0].product._id;
    }
    if (!isLoggedIn && guestCart.items.length > 0 && guestCart.items[0].type === "product") {
      return guestCart.items[0].product._id;
    }
    return "68e16239e9dceb0798c28534";
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <AnimatePresence>
        {isGoogleAdding && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-white/70 backdrop-blur-sm flex items-center justify-center"
          >
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-700 font-medium">Adding item to your cart...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-[36px]" />
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <AnimatePresence>
              {isLoggedIn && cartLoading ? (
                <CartItemsSkeleton />
              ) : !hasItems ? (
                <EmptyCart />
              ) : isLoggedIn ? (
                <CartItemsList items={cart!.items} />
              ) : (
                <GuestCartItemsList items={guestCart.items} />
              )}
            </AnimatePresence>
          </div>

          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-4">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

              {isLoggedIn && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Delivery Address</h3>
                    <button
                      onClick={() => setShowAddressSelect(true)}
                      className="text-green-600 font-medium hover:text-green-700 flex items-center gap-1"
                    >
                      Select Address
                    </button>
                  </div>
                  <div
                    className="border-2 rounded-xl p-4 cursor-pointer hover:border-gray-300"
                    onClick={() => setShowAddressSelect(true)}
                  >
                    {(() => {
                      const foundAddress = addresses.find((addr) => addr.id === selectedAddress);

                      if (addressLoading) {
                        return <p className="text-gray-500 text-center">Loading addresses...</p>;
                      } else if (foundAddress) {
                        return (
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <p className="font-semibold text-gray-900">{foundAddress.name}</p>
                              <p className="text-sm text-gray-600">{foundAddress.phone}</p>
                            </div>
                            <p className="text-sm text-gray-600">
                              {foundAddress.address}, {foundAddress.city}, {foundAddress.state}, {foundAddress.zip}
                            </p>
                          </div>
                        );
                      } else {
                        return <p className="text-gray-500 text-center">Select a delivery address</p>;
                      }
                    })()}
                  </div>
                </div>
              )}

              {!isLoggedIn && hasItems && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Guest Checkout:</span> You can place an order without creating an account. 
                    You&apos;ll enter your delivery address during checkout.
                  </p>
                </div>
              )}

              <OrderSummary
                subtotal={subtotal}
                shippingCharge={shippingCharge}
                finalPrice={finalPrice}
              />
              
              {isLoggedIn ? (
                <CheckoutButton 
                  disabled={!hasItems} 
                  cartId={cart?._id}
                  addressId={selectedAddress}
                />
              ) : (
                <GuestCheckoutButton 
                  disabled={!hasItems}
                  cart={guestCart}
                />
              )}

              {!isLoggedIn && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600 mb-2">Already have an account?</p>
                  <a 
                    href="/login?redirect=/cart" 
                    className="text-green-600 hover:text-green-700 font-medium text-sm"
                  >
                    Log in for faster checkout
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <ProductSlider
        title="Recommended for you"
        image={thumbnails[1]}
        productIdForRecommendations={getRecommendationProductId()}
      />
      <ProductSlider title="Best Sellers" image={thumbnails[0]} fetchBestSellers={true} />

      {isLoggedIn && (
        <>
          {showAddAddress && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
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
                    <label className="block text-sm font-medium mb-2" htmlFor="addFullName">Full Name</label>
                    <input type="text" id="addFullName" name="fullName" className="w-full border-2 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" htmlFor="addAddress">Street Address</label>
                    <input type="text" id="addAddress" name="address" className="w-full border-2 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" htmlFor="addCity">City</label>
                      <input type="text" id="addCity" name="city" className="w-full border-2 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" htmlFor="addState">State</label>
                      <input type="text" id="addState" name="state" className="w-full border-2 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" htmlFor="addZip">PIN Code</label>
                      <input 
                        type="text" 
                        id="addZip" 
                        name="zip" 
                        pattern="[0-9]{6}"
                        placeholder="6-digit PIN"
                        maxLength={6}
                        className="w-full border-2 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none" 
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" htmlFor="addPhone">Mobile</label>
                      <input 
                        type="tel" 
                        id="addPhone" 
                        name="phone" 
                        pattern="[0-9]{10}"
                        placeholder="10-digit number"
                        maxLength={10}
                        className="w-full border-2 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none" 
                        required 
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <input type="checkbox" id="addDefault" name="default" className="rounded border-2 text-green-600 focus:ring-green-500" />
                    <label htmlFor="addDefault" className="text-sm">Set as default address</label>
                  </div>
                  <button type="submit" disabled={createAddressMutation.isPending} className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors mt-6 font-medium disabled:opacity-50">
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
              className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl max-h-[80vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">Select Address</h2>
                  <button onClick={() => setShowAddressSelect(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="space-y-3">
                  <div onClick={() => { setShowAddAddress(true); setShowAddressSelect(false); }} className="border-2 border-dashed border-gray-300 rounded-xl p-4 cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all flex items-center justify-center gap-2 text-green-600 font-medium">
                    <Plus className="w-5 h-5" /> Add New Address
                  </div>
                  {addresses.map((address) => (
                    <div key={address.id} className={`border-2 rounded-xl p-3 cursor-pointer transition-all ${selectedAddress === address.id ? "border-green-500 bg-green-50" : "hover:border-gray-300"}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1" onClick={() => { setSelectedAddress(address.id); setShowAddressSelect(false); }}>
                          <div className="flex items-center gap-3 mb-1">
                            <p className="font-semibold text-gray-900">{address.name}</p>
                            <p className="text-sm text-gray-600">{address.phone}</p>
                          </div>
                          <p className="text-sm text-gray-600">
                            {address.address}, {address.city}, {address.state} - {address.zip}
                          </p>
                          {address.isDefault && (
                            <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Default</span>
                          )}
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <button onClick={(e) => { e.stopPropagation(); setEditingAddress(address); setShowEditAddress(true); setShowAddressSelect(false); }} className="text-gray-400 hover:text-gray-600 p-1">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handleDeleteAddress(address.id); }} className="text-red-400 hover:text-red-600 p-1" disabled={deleteAddressMutation.isPending}>
                            <Trash2 className="w-4 h-4" />
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
              className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">Edit Address</h2>
                  <button onClick={() => { setShowEditAddress(false); setEditingAddress(null); }} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <form onSubmit={editAddress} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" htmlFor="editFullName">Full Name</label>
                    <input type="text" id="editFullName" name="fullName" defaultValue={editingAddress.name} className="w-full border-2 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" htmlFor="editAddress">Street Address</label>
                    <input type="text" id="editAddress" name="address" defaultValue={editingAddress.address} className="w-full border-2 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" htmlFor="editCity">City</label>
                      <input type="text" id="editCity" name="city" defaultValue={editingAddress.city} className="w-full border-2 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" htmlFor="editState">State</label>
                      <input type="text" id="editState" name="state" defaultValue={editingAddress.state} className="w-full border-2 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" htmlFor="editZip">PIN Code</label>
                      <input 
                        type="text" 
                        id="editZip" 
                        name="zip" 
                        defaultValue={editingAddress.zip} 
                        pattern="[0-9]{6}"
                        placeholder="6-digit PIN"
                        maxLength={6}
                        className="w-full border-2 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none" 
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" htmlFor="editPhone">Mobile</label>
                      <input 
                        type="tel" 
                        id="editPhone" 
                        name="phone" 
                        defaultValue={editingAddress.phone} 
                        pattern="[0-9]{10}"
                        placeholder="10-digit number"
                        maxLength={10}
                        className="w-full border-2 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none" 
                        required 
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <input type="checkbox" id="editDefault" name="default" defaultChecked={editingAddress.isDefault} className="rounded border-2 text-green-600 focus:ring-green-500" />
                    <label htmlFor="editDefault" className="text-sm">Set as default address</label>
                  </div>
                  <button type="submit" disabled={updateAddressMutation.isPending} className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors mt-6 font-medium disabled:opacity-50">
                    {updateAddressMutation.isPending ? "Saving..." : "Save Changes"}
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}

          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Trash2 className="w-6 h-6 text-red-600" />
                  </div>
                  <h2 className="text-xl font-semibold">Delete Address?</h2>
                </div>
                <p className="text-gray-600 mb-6">Are you sure you want to delete this address? This action cannot be undone.</p>
                <div className="flex gap-3">
                  <button onClick={() => { setShowDeleteConfirm(false); setDeletingAddressId(""); }} className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium" disabled={deleteAddressMutation.isPending}>
                    Cancel
                  </button>
                  <button onClick={confirmDeleteAddress} disabled={deleteAddressMutation.isPending} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50">
                    {deleteAddressMutation.isPending ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </>
      )}
      <Footer />
    </div>
  );
};

export default CartPage;