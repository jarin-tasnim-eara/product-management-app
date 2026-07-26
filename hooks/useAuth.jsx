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
      try {
        if (firebaseUser) {
          const profile = await authService.getUserProfile(firebaseUser.uid);
          dispatch(
            setUser({
              user: {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                name: profile.name,
              },
              role: profile.role,
            })
          );
        } else {
          dispatch(clearUser());
        }
      } catch (error) {
        console.warn("Auth state change error:", error);
        if (firebaseUser) {
          dispatch(
            setUser({
              user: { uid: firebaseUser.uid, email: firebaseUser.email, name: "" },
              role: "user",
            })
          );
        } else {
          dispatch(clearUser());
        }
      }
    });

    return () => unsubscribe();
  }, [dispatch]);
}