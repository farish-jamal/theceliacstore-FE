import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GuestCart, GuestCartItem } from '@/app/types/GuestCart';

interface GuestCartState {
  cart: GuestCart;
  isInitialized: boolean;
}

const initialState: GuestCartState = {
  cart: {
    items: [],
    total_price: 0,
    shipping_charge: 0,
    final_price: 0,
  },
  isInitialized: false,
};

const guestCartSlice = createSlice({
  name: 'guestCart',
  initialState,
  reducers: {
    setGuestCart(state, action: PayloadAction<GuestCart>) {
      state.cart = action.payload;
      state.isInitialized = true;
    },
    clearGuestCartState(state) {
      state.cart = {
        items: [],
        total_price: 0,
        shipping_charge: 0,
        final_price: 0,
      };
    },
    updateGuestCartItem(state, action: PayloadAction<{ itemId: string; quantity: number }>) {
      const { itemId, quantity } = action.payload;
      const itemIndex = state.cart.items.findIndex(item => item.id === itemId);
      
      if (itemIndex !== -1) {
        if (quantity <= 0) {
          state.cart.items.splice(itemIndex, 1);
        } else {
          state.cart.items[itemIndex].quantity = quantity;
          state.cart.items[itemIndex].total = state.cart.items[itemIndex].price * quantity;
        }
        
        // Recalculate totals
        const total_price = state.cart.items.reduce((sum, item) => sum + item.total, 0);
        const shipping_charge = total_price >= 500 ? 0 : 50;
        state.cart.total_price = total_price;
        state.cart.shipping_charge = shipping_charge;
        state.cart.final_price = total_price + shipping_charge;
      }
    },
    addItemToGuestCart(state, action: PayloadAction<GuestCartItem>) {
      // Check if item already exists
      const existingIndex = state.cart.items.findIndex(item => {
        if (item.type === 'product' && action.payload.type === 'product') {
          return item.product._id === action.payload.product._id;
        }
        if (item.type === 'bundle' && action.payload.type === 'bundle') {
          return item.bundle._id === action.payload.bundle._id;
        }
        return false;
      });
      
      if (existingIndex !== -1) {
        // Update existing item quantity
        state.cart.items[existingIndex].quantity += action.payload.quantity;
        state.cart.items[existingIndex].total = 
          state.cart.items[existingIndex].price * state.cart.items[existingIndex].quantity;
      } else {
        state.cart.items.push(action.payload);
      }
      
      // Recalculate totals
      const total_price = state.cart.items.reduce((sum, item) => sum + item.total, 0);
      const shipping_charge = total_price >= 500 ? 0 : 50;
      state.cart.total_price = total_price;
      state.cart.shipping_charge = shipping_charge;
      state.cart.final_price = total_price + shipping_charge;
    },
  },
});

export const { 
  setGuestCart, 
  clearGuestCartState, 
  updateGuestCartItem, 
  addItemToGuestCart 
} = guestCartSlice.actions;

export default guestCartSlice.reducer;

