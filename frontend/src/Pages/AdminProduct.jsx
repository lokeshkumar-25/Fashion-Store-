
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  ArrowLeft,
  Package,
} from "lucide-react";

import { useAuth } from "../Context/AuthContext";

// Must match your running Spring Boot backend.
const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8080";

const API = `${API_URL}/api/products`;

export default function AdminProducts() {
  const { token, role, user } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isAdmin =
    String(role ?? user?.role ?? "")
      .replace(/^ROLE_/i, "")
      .toUpperCase() === "ADMIN";

  // LOAD ALL PRODUCTS
  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(API);

      const data = response.data;

      const productList = Array.isArray(data)
        ? data
        : Array.isArray(data?.content)
        ? data.content
        : [];

      setProducts(productList);
    } catch (err) {
      console.error("Load products error:", err);

      setError(
        err.response?.data?.message ||
        `Unable to load products: ${
          err.response?.status || err.message
        }`
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // DELETE PRODUCT
  const deleteProduct = async (id) => {
    if (!id) {
      setError("Invalid product ID.");
      return;
    }

    if (!isAdmin) {
      setError("Only administrators can delete products.");
      return;
    }

    if (!token) {
      setError("Please log in as an administrator.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    setDeletingId(String(id));
    setError("");
    setSuccess("");

    try {
      await axios.delete(
        `${API}/${encodeURIComponent(id)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProducts((previous) =>
        previous.filter(
          (product) =>
            String(product.id ?? product._id) !== String(id)
        )
      );

      setSuccess("Product deleted successfully!");
    } catch (err) {
      console.error("Delete product error:", err);

      const status = err.response?.status;

      if (status === 401) {
        setError("Session expired. Please log in again.");
      } else if (status === 403) {
        setError("Access denied. Admin permission required.");
      } else if (status === 404) {
        setError("Product not found.");
      } else {
        setError(
          err.response?.data?.message ||
          "Unable to delete product."
        );
      }
    } finally {
      setDeletingId(null);
    }
  };

  // PRICE DISPLAY
  const getDisplayPrice = (product) => {
    const price = Number(product.price ?? 0);

    const discount = Number(
      product.discountprice ??
      product.discountPrice ??
      0
    );

    return discount > 0 && discount < price
      ? discount
      : price;
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(price);

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-10">
      <div className="mx-auto max-w-7xl">

        {/* BACK BUTTON */}
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        {/* HEADER */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Manage Products
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Add, edit, delete, and manage store products.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={loadProducts}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw size={17} />
              Refresh
            </button>

            {isAdmin && (
              <Link
                to="/admin/products/new"
                className="inline-flex items-center gap-2 rounded-lg bg-black px-5 py-3 font-semibold text-white hover:bg-gray-800"
              >
                <Plus size={18} />
                Add Product
              </Link>
            )}
          </div>
        </div>

        {/* SUCCESS */}
        {success && (
          <div
            role="status"
            className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700"
          >
            {success}
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div
            role="alert"
            className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700"
          >
            {error}
          </div>
        )}

        {/* PRODUCT COUNT */}
        <div className="mt-6 flex items-center gap-3 rounded-xl bg-white p-5 shadow-sm">
          <Package size={24} />

          <div>
            <p className="text-sm text-gray-500">
              Total Products
            </p>

            <h2 className="text-2xl font-bold">
              {products.length}
            </h2>
          </div>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="mt-8 rounded-xl bg-white p-10 text-center">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="mt-8 rounded-xl bg-white p-10 text-center">
            <Package
              size={42}
              className="mx-auto text-gray-400"
            />

            <h3 className="mt-4 text-xl font-bold">
              No Products Found
            </h3>

            <p className="mt-2 text-gray-500">
              Add your first product to the store.
            </p>

            {isAdmin && (
              <Link
                to="/admin/products/new"
                className="mt-5 inline-block rounded-lg bg-black px-6 py-3 text-white"
              >
                Add Product
              </Link>
            )}
          </div>
        ) : (
          <div className="mt-8 overflow-x-auto rounded-xl bg-white shadow-sm">
            <table className="w-full min-w-[800px] text-left text-sm">

              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="p-4">Image</th>
                  <th className="p-4">Product</th>
                  <th className="p-4">Brand</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product, index) => {
                  const productId =
                    product.id ?? product._id;

                  const image =
                    product.images?.[0] ||
                    "https://placehold.co/100x100?text=Product";

                  const stock = Number(
                    product.stock ?? 0
                  );

                  const available =
                    product.available !== false &&
                    stock > 0;

                  return (
                    <tr
                      key={productId ?? index}
                      className="border-t hover:bg-gray-50"
                    >
                      {/* IMAGE */}
                      <td className="p-4">
                        <img
                          src={image}
                          alt={product.name || "Product"}
                          className="h-16 w-16 rounded-lg object-cover"
                        />
                      </td>

                      {/* NAME */}
                      <td className="p-4 font-semibold">
                        {product.name || "Unnamed Product"}
                      </td>

                      {/* BRAND */}
                      <td className="p-4">
                        {product.brand || "-"}
                      </td>

                      {/* CATEGORY */}
                      <td className="p-4 capitalize">
                        {product.category || "-"}
                      </td>

                      {/* PRICE */}
                      <td className="p-4 font-medium">
                        {formatPrice(getDisplayPrice(product))}
                      </td>

                      {/* STOCK */}
                      <td className="p-4">
                        {stock}
                      </td>

                      {/* STATUS */}
                      <td className="p-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            available
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {available
                            ? "Available"
                            : "Out of Stock"}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">

                          {isAdmin && productId && (
                            <>
                              <Link
                                to={`/admin/products/edit/${productId}`}
                                className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-2 font-medium text-white hover:bg-blue-700"
                              >
                                <Pencil size={15} />
                                Edit
                              </Link>

                              <button
                                type="button"
                                onClick={() =>
                                  deleteProduct(productId)
                                }
                                disabled={
                                  deletingId === String(productId)
                                }
                                className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 font-medium text-white hover:bg-red-700 disabled:opacity-50"
                              >
                                <Trash2 size={15} />

                                {deletingId === String(productId)
                                  ? "Deleting..."
                                  : "Delete"}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
