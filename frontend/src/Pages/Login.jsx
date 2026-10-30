import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

 
const handleSubmit = async (event) => {
  event.preventDefault();
  setError("");

  try {
    const response = await login(form);

    // This assumes login() returns the API response.
    const data = response?.data ?? response;

    const { token, userId, name, email, role } = data;

    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    localStorage.setItem("name", name);
    localStorage.setItem("email", email);
    localStorage.setItem("role", role);

    if (role === "ADMIN") {
      navigate("/admin");
    } else {
      navigate("/");
    }

  } catch (err) {
    console.error("Login error:", err);

    setError(
      err.response?.status === 401
        ? "Invalid email or password."
        : "Login failed. Please try again."
    );
  }
};

  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-5 rounded-2xl border p-8 shadow-sm"
      >
        <h1 className="text-3xl font-bold">Welcome Back</h1>
        <p className="text-gray-500">
          Sign in to your account.
        </p>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <input
          name="email"
          type="email"
          placeholder="Email address"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full rounded-lg border p-3"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full rounded-lg border p-3"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-black p-3 font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-gray-600">
          New customer?{" "}
          <Link to="/register" className="font-semibold underline">
            Create account
          </Link>
        </p>
      </form>
    </div>
  );
}