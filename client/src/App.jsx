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
import apiStore from "./components/Store/apiStores";

function App() {
  const { getProducts, theme } = useStore();
  const {verifyLogIn} = apiStore()

  useEffect(() => {
    document.documentElement.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    getProducts();
    verifyLogIn()
  }, [getProducts]);

  return (
    <div className="all-content dark:bg-themedark">
      <Routers>
        <Navbar />
        <ScrollToTop />
        <Routes>
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
        </Routes>
        <Footer />
      </Routers>
    </div>
  );
}

export default App;
