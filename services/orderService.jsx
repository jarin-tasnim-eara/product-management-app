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
      stockDeductedFor: [],
      createdAt: new Date().toISOString(),
    });
    return { id: docRef.id };
  },

  async getAllOrders() {
    try {
      const snapshot = await getDocs(collection(db, ORDERS_COLLECTION));
      return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (error) {
      console.error("orderService getAllOrders error:", error);
      return [];
    }
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

  async updateOrderStatus(orderId, status, sellerEmail) {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);

    if (status === "delivered" && sellerEmail) {
      const snap = await getDoc(orderRef);
      if (!snap.exists()) return;
      const order = snap.data();
      const alreadyDeducted = order.stockDeductedFor || [];

      if (!alreadyDeducted.includes(sellerEmail)) {
        const myItems = (order.items || []).filter(
          (it) => it.sellerEmail === sellerEmail && !String(it.productId).startsWith("dummy_")
        );

        await Promise.all(
          myItems.map((it) => productService.decrementStock(it.productId, it.quantity))
        );

        await updateDoc(orderRef, {
          status,
          stockDeductedFor: [...alreadyDeducted, sellerEmail],
        });
        return;
      }
    }

    await updateDoc(orderRef, { status });
  },
};