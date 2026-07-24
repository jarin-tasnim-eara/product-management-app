import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const cartService = {
  async getCart(uid) {
    if (!uid) return [];
    try {
      const snap = await getDoc(doc(db, "carts", uid));
      return snap.exists() ? snap.data().items || [] : [];
    } catch (error) {
      console.error("cartService getCart error:", error);
      return [];
    }
  },

  async saveCart(uid, items) {
    if (!uid) return;
    try {
      await setDoc(doc(db, "carts", uid), { items }, { merge: true });
    } catch (error) {
      console.error("cartService saveCart error:", error);
    }
  },
};