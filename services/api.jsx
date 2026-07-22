import { API_BASE_URL } from "@/config/constants";

async function request(endpoint, options = {}){
  const res = await fetch(`${API_BASE_URL}${endpoint}`,{
    headers:{ "Content-Type": "application/json"},
    ...options,
  });

  if(!res.ok){
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }

return res.json();
}

export const api = {
  get:(endpoint)=> request(endpoint),
  post:(endpoint, data)=>request(endpoint, {method: "POST", body: JSON.stringify(data)}),
  put:(endpoint, data)=>request(endpoint, {method: "PUT", body: JSON.stringify(data)}),
  patch:(endpoint, data)=>request(endpoint, {method: "PATCH", body: JSON.stringify(data)}),
  delete:(endpoint)=> request(endpoint, {method: "DELETE"}),
};