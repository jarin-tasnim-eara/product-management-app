import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

const ROLES = {
  USER: "user",
  SELLER: "seller",
  ADMIN: "admin",
};

export const authService = {
  async signup(email, password, role = ROLES.USER) {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      try {
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          role,
        });
      } catch (firestoreError) {
        console.warn("Firestore save failed, but auth succeeded:", firestoreError);
      }
      
      return { uid: user.uid, email: user.email, role };
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  },

  async login(email, password) {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      
      let role = ROLES.USER;
      try {
        role = await authService.getRole(user.uid);
      } catch (firestoreError) {
        console.warn("Firestore getRole failed, using default USER:", firestoreError);
      }
      
      return { uid: user.uid, email: user.email, role };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  async logout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  },

  async getRole(uid) {
    try {
      const snap = await getDoc(doc(db, "users", uid));
      return snap.exists() ? snap.data().role : ROLES.USER;
    } catch (error) {
      console.warn("getRole error, returning default USER:", error);
      return ROLES.USER;
    }
  },
};