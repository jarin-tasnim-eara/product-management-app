import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { ROLES } from "@/config/constants";

export const authService = {
  async signup(email, password, role = ROLES.USER, name = "") {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      try {
        await setDoc(doc(db, "users", user.uid), { email: user.email, role, name });
      } catch (firestoreError) {
        console.warn("Firestore save failed, but auth succeeded:", firestoreError);
      }
      return { uid: user.uid, email: user.email, role, name };
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  },

  async login(email, password) {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const profile = await authService.getUserProfile(user.uid);
      return { uid: user.uid, email: user.email, role: profile.role, name: profile.name };
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

  async getUserProfile(uid) {
    try {
      const snap = await getDoc(doc(db, "users", uid));
      if (snap.exists()) {
        const data = snap.data();
        return {
          role: data.role || ROLES.USER,
          name: data.name || "",
          bio: data.bio || "",
        };
      }
    } catch (error) {
      console.warn("getUserProfile error, using default:", error);
    }
    return { role: ROLES.USER, name: "", bio: "" };
  },

  async updateProfile(uid, updates) {
    await setDoc(doc(db, "users", uid), updates, { merge: true });
  },
};