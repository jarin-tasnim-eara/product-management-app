import {api} from "./api";

export const productService ={
  getAll:() => api.get(""),
  getById:(id) => api.get(`/${id}`),
  create:(productData) => api.post("", productData),
  update:(id, productData) => api.put(`/${id}`, productData),
  delete:(id) => api.delete(`/${id}`),
};