import { API_BASE_URL } from "@/config/constants";

async function request(endpoint, options = {}) {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("API Error Response:", errorText);
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export const api = {
  get: (endpoint) => request(endpoint),
  post: (endpoint, data) => request(endpoint, { method: "POST", body: data }),
  put: (endpoint, data) => request(endpoint, { method: "PUT", body: data }),
  patch: (endpoint, data) => request(endpoint, { method: "PATCH", body: data }),
  delete: (endpoint) => request(endpoint, { method: "DELETE" }),
};