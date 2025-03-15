import { useEffect, useState } from "react";
import "./products.css";
import { Link, useNavigate } from "react-router-dom";
import useStore from "../../Store/Store";

function Products() {
  const [products, setProducts] = useState([]);
  const { allProducts } = useStore();
  const navigate =  useNavigate()

  useEffect(() => {
    // Sort products by rating in descending order (highest rating first)
    const sortedProducts = [...allProducts].sort((a, b) => b.rating - a.rating);
    
    // Then slice to get the top N products based on screen width
    const displayCount = window.innerWidth < 850 ? 6 : 10;
    setProducts(sortedProducts.slice(0, displayCount));
  }, [allProducts]);

  return (
    <>
      <div className="product-container pt-4 ">
        <h1 className="text-center text-4xl font-bold underline text-themegreen">
          Featured Products
        </h1>
        <p className="text-center text-gray-600 mt-2 mb-6">
          Our highest rated products
        </p>
        <section className="all-products">
          {products?.map((product, index) => (
            <div
              key={product?.id || index}
              className="border-2 border-themegreen overflow-hidden rounded-xl transition duration-300 shadow-xl bg-white flex flex-col relative"
            >
              <div className="relative">
                <img
                  src={product?.thumbnail}
                  alt={product?.title}
                  className="w-full h-48 object-fit"
                />
                
                {/* Rating badge */}
                <div className="absolute top-2 left-2 bg-themegreen text-white px-2 py-1 rounded-md text-sm font-medium">
                  {product.rating} <span className="text-[gold]">★</span>
                </div>
                
                {/* Simple discount sticker */}
                {product.discountPercentage && (
                  <div className="absolute top-0 right-0">
                    <div className="simple-discount-sticker">
                      <span className="discount-value">{Math.round(product.discountPercentage)}%</span>
                      <span className="discount-off">OFF</span>
                    </div>
                  </div>
                )}
              </div>
              
              <section className="product-details text-themegreen px-2 py-3 flex flex-col flex-grow">
                <p className="text-left font-bold text-xl">
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
                      ).toFixed(1)}
                    </span>
                  ) : (
                    ""
                  )}
                </p>
                <p className="text-left my-1 font-semibold break-words max-w-full">
                  {product?.title}
                </p>
                <div className="mt-auto">
                  <button 
                   onClick={()=>navigate(`/products/${product?.id}`)}
                    className="hover:bg-white active:scale-[95%] transition cursor-pointer border border-themegreen hover:text-themegreen w-full rounded py-2 bg-themegreen text-white font-semibold text-center block"
                  >
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
          <Link to="/products" className="hover:underline">
            View all products&rarr;{" "}
          </Link>
        </p>
      </div>
    </>
  );
}

export default Products;
