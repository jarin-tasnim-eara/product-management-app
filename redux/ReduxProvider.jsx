"use client";

import { Provider } from "react-redux";
import { store } from "./store";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";

function AppListeners({ children }) {
  useAuth();
  useCart();
  useWishlist();
  return children;
}

export default function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <AppListeners>{children}</AppListeners>
    </Provider>
  );
}