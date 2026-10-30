import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
  });

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("fashionCart") || "[]"));
  }, []);

  const total = cart.reduce(
    (sum, item) =>
      sum + Number(item.price) * Number(item.quantity),
    0
  );

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    // Next: submit the address and cart to the Spring Boot API.
    // Do not clear the cart until the backend confirms success.
    navigate("/checkout-review", {
      state: { form, cart, total },
    });
  };

  if (cart.length === 0) {
    return (
      <main className="p-10 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <Link className="mt-4 inline-block underline" to="/shop">
          Continue shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto grid max-w-6xl gap-8 p-5 py-10 md:grid-cols-2">
      <section>
        <h1 className="mb-6 text-3xl font-bold">Checkout</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            ["customerName", "Full name"],
            ["phone", "Phone number"],
            ["address", "Street address"],
            ["city", "City"],
            ["state", "State"],
            ["postalCode", "PIN code"],
          ].map(([name, label]) => (
            <div key={name}>
              <label className="mb-1 block text-sm font-medium">
                {label}
              </label>

              <input
                name={name}
                value={form[name]}
                onChange={handleChange}
                required
                maxLength={name === "address" ? 200 : 100}
                pattern={
                  name === "phone"
                    ? "[6-9][0-9]{9}"
                    : name === "postalCode"
                      ? "[0-9]{6}"
                      : undefined
                }
                title={
                  name === "phone"
                    ? "Enter a valid 10-digit Indian mobile number"
                    : name === "postalCode"
                      ? "Enter a valid 6-digit PIN code"
                      : undefined
                }
                className="w-full rounded-lg border border-gray-300 p-3"
                placeholder={`Enter ${label.toLowerCase()}`}
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full rounded-lg bg-black px-6 py-3 font-semibold text-white hover:bg-gray-800"
          >
            Continue to Order Review
          </button>
        </form>
      </section>

      <aside className="h-fit rounded-xl border p-6">
        <h2 className="mb-5 text-xl font-bold">Order Summary</h2>

        {cart.map((item, index) => (
          <div
            key={`${item.productId}-${item.size}-${item.color}-${index}`}
            className="flex justify-between gap-4 border-b py-3"
          >
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">
                Qty: {item.quantity}
                {item.size ? ` · Size: ${item.size}` : ""}
              </p>
            </div>

            <p className="font-medium">
              ₹{(
                Number(item.price) * Number(item.quantity)
              ).toLocaleString("en-IN")}
            </p>
          </div>
        ))}

        <div className="mt-5 flex justify-between text-lg">
          <span>Total</span>
          <strong>₹{total.toLocaleString("en-IN")}</strong>
        </div>

        <p className="mt-3 text-xs text-gray-500">
          Final price and stock must be verified by the server before
          the order is created.
        </p>
      </aside>
    </main>
  );
}