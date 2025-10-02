import { useParams } from "react-router-dom";
import useStore from "../Store/Store";
import { useEffect, useState } from "react";
import "./SingleProduct.css";

function SingleProduct() {
  const { allProducts, addToCart, cart } = useStore();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("details");
  const { productID } = useParams();

  useEffect(() => {
    const foundProduct = allProducts.find((item) => item._id == productID);
    if (foundProduct) {
      setProduct(foundProduct);
    }
  }, [productID, allProducts]);

  console.log(product);

  const addToCartBtn = (product) => {
    const check = cart.some((item) => item.id === product.id);

    const newProduct = { ...product, buyingQuantity: quantity };

    console.log(newProduct);

    if (!check) {
      addToCart(newProduct);
    } else {
      alert("Already in cart");
    }
  };

  const handleImageClick = (imageUrl) => {
    setMainImage(imageUrl);
  };

  const handleQuantityChange = (action) => {
    if (action === "increase" && quantity < 10) {
      setQuantity((prev) => prev + 1);
    } else if (action === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    } else {
      setQuantity(1);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  //Loading screen
  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-themegreen text-xl font-medium">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="container single-product mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/5">
          {/* image section */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-4 dark:bg-lighterthemedark">
            <img
              src={mainImage || product.thumbnail.displayPath}
              alt={product.title}
              className="w-full h-[300px] sm:h-[400px] object-contain rounded-md"
            />
          </div>

          <div className="grid grid-cols-5 gap-2">
            {/* Thumbnail */}
            <div
              className={`cursor-pointer p-2 border rounded-md ${
                mainImage === product.thumbnail.displayPath
                  ? "border-themegreen"
                  : "border-gray-200"
              }`}
              onClick={() => handleImageClick(product.thumbnail.displayPath)}
            >
              <img
                src={product.thumbnail.displayPath}
                alt="thumbnail"
                className="h-16 w-full object-cover"
              />
            </div>

            {/* Additional images */}
            {product.images &&
              product.images.map((img, index) => (
                <div
                  key={index}
                  className={`cursor-pointer p-2 border rounded-md ${
                    mainImage === img.displayPath
                      ? "border-themegreen"
                      : "border-gray-200"
                  }`}
                  onClick={() => handleImageClick(img.displayPath)}
                >
                  <img
                    src={img.displayPath}
                    alt={`product-${index}`}
                    className="h-16 w-full object-cover"
                  />
                </div>
              ))}
          </div>
        </div>

        {/* Some product details  */}
        <div className="lg:w-3/5 scroll-auto ">
          <div className="bg-white p-6 rounded-lg shadow-md dark:bg-lighterthemedark">
            <h1 className="text-2xl md:text-3xl font-bold text-themegreen mb-2">
              {product.title}
            </h1>
            <p className="text-gray-500 dark:text-gray-300 text-sm mb-4">
              Product by:{" "}
              <span className="text-themegreen font-medium">
                {product.brand}
              </span>
            </p>

            <div className="flex items-center mb-4">
              <div className="bg-themegreen text-white px-2 py-1 rounded-md text-sm font-medium mr-3">
                {product.rating} <span className="text-[gold]">★</span>
              </div>
              <span className="text-gray-600 text-sm dark:text-gray-300">
                {product.reviews ? product.reviews.length : 0} user reviews
              </span>
            </div>

            <p className="text-gray-700 mb-6 dark:text-gray-300">
              {product.description}
            </p>

            <div className="mb-6">
              <p className="text-2xl font-bold flex items-center">
                <span
                  className={
                    product.discountPercentage
                      ? "text-gray-400 line-through mr-3"
                      : "text-themegreen"
                  }
                >
                  &#8377;{product.price}
                </span>
                {product.discountPercentage ? (
                  <span className="text-themegreen">
                    $
                    {(
                      parseFloat(product.price) -
                      parseFloat(product.price) *
                        (parseFloat(product.discountPercentage) / 100)
                    ).toFixed(2)}
                  </span>
                ) : null}

                {product.discountPercentage ? (
                  <span className="ml-4 bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                    {product.discountPercentage}% OFF
                  </span>
                ) : null}
              </p>
            </div>

            {product.tags && product.tags.length > 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 text-sm px-2 py-1 rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mb-6">
              <p className="text-gray-700 mb-1 dark:text-gray-300">
                Availability:
                <span
                  className={`font-medium ${
                    product.availabilityStatus
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {" "}
                  {product.availabilityStatus ? "Available" : "Not Available"}
                </span>
                {product.stock && (
                  <span className="text-gray-600 ml-2 dark:text-gray-300">
                    ({product.stock} in stock)
                  </span>
                )}
              </p>
              <p className="text-gray-700 mb-1 dark:text-gray-300">
                {product.shippingInformation}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                {product.warrantyInformation}
              </p>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-2 dark:text-gray-300">Quantity:</p>
              <div className="flex items-center">
                <button
                  type="button"
                  disabled={quantity == 1}
                  onClick={() => handleQuantityChange("decrease")}
                  className="cursor-pointer px-3   py-1 border border-gray-300 rounded-l-md bg-gray-100 hover:bg-gray-200"
                >
                  -
                </button>
                <input
                  type="number"
                  disabled
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-16 dark:text-gray-300 text-center border-t border-b border-gray-300 py-1"
                  min="1"
                />
                <button
                  type="button"
                  disabled={quantity >= 10 || quantity >= product.stock}
                  onClick={() => handleQuantityChange("increase")}
                  className="cursor-pointer px-3 py-1 border border-gray-300 rounded-r-md bg-gray-100 hover:bg-gray-200"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mb-6">
              <span className="bg-gray-200 text-gray-700 rounded-sm px-3 py-1 text-sm ">
                {product.returnPolicy}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                className="w-full sm:w-1/2 p-3 border border-themegreen rounded-md bg-transparent text-themegreen hover:bg-themegreen cursor-pointer hover:text-white transition duration-300 active:scale-[98%] font-medium"
                onClick={() => addToCartBtn(product)}
              >
                Add to Cart
              </button>
              <button
                type="button"
                className="w-full sm:w-1/2 p-3 border border-themegreen rounded-md bg-themegreen text-white hover:bg-transparent cursor-pointer hover:text-themegreen transition duration-300 active:scale-[98%] font-medium"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 bg-white rounded-lg shadow-md overflow-hidden dark:bg-lighterthemedark">
        <div className="border-b border-gray-200">
          <nav className="flex flex-wrap ">
            <button
              type="button"
              onClick={() => setActiveTab("details")}
              className={`px-4 py-4 text-sm font-medium ${
                activeTab === "details"
                  ? "text-white bg-themegreen"
                  : "text-gray-700 hover:text-themegreen dark:text-gray-300 hover:bg-gray-50"
              }`}
            >
              Product Details
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("reviews")}
              className={`px-4 py-4 text-sm font-medium ${
                activeTab === "reviews"
                  ? "text-white bg-themegreen"
                  : "text-gray-700 hover:text-themegreen dark:text-gray-300 hover:bg-gray-50"
              }`}
            >
              Reviews ({product.reviews ? product.reviews.length : 0})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("shipping")}
              className={`px-4 py-4 text-sm font-medium ${
                activeTab === "shipping"
                  ? "text-white bg-themegreen"
                  : "text-gray-700 hover:text-themegreen dark:text-gray-300 hover:bg-gray-50"
              }`}
            >
              Shipping Info
            </button>
          </nav>
        </div>

        <div className="p-6 ">
          {activeTab === "details" && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white  mb-4">
                Specifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-b border-gray-200 pb-2">
                  <p className="text-gray-500 dark:text-gray-300 text-sm">
                    Category
                  </p>
                  <p className="text-gray-900 dark:text-white ">
                    {product.category || "Farming"}
                  </p>
                </div>
                <div className="border-b border-gray-200 pb-2">
                  <p className="text-gray-500 dark:text-gray-300 text-sm">
                    Brand
                  </p>
                  <p className="text-gray-900 dark:text-white ">
                    {product.brand || "N/A"}
                  </p>
                </div>
                <div className="border-b border-gray-200 pb-2">
                  <p className="text-gray-500 dark:text-gray-300 text-sm">
                    Stock
                  </p>
                  <p className="text-gray-900 dark:text-white ">
                    {product.stock || "0"} units
                  </p>
                </div>
                <div className="border-b border-gray-200 pb-2">
                  <p className="text-gray-500 dark:text-gray-300 text-sm">
                    SKU
                  </p>
                  <p className="text-gray-900 dark:text-white ">
                    {product.sku }
                  </p>
                </div>

                {product.dimensions && (
                  <div className="border-b border-gray-200 pb-2">
                    <p className="text-gray-500 dark:text-gray-300 text-sm">
                      Dimensions
                    </p>
                    <p className="text-gray-900 dark:text-white ">
                      {product.dimensions.width}W × {product.dimensions.height}H
                      × {product.dimensions.depth}D cm
                    </p>
                  </div>
                )}
              </div>

              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-300  mt-6 mb-4">
                Product Description
              </h3>
              <p className="text-gray-700 dark:text-white">
                {product.description}
              </p>
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white  mb-4">
                Customer Reviews
              </h3>

              {product.reviews && product.reviews.length > 0 ? (
                <div className="space-y-6">
                  {product.reviews.map((review, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4">
                      <div className="flex items-center mb-2">
                        <div className="flex mr-2">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={
                                i < review.rating
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <p className="text-gray-700 font-medium">
                          {review.reviewerName}
                        </p>
                        <p className="text-gray-500 dark:text-gray-300 text-sm ml-auto">
                          {formatDate(review.date)}
                        </p>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-300">
                  No reviews yet. Be the first to review this product!
                </p>
              )}
            </div>
          )}

          {activeTab === "shipping" && (
            <div>
              <h3 className="text-lg font-medium  text-gray-900 dark:text-white  mb-4">
                Shipping Information
              </h3>
              <div className="space-y-4 ">
                <div className="border-b border-gray-200 pb-3 ">
                  <h4 className="font-medium dark:text-gray-100 text-gray-800 mb-2">
                    Delivery
                  </h4>
                  <p className="text-gray-700 dark:text-gray-100">
                    {product.shippingInformation}
                  </p>
                </div>

                <div className="border-b border-gray-200 pb-3">
                  <h4 className="font-medium dark:text-gray-100 text-gray-800 mb-2">
                    Return Policy
                  </h4>
                  <p className=" dark:text-gray-100 text-gray-700">
                    {product.returnPolicy} return policy
                  </p>
                </div>

                
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SingleProduct;
