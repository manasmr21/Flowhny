import { useEffect, useState } from "react";
import "./products.css";
import { Link } from "react-router-dom";
import { FaCartPlus } from "react-icons/fa";
import useStore from "../../Store/Store";

function Products() {
  const [products, setProducts] = useState([]);

  const { allProducts } = useStore();

  useEffect(() => {
    setProducts(allProducts.slice(0, window.innerWidth < 850 ? "6" : "10"));
  }, [allProducts]);

  return (
    <>
      <div className="product-container pt-4 ">
        <h1 className="text-center text-4xl font-bold underline text-themegreen">
          Featured Products
        </h1>
        <section className="all-products">
          {products?.map((product, index) => (
            <div
              key={product?.id || index}
              className=" border-2 border-themegreen overflow-hidden rounded-xl transition duration-300 shadow-xl bg-white flex flex-col"
            >
              <img
                src={product?.thumbnail}
                alt={product?.title}
                className="w-full h-48 object-fit"
              />
              <section className="product-details text-themegreen px-2 py-3 flex flex-col flex-grow">
                <p className="text-left font-bold text-xl">
                  {" "}
                  <span
                    className={`${
                      product.discountPercentage
                        ? "text-gray-400 line-through mx-2"
                        : ""
                    }`}
                  >
                    ${product?.price}
                  </span>
                  {product.discountPercentage ? (
                    <span>
                      $
                      {(
                        parseFloat(product?.price) -
                        parseFloat(product?.price) *
                          (parseFloat(product?.discountPercentage) / 100)
                      ).toFixed(2)}
                    </span>
                  ) : (
                    ""
                  )}
                </p>
                <p className="text-left my-1 font-semibold break-words max-w-full">
                  {product?.title}
                </p>
                <div className="flex  justify-center items-center mt-auto">
                  <div className="p-3 rounded bg-themegreen transition text-white mr-2 border border-themegreen hover:bg-white hover:text-themegreen cursor-pointer ">
                    <FaCartPlus />
                  </div>
                  <button className="hover:bg-white active:scale-[95%] transition cursor-pointer border border-themegreen hover:text-themegreen mt-auto w-full rounded py-2 bg-themegreen text-white font-semibold">
                    Buy Now
                  </button>
                </div>
              </section>
            </div>
          ))}
        </section>
        <p
          tabIndex={0}
          className="text-center pb-10 text-themegreen font-semibold "
        >
          {" "}
          <Link to="/products" className="hover:underline">
            View all products&rarr;{" "}
          </Link>
        </p>
      </div>
    </>
  );
}

export default Products;
