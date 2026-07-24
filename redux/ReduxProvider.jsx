"use client";

import { Provider } from "react-redux";
import { store } from "./store";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";

function AppListeners({ children }) {
  useAuth();
  useCart();
  return children;
}

export default function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <AppListeners>{children}</AppListeners>
    </Provider>
  );
}