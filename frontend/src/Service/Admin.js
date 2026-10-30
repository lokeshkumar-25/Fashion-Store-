
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8080";

export async function getAdminProducts() {
  const response = await axios.get(
    `${API_URL}/api/products`
  );

  return Array.isArray(response.data)
    ? response.data
    : response.data.content ?? [];
}
