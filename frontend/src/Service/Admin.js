export async function getAdminProducts() {
  const response = await axios.get(
    "http://localhost:8080/api/products"
  );

  return Array.isArray(response.data)
    ? response.data
    : response.data.content ?? [];
}