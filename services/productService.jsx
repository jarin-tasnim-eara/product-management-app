import { api } from "./api";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";

const PRODUCTS_COLLECTION = "products";

export const productService = {
  async getAll() {
    let apiProducts = [];
    let firestoreProducts = [];

    try {
      const data = await api.get("");
      apiProducts = Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("API GET Error (skipping API products):", error.message);
      apiProducts = [];
    }

    try {
      const snapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
      firestoreProducts = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
    } catch (error) {
      console.error("Firestore getAll error:", error.message);
      firestoreProducts = [];
    }

    return [...firestoreProducts, ...apiProducts];
  },

  async create(productData) {
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
      name: productData.name,
      data: productData.data,
      sellerEmail: productData.data?.sellerEmail || null,
      createdAt: new Date().toISOString(),
    });

    return {
      id: docRef.id,
      name: productData.name,
      data: productData.data,
      sellerEmail: productData.data?.sellerEmail || null,
    };
  },

  // Seller dashboard: শুধু নিজের email এর product
  async getSellerProducts(sellerEmail) {
    if (!sellerEmail) return [];
    try {
      const q = query(
        collection(db, PRODUCTS_COLLECTION),
        where("sellerEmail", "==", sellerEmail)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (error) {
      console.error("Firestore getSellerProducts error:", error);
      return [];
    }
  },

  async getById(id) {
    try {
      const snap = await getDoc(doc(db, PRODUCTS_COLLECTION, id));
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() };
      }
    } catch (error) {
      console.warn("Firestore getById error:", error.message);
    }

    try {
      const data = await api.get(`/${id}`);
      return data;
    } catch (error) {
      console.error("API getById error:", error.message);
      return null;
    }
  },

  async update(id, productData) {
    await updateDoc(doc(db, PRODUCTS_COLLECTION, id), productData);
    return { id, ...productData };
  },

  async delete(id) {
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, id));
    return { success: true };
  },
};