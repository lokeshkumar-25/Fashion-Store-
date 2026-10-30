import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";

export default function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(() =>
    JSON.parse(localStorage.getItem("fashionCart") || "[]")
  );

  useEffect(() => {
    const refreshCart = () => {
      setCart(JSON.parse(localStorage.getItem("fashionCart") || "[]"));
    };

    window.addEventListener("cartUpdated", refreshCart);

    return () => window.removeEventListener("cartUpdated", refreshCart);
  }, []);

  const saveCart = (updatedCart) => {
    localStorage.setItem("fashionCart", JSON.stringify(updatedCart));
    setCart(updatedCart);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const removeItem = (productId, size, color) => {
    saveCart(
      cart.filter(
        (item) =>
          !(
            String(item.productId) === String(productId) &&
            item.size === size &&
            item.color === color
          )
      )
    );
  };

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  if (cart.length === 0) {
    return (
      <main className="mx-auto max-w-5xl p-10 text-center">
        <h1 className="text-3xl font-bold">Your Cart</h1>
        <p className="mt-4 text-gray-600">Your cart is empty.</p>
        <Link
          to="/shop"
          className="mt-6 inline-block rounded-lg bg-black px-6 py-3 text-white"
        >
          Continue Shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl p-5 py-10">
      <h1 className="mb-8 text-3xl font-bold">Your Cart</h1>

      <div className="space-y-5">
        {cart.map((item) => (
          <article
            key={`${item.productId}-${item.size}-${item.color}`}
            className="flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center"
          >
            <img
              src={item.image}
              alt={item.name}
              className="h-28 w-24 rounded-lg object-cover"
            />

            <div className="flex-1">
              <h2 className="font-semibold">{item.name}</h2>
              <p className="mt-1 text-sm text-gray-600">
                Size: {item.size || "N/A"} · Color: {item.color || "N/A"}
              </p>
              <p className="mt-2">₹{Number(item.price).toLocaleString("en-IN")}</p>
              <p className="text-sm text-gray-600">
                Quantity: {item.quantity}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                removeItem(item.productId, item.size, item.color)
              }
              className="flex items-center gap-2 text-red-600"
            >
              <Trash2 size={18} />
              Remove
            </button>
          </article>
        ))}
      </div>

      <div className="mt-8 rounded-xl border p-6 text-right">
        <p className="text-lg">
          Total:{" "}
          <strong>₹{total.toLocaleString("en-IN")}</strong>
        </p>

        <button 
          type="button"
          onClick={() => navigate("/checkout")}
          className="mt-5 rounded-lg bg-black px-8 py-3 font-semibold text-white"
        >
          Proceed to Checkout
        </button>
      </div>
    </main>
  );
}