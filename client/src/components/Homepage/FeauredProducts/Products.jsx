import { useEffect, useState } from "react";
import "./products.css";
import {Link} from "react-router-dom"

function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await fetch(`https://dummyjson.com/products?limit=${window.innerWidth < 850 ? "6" : "10" }`);
        const response = await data.json();

        localStorage.setItem("products", JSON.stringify(response.products));
        setProducts(response.products);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProduct();
  }, []);

  return (
    <>
      <div className="product-container pt-4 ">
        <h1 className="text-center text-4xl font-bold underline text-themegreen">
          Featured Products
        </h1>
        <section className="all-products">
          {products?.map((product, index) => (
            <div
              key={product.id || index}
              className=" border-2 border-themegreen overflow-hidden rounded-xl transition duration-300 shadow-xl bg-white flex flex-col"
            >
              <img
                src={product.thumbnail}
                alt={product.title}
                className="w-full h-48 object-fit"
              />
              <section className="product-details text-themegreen px-2 py-3 flex flex-col flex-grow">
                <p className="text-left font-bold text-xl">${product.price}</p>
                <p className="text-left my-1 font-semibold break-words max-w-full">
                  {product.title}
                </p>
                <button className="hover:bg-white transition cursor-pointer border border-themegreen hover:text-themegreen mt-auto w-full rounded py-2 bg-themegreen text-white font-semibold">
                  Buy Now
                </button>
              </section>
            </div>
          ))}

        </section>
          <p tabIndex={0} className="text-center pb-10 text-themegreen font-semibold "> <Link to="/products" className="hover:underline">View all products&rarr; </Link></p>
      </div>
    </>
  );
}

export default Products;
