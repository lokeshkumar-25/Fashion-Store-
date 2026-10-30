
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Heart,
  ShoppingBag,
  LogOut,
  User,
  LayoutDashboard,
} from "lucide-react";

import { useAuth } from "../Context/AuthContext";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Shop", path: "/shop" },
  { name: "Men", path: "/shop?category=men" },
  { name: "Women", path: "/shop?category=women" },
  { name: "Kids", path: "/shop?category=kids" },
];

export default function Navbar() {
  const navigate = useNavigate();

  const {
    user,
    token,
    role: contextRole,
    isAuthenticated: contextAuthenticated,
    logout,
  } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  // Supports both your original and corrected AuthContext.
  const isAuthenticated =
    contextAuthenticated ?? Boolean(token && user);

  const role = String(contextRole ?? user?.role ?? "")
    .replace(/^ROLE_/i, "")
    .toUpperCase();

  const isAdmin = isAuthenticated && role === "ADMIN";

  const getStoredItems = (key) => {
    try {
      const data = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  };

  const updateCounts = () => {
    const cart = getStoredItems("fashionCart");
    const wishlist = getStoredItems("fashionWishlist");

    const totalCartQuantity = cart.reduce(
      (total, item) => total + Number(item.quantity || 1),
      0
    );

    setCartCount(totalCartQuantity);
    setWishlistCount(wishlist.length);
  };

  useEffect(() => {
    updateCounts();

    window.addEventListener("cartUpdated", updateCounts);
    window.addEventListener("wishlistUpdated", updateCounts);
    window.addEventListener("storage", updateCounts);

    return () => {
      window.removeEventListener("cartUpdated", updateCounts);
      window.removeEventListener(
        "wishlistUpdated",
        updateCounts
      );
      window.removeEventListener("storage", updateCounts);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);

    navigate("/login", { replace: true });
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive
        ? "text-red-500"
        : "text-gray-700 hover:text-red-500"
    }`;

  const renderNavLink = (item) => (
    <NavLink
      key={item.name}
      to={item.path}
      end={item.path === "/"}
      onClick={closeMenu}
      className={linkClass}
    >
      {item.name}
    </NavLink>
  );

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">

      {/* TOP ANNOUNCEMENT BAR */}
      <div className="bg-black px-4 py-2 text-center text-xs text-white">
        Discover your new favorite style
      </div>

      {/* MAIN NAVBAR */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">

        {/* LOGO */}
        <Link
          to="/"
          onClick={closeMenu}
          className="shrink-0 text-xl font-extrabold tracking-tight text-black sm:text-2xl"
        >
          FASHION
          <span className="text-red-500">STORE.</span>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map(renderNavLink)}
        </nav>

        {/* DESKTOP ACTIONS */}
        <div className="hidden items-center gap-4 lg:flex">

          {isAuthenticated ? (
            <>
              {/* USER NAME */}
              <div className="flex items-center gap-2">
                <User size={17} />

                <span className="max-w-28 truncate text-sm font-medium">
                  {user?.name || "User"}
                </span>
              </div>

              {/* ADMIN DASHBOARD */}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1 text-sm font-medium hover:text-red-500"
                >
                  <LayoutDashboard size={17} />
                  Dashboard
                </Link>
              )}

              {/* LOGOUT */}
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              {/* LOGIN */}
              <Link
                to="/login"
                className="text-sm font-medium text-gray-700 hover:text-red-500"
              >
                Login
              </Link>

              {/* REGISTER */}
              <Link
                to="/register"
                className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Register
              </Link>
            </>
          )}

          {/* WISHLIST */}
          <Link
            to="/wishlist"
            aria-label={`Wishlist, ${wishlistCount} items`}
            className="relative text-gray-700 hover:text-red-500"
          >
            <Heart size={21} />

            {wishlistCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] text-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* CART */}
          <Link
            to="/cart"
            aria-label={`Cart, ${cartCount} items`}
            className="relative text-gray-700 hover:text-red-500"
          >
            <ShoppingBag size={21} />

            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] text-white">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* MOBILE ACTIONS */}
        <div className="flex items-center gap-4 lg:hidden">
          <Link
            to="/wishlist"
            aria-label="Wishlist"
            onClick={closeMenu}
            className="relative"
          >
            <Heart size={21} />

            {wishlistCount > 0 && (
              <span className="absolute -right-2 -top-2 rounded-full bg-red-500 px-1 text-[10px] text-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link
            to="/cart"
            aria-label="Cart"
            onClick={closeMenu}
            className="relative"
          >
            <ShoppingBag size={21} />

            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 rounded-full bg-red-500 px-1 text-[10px] text-white">
                {cartCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="text-gray-800"
          >
            {menuOpen ? <X size={25} /> : <Menu size={25} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="border-t border-gray-200 bg-white px-5 py-5 lg:hidden">
          <nav className="flex flex-col gap-5">

            {navLinks.map(renderNavLink)}

            <div className="border-t border-gray-200 pt-4">
              {isAuthenticated ? (
                <div className="flex flex-col gap-4">

                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <User size={18} />
                    {user?.name || "User"}
                  </div>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={closeMenu}
                      className="flex items-center gap-2 text-sm font-medium"
                    >
                      <LayoutDashboard size={18} />
                      Admin Dashboard
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-3 text-sm font-semibold text-white"
                  >
                    <LogOut size={17} />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="rounded-lg border border-gray-300 px-4 py-3 text-center text-sm font-semibold"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="rounded-lg bg-black px-4 py-3 text-center text-sm font-semibold text-white"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
