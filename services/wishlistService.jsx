import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const wishlistService = {
  async getWishlist(uid) {
    if (!uid) return [];
    try {
      const snap = await getDoc(doc(db, "wishlists", uid));
      return snap.exists() ? snap.data().items || [] : [];
    } catch (error) {
      console.error("wishlistService getWishlist error:", error);
      return [];
    }
  },

  async saveWishlist(uid, items) {
    if (!uid) return;
    try {
      await setDoc(doc(db, "wishlists", uid), { items }, { merge: true });
    } catch (error) {
      console.error("wishlistService saveWishlist error:", error);
    }
  },
};