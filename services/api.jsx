import { API_BASE_URL } from "@/config/constants";

async function request(endpoint, options = {}){
  const res = await fetch(`${API_BASE_URL}${endpoint}`,{
    headers:{ "Content-Type": "application/json"},
    ...options,
  });

  if(!res.ok){
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }

  const text= await res.text();
  return text ? JSON.parse(text) : null;
}

export const api = {
  get:(endpoint)=> request(endpoint),
  post:(endpoint, body)=>request(endpoint, {method: "POST", body: JSON.stringify(body)}),
  put:(endpoint, body)=>request(endpoint, {method: "PUT", body: JSON.stringify(body)}),
  patch:(endpoint, body)=>request(endpoint, {method: "PATCH", body: JSON.stringify(body)}),
  delete:(endpoint)=> request(endpoint, {method: "DELETE"}),
};