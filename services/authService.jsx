import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { ROLES } from "@/config/constants";

export const authService = {
  async signup(email, password, role = ROLES.USER){
    const {user} = await createUserWithEmailAndPassword(auth,email,password);

    await setDoc(doc(db, "users", user.uid),{
      email: user.email,
      role,
    });

    return { uid: user.uid, email: user.email, role };
  },

  async login(email, password){
    const { user}= await signInWithEmailAndPassword(auth, email, password);
    const role= await authService.getRole(user.uid);
    return {uid: user.uid, email: user.email, role };
  },

  async logout(){
    await signOut(auth);
  },

  async getRole(uid){
    const snap = await getDoc(doc(db, "users", uid));
    return snap.exists() ? snap.data().role:ROLES.USER;
  },
};