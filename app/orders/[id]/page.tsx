"use client";

import React from 'react';
import Header from '../../components/layout/Header';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/layout/Footer';
import { ArrowLeft, CheckCircle, Calendar, Package, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getOrderById, Order, OrderItem } from '@/app/apis/getOrderHistory';
import { getProduct } from '@/app/apis/getProducts';
import { formatPrice } from '@/app/utils/formatPrice';

const statusBadgeClass = (status: string) => {
  if (status === 'Delivered') return 'bg-green-100 text-green-600';
  if (status === 'Processing') return 'bg-orange-100 text-orange-600';
  if (status === 'pending') return 'bg-yellow-100 text-yellow-600';
  return 'bg-red-100 text-red-600';
};

// Component to display individual products within a bundle
const BundleProductItem = ({ productId, quantity }: { productId: string; quantity: number }) => {
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const response = await getProduct(productId);
      return response.data;
    },
    enabled: Boolean(productId),
  });

  if (isLoading) {
    return (
      <div className="flex gap-2 p-2 bg-gray-50 rounded-lg">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded animate-pulse shrink-0"></div>
        <div className="flex-1 min-w-0">
          <div className="h-3 sm:h-4 bg-gray-200 rounded w-full mb-1 animate-pulse"></div>
          <div className="h-2 sm:h-3 bg-gray-200 rounded w-2/3 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="flex gap-2 p-2 bg-gray-50 rounded-lg">
      <div className="relative w-10 h-10 sm:w-12 sm:h-12 shrink-0">
        <Image
          src={product.banner_image || '/placeholder-product.png'}
          alt={product.name}
          fill
          className="object-cover rounded"
          sizes="(max-width: 640px) 40px, 48px"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-xs sm:text-sm font-medium text-gray-900 leading-tight line-clamp-2">{product.name}</h4>
        <p className="text-xs text-gray-500 mt-0.5">Qty: {quantity}</p>
        {product.brand && (
          <p className="text-xs text-gray-400 truncate">{product.brand.name}</p>
        )}
      </div>
    </div>
  );
};

const renderOrderItem = (item: OrderItem) => {
  if (item.type === 'bundle') {
    return (
      <div key={item._id} className="pb-4 border-b last:border-0">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 mx-auto sm:mx-0">
            <Image
              src={item.bundle.images[0]}
              alt={item.bundle.name}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 640px) 64px, 80px"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
              <h3 className="font-medium text-sm sm:text-base leading-tight">{item.bundle.name}</h3>
              <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full w-fit">
                Bundle
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mb-2 leading-tight">{item.bundle.description}</p>
            <div className="flex flex-col sm:flex-row sm:gap-4 text-xs sm:text-sm text-gray-500 mb-3">
              <span>Quantity: {item.quantity}</span>
              <span>Contains {item.bundle.products.length} products</span>
            </div>
            
            {/* Individual Products in Bundle */}
            <div className="mb-3">
              <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Products included:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {item.bundle.products.map((bundleProduct) => (
                  <BundleProductItem
                    key={bundleProduct._id}
                    productId={bundleProduct.product}
                    quantity={bundleProduct.quantity}
                  />
                ))}
              </div>
            </div>
            
            <div className="space-y-1 text-xs sm:text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-gray-600">Unit Price:</span>
                {item.bundle.discounted_price && item.bundle.discounted_price !== item.bundle.price ? (
                  <>
                    <span className="font-medium">₹{formatPrice(item.bundle.discounted_price)}</span>
                    <span className="text-gray-500 line-through">₹{formatPrice(item.bundle.price)}</span>
                  </>
                ) : (
                  <span className="font-medium">₹{formatPrice(item.bundle.price)}</span>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-gray-600">Total:</span>
                <span className="font-medium">₹{formatPrice(item.discounted_total_amount ?? item.total_amount)}</span>
                {item.discounted_total_amount && item.discounted_total_amount !== item.total_amount && (
                  <span className="text-gray-500 line-through">₹{formatPrice(item.total_amount)}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div key={item._id} className="pb-4 border-b last:border-0">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 mx-auto sm:mx-0">
            <Image
              src={item.product.banner_image}
              alt={item.product.name}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 640px) 64px, 80px"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
              <h3 className="font-medium text-sm sm:text-base leading-tight">{item.product.name}</h3>
              <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full w-fit">
                Product
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mb-2">Quantity: {item.quantity}</p>
            
            <div className="space-y-1 text-xs sm:text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-gray-600">Unit Price:</span>
                {item.product.discounted_price && item.product.discounted_price !== item.product.price ? (
                  <>
                    <span className="font-medium">₹{formatPrice(item.product.discounted_price)}</span>
                    <span className="text-gray-500 line-through">₹{formatPrice(item.product.price)}</span>
                  </>
                ) : (
                  <span className="font-medium">₹{formatPrice(item.product.price)}</span>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-gray-600">Total:</span>
                <span className="font-medium">₹{formatPrice(item.discounted_total_amount ?? item.total_amount)}</span>
                {item.discounted_total_amount && item.discounted_total_amount !== item.total_amount && (
                  <span className="text-gray-500 line-through">₹{formatPrice(item.total_amount)}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

const OrderDetailsPage = () => {
  const params = useParams<{ id: string }>();
  const orderId = params?.id as string;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const res = await getOrderById(orderId);
      return res.data as Order;
    },
    enabled: Boolean(orderId),
  });

  const order = data;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {isLoading && (
            <div className="bg-white rounded-lg shadow-sm border p-6 text-center">Loading order...</div>
          )}
          {isError && (
            <div className="bg-white rounded-lg shadow-sm border p-6 text-center text-red-600">Failed to load order.</div>
          )}
          {!isLoading && !isError && order && (
          <>
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/orders" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold">Order #{order._id.toString().slice(0, 6)}</h1>
            <span className={`text-sm px-3 py-1 rounded-full ${statusBadgeClass(order.status)}`}>
              {order.status}
            </span>
          </div>

          {/* Order Timeline */}
          <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 mb-4 sm:mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Order Timeline
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative z-10 w-8 h-8 rounded-full flex items-center justify-center bg-green-500">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Order Placed</p>
                  <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-IN', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${
                  order.status === 'pending' ? 'bg-yellow-500' : 
                  order.status === 'Processing' ? 'bg-orange-500' : 'bg-green-500'
                }`}>
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Current Status: {order.status}</p>
                  <p className="text-xs text-gray-500">Last updated: {new Date(order.updatedAt).toLocaleDateString('en-IN', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            {/* Order Items */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border p-4 sm:p-6">
              <h2 className="text-lg font-semibold mb-4">Order Items</h2>
              <div className="space-y-3 sm:space-y-4">
                {order.items.map(renderOrderItem)}
              </div>
            </div>

            {/* Order Info */}
            <div className="space-y-4 lg:space-y-6">
              <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Order Information
                </h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-medium font-mono text-sm">{order._id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Order Date</p>
                    <p className="font-medium">{new Date(order.createdAt).toLocaleDateString('en-IN', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="font-medium">{new Date(order.updatedAt).toLocaleDateString('en-IN', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Expected Delivery</p>
                    <p className="font-medium">—</p>
                  </div>
                </div>
              </div>

              {/* <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Customer Information
                </h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">User ID</p>
                    <p className="font-medium font-mono text-sm">{order.user}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Order Version</p>
                    <p className="font-medium">v{order.__v}</p>
                  </div>
                </div>
              </div> */}

              <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Items ({order.items.length})</span>
                    <span className="text-sm font-medium">
                      {order.items.reduce((sum, item) => sum + item.quantity, 0)} products
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Subtotal</span>
                    <span className="text-sm font-medium">₹{formatPrice(order.totalAmount)}</span>
                  </div>
                  {order.discountedTotalAmount && order.discountedTotalAmount !== order.totalAmount && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Discount</span>
                        <span className="text-sm text-green-600">-₹{formatPrice(order.totalAmount - order.discountedTotalAmount)}</span>
                      </div>
                      <hr className="my-2" />
                    </>
                  )}
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total Amount</span>
                    <span>₹{formatPrice(order.discountedTotalAmount ?? order.totalAmount)}</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <p className="font-medium">—</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
                <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
                <div className="space-y-2">
                  <p className="font-medium">{order.address.name}</p>
                  <p className="text-gray-600">{order.address.address}</p>
                  <p className="text-gray-600">
                    {order.address.city}, {order.address.state} {order.address.pincode}
                  </p>
                  <p className="text-gray-600">{order.address.mobile}</p>
                </div>
              </div>
            </div>
          </div>
          </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrderDetailsPage;
