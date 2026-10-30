
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Eye } from "lucide-react";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  const productId = String(product?.id ?? product?._id ?? "");

  const price = Number(product?.price ?? 0);
  const discountPrice = Number(product?.discountPrice ?? 0);

  const hasDiscount =
    discountPrice > 0 && discountPrice < price;

  const salePrice = hasDiscount ? discountPrice : price;

  const discountPercent =
    hasDiscount && price > 0
      ? Math.round(((price - discountPrice) / price) * 100)
      : 0;

  const image =
    product?.images?.[0] ||
    "https://placehold.co/600x750?text=Fashion+Store";

  const stock = Number(product?.stock ?? 0);

  const outOfStock =
    stock <= 0 || product?.available === false;

  const requiresOptions =
    (product?.sizes?.length ?? product?.size?.length ?? 0) > 0 ||
    (product?.colors?.length ?? 0) > 0;

  const [isWishlisted, setIsWishlisted] = useState(() => {
    try {
      const wishlist = JSON.parse(
        localStorage.getItem("fashionWishlist") || "[]"
      );

      return wishlist.some(
        (item) => String(item.productId) === productId
      );
    } catch {
      return false;
    }
  });

  // ADD TO CART
  const addToCart = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!productId) return;

    if (outOfStock) {
      alert("This product is out of stock.");
      return;
    }

    // Select size and color on Product Details page
    if (requiresOptions) {
      navigate(`/product/${productId}`);
      return;
    }

    try {
      const cart = JSON.parse(
        localStorage.getItem("fashionCart") || "[]"
      );

      const existingIndex = cart.findIndex(
        (item) =>
          String(item.productId) === productId &&
          !item.size &&
          !item.color
      );

      if (existingIndex >= 0) {
        const nextQuantity =
          Number(cart[existingIndex].quantity || 1) + 1;

        if (nextQuantity > stock) {
          alert("Requested quantity exceeds available stock.");
          return;
        }

        cart[existingIndex].quantity = nextQuantity;
      } else {
        cart.push({
          productId,
          name: product.name,
          price: salePrice,
          image,
          size: "",
          color: "",
          quantity: 1,
        });
      }

      localStorage.setItem(
        "fashionCart",
        JSON.stringify(cart)
      );

      window.dispatchEvent(new Event("cartUpdated"));

      alert("Product added to cart!");
    } catch (error) {
      console.error("Add to cart failed:", error);
      alert("Unable to add product to cart.");
    }
  };

  // ADD / REMOVE WISHLIST
  const addToWishlist = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!productId) return;

    try {
      const wishlist = JSON.parse(
        localStorage.getItem("fashionWishlist") || "[]"
      );

      const exists = wishlist.some(
        (item) => String(item.productId) === productId
      );

      const updatedWishlist = exists
        ? wishlist.filter(
            (item) => String(item.productId) !== productId
          )
        : [
            ...wishlist,
            {
              productId,
              name: product.name,
              price: salePrice,
              image,
            },
          ];

      localStorage.setItem(
        "fashionWishlist",
        JSON.stringify(updatedWishlist)
      );

      setIsWishlisted(!exists);

      window.dispatchEvent(
        new Event("wishlistUpdated")
      );
    } catch (error) {
      console.error("Wishlist update failed:", error);
      alert("Unable to update wishlist.");
    }
  };

  if (!product || !productId) return null;

  return (
    <article className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-lg">
      {/* PRODUCT IMAGE */}
      <div className="relative overflow-hidden bg-gray-100">
        <Link to={`/product/${productId}`}>
          <img
            src={image}
            alt={product.name || "Fashion product"}
            loading="lazy"
            className="h-56 w-full object-cover transition duration-300 group-hover:scale-105 sm:h-72"
          />
        </Link>

        {/* DISCOUNT BADGE */}
        {hasDiscount && (
          <span className="absolute left-3 top-3 rounded-md bg-red-600 px-2 py-1 text-xs font-semibold text-white">
            {discountPercent}% OFF
          </span>
        )}

        {/* OUT OF STOCK */}
        {outOfStock && (
          <span className="absolute bottom-3 left-3 rounded bg-gray-900 px-3 py-1 text-xs text-white">
            Out of Stock
          </span>
        )}

        {/* WISHLIST BUTTON */}
        <button
          type="button"
          onClick={addToWishlist}
          aria-label={
            isWishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          className="absolute right-3 top-3 rounded-full bg-white p-2 shadow transition hover:bg-gray-100"
        >
          <Heart
            size={20}
            className={
              isWishlisted
                ? "fill-red-500 text-red-500"
                : "text-gray-700"
            }
          />
        </button>
      </div>

      {/* PRODUCT INFORMATION */}
      <div className="p-4">
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
          {product.brand || "Fashion Store"}
        </p>

        <Link to={`/product/${productId}`}>
          <h3 className="mb-2 line-clamp-2 min-h-12 text-base font-semibold text-gray-900 hover:text-red-600">
            {product.name}
          </h3>
        </Link>

        {/* PRICE */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-lg font-bold text-gray-900">
            ₹{salePrice.toLocaleString("en-IN")}
          </span>

          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              ₹{price.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={addToCart}
            disabled={outOfStock}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-black px-3 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            <ShoppingCart size={17} />
            {outOfStock
              ? "Sold Out"
              : requiresOptions
              ? "Select Options"
              : "Add to Cart"}
          </button>

          <Link
            to={`/product/${productId}`}
            aria-label="View product details"
            className="flex items-center justify-center rounded-lg border border-gray-300 px-3 text-gray-700 transition hover:bg-gray-100"
          >
            <Eye size={19} />
          </Link>
        </div>
      </div>
    </article>
  );
}
