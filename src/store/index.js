import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";

const STORAGE_KEY = "skrackkallaren-cart";

// Läs in sparad kundvagn vid start …
function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : undefined;
  } catch {
    return undefined;
  }
}

export const store = configureStore({
  reducer: { cart: cartReducer },
  preloadedState: { cart: loadCart() },
});

// … och spara vid varje ändring
store.subscribe(() => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store.getState().cart));
  } catch {
    /* localStorage kan vara blockerat – appen fungerar ändå */
  }
});
