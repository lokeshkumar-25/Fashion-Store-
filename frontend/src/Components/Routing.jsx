import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../Pages/Home";
import Shop from "../Pages/Shop";
import ProductDetails from "../Pages/ProductDetails";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import ProtectedRoutes from "./ProtectedRoutes";
import Cart from "../Pages/Cart";
import Wishlist from "../Pages/WishList";
import Checkout from "../Pages/CheckOut";

import AdminRoute from "./AdminRoute";
import AdminDashboard from "../Pages/AdminDashBoard";
import AdminProducts from "../Pages/AdminProduct";
import AdminProductForm from "../Pages/AdminProductForm";

export default function Routing() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoutes />}>
          <Route
            path="/account"
            element={<h1 className="p-10 text-2xl">My Account</h1>}
          />
          <Route path="/checkout" element={<Checkout />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/products/new" element={<AdminProductForm />} />
           <Route path="/admin/products/edit/:id" element={<AdminProductForm />} />
        </Route>
      </Routes>
    </>
  );
}
