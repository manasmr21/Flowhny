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

function App() {
  const { getProducts, allProducts } = useStore();

  useEffect(() => {
    getProducts();
  }, [allProducts]);

  return (
    <div className="all-content">
      <Routers>
        <Navbar />
        <ScrollToTop />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/products" element={<ProductPage />} />
          <Route exact path="/about" element={<AboutPage />} />
          <Route exact path="/contact" element={<Contact />} />
          <Route exact  path="/products/:productID" element={<SingleProduct />} />
          <Route exact path="/cart" element={<Cart/>} />
        </Routes>
        <Footer />
      </Routers>
    </div>
  );
}

export default App;
