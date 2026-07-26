
export function formatBDT(price) {
  if (price == null || isNaN(price)) return "";
  return `৳${Math.round(Number(price)).toLocaleString("en-BD")}`;
}