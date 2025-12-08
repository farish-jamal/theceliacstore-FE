import { GuestCart, GuestCartItem, GuestProductCartItem, GuestBundleCartItem } from "@/app/types/GuestCart";
import { Product } from "@/app/types/Product";
import { Bundle } from "@/app/apis/getBundles";
import { convertToNumber } from "@/app/utils/formatPrice";

const GUEST_CART_KEY = "guest_cart";
const SHIPPING_THRESHOLD = 500; // Free shipping above this amount
const SHIPPING_CHARGE = 50;

// Helper to get price from product (considering variant if selected)
const getProductPrice = (product: Product, variantSku?: string): number => {
  if (variantSku && product.variants) {
    const variant = product.variants.find(v => v.sku === variantSku);
    if (variant) {
      return convertToNumber(variant.discounted_price ?? variant.price);
    }
  }
  return convertToNumber(product.discounted_price ?? product.price);
};

// Helper to get price from bundle
const getBundlePrice = (bundle: Bundle): number => {
  return convertToNumber(bundle.discounted_price ?? bundle.price);
};

// Calculate cart totals
const calculateTotals = (items: GuestCartItem[]): { total_price: number; shipping_charge: number; final_price: number } => {
  const total_price = items.reduce((sum, item) => sum + item.total, 0);
  const shipping_charge = total_price >= SHIPPING_THRESHOLD ? 0 : SHIPPING_CHARGE;
  const final_price = total_price + shipping_charge;
  return { total_price, shipping_charge, final_price };
};

// Get guest cart from localStorage
export const getGuestCart = (): GuestCart => {
  if (typeof window === "undefined") {
    return { items: [], total_price: 0, shipping_charge: 0, final_price: 0 };
  }
  
  try {
    const stored = localStorage.getItem(GUEST_CART_KEY);
    if (stored) {
      const cart = JSON.parse(stored) as GuestCart;
      return cart;
    }
  } catch (error) {
    console.error("Error reading guest cart:", error);
  }
  
  return { items: [], total_price: 0, shipping_charge: 0, final_price: 0 };
};

// Save guest cart to localStorage
const saveGuestCart = (cart: GuestCart): void => {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error("Error saving guest cart:", error);
  }
};

// Generate unique ID for cart items
const generateItemId = (): string => {
  return `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Add product to guest cart
export const addProductToGuestCart = (
  product: Product, 
  quantity: number, 
  variantSku?: string
): GuestCart => {
  const cart = getGuestCart();
  const price = getProductPrice(product, variantSku);
  
  // Check if item already exists (same product and variant)
  const existingIndex = cart.items.findIndex(
    item => 
      item.type === "product" && 
      item.product._id === product._id &&
      (item as GuestProductCartItem).variant_sku === variantSku
  );
  
  if (existingIndex !== -1) {
    // Update existing item
    const existingItem = cart.items[existingIndex] as GuestProductCartItem;
    existingItem.quantity += quantity;
    existingItem.total = existingItem.price * existingItem.quantity;
  } else {
    // Add new item
    const newItem: GuestProductCartItem = {
      id: generateItemId(),
      type: "product",
      product,
      quantity,
      variant_sku: variantSku,
      price,
      total: price * quantity,
      addedAt: new Date().toISOString(),
    };
    cart.items.push(newItem);
  }
  
  // Recalculate totals
  const totals = calculateTotals(cart.items);
  const updatedCart = { ...cart, ...totals };
  
  saveGuestCart(updatedCart);
  return updatedCart;
};

// Add bundle to guest cart
export const addBundleToGuestCart = (bundle: Bundle, quantity: number): GuestCart => {
  const cart = getGuestCart();
  const price = getBundlePrice(bundle);
  
  // Check if bundle already exists
  const existingIndex = cart.items.findIndex(
    item => item.type === "bundle" && (item as GuestBundleCartItem).bundle._id === bundle._id
  );
  
  if (existingIndex !== -1) {
    // Update existing item
    const existingItem = cart.items[existingIndex] as GuestBundleCartItem;
    existingItem.quantity += quantity;
    existingItem.total = existingItem.price * existingItem.quantity;
  } else {
    // Add new item
    const newItem: GuestBundleCartItem = {
      id: generateItemId(),
      type: "bundle",
      bundle,
      quantity,
      price,
      total: price * quantity,
      addedAt: new Date().toISOString(),
    };
    cart.items.push(newItem);
  }
  
  // Recalculate totals
  const totals = calculateTotals(cart.items);
  const updatedCart = { ...cart, ...totals };
  
  saveGuestCart(updatedCart);
  return updatedCart;
};

// Update item quantity in guest cart
export const updateGuestCartItemQuantity = (itemId: string, quantity: number): GuestCart => {
  const cart = getGuestCart();
  
  if (quantity <= 0) {
    // Remove item
    cart.items = cart.items.filter(item => item.id !== itemId);
  } else {
    // Update quantity
    const itemIndex = cart.items.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
      cart.items[itemIndex].quantity = quantity;
      cart.items[itemIndex].total = cart.items[itemIndex].price * quantity;
    }
  }
  
  // Recalculate totals
  const totals = calculateTotals(cart.items);
  const updatedCart = { ...cart, ...totals };
  
  saveGuestCart(updatedCart);
  return updatedCart;
};

// Remove item from guest cart
export const removeFromGuestCart = (itemId: string): GuestCart => {
  return updateGuestCartItemQuantity(itemId, 0);
};

// Clear guest cart
export const clearGuestCart = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(GUEST_CART_KEY);
};

// Get guest cart item count
export const getGuestCartItemCount = (): number => {
  const cart = getGuestCart();
  return cart.items.reduce((count, item) => count + item.quantity, 0);
};

