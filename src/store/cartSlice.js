import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [] },
  reducers: {
    // payload: { id, title, poster_path, basePrice, mode: "buy" | "rent" }
    addItem(state, action) {
      const exists = state.items.find((i) => i.id === action.payload.id);
      if (exists) exists.mode = action.payload.mode;
      else state.items.push(action.payload);
    },
    removeItem(state, action) {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addItem, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
