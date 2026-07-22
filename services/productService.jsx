import { api } from "./api";

export const productService = {
  async getAll() {
    try {
      const data = await api.get("");
      console.log("API Response:", data);
      return data;
    } catch (error) {
      console.error("API Error:", error);
      
      return [];
    }
  },

  async getById(id) {
    const data = await api.get(`/${id}`);
    return data;
  },

  async create(productData) {
    const data = await api.post("", productData);
    return data;
  },

  async update(id, productData) {
    const data = await api.put(`/${id}`, productData);
    return data;
  },

  async delete(id) {
    const data = await api.delete(`/${id}`);
    return data;
  },
};