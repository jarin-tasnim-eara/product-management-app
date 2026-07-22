"use client";

import { Provider } from "react-redux";
import { store } from "./store";
import { useAuth } from "@/hooks/useAuth";

function AuthListener({ children }) {
  useAuth(); 
  return children;
}
export default function ReduxProvider({ children }) {
  return <Provider store={store}>
    <AuthListener>
    {children}
    </AuthListener>
    </Provider>;
}