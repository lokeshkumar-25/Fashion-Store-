
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
} from "lucide-react";

import ProductCard from "../Components/ProductCard";

const API_URL = `${(import.meta.env.VITE_API_URL || "http://localhost:8080").replace(/\/$/, "")}/api/products`;

function getPrice(product) {
  const regular = Number(product?.price ?? 0);
  const discounted = Number(product?.discountPrice ?? product?.discountprice ?? 0);
  return discounted > 0 && discounted < regular ? discounted : regular;
}

const categories = [
  { label: "All Products", value: "all" },
  { label: "Men", value: "men" },
  { label: "Women", value: "women" },
  { label: "Kids", value: "kids" },
];

const priceOptions = [
  { label: "All Prices", value: "all" },
  { label: "Under ₹1,000", value: "1000" },
  { label: "Under ₹2,000", value: "2000" },
  { label: "Under ₹5,000", value: "5000" },
  { label: "Under ₹10,000", value: "10000" },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [mobileFiltersOpen, setMobileFiltersOpen] =
    useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const selectedCategory =
    searchParams.get("category")?.toLowerCase() || "all";

  // Fetch products from Spring Boot
  useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts() {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get(API_URL, {
          signal: controller.signal,
        });

        const data = response.data;

        const productList = Array.isArray(data)
          ? data
          : Array.isArray(data?.content)
          ? data.content
          : [];

        if (!controller.signal.aborted) setProducts(productList);
      } catch (err) {
        if (
          err.name === "CanceledError" ||
          err.code === "ERR_CANCELED"
        ) {
          return;
        }

        console.error("Product loading failed:", err);
        if (!controller.signal.aborted) setError(
          "Unable to load products. Please check your backend."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => controller.abort();
  }, [retryCount]);

  // Category selection updates the URL
  const changeCategory = (category) => {
    if (category === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }

    setMobileFiltersOpen(false);
  };

  // Search, filter, and sort
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search
    if (search.trim()) {
      const query = search.trim().toLowerCase();

      result = result.filter((product) => {
        const name = String(product.name || "").toLowerCase();
        const brand = String(product.brand || "").toLowerCase();

        return name.includes(query) || brand.includes(query);
      });
    }

    // Category
    if (selectedCategory !== "all") {
      result = result.filter((product) => {
        const category = String(
          product.category || ""
        ).toLowerCase();

        return category === selectedCategory;
      });
    }

    // Price
    if (maxPrice !== "all") {
      result = result.filter((product) => {
        const price = getPrice(product);

        return price <= Number(maxPrice);
      });
    }

    // Sort
    if (sortBy === "price-low") {
      result.sort(
        (a, b) =>
          getPrice(a) - getPrice(b)
      );
    }

    if (sortBy === "price-high") {
      result.sort(
        (a, b) =>
          getPrice(b) - getPrice(a)
      );
    }

    if (sortBy === "name") {
      result.sort((a, b) =>
        String(a.name || "").localeCompare(String(b.name || ""))
      );
    }

    return result;
  }, [products, search, selectedCategory, maxPrice, sortBy]);

  const clearFilters = () => {
    setSearch("");
    setMaxPrice("all");
    setSortBy("default");
    setSearchParams({});
  };

  const hasFilters =
    search.trim() !== "" ||
    selectedCategory !== "all" ||
    maxPrice !== "all" ||
    sortBy !== "default";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <section className="bg-gray-950 px-5 py-12 text-white md:py-16">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-gray-300">
            Fashion Store Collection
          </p>

          <h1 className="text-4xl font-bold md:text-5xl">
            Shop Collection
          </h1>

          <p className="mt-4 max-w-xl text-gray-300">
            Discover stylish fashion for men, women, and kids.
            Find your perfect look.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search and sorting */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products or brands..."
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 outline-none focus:border-black"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                setMobileFiltersOpen(!mobileFiltersOpen)
              }
              className="flex items-center gap-2 rounded-xl border bg-white px-4 py-3 lg:hidden"
            >
              <SlidersHorizontal size={18} />
              Filters
            </button>

            <div className="relative ml-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort products"
                className="appearance-none rounded-xl border border-gray-200 bg-white py-3 pl-4 pr-10 outline-none"
              >
                <option value="default">Sort: Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside
            className={`w-full shrink-0 lg:block lg:w-60 ${
              mobileFiltersOpen ? "block" : "hidden"
            }`}
          >
            <div className="rounded-xl border border-gray-100 bg-white p-5">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-bold">Filters</h2>

                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  aria-label="Close filters"
                  className="lg:hidden"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Categories */}
              <h3 className="mb-4 font-semibold">Category</h3>

              <div className="space-y-3">
                {categories.map((category) => (
                  <label
                    key={category.value}
                    className="flex cursor-pointer items-center gap-3 text-sm"
                  >
                    <input
                      type="radio"
                      name="category"
                      checked={
                        selectedCategory === category.value
                      }
                      onChange={() =>
                        changeCategory(category.value)
                      }
                      className="accent-black"
                    />
                    {category.label}
                  </label>
                ))}
              </div>

              <hr className="my-6 border-gray-200" />

              {/* Price filter */}
              <h3 className="mb-4 font-semibold">Price Range</h3>

              <select
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white p-3 text-sm"
              >
                {priceOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={clearFilters}
                disabled={!hasFilters}
                className="mt-6 w-full rounded-lg border border-gray-300 py-3 text-sm font-semibold transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Clear All Filters
              </button>
            </div>
          </aside>

          {/* Product section */}
          <main className="min-w-0 flex-1">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold capitalize">
                  {selectedCategory === "all"
                    ? "All Products"
                    : `${selectedCategory} Collection`}
                </h2>

                {!loading && !error && (
                  <p className="mt-1 text-sm text-gray-500">
                    Showing {filteredProducts.length} products
                  </p>
                )}
              </div>

              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-sm font-medium underline"
                >
                  Clear filters
                </button>
              )}
            </div>

            {/* Loading */}
            {loading ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-xl bg-white"
                  >
                    <div className="h-56 animate-pulse bg-gray-200 sm:h-72" />
                    <div className="space-y-3 p-4">
                      <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                      <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
                      <div className="h-10 animate-pulse rounded bg-gray-200" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="rounded-xl bg-white p-10 text-center">
                <p role="alert" className="text-red-600">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() => setRetryCount((n) => n + 1)}
                  className="mt-5 rounded-lg bg-black px-6 py-3 text-white"
                >
                  Try Again
                </button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="rounded-xl bg-white px-6 py-16 text-center">
                <Search
                  size={42}
                  className="mx-auto text-gray-400"
                />

                <h3 className="mt-4 text-xl font-bold">
                  No Products Found
                </h3>

                <p className="mt-2 text-gray-500">
                  Try changing your search or filters.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-6 rounded-lg bg-black px-6 py-3 text-white"
                >
                  View All Products
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id ?? product._id}
                    product={product}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
 