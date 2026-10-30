import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Trash2 } from "lucide-react";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState(() =>
    JSON.parse(localStorage.getItem("fashionWishlist") || "[]")
  );

  useEffect(() => {
    const refreshWishlist = () => {
      setWishlist(
        JSON.parse(localStorage.getItem("fashionWishlist") || "[]")
      );
    };

    window.addEventListener("wishlistUpdated", refreshWishlist);

    return () =>
      window.removeEventListener("wishlistUpdated", refreshWishlist);
  }, []);

  const removeItem = (productId) => {
    const updated = wishlist.filter(
      (item) => String(item.productId) !== String(productId)
    );

    localStorage.setItem("fashionWishlist", JSON.stringify(updated));
    setWishlist(updated);
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  if (wishlist.length === 0) {
    return (
      <main className="p-10 text-center">
        <Heart className="mx-auto mb-4" size={36} />
        <h1 className="text-3xl font-bold">Your Wishlist</h1>
        <p className="mt-3 text-gray-600">
          You haven't saved any products yet.
        </p>
        <Link
          to="/shop"
          className="mt-6 inline-block rounded-lg bg-black px-6 py-3 text-white"
        >
          Explore Products
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl p-5 py-10">
      <h1 className="mb-8 text-3xl font-bold">My Wishlist</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {wishlist.map((item) => (
          <article
            key={item.productId}
            className="overflow-hidden rounded-xl border"
          >
            <Link to={`/product/${item.productId}`}>
              <img
                src={item.image}
                alt={item.name}
                className="h-64 w-full object-cover"
              />
            </Link>

            <div className="p-4">
              <h2 className="font-semibold">{item.name}</h2>
              <p className="mt-2">
                ₹{Number(item.price).toLocaleString("en-IN")}
              </p>

              <button
                type="button"
                onClick={() => removeItem(item.productId)}
                className="mt-4 flex items-center gap-2 text-red-600"
              >
                <Trash2 size={18} />
                Remove from Wishlist
              </button>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}