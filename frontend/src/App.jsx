

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Public Components
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminProducts from "./components/admin/AdminProducts";

import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Profile from "./pages/Profile";
import AdminUsers from "./components/admin/AdminUsers";
// App.jsx
import Wishlist from "./pages/Wishlist";
import AIChat from "./components/AIChat";

// BrowserRouter ke andar, Routes ke baad:

// Admin routes:

// Admin Components

// Routes ke andar:

import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./components/admin/Dashboard";
import AdminCategories from "./components/admin/AdminCategories";
import AdminBrands from "./components/admin/AdminBrands";
import AdminCoupons from "./components/admin/AdminCoupons";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import AdminOrders from "./components/admin/AdminOrders";

function App() {
  return (<div> <AIChat />
   
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
            </>
          }
        />
        <Route
  path="/products"
  element={
    <>
      <Navbar />
      <Products />
    </>
  }
/>
<Route
  path="/product/:slug"
  element={
    <>
      <Navbar />
      <ProductDetails />
    </>
  }
/>
<Route
  path="/cart"
  element={
    <>
      <Navbar />
      <Cart />
    </>
  }
/>
<Route path="/wishlist" element={<><Navbar /><Wishlist /></>} />

<Route path="/profile" element={<><Navbar /><Profile /></>} />

<Route path="/orders" element={<><Navbar /><Orders /></>} />
<Route path="/orders/:id" element={<><Navbar /><OrderDetails /></>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
     <Route path="/checkout" element={<><Navbar /><Checkout /></>} />
     
<Route path="/order-success/:id" element={<><Navbar /><OrderSuccess /></>} />

       <Route path="/admin" element={<AdminLayout />}>
  <Route index element={<Dashboard />} />
  <Route path="products" element={<AdminProducts />} />
  <Route path="categories" element={<AdminCategories />} />
          <Route path="brands" element={<AdminBrands />} />
             <Route path="coupons" element={<AdminCoupons />} />
             <Route path="orders" element={<AdminOrders />} />
             <Route path="users" element={<AdminUsers />} />
  
</Route>

        {/* 404 */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-yellow-500 mb-4">404</h1>
                <p className="text-gray-400 mb-6">Page not found</p>
                <a href="/" className="text-yellow-500 hover:underline">
                  Go back home
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;