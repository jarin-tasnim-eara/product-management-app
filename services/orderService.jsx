import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import { productService } from "@/services/productService";

const ORDERS_COLLECTION = "orders";

export const orderService = {
  async createOrder(buyerEmail, items, total) {
    const sellerEmails = [...new Set(items.map((i) => i.sellerEmail).filter(Boolean))];

    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
      buyerEmail,
      items,
      sellerEmails,
      total,
      status: "pending", 
      stockDeducted: false, 
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

 
  async updateOrderStatus(orderId, status) {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);

    if (status === "delivered") {
      const snap = await getDoc(orderRef);
      if (!snap.exists()) return;
      const order = snap.data();

      if (!order.stockDeducted) {
        await Promise.all(
          (order.items || [])
            .filter((it) => !String(it.productId).startsWith("dummy_"))
            .map((it) => productService.decrementStock(it.productId, it.quantity))
        );
        await updateDoc(orderRef, { status, stockDeducted: true });
        return;
      }
    }

    await updateDoc(orderRef, { status });
  },
};