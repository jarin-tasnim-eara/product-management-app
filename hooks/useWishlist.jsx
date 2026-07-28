"use client";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { wishlistService } from "@/services/wishlistService";
import { setWishlist, clearWishlist } from "@/redux/slices/wishlistSlice";

export function useWishlist() {
  const dispatch = useDispatch();
  const { user, initialized: authInitialized } = useSelector((s) => s.auth);
  const { items, initialized: wishlistInitialized } = useSelector((s) => s.wishlist);
  const skipNextSave = useRef(true);

  useEffect(() => {
    if (!authInitialized) return;
    skipNextSave.current = true;
    if (user?.uid) {
      wishlistService.getWishlist(user.uid).then((items) => dispatch(setWishlist(items)));
    } else {
      dispatch(clearWishlist());
    }
  }, [authInitialized, user, dispatch]);

  useEffect(() => {
    if (!wishlistInitialized || !user?.uid) return;
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }
    wishlistService.saveWishlist(user.uid, items);
  }, [items, wishlistInitialized, user]);
}