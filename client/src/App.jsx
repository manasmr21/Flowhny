import { BrowserRouter as Routers, Routes, Route } from "react-router-dom";
import "./index.css";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Homepage/Home";
import ProductPage from "./components/Product page/ProductPage";
import AboutPage from "./components/About/About";
import { useEffect } from "react";
import Footer from "./components/Footer/Footer";
import Contact from "./components/Contact/Contact";
import "./App.css";
import SingleProduct from "./components/SingleProduct/SingleProduct";
import useStore from "./components/Store/Store";
import ScrollToTop from "./ScrollToTop";
import Cart from "./components/Cart/Cart";
import Error from "./components/Error/Error";
import Login from "./components/Authentication/Login";
import Signup from "./components/Authentication/Signup";
import Verification from "./components/Verifications/Verification";
import Profile from "./components/Profile/Profile";
import ProtectedRoute from "./ProtectedRoute";
import AdminLogin from "./AdminComponents/AdminAuthentication/AdminLogin";
import AdminRoute from "./AdminComponents/AdminAuthentication/AdminRoute";
import Dashboard from "./AdminComponents/AdminPanel/Dashboard";
import AdminProtectedRoute from "./AdminProtectedRoute";
import Products from "./AdminComponents/AdminPanel/Products";
import Layout from "./Layouts/layout";
import AdminLayout from "./Layouts/AdminLayout";
import AddProducts from "./AdminComponents/AdminPanel/AddProducts";

function App() {
  const { getProducts, theme } = useStore();

  useEffect(() => {
    document.documentElement.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  return (
    <div className="all-content dark:bg-themedark">
      <Routers>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout />}>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/products" element={<ProductPage />} />
            <Route exact path="/about" element={<AboutPage />} />
            <Route exact path="/contact" element={<Contact />} />
            <Route
              exact
              path="/products/:productID"
              element={<SingleProduct />}
            />

            <Route exact path="*" element={<Error />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/register" element={<Signup />} />
            <Route exact path="/otp" element={<Verification />} />

            <Route element={<ProtectedRoute />}>
              <Route exact path="/cart" element={<Cart />} />
              <Route exact path="/profile" element={<Profile />} />
            </Route>
          </Route>

          {/* Admin Routes */}
          <Route element={<AdminLayout />}>
            <Route exact path="/admin" element={<AdminRoute />} />
            <Route exact path="/admin/:adminRoute" element={<AdminLogin />} />
            <Route element={<AdminProtectedRoute />}>
              <Route exact path="/admin/dashboard" element={<Dashboard />} />
              <Route exact path="/admin/product" element={<Products />} />
              <Route exact path="/admin/addProduct" element={<AddProducts />} />
            </Route>
          </Route>
        </Routes>
      </Routers>
    </div>
  );
}

export default App;
