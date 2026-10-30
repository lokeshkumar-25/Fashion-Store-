
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8080";

const emptyForm = {
  name: "",
  description: "",
  brand: "",
  category: "men",
  price: "",
  discountprice: "",
  size: [],
  colors: [],
  stock: "",
  images: ["", "", ""],
  available: true,
};

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEdit = Boolean(id);

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!id) return;

    let active = true;

    async function loadProduct() {
      try {
        const response = await axios.get(
          `${API_URL}/api/products/${id}`
        );

        const product = response.data;

        if (!active) return;

        setForm({
          name: product.name || "",
          description: product.description || "",
          brand: product.brand || "",
          category: product.category || "men",
          price: product.price ?? "",
          discountprice:
            product.discountprice ??
            product.discountPrice ??
            "",
          size: product.size ?? product.sizes ?? [],
          colors: product.colors ?? [],
          stock: product.stock ?? "",
          images: [
            product.images?.[0] || "",
            product.images?.[1] || "",
            product.images?.[2] || "",
          ],
          available: product.available ?? true,
        });
      } catch (err) {
        console.error("Product loading error:", err);

        if (active) {
          setError("Unable to load product details.");
        }
      } finally {
        if (active) setFetching(false);
      }
    }

    loadProduct();

    return () => {
      active = false;
    };
  }, [id]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (index, value) => {
    setForm((previous) => {
      const updatedImages = [...previous.images];
      updatedImages[index] = value;

      return {
        ...previous,
        images: updatedImages,
      };
    });
  };

  const handleSizesChange = (event) => {
    const sizes = event.target.value
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);

    setForm((previous) => ({
      ...previous,
      size: sizes,
    }));
  };

  const handleColorsChange = (event) => {
    const colors = event.target.value
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);

    setForm((previous) => ({
      ...previous,
      colors,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    setError("");
    setSuccess("");

    const price = Number(form.price);
    const discountprice =
      form.discountprice === ""
        ? 0
        : Number(form.discountprice);

    const stock = Number(form.stock);

    if (!form.name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      setError("Enter a valid product price.");
      return;
    }

    if (
      !Number.isFinite(discountprice) ||
      discountprice < 0 ||
      (discountprice > 0 && discountprice >= price)
    ) {
      setError("Discount price must be lower than the price.");
      return;
    }

    if (
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      setError("Stock must be a non-negative whole number.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      brand: form.brand.trim(),
      category: form.category,
      price,
      discountprice,
      size: form.size,
      colors: form.colors,
      stock,
      images: form.images
        .map((image) => image.trim())
        .filter(Boolean),
      available: form.available,
    };

    try {
      setLoading(true);

      // Matches the fashionToken key in AuthContext.
      const token = localStorage.getItem("fashionToken");

      if (!token) {
        setError("Please login as an admin.");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (isEdit) {
        await axios.put(
          `${API_URL}/api/products/${id}`,
          payload,
          config
        );

        setSuccess("Product updated successfully!");
      } else {
        await axios.post(
          `${API_URL}/api/products`,
          payload,
          config
        );

        setSuccess("Product added successfully!");
      }

      navigate("/admin/products", { replace: true });
    } catch (err) {
      console.error("Product save error:", err);

      const status = err.response?.status;

      if (status === 401) {
        setError("Your login has expired. Please login again.");
      } else if (status === 403) {
        setError("Only admins can manage products.");
      } else {
        setError(
          err.response?.data?.message ||
          "Unable to save product. Check your backend API."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white p-3 outline-none focus:border-black";

  const labelClass =
    "mb-2 block text-sm font-semibold text-gray-700";

  if (fetching) {
    return (
      <div className="p-10 text-center">
        Loading product details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-4xl">

        <Link
          to="/admin/products"
          className="mb-5 inline-block text-sm font-medium text-gray-600 hover:text-black"
        >
          ← Back to Products
        </Link>

        <div className="rounded-2xl border bg-white p-6 shadow-sm md:p-8">

          <h1 className="mb-2 text-3xl font-bold">
            {isEdit ? "Edit Product" : "Add New Product"}
          </h1>

          <p className="mb-8 text-gray-500">
            {isEdit
              ? "Update your existing product information."
              : "Create a new product for your fashion store."}
          </p>

          {error && (
            <div
              role="alert"
              className="mb-5 rounded-lg bg-red-50 p-4 text-sm text-red-600"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              role="status"
              className="mb-5 rounded-lg bg-green-50 p-4 text-sm text-green-700"
            >
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className={labelClass}>
                  Product Name *
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Men's Cotton Shirt"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Brand
                </label>

                <input
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  placeholder="Fashion Store"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Category *
                </label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="kids">Kids</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>
                  Stock Quantity *
                </label>

                <input
                  type="number"
                  name="stock"
                  min="0"
                  step="1"
                  value={form.stock}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Original Price (₹) *
                </label>

                <input
                  type="number"
                  name="price"
                  min="0.01"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Discount Price (₹)
                </label>

                <input
                  type="number"
                  name="discountprice"
                  min="0"
                  step="0.01"
                  value={form.discountprice}
                  onChange={handleChange}
                  placeholder="Optional"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Enter product description..."
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Sizes (comma separated)
              </label>

              <input
                value={form.size.join(", ")}
                onChange={handleSizesChange}
                placeholder="S, M, L, XL, XXL"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Colors (comma separated)
              </label>

              <input
                value={form.colors.join(", ")}
                onChange={handleColorsChange}
                placeholder="Black, White, Blue"
                className={inputClass}
              />
            </div>

            <div>
              <h2 className="mb-4 text-xl font-bold">
                Product Images
              </h2>

              <p className="mb-4 text-sm text-gray-500">
                Enter up to three public image URLs.
              </p>

              <div className="grid gap-5 md:grid-cols-3">
                {form.images.map((image, index) => (
                  <div key={index}>
                    <label className={labelClass}>
                      Image {index + 1}
                    </label>

                    <input
                      type="url"
                      value={image}
                      onChange={(event) =>
                        handleImageChange(
                          index,
                          event.target.value
                        )
                      }
                      placeholder="https://example.com/image.jpg"
                      className={inputClass}
                    />

                    {image.trim() && (
                      <img
                        src={image}
                        alt={`Product preview ${index + 1}`}
                        className="mt-3 h-40 w-full rounded-lg border object-cover"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="available"
                checked={form.available}
                onChange={handleChange}
                className="h-5 w-5 accent-black"
              />

              <span className="font-medium">
                Product Available
              </span>
            </label>

            <div className="flex flex-wrap gap-4 border-t pt-6">

              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-black px-8 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:opacity-50"
              >
                {loading
                  ? "Saving..."
                  : isEdit
                  ? "Update Product"
                  : "Add Product"}
              </button>

              <Link
                to="/admin/products"
                className="rounded-lg border border-gray-300 px-8 py-3 font-semibold hover:bg-gray-100"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
