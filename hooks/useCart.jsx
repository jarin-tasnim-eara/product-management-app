"use client";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cartService } from "@/services/cartService";
import { setCart, clearCart } from "@/redux/slices/cartSlice";

export function useCart() {
  const dispatch = useDispatch();
  const { user, initialized: authInitialized } = useSelector((s) => s.auth);
  const { items, initialized: cartInitialized } = useSelector((s) => s.cart);
  const skipNextSave = useRef(true);

  useEffect(() => {
    if (!authInitialized) return;
    skipNextSave.current = true;
    if (user?.uid) {
      cartService.getCart(user.uid).then((items) => dispatch(setCart(items)));
    } else {
      dispatch(clearCart());
    }
  }, [authInitialized, user, dispatch]);

  useEffect(() => {
    if (!cartInitialized || !user?.uid) return;
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }
    cartService.saveCart(user.uid, items);
  }, [items, cartInitialized, user]);
}