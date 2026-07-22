"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { auth } from "@/lib/firebase";
import { authService } from "@/services/authService";
import { setUser, clearUser } from "@/redux/slices/authSlice";

export function useAuth() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const role = await authService.getRole(firebaseUser.uid);
        dispatch(
          setUser({
            user: { uid: firebaseUser.uid, email: firebaseUser.email },
            role,
          })
        );
      } else {
        dispatch(clearUser());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);
}