
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:8080/api/products";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

   axios.get("http://localhost:8080/api/products")
  .then((response) => {
    const data = response.data;

    setProducts(
      Array.isArray(data)
        ? data
        : data.content ?? []
    );
  })
  .catch((error) => {
    console.error("Product API error:", error);
    setError("Unable to load products.");
  });
  }, []);

  const totalProducts = products.length;
  const lowStock = products.filter(
    (product) => Number(product.stock ?? 0) <= 5
  ).length;
  const outOfStock = products.filter(
    (product) => Number(product.stock ?? 0) <= 0
  ).length;

  return (
    <div className="min-h-screen bg-gray-100 md:flex">
      <aside className="w-full bg-gray-950 p-6 text-white md:min-h-screen md:w-64">
        <h1 className="text-2xl font-bold">Fashion Admin</h1>
        <p className="mt-2 text-sm text-gray-400">
          Store management
        </p>

        <nav className="mt-8 flex flex-col gap-3">
          <Link
            to="/admin"
            className="rounded-lg bg-gray-800 px-4 py-3"
          >
            Dashboard
          </Link>
          <Link
            to="/admin/products"
            className="rounded-lg px-4 py-3 hover:bg-gray-800"
          >
            Manage Products
          </Link>
          <Link
            to="/shop"
            className="rounded-lg px-4 py-3 hover:bg-gray-800"
          >
            View Store
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Dashboard
            </h2>
            <p className="mt-2 text-gray-600">
              Welcome to your Fashion Store admin panel.
            </p>
          </div>

          <Link
            to="/admin/products"
            className="rounded-lg bg-black px-5 py-3 font-semibold text-white"
          >
            + Manage Products
          </Link>
        </div>

        {error && (
          <p role="alert" className="mt-6 rounded-lg bg-red-100 p-4 text-red-700">
            {error}
          </p>
        )}

        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard title="Products" value={totalProducts} />
          <StatCard title="Low Stock (≤ 5)" value={lowStock} />
          <StatCard title="Out of Stock" value={outOfStock} />
        </div>

        <section className="mt-8 rounded-xl bg-white p-6 shadow-sm">
          <h3 className="text-xl font-bold">Quick Actions</h3>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              to="/admin/products"
              className="rounded-lg border px-4 py-3 hover:bg-gray-50"
            >
              View all products
            </Link>
            <Link
              to="/shop"
              className="rounded-lg border px-4 py-3 hover:bg-gray-50"
            >
              Preview storefront
            </Link>
          </div>
          <p className="mt-5 text-sm text-gray-500">
            Product statistics are based on the products returned
            by your current API.
          </p>
        </section>
      </main>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="mt-3 text-3xl font-bold text-gray-900">
        {value}
      </p>
    </div>
  );
}
