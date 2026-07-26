import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

const ORDERS_COLLECTION = "orders";

export const orderService = {
  async createOrder(buyerEmail, items, total) {
    
    const sellerEmails = [...new Set(items.map((i) => i.sellerEmail).filter(Boolean))];

    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
      buyerEmail,
      items,
      sellerEmails,
      total,
      createdAt: new Date().toISOString(),
    });
    return { id: docRef.id };
  },

  async getOrdersForSeller(sellerEmail) {
    if (!sellerEmail) return [];
    try {
      const q = query(
        collection(db, ORDERS_COLLECTION),
        where("sellerEmails", "array-contains", sellerEmail)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (error) {
      console.error("orderService getOrdersForSeller error:", error);
      return [];
    }
  },

  async getOrdersForBuyer(buyerEmail) {
    if (!buyerEmail) return [];
    try {
      const q = query(
        collection(db, ORDERS_COLLECTION),
        where("buyerEmail", "==", buyerEmail)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (error) {
      console.error("orderService getOrdersForBuyer error:", error);
      return [];
    }
  },
};