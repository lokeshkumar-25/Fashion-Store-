
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ProductCard from "../Components/ProductCard";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080";

const API = `${API_URL.replace(/\/$/, "")}/api/products`;

const categories = [
  {
    name: "Men",
    slug: "men",
    image:
      "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800",
  },
  {
    name: "Women",
    slug: "women",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800",
  },
  {
    name: "Kids",
    slug: "kids",
    image:
      "https://images.unsplash.com/photo-1503919005314-30d93d07d823?w=800",
  },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function fetchProducts() {
      try {
        const response = await axios.get(API);
        const data = response.data;

        const productList = Array.isArray(data)
          ? data
          : Array.isArray(data?.content)
          ? data.content
          : [];

        if (active) {
          setProducts(productList);
          setError("");
        }
      } catch (err) {
        console.error("Failed to load homepage products:", err);

        if (active) {
          setError("Unable to load products.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="relative flex min-h-[480px] items-center bg-gray-900">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600"
          alt="Fashion collection"
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />

        <div className="relative mx-auto w-full max-w-7xl px-6 py-20 text-white">
          <p className="mb-4 text-sm uppercase tracking-[0.3em]">
            New Season Collection
          </p>

          <h1 className="max-w-xl text-4xl font-bold leading-tight sm:text-6xl">
            Discover Your Style
          </h1>

          <p className="mt-5 max-w-md text-gray-200">
            Explore modern fashion, everyday essentials,
            and timeless looks.
          </p>

          <Link
            to="/shop"
            className="mt-8 inline-block rounded-lg bg-white px-8 py-3 font-semibold text-black hover:bg-gray-200"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold">
            Shop by Category
          </h2>
          <p className="mt-2 text-gray-500">
            Find your perfect collection
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.slug}
              to={`/shop?category=${category.slug}`}
              className="group relative overflow-hidden rounded-xl"
            >
              <img
                src={category.image}
                alt={category.name}
                className="h-80 w-full object-cover transition duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 to-transparent p-6">
                <h3 className="text-2xl font-bold text-white">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-5">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold">
                Featured Products
              </h2>
              <p className="mt-2 text-gray-500">
                Discover our latest picks
              </p>
            </div>

            <Link to="/shop" className="font-medium underline">
              View All
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-80 animate-pulse rounded-xl bg-gray-200"
                />
              ))}
            </div>
          ) : error ? (
            <p role="alert" className="text-red-600">
              {error}
            </p>
          ) : products.length === 0 ? (
            <p>No products available yet.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {products.slice(0, 8).map((product) => (
                <ProductCard
                  key={product.id || product._id}
                  product={product}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Promotional Section */}
      <section className="bg-gray-950 px-6 py-16 text-center text-white">
        <h2 className="text-3xl font-bold">
          Upgrade Your Wardrobe
        </h2>

        <p className="mx-auto mt-4 max-w-lg text-gray-300">
          Discover clothing and accessories for every occasion.
        </p>

        <Link
          to="/shop"
          className="mt-7 inline-block rounded-lg bg-white px-8 py-3 font-semibold text-black"
        >
          Explore Collection
        </Link>
      </section>
    </main>
  );
}
