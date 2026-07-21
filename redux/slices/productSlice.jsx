import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productService } from "@/services/productService";


export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await productService.getAll();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/create",
  async (productData, { rejectWithValue }) => {
    try {
      return await productService.create(productData);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id, {rejectWithValue})=>{
    try{
      await productService.delete(id);
      return id; 
    }catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState:{
    items:[],
    loading: false,
    error: null,
  },
  reducers: {}, 
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading= true;
        state.error= null;
      })
      .addCase(fetchProducts.fulfilled, (state,action) => {
        state.loading= false;
        state.items= action.payload;
      })
      .addCase(fetchProducts.rejected, (state,action) => {
        state.loading= false;
        state.error= action.payload;
      })
      // Create
      .addCase(createProduct.fulfilled, (state,action) => {
        state.items.unshift(action.payload); 
      })
      // Delete
      .addCase(deleteProduct.fulfilled, (state,action) => {
        state.items= state.items.filter((p) => p.id !== action.payload);
      });
  },
});

export default productSlice.reducer;