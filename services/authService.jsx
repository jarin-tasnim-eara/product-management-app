import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

const ROLES = {
  USER: "user",
  SELLER: "seller",
  ADMIN: "admin",
};

export const authService = {
  async signup(email, password, role = ROLES.USER, name = "") {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);

      try {
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          role,
          name,
        });
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

  async getUserProfile(uid) {
    try {
      const snap = await getDoc(doc(db, "users", uid));
      if (snap.exists()) {
        const data = snap.data();
        return {
          role: data.role || ROLES.USER,
          name: data.name || "",
          shopBio: data.shopBio || "",
        };
      }
      return { role: ROLES.USER, name: "", shopBio: "" };
    } catch (error) {
      console.warn("getUserProfile error:", error);
      return { role: ROLES.USER, name: "", shopBio: "" };
    }
  },

  async updateProfile(uid, updates) {
    await setDoc(doc(db, "users", uid), updates, { merge: true });
  },

  async getAllUsers() {
    try {
      const snapshot = await getDocs(collection(db, "users"));
      return snapshot.docs.map((d) => ({ uid: d.id, ...d.data() }));
    } catch (error) {
      console.warn("getAllUsers error:", error);
      return [];
    }
  },

  async getProfileByEmail(email) {
    if (!email) return null;
    try {
      const q = query(collection(db, "users"), where("email", "==", email));
      const snapshot = await getDocs(q);
      if (snapshot.empty) return null;
      const data = snapshot.docs[0].data();
      return { name: data.name || "", shopBio: data.shopBio || "" };
    } catch (error) {
      console.warn("getProfileByEmail error:", error);
      return null;
    }
  },
};