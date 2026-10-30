import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../Service/ProductApi";
import { ArrowLeft, Heart, ShoppingCart } from "lucide-react";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const data = await getProductById(id);

        if (!cancelled) {
          setProduct(data);
          setSelectedSize(data.sizes?.[0] || "");
          setSelectedColor(data.colors?.[0] || "");

          const productId = String(data.id ?? data._id);

          const wishlist = JSON.parse(
            localStorage.getItem("fashionWishlist") || "[]"
          );

          setIsWishlisted(
            wishlist.some(
              (item) => String(item.productId) === productId
            )
          );
        }
      } catch (err) {
        console.error("Product loading failed:", err);

        if (!cancelled) {
          setError("Unable to load this product. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return <p className="p-10 text-center">Loading product details...</p>;
  }

  if (error || !product) {
    return (
      <div className="p-10 text-center">
        <p className="mb-4 text-red-600">
          {error || "Product not found."}
        </p>
        <button
          onClick={() => navigate("/shop")}
          className="rounded bg-black px-5 py-2 text-white"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  const productId = String(product.id ?? product._id);
  const hasSizes = product.sizes?.length > 0;
  const hasColors = product.colors?.length > 0;
  const stock = Number(product.stock ?? 0);
  const outOfStock = stock <= 0 || product.available === false;

  const image =
    product.images?.[0] ||
    "https://placehold.co/600x750?text=Fashion+Product";

  const hasDiscount =
    product.discountPrice != null &&
    Number(product.discountPrice) > 0 &&
    Number(product.discountPrice) < Number(product.price);

  const displayPrice = hasDiscount
    ? Number(product.discountPrice)
    : Number(product.price);

  // Add product to cart
  const addToCart = () => {
    if (outOfStock) {
      alert("This product is out of stock.");
      return false;
    }

    if (hasSizes && !selectedSize) {
      alert("Please select a size.");
      return false;
    }

    if (hasColors && !selectedColor) {
      alert("Please select a color.");
      return false;
    }

    const cartItem = {
      productId,
      name: product.name,
      price: displayPrice,
      image,
      size: selectedSize,
      color: selectedColor,
      quantity,
    };

    try {
      const cart = JSON.parse(
        localStorage.getItem("fashionCart") || "[]"
      );

      const existingIndex = cart.findIndex(
        (item) =>
          String(item.productId) === productId &&
          item.size === selectedSize &&
          item.color === selectedColor
      );

      if (existingIndex >= 0) {
        const newQuantity =
          Number(cart[existingIndex].quantity) + quantity;

        if (newQuantity > stock) {
          alert("Requested quantity exceeds available stock.");
          return false;
        }

        cart[existingIndex].quantity = newQuantity;
      } else {
        if (quantity > stock) {
          alert("Requested quantity exceeds available stock.");
          return false;
        }

        cart.push(cartItem);
      }

      localStorage.setItem("fashionCart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdated"));

      return true;
    } catch (err) {
      console.error("Unable to update cart:", err);
      alert("Unable to add this product to your cart.");
      return false;
    }
  };

  // Add or remove product from wishlist
  const toggleWishlist = () => {
    try {
      const wishlist = JSON.parse(
        localStorage.getItem("fashionWishlist") || "[]"
      );

      const alreadyExists = wishlist.some(
        (item) => String(item.productId) === productId
      );

      let updatedWishlist;

      if (alreadyExists) {
        updatedWishlist = wishlist.filter(
          (item) => String(item.productId) !== productId
        );
      } else {
        updatedWishlist = [
          ...wishlist,
          {
            productId,
            name: product.name,
            price: displayPrice,
            image,
            category: product.category,
          },
        ];
      }

      localStorage.setItem(
        "fashionWishlist",
        JSON.stringify(updatedWishlist)
      );

      setIsWishlisted(!alreadyExists);
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (err) {
      console.error("Unable to update wishlist:", err);
      alert("Unable to update wishlist.");
    }
  };

  // Buy Now: add the selected item, then open cart
  const buyNow = () => {
    const added = addToCart();

    if (added) {
      navigate("/cart");
    }
  };

  return (
    <section>
      <button
        onClick={() => navigate(-1)}
        className="m-5 flex items-center gap-2 text-sm"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <main className="mx-auto max-w-7xl px-5 py-10">
        <div className="grid gap-10 md:grid-cols-2">
          {/* Product image */}
          <div className="relative overflow-hidden rounded-2xl bg-gray-100">
            <img
              src={image}
              alt={product.name}
              className="h-[420px] w-full object-cover sm:h-[600px]"
            />

            <button
              type="button"
              onClick={toggleWishlist}
              aria-label={
                isWishlisted ? "Remove from wishlist" : "Add to wishlist"
              }
              aria-pressed={isWishlisted}
              className="absolute right-4 top-4 rounded-full bg-white p-3 shadow-md hover:scale-105"
            >
              <Heart
                size={23}
                className={
                  isWishlisted
                    ? "fill-red-500 text-red-500"
                    : "text-gray-700"
                }
              />
            </button>
          </div>

          {/* Product information */}
          <section className="py-2">
            <p className="mb-2 text-sm uppercase tracking-widest text-gray-500">
              {product.brand}
            </p>

            <h1 className="text-3xl font-bold sm:text-4xl">
              {product.name}
            </h1>

            <p className="mt-3 text-gray-600">{product.description}</p>

            <div className="mt-6 flex items-center gap-3">
              <span className="text-2xl font-bold">
                ₹{displayPrice.toLocaleString("en-IN")}
              </span>

              {hasDiscount && (
                <>
                  <span className="text-lg text-gray-400 line-through">
                    ₹{Number(product.price).toLocaleString("en-IN")}
                  </span>

                  <span className="rounded bg-green-100 px-2 py-1 text-sm text-green-700">
                    {Math.round(
                      (1 - displayPrice / Number(product.price)) * 100
                    )}
                    % OFF
                  </span>
                </>
              )}
            </div>

            <p className="mt-4 text-sm text-gray-500">
              Category: {product.category}
            </p>

            {/* Size selection */}
            {hasSizes && (
              <div className="mt-7">
                <h2 className="mb-3 font-semibold">Select Size</h2>

                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      type="button"
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-12 rounded-lg border px-4 py-2 ${
                        selectedSize === size
                          ? "border-black bg-black text-white"
                          : "border-gray-300 hover:border-black"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color selection */}
            {hasColors && (
              <div className="mt-7">
                <h2 className="mb-3 font-semibold">Select Color</h2>

                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      type="button"
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`rounded-lg border px-4 py-2 ${
                        selectedColor === color
                          ? "border-black bg-black text-white"
                          : "border-gray-300 hover:border-black"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock status */}
            <p
              className={`mt-6 text-sm font-medium ${
                outOfStock ? "text-red-600" : "text-green-700"
              }`}
            >
              {outOfStock
                ? "Out of stock"
                : stock <= 5
                  ? `Only ${stock} left in stock`
                  : "In stock"}
            </p>

            {/* Quantity */}
            <div className="mt-5 flex items-center gap-5">
              <span className="font-semibold">Quantity</span>

              <div className="flex items-center rounded-lg border">
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) => Math.max(1, q - 1))
                  }
                  disabled={quantity <= 1}
                  className="px-4 py-2 disabled:opacity-40"
                >
                  −
                </button>

                <span className="min-w-10 text-center">{quantity}</span>

                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) => Math.min(stock, q + 1))
                  }
                  disabled={quantity >= stock || outOfStock}
                  className="px-4 py-2 disabled:opacity-40"
                >
                  +
                </button>
              </div>
            </div>

            {/* Cart and wishlist actions */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  if (addToCart()) {
                    alert("Product added to cart!");
                  }
                }}
                disabled={outOfStock}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-black px-6 py-3 font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                <ShoppingCart size={19} />
                Add to Cart
              </button>

              <button
                type="button"
                onClick={buyNow}
                disabled={outOfStock}
                className="flex-1 rounded-lg border border-black px-6 py-3 font-semibold hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Buy Now
              </button>
            </div>

            <button
              type="button"
              onClick={toggleWishlist}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50"
            >
              <Heart
                size={19}
                className={
                  isWishlisted ? "fill-red-500 text-red-500" : ""
                }
              />
              {isWishlisted
                ? "Remove from Wishlist"
                : "Add to Wishlist"}
            </button>

            <p className="mt-5 text-xs text-gray-500">
              Prices are displayed in INR. Product availability depends on
              stock.
            </p>
          </section>
        </div>
      </main>
    </section>
  );
}