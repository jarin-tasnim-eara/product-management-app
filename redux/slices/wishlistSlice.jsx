import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [], 
    initialized: false,
  },
  reducers: {
    setWishlist: (state, action) => {
      state.items = action.payload || [];
      state.initialized = true;
    },
    toggleWishlistItem: (state, action) => {
      const product = action.payload;
      const exists = state.items.find((i) => i.productId === product.id);
      if (exists) {
        state.items = state.items.filter((i) => i.productId !== product.id);
      } else {
        state.items.push({
          productId: product.id,
          name: product.name,
          price: product.data?.price ?? 0,
          image: product.data?.image ?? null,
          currency: product.data?.currency || "BDT",
        });
      }
    },
    clearWishlist: (state) => {
      state.items = [];
    },
  },
});

export const { setWishlist, toggleWishlistItem, clearWishlist } =
  wishlistSlice.actions;
export default wishlistSlice.reducer;