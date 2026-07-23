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

function mapDummyProduct(p) {
  return {
    id: `dummy_${p.id}`,
    name: p.title,
    data: {
      category: p.category,
      price: p.price,
      brand: p.brand,
      rating: p.rating,
      image: p.thumbnail,
      description: p.description,
    },
  };
}

export const productService = {
  async getAll() {
    let apiProducts = [];
    let firestoreProducts = [];

    try {
      const data = await api.get("?limit=50");
      const list = Array.isArray(data) ? data : data.products || [];
      apiProducts = list.map(mapDummyProduct);
    } catch (error) {
      console.error("API GET error (skipping API products):", error.message);
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
    if (typeof id === "string" && id.startsWith("dummy_")) {
      const realId = id.replace("dummy_", "");
      try {
        const p = await api.get(`/${realId}`);
        return mapDummyProduct(p);
      } catch (error) {
        console.error("API getById error:", error.message);
        return null;
      }
    }

    try {
      const snap = await getDoc(doc(db, PRODUCTS_COLLECTION, id));
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() };
      }
    } catch (error) {
      console.warn("Firestore getById error:", error.message);
    }
    return null;
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