import { useEffect, useState } from "react";
import "./products.css";
import { Link, useNavigate } from "react-router-dom";
import useStore from "../../Store/Store";

function Products() {
  const [products, setProducts] = useState([]);
  const { allProducts } = useStore();
  const navigate =  useNavigate()

  useEffect(() => {
    const sortedProducts = [...allProducts].sort((a, b) => b.rating - a.rating);
    
    const displayCount = window.innerWidth < 850 ? 6 : 10;
    setProducts(sortedProducts.slice(0, displayCount));
  }, [allProducts]);

  return (
    <>
      <div className="product-container pt-4 dark:bg-themedark">
        <h1 className="text-center text-4xl font-bold underline text-themegreen">
          Featured Products
        </h1>
        <section className="all-products flex justify-center">
          {products?.map((product, index) => (
            <div
              key={product?._id || index}
              className="border-2 dark:bg-themedark dark:border-white border-themegreen overflow-hidden rounded-xl  shadow-xl bg-white flex flex-col relative"
            >
              <div className="relative">
                <img
                  src={product?.thumbnail}
                  alt={product?.title}
                  className="w-full h-48 object-contain"
                />
                
                {/* Rating badge */}
                <div className="absolute top-2 left-2 bg-themegreen text-white px-2 py-1 rounded-md text-sm font-medium">
                  {product.rating} <span className="text-[gold]">★</span>
                </div>
                
                {/* discount sticker */}
                {product.discountPercentage >0 && (
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
                    Rs {product?.price}
                  </span>
                  {product.discountPercentage ? (
                    <span>
                      Rs 
                      {" " + (
                        parseFloat(product?.price) -
                        parseFloat(product?.price) *
                          (parseFloat(product?.discountPercentage) / 100)
                      ).toFixed(1) }
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
                   onClick={()=>navigate(`/products/${product?._id}`)}
                    className="hover:bg-transparent active:scale-[95%] transition cursor-pointer border duration-300 border-themegreen hover:text-themegreen w-full rounded py-2 bg-themegreen text-white font-semibold text-center block"
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
